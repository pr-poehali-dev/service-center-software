import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { register, saveSession, User } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';

const SKILLS = ['Холодильники', 'Стиральные машины', 'ТВ · Электроника', 'Мелкая техника', 'Посудомоечные машины', 'Кондиционеры'];

const LOAD_COLORS: Record<string, string> = {
  low: 'bg-emerald-500',
  mid: 'bg-primary',
  high: 'bg-destructive',
};

interface MasterRow {
  id: number;
  name: string;
  email: string;
  skill: string;
  load: number;
  status: string;
}

const INITIAL: MasterRow[] = [
  { id: 1, name: 'Алексей Громов', email: 'gromov@nexus.ru', skill: 'Холодильники', load: 80, status: 'Занят' },
  { id: 2, name: 'Ирина Соколова', email: 'sokolova@nexus.ru', skill: 'Стиральные машины', load: 45, status: 'Свободна' },
  { id: 3, name: 'Дмитрий Орлов', email: 'orlov@nexus.ru', skill: 'ТВ · Электроника', load: 95, status: 'Занят' },
  { id: 4, name: 'Сергей Белов', email: 'belov@nexus.ru', skill: 'Мелкая техника', load: 20, status: 'Свободен' },
];

interface Props { currentUser: User }

export default function Masters({ currentUser }: Props) {
  const [masters, setMasters] = useState<MasterRow[]>(INITIAL);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', skill: '' });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.skill) {
      setFormError('Заполните все поля'); return;
    }
    setLoading(true); setFormError('');
    const res = await register({ ...form, role: 'master' });
    setLoading(false);
    if ('error' in res) { setFormError(res.error); return; }
    saveSession(res.session_id);
    setMasters(prev => [...prev, {
      id: res.user.id,
      name: res.user.name,
      email: res.user.email,
      skill: res.user.skill,
      load: 0,
      status: 'Свободен',
    }]);
    setOpen(false);
    setForm({ name: '', email: '', password: '', skill: '' });
    toast({ title: 'Мастер добавлен', description: `Аккаунт для ${res.user.name} создан` });
  };

  return (
    <div className="p-5 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-600 tracking-wide">Мастера</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{masters.length} специалистов в команде</p>
        </div>
        {currentUser.role === 'admin' && (
          <Button onClick={() => setOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold glow-cyan">
            <Icon name="UserPlus" size={18} className="mr-1.5" /> Добавить мастера
          </Button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {masters.map((m, i) => {
          const loadKey = m.load > 70 ? 'high' : m.load > 40 ? 'mid' : 'low';
          return (
            <div
              key={m.id}
              style={{ animationDelay: `${i * 60}ms` }}
              className="opacity-0 animate-fade-in glass border border-border rounded-2xl p-5 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center text-accent font-display text-lg font-600 shrink-0">
                    {m.name[0]}
                  </div>
                  <div>
                    <div className="font-medium leading-tight">{m.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{m.email}</div>
                  </div>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 ${m.load > 70 ? 'bg-destructive/15 text-destructive' : 'bg-emerald-500/15 text-emerald-400'}`}>
                  {m.status}
                </span>
              </div>

              <div className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
                <Icon name="Wrench" size={13} />
                {m.skill}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Загрузка</span>
                  <span className={m.load > 70 ? 'text-destructive' : 'text-primary'}>{m.load}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${LOAD_COLORS[loadKey]}`} style={{ width: `${m.load}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-600 tracking-wide flex items-center gap-2">
              <Icon name="UserPlus" size={20} className="text-primary" /> Новый мастер
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4 pt-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs text-muted-foreground">Полное имя</Label>
                <Input placeholder="Иван Петров" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-secondary/40 border-border" />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs text-muted-foreground">Email</Label>
                <Input type="email" placeholder="master@nexus.ru" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-secondary/40 border-border" />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs text-muted-foreground">Пароль для входа</Label>
                <Input type="password" placeholder="Минимум 6 символов" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="bg-secondary/40 border-border" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Специализация</Label>
              <div className="grid grid-cols-2 gap-2">
                {SKILLS.map(s => (
                  <button key={s} type="button" onClick={() => setForm({ ...form, skill: s })}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all text-left ${form.skill === s ? 'bg-primary/10 text-primary border-primary/40' : 'bg-secondary/40 text-muted-foreground border-border hover:text-foreground'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            {formError && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                <Icon name="AlertCircle" size={15} /> {formError}
              </div>
            )}
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold glow-cyan">
              {loading ? <Icon name="Loader2" size={18} className="animate-spin mr-2" /> : <Icon name="Check" size={18} className="mr-2" />}
              Создать аккаунт
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
