import { useQuery } from '@tanstack/react-query';
import { getTopGroupA } from '../api/scores';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingBlock } from '../components/LoadingBlock';

export function TopGroupAPage() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['top-group-a'],
    queryFn: () => getTopGroupA(10),
  });

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-3xl font-black tracking-tight">Top 10 Group A</h2>
        <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
          Ranking by total score across math, physics, and chemistry.
        </p>
      </section>

      {isLoading ? <LoadingBlock label="Loading ranking" /> : null}
      {error ? <ErrorMessage message={error instanceof Error ? error.message : 'Could not load ranking'} /> : null}

      {!isLoading && !error ? (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-5 py-3">Rank</th>
                  <th className="px-5 py-3">SBD</th>
                  <th className="px-5 py-3">Math</th>
                  <th className="px-5 py-3">Physics</th>
                  <th className="px-5 py-3">Chemistry</th>
                  <th className="px-5 py-3">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.map((student, index) => (
                  <tr key={student.sbd}>
                    <td className="px-5 py-3 font-black text-slate-950">#{index + 1}</td>
                    <td className="px-5 py-3 font-semibold">{student.sbd}</td>
                    <td className="px-5 py-3">{student.toan.toFixed(2)}</td>
                    <td className="px-5 py-3">{student.vatLi.toFixed(2)}</td>
                    <td className="px-5 py-3">{student.hoaHoc.toFixed(2)}</td>
                    <td className="px-5 py-3 font-black text-emerald-700">{student.groupATotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}
