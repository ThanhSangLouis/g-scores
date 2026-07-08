import type { ReactNode } from 'react';

export type PageKey = 'dashboard' | 'search' | 'reports' | 'topA';

const navigation: Array<{ key: PageKey; label: string }> = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'search', label: 'Search Scores' },
  { key: 'reports', label: 'Reports' },
  { key: 'topA', label: 'Top Group A' },
];

interface AppShellProps {
  activePage: PageKey;
  onPageChange: (page: PageKey) => void;
  children: ReactNode;
}

export function AppShell({ activePage, onPageChange, children }: AppShellProps) {
  return (
    <div className="min-h-dvh bg-slate-50 text-slate-950">
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-slate-200 bg-white px-5 py-6 lg:block">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">Golden Owl</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">G-Scores</h1>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`w-full rounded-lg px-4 py-3 text-left text-sm font-semibold transition ${
                activePage === item.key
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
              }`}
              onClick={() => onPageChange(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur lg:hidden">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600">Golden Owl</p>
            <h1 className="text-xl font-black tracking-tight">G-Scores</h1>
          </div>
        </div>
        <nav className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {navigation.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                activePage === item.key ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700'
              }`}
              onClick={() => onPageChange(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="px-4 py-6 lg:ml-64 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
