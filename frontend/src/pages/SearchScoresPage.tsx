import { FormEvent, useState } from 'react';
import { getScoreBySbd } from '../api/scores';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingBlock } from '../components/LoadingBlock';
import { ScoreTable } from '../components/ScoreTable';
import type { StudentScore } from '../types/scores';

export function SearchScoresPage() {
  const [sbd, setSbd] = useState('');
  const [student, setStudent] = useState<StudentScore | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setStudent(null);

    if (!/^\d{8}$/.test(sbd)) {
      setError('Registration number must be exactly 8 digits.');
      return;
    }

    setIsLoading(true);
    try {
      setStudent(await getScoreBySbd(sbd));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not load score.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-3xl font-black tracking-tight">Search scores</h2>
        <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
          Enter an 8-digit registration number to retrieve the candidate score profile.
        </p>
      </section>

      <form className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
        <label className="text-sm font-bold text-slate-700" htmlFor="sbd">
          Registration number
        </label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            id="sbd"
            value={sbd}
            maxLength={8}
            inputMode="numeric"
            placeholder="01000001"
            className="min-h-11 flex-1 rounded-lg border border-slate-300 px-4 text-base outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            onChange={(event) => setSbd(event.target.value.replace(/\D/g, ''))}
          />
          <button
            type="submit"
            className="min-h-11 rounded-lg bg-slate-950 px-6 text-sm font-bold text-white transition active:translate-y-px disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={isLoading}
          >
            Search
          </button>
        </div>
      </form>

      {error ? <ErrorMessage message={error} /> : null}
      {isLoading ? <LoadingBlock label="Searching score" /> : null}
      {student ? <ScoreTable student={student} /> : null}
    </div>
  );
}
