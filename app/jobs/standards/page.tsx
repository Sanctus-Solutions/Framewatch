import Link from "next/link";
import { fetchJobTypesFromSupabase, fetchMaterialsFromSupabase } from "../../src/lib/supabase";
import { JobStandardsClient } from "../../src/components/jobs/job-standards-client";

export default async function JobStandardsPage() {
  const [{ data: materials, error }, { data: jobTypes, error: jobTypeError }] = await Promise.all([
    fetchMaterialsFromSupabase(),
    fetchJobTypesFromSupabase(),
  ]);

  return (
    <main className="min-h-screen bg-[#050914] text-white">
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Jobs
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Standard supply amounts by job type
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Build standard supply plans for each job type so crews have baseline usage targets.
            </p>
            {error ? (
              <p className="mt-3 text-sm text-amber-200">
                Unable to load materials from Supabase. {error}
              </p>
            ) : null}
            {jobTypeError ? (
              <p className="mt-3 text-sm text-amber-200">
                Unable to load job types from Supabase. {jobTypeError}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/jobs"
              className="rounded-xl border border-cyan-400/30 px-4 py-2 text-sm font-semibold hover:bg-[#111a2f]"
            >
              Back to Jobs
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-cyan-400/30 px-4 py-2 text-sm font-semibold hover:bg-[#111a2f]"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        <JobStandardsClient
          materials={materials.map((material) => ({
            id: material.id,
            name: material.name,
            sku: material.sku,
          }))}
          jobTypes={jobTypes.map((jobType) => jobType.name)}
        />

        <p className="mt-6 text-xs text-slate-500">
          Standards are saved in this browser for MVP use and can be reset by clearing site storage.
        </p>
      </section>
    </main>
  );
}
