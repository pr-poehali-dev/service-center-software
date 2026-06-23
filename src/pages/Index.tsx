import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

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

const ORDERS = [
  { id: 'SC-2041', device: 'Холодильник Bosch', issue: 'Не морозит камеру', master: 'Алексей Громов', status: 'В работе', auto: true },
  { id: 'SC-2042', device: 'Стиралка LG', issue: 'Не сливает воду', master: 'Ирина Соколова', status: 'Диагностика', auto: true },
  { id: 'SC-2043', device: 'Телевизор Samsung', issue: 'Нет изображения', master: 'Дмитрий Орлов', status: 'Ожидает', auto: false },
  { id: 'SC-2044', device: 'Микроволновка', issue: 'Не греет', master: 'Авто-подбор...', status: 'Новая', auto: true },
];

const statusColor: Record<string, string> = {
  'В работе': 'bg-primary/15 text-primary border-primary/30',
  'Диагностика': 'bg-accent/15 text-accent border-accent/30',
  'Ожидает': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'Новая': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
};

const Index = () => {
  const [active, setActive] = useState('home');

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
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold">А</div>
            <div className="text-sm">
              <div className="font-medium leading-none">Администратор</div>
              <div className="text-xs text-muted-foreground mt-1">Онлайн</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 relative z-10 overflow-y-auto h-screen">
        {/* Header */}
        <header className="h-20 px-5 md:px-8 flex items-center justify-between border-b border-border glass sticky top-0 z-20">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-600 tracking-wide">Центр управления</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Понедельник, 23 июня · Все системы в норме</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/60 border border-border text-sm text-muted-foreground">
              <Icon name="Search" size={16} />
              Поиск заявки…
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold glow-cyan">
              <Icon name="Plus" size={18} className="mr-1" /> Новая заявка
            </Button>
          </div>
        </header>

        <div className="p-5 md:p-8 space-y-8">
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
                {ORDERS.map((o) => (
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
        </div>
      </main>
    </div>
  );
};

export default Index;
