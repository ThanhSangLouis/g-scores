import { useState } from 'react';
import { AppShell, type PageKey } from './components/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { ReportsPage } from './pages/ReportsPage';
import { SearchScoresPage } from './pages/SearchScoresPage';
import { TopGroupAPage } from './pages/TopGroupAPage';

export function App() {
  const [activePage, setActivePage] = useState<PageKey>('dashboard');

  return (
    <AppShell activePage={activePage} onPageChange={setActivePage}>
      {activePage === 'dashboard' ? <DashboardPage /> : null}
      {activePage === 'search' ? <SearchScoresPage /> : null}
      {activePage === 'reports' ? <ReportsPage /> : null}
      {activePage === 'topA' ? <TopGroupAPage /> : null}
    </AppShell>
  );
}
