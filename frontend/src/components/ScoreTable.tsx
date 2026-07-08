import type { StudentScore, SubjectKey } from '../types/scores';

const subjectLabels: Array<{ key: SubjectKey; label: string }> = [
  { key: 'toan', label: 'Math' },
  { key: 'nguVan', label: 'Literature' },
  { key: 'ngoaiNgu', label: 'Foreign Language' },
  { key: 'vatLi', label: 'Physics' },
  { key: 'hoaHoc', label: 'Chemistry' },
  { key: 'sinhHoc', label: 'Biology' },
  { key: 'lichSu', label: 'History' },
  { key: 'diaLi', label: 'Geography' },
  { key: 'gdcd', label: 'Civic Education' },
];

function formatScore(score: number | null) {
  return score === null ? 'Not registered' : score.toFixed(score % 1 === 0 ? 0 : 2);
}

export function ScoreTable({ student }: { student: StudentScore }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <p className="text-sm font-semibold text-slate-500">Registration Number</p>
        <h2 className="mt-1 text-2xl font-black tracking-tight">{student.sbd}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-5 py-3">Subject</th>
              <th className="px-5 py-3">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {subjectLabels.map((subject) => (
              <tr key={subject.key}>
                <td className="px-5 py-3 font-semibold text-slate-700">{subject.label}</td>
                <td className="px-5 py-3 text-slate-950">{formatScore(student.scores[subject.key])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 border-t border-slate-200 p-5 text-sm sm:grid-cols-2">
        <p>
          <span className="font-semibold text-slate-500">Foreign language code:</span>{' '}
          {student.maNgoaiNgu ?? 'None'}
        </p>
        <p>
          <span className="font-semibold text-slate-500">Group A total:</span>{' '}
          {student.groupATotal?.toFixed(2) ?? 'Incomplete'}
        </p>
      </div>
    </section>
  );
}
