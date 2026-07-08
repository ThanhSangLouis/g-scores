import { useQuery } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getScoreLevelsReport } from '../api/scores';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingBlock } from '../components/LoadingBlock';

export function ReportsPage() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['score-level-report'],
    queryFn: getScoreLevelsReport,
  });

  const chartData =
    data?.map((item) => ({
      subject: item.label,
      '>= 8': item.levels.excellent,
      '6 - 7.99': item.levels.good,
      '4 - 5.99': item.levels.average,
      '< 4': item.levels.poor,
    })) ?? [];

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-3xl font-black tracking-tight">Score level report</h2>
        <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
          Statistics of candidate counts by subject across the four required score levels.
        </p>
      </section>

      {isLoading ? <LoadingBlock label="Loading report" /> : null}
      {error ? <ErrorMessage message={error instanceof Error ? error.message : 'Could not load report'} /> : null}

      {!isLoading && !error ? (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="h-[440px] w-full">
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 20, right: 24, left: 0, bottom: 72 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="subject" angle={-35} textAnchor="end" interval={0} height={88} tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey=">= 8" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="6 - 7.99" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="4 - 5.99" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="< 4" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      ) : null}
    </div>
  );
}
