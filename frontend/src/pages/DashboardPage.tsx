import { StatCard } from '../components/StatCard';

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">2024 exam dataset</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">National score explorer</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          Search candidate scores, inspect subject score distributions, and review the strongest Group A results from
          the imported CSV dataset.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Imported records" value="1,061,605" helper="Rows from diem_thi_thpt_2024.csv." />
        <StatCard label="Report subjects" value="9" helper="Math, literature, language, sciences, and socials." />
        <StatCard label="Score levels" value="4" helper=">= 8, 6 to 7.99, 4 to 5.99, and < 4." />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-black tracking-tight">Engineering notes</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="font-semibold">Data import</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The backend streams CSV rows into PostgreSQL in batches so the 43MB file is not loaded into memory.
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="font-semibold">Subject model</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Subject banding is managed through small OOP classes to keep report rules explicit and testable.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
