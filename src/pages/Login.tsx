import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { login, saveSession, User } from '@/lib/auth';

interface Props {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await login(email, password);
    setLoading(false);
    if ('error' in res) { setError(res.error); return; }
    saveSession(res.session_id);
    onLogin(res.user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.07]" />
      <div className="pointer-events-none absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-sm px-4 opacity-0 animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 glow-cyan">
            <Icon name="Hexagon" size={28} className="text-primary-foreground" />
          </div>
          <div className="font-display text-3xl font-700 tracking-wider text-glow">NEXUS</div>
          <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mt-1">Service Lab</div>
        </div>

        <div className="glass border border-border rounded-2xl p-7">
          <h2 className="font-display text-xl font-600 tracking-wide mb-5">Вход в систему</h2>
          <form onSubmit={handle} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Email</Label>
              <Input
                type="email"
                placeholder="admin@nexus.ru"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-secondary/40 border-border"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Пароль</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-secondary/40 border-border"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                <Icon name="AlertCircle" size={15} />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold glow-cyan mt-2"
            >
              {loading ? <Icon name="Loader2" size={18} className="animate-spin mr-2" /> : <Icon name="LogIn" size={18} className="mr-2" />}
              Войти
            </Button>
          </form>

          <div className="mt-4 pt-4 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              Администратор: <span className="text-foreground">admin@nexus.ru</span> / <span className="text-foreground">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
