import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { User, logout } from '@/lib/auth';
import Masters from './Masters';

interface Props { user: User; onLogout: () => void; }

const NAV = [
  { id: 'home', label: 'Главная', icon: 'LayoutDashboard' },
  { id: 'orders', label: 'Заявки', icon: 'ClipboardList' },
  { id: 'masters', label: 'Мастера', icon: 'Wrench' },
  { id: 'parts', label: 'Запчасти', icon: 'Cpu' },
  { id: 'clients', label: 'Клиенты', icon: 'Users' },
  { id: 'services', label: 'Услуги', icon: 'Settings2' },
  { id: 'reports', label: 'Отчёты', icon: 'BarChart3' },
  { id: 'contacts', label: 'Контакты', icon: 'Phone' },
];

const STATS = [
  { label: 'Активные заявки', value: '47', delta: '+8', icon: 'ClipboardList', color: 'text-primary' },
  { label: 'Свободных мастеров', value: '6', delta: 'из 14', icon: 'Wrench', color: 'text-accent' },
  { label: 'Готово сегодня', value: '23', delta: '+12%', icon: 'CircleCheck', color: 'text-emerald-400' },
  { label: 'Выручка / день', value: '184к', delta: '+5%', icon: 'TrendingUp', color: 'text-primary' },
];

const MASTERS = [
  { name: 'Алексей Громов', skill: 'Холодильники · Эксперт', load: 80, status: 'Занят', orders: 4 },
  { name: 'Ирина Соколова', skill: 'Стиральные машины', load: 45, status: 'Свободна', orders: 2 },
  { name: 'Дмитрий Орлов', skill: 'ТВ · Электроника', load: 95, status: 'Занят', orders: 5 },
  { name: 'Сергей Белов', skill: 'Мелкая техника', load: 20, status: 'Свободен', orders: 1 },
];

const INITIAL_ORDERS = [
  { id: 'SC-2041', device: 'Холодильник Bosch', issue: 'Не морозит камеру', master: 'Алексей Громов', status: 'В работе', auto: true },
  { id: 'SC-2042', device: 'Стиралка LG', issue: 'Не сливает воду', master: 'Ирина Соколова', status: 'Диагностика', auto: true },
  { id: 'SC-2043', device: 'Телевизор Samsung', issue: 'Нет изображения', master: 'Дмитрий Орлов', status: 'Ожидает', auto: false },
  { id: 'SC-2044', device: 'Микроволновка', issue: 'Не греет', master: 'Авто-подбор...', status: 'Новая', auto: true },
];

const DEVICE_TYPES = [
  { id: 'fridge', label: 'Холодильник', keywords: ['Холодильник'] },
  { id: 'washer', label: 'Стиральная машина', keywords: ['Стиральные', 'машины'] },
  { id: 'tv', label: 'Телевизор / Электроника', keywords: ['ТВ', 'Электроника'] },
  { id: 'small', label: 'Мелкая техника', keywords: ['Мелкая'] },
];

function pickMaster(deviceTypeId: string) {
  const type = DEVICE_TYPES.find((d) => d.id === deviceTypeId);
  if (!type) return null;
  const matched = MASTERS.filter((m) =>
    type.keywords.some((k) => m.skill.includes(k)),
  );
  const pool = matched.length ? matched : MASTERS;
  return [...pool].sort((a, b) => a.load - b.load)[0];
}

const statusColor: Record<string, string> = {
  'В работе': 'bg-primary/15 text-primary border-primary/30',
  'Диагностика': 'bg-accent/15 text-accent border-accent/30',
  'Ожидает': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'Новая': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
};

