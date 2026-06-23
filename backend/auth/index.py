"""Авторизация: вход, выход, текущий пользователь, регистрация мастеров. Роутинг через action в body."""
import json
import os
import uuid
import hashlib
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def ok(data: dict) -> dict:
    return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps(data, ensure_ascii=False)}

def err(msg: str, code: int = 400) -> dict:
    return {'statusCode': code, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps({'error': msg}, ensure_ascii=False)}

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    body = json.loads(event.get('body') or '{}')
    action = body.get('action', '')
    session_id = (event.get('headers') or {}).get('X-Session-Id', '')

    conn = get_conn()
    cur = conn.cursor()

    try:
        # Регистрация нового пользователя
        if action == 'register':
            name = body.get('name', '').strip()
            email = body.get('email', '').strip().lower()
            password = body.get('password', '')
            role = body.get('role', 'master')
            skill = body.get('skill', '')

            if not name or not email or not password:
                return err('Заполните имя, email и пароль')
            if role not in ('admin', 'master'):
                return err('Недопустимая роль')

            cur.execute(f"SELECT id FROM {schema}.users WHERE email = %s", (email,))
            if cur.fetchone():
                return err('Email уже зарегистрирован')

            pw_hash = hash_password(password)
            cur.execute(
                f"INSERT INTO {schema}.users (name, email, password_hash, role, skill) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                (name, email, pw_hash, role, skill)
            )
            user_id = cur.fetchone()[0]
            sid = str(uuid.uuid4())
            cur.execute(f"INSERT INTO {schema}.sessions (id, user_id) VALUES (%s, %s)", (sid, user_id))
            conn.commit()
            return ok({'session_id': sid, 'user': {'id': user_id, 'name': name, 'email': email, 'role': role, 'skill': skill}})

        # Вход
        if action == 'login':
            email = body.get('email', '').strip().lower()
            password = body.get('password', '')
            if not email or not password:
                return err('Введите email и пароль')

            pw_hash = hash_password(password)
            cur.execute(
                f"SELECT id, name, email, role, skill FROM {schema}.users WHERE email = %s AND password_hash = %s",
                (email, pw_hash)
            )
            row = cur.fetchone()
            if not row:
                return err('Неверный email или пароль', 401)

            user_id, name, email_db, role, skill = row
            sid = str(uuid.uuid4())
            cur.execute(f"INSERT INTO {schema}.sessions (id, user_id) VALUES (%s, %s)", (sid, user_id))
            conn.commit()
            return ok({'session_id': sid, 'user': {'id': user_id, 'name': name, 'email': email_db, 'role': role, 'skill': skill or ''}})

        # Текущий пользователь
        if action == 'me':
            if not session_id:
                return err('Не авторизован', 401)
            cur.execute(
                f"SELECT u.id, u.name, u.email, u.role, u.skill FROM {schema}.users u "
                f"JOIN {schema}.sessions s ON s.user_id = u.id "
                f"WHERE s.id = %s AND s.expires_at > NOW()",
                (session_id,)
            )
            row = cur.fetchone()
            if not row:
                return err('Сессия истекла', 401)
            user_id, name, email, role, skill = row
            return ok({'user': {'id': user_id, 'name': name, 'email': email, 'role': role, 'skill': skill or ''}})

        # Выход
        if action == 'logout':
            if session_id:
                cur.execute(f"UPDATE {schema}.sessions SET expires_at = NOW() WHERE id = %s", (session_id,))
                conn.commit()
            return ok({'ok': True})

        return err('Неизвестное действие', 404)

    finally:
        cur.close()
        conn.close()