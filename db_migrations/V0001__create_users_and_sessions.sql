CREATE TABLE t_p95224482_service_center_softw.users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'master' CHECK (role IN ('admin', 'master')),
  skill TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE t_p95224482_service_center_softw.sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES t_p95224482_service_center_softw.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '30 days'
);

INSERT INTO t_p95224482_service_center_softw.users (name, email, password_hash, role)
VALUES ('Администратор', 'admin@nexus.ru', '$2b$12$K9Qmz6Hj7VvLpXN2eRsY4.NpSXb3kJZFvKqLJ8BHqPcXPdXoBzOWO', 'admin');