const Index = ({ user, onLogout }: Props) => {
  const [active, setActive] = useState('home');
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ device: '', issue: '', type: '' });
  const suggested = form.type ? pickMaster(form.type) : null;

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  const handleSubmit = () => {
    if (!form.device || !form.type) {
      toast({ title: 'Заполните технику и тип', variant: 'destructive' });
      return;
    }
    const master = pickMaster(form.type);
    const newOrder = {
      id: `SC-${2045 + orders.length - INITIAL_ORDERS.length}`,
      device: form.device,
      issue: form.issue || 'Без описания',
      master: master ? master.name : 'Авто-подбор…',
      status: 'Новая',
      auto: true,
    };
    setOrders([newOrder, ...orders]);
    setOpen(false);
    setForm({ device: '', issue: '', type: '' });
    toast({
      title: 'Заявка создана',
      description: master ? `Назначен мастер: ${master.name}` : 'Мастер будет подобран',
    });
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.07]" />
      <div className="pointer-events-none absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[120px]" />

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-border glass relative z-10 shrink-0">
        <div className="h-20 flex items-center gap-3 px-6 border-b border-border">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow-cyan">
            <Icon name="Hexagon" className="text-primary-foreground" size={22} />
          </div>
          <div>
            <div className="font-display text-xl font-700 tracking-wider leading-none">NEXUS</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Service Lab</div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                active === item.id
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-transparent'
              }`}
            >
              <Icon name={item.icon} size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-border space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold shrink-0">
              {user.name[0]}
            </div>
            <div className="text-sm min-w-0">
              <div className="font-medium leading-none truncate">{user.name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {user.role === 'admin' ? 'Администратор' : 'Мастер'}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all"
          >
            <Icon name="LogOut" size={14} /> Выйти из системы
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 relative z-10 overflow-y-auto h-screen">
        {/* Header */}
        <header className="h-20 px-5 md:px-8 flex items-center justify-between border-b border-border glass sticky top-0 z-20">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-600 tracking-wide">
              {active === 'masters' ? 'Мастера' : 'Центр управления'}
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Понедельник, 23 июня · Все системы в норме</p>
          </div>
          <div className="flex items-center gap-3">
            {active === 'home' && (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/60 border border-border text-sm text-muted-foreground">
                  <Icon name="Search" size={16} />
                  Поиск заявки…
                </div>
                <Button onClick={() => setOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold glow-cyan">
                  <Icon name="Plus" size={18} className="mr-1" /> Новая заявка
                </Button>
              </>
            )}
          </div>
        </header>

        {active === 'masters' && <Masters currentUser={user} />}

        {active === 'home' && <div className="p-5 md:p-8 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                style={{ animationDelay: `${i * 80}ms` }}
                className="opacity-0 animate-fade-in glass border border-border rounded-2xl p-5 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-secondary flex items-center justify-center ${s.color}`}>
                    <Icon name={s.icon} size={20} />
                  </div>
                  <span className="text-xs text-muted-foreground">{s.delta}</span>
                </div>
                <div className="font-display text-3xl font-700">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* AI Scheduler banner */}
          <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-accent/5 to-transparent p-6 animate-scale-in">
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20">
              <Icon name="BrainCircuit" size={120} className="text-primary" />
            </div>
            <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" /> AI Планировщик
            </div>
            <h2 className="font-display text-2xl font-600 mb-2 max-w-lg">
              Автораспределение работ по квалификации и загрузке
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mb-4">
              Система анализирует навыки мастеров и их занятость, назначая заявки оптимальному специалисту автоматически.
            </p>
            <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">
              <Icon name="Zap" size={16} className="mr-1" /> Запустить распределение
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Orders */}
            <div className="lg:col-span-2 glass border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-600 tracking-wide flex items-center gap-2">
                  <Icon name="ClipboardList" size={18} className="text-primary" /> Активные заявки
                </h3>
                <button className="text-xs text-primary hover:underline">Все заявки →</button>
              </div>
              <div className="space-y-3">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-secondary/40 border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="font-mono text-xs text-muted-foreground w-16 shrink-0">{o.id}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{o.device}</div>
                      <div className="text-xs text-muted-foreground truncate">{o.issue}</div>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground w-36 truncate">
                      {o.auto && <Icon name="Sparkles" size={13} className="text-primary shrink-0" />}
                      {o.master}
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full border shrink-0 ${statusColor[o.status]}`}>
                      {o.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Masters load */}
            <div className="glass border border-border rounded-2xl p-5">
              <h3 className="font-display text-lg font-600 tracking-wide flex items-center gap-2 mb-4">
                <Icon name="Wrench" size={18} className="text-accent" /> Загрузка мастеров
              </h3>
              <div className="space-y-4">
                {MASTERS.map((m) => (
                  <div key={m.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{m.name}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{m.skill}</div>
                      </div>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 ${m.load > 70 ? 'bg-destructive/15 text-destructive' : 'bg-emerald-500/15 text-emerald-400'}`}>
                        {m.status}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${m.load > 70 ? 'bg-destructive' : 'bg-primary'}`}
                        style={{ width: `${m.load}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>}
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-600 tracking-wide flex items-center gap-2">
              <Icon name="Plus" size={20} className="text-primary" /> Новая заявка
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Техника</Label>
              <Input
                placeholder="Напр. Холодильник Bosch KGN"
                value={form.device}
                onChange={(e) => setForm({ ...form, device: e.target.value })}
                className="bg-secondary/40 border-border"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Тип техники</Label>
              <div className="grid grid-cols-2 gap-2">
                {DEVICE_TYPES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setForm({ ...form, type: t.id })}
                    className={`px-3 py-2.5 rounded-lg text-xs font-medium border transition-all ${
                      form.type === t.id
                        ? 'bg-primary/10 text-primary border-primary/40'
                        : 'bg-secondary/40 text-muted-foreground border-border hover:text-foreground'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Описание поломки</Label>
              <Textarea
                placeholder="Что случилось с техникой?"
                value={form.issue}
                onChange={(e) => setForm({ ...form, issue: e.target.value })}
                className="bg-secondary/40 border-border resize-none"
                rows={2}
              />
            </div>

            {suggested && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/30 animate-fade-in">
                <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <Icon name="Sparkles" size={16} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.15em] text-primary">AI подбор мастера</div>
                  <div className="text-sm font-medium truncate">{suggested.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{suggested.skill} · загрузка {suggested.load}%</div>
                </div>
              </div>
            )}

            <Button onClick={handleSubmit} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold glow-cyan">
              <Icon name="Check" size={18} className="mr-1" /> Создать заявку
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;