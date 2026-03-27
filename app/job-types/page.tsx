import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createJobTypeInSupabase,
  deleteJobTypeInSupabase,
  fetchJobTypesFromSupabase,
} from "../src/lib/supabase";
import { JobTypeLookup } from "../src/components/jobs/job-type-lookup";

async function addJobTypeAction(formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!name) {
    redirect("/job-types?status=validation&field=name");
  }

  const { error } = await createJobTypeInSupabase(name, description || undefined);

  if (error) {
    redirect(`/job-types?status=error&message=${encodeURIComponent(error)}`);
  }

  revalidatePath("/job-types");
  redirect("/job-types?status=success");
}

async function deleteJobTypeAction(formData: FormData) {
  "use server";

  const name = String(formData.get("job_type_name") ?? "").trim();
  if (!name) {
    redirect("/job-types?status=error&message=Missing job type name");
  }

  const { error } = await deleteJobTypeInSupabase(name);

  if (error) {
    redirect(`/job-types?status=error&message=${encodeURIComponent(error)}`);
  }

  revalidatePath("/job-types");
  redirect("/job-types?status=deleted");
}

type JobTypesPageProps = {
  searchParams?: {
    status?: string;
    field?: string;
    message?: string;
  };
};

export default async function JobTypesPage({ searchParams }: JobTypesPageProps) {
  const params = searchParams ?? {};
  const { data: jobTypes, error } = await fetchJobTypesFromSupabase();

  return (
    <main className="min-h-screen bg-[#050914] text-white">
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Jobs
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Job Types</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Save reusable project type names so teams can look up standards like UG 12x40.
            </p>
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

        <div className="mt-10 rounded-2xl border border-cyan-500/20 bg-[#0c1426]/80 p-6">
          <h2 className="text-xl font-semibold">Add job type</h2>
          <p className="mt-2 text-sm text-slate-300">
            Add project names that should remain consistent across jobs.
          </p>

          {params.status === "success" ? (
            <p className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              Job type added.
            </p>
          ) : null}

          {params.status === "deleted" ? (
            <p className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              Job type deleted.
            </p>
          ) : null}

          {params.status === "validation" && params.field === "name" ? (
            <p className="mt-4 rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
              Job type name is required.
            </p>
          ) : null}

          {params.status === "error" ? (
            <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              Unable to process request. {params.message ?? "Please try again."}
            </p>
          ) : null}

          <form action={addJobTypeAction} className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm">
              <span className="text-slate-300">Job Type Name *</span>
              <input
                name="name"
                type="text"
                required
                placeholder="e.g. UG 12x40"
                className="rounded-xl border border-cyan-400/30 bg-[#050914] px-3 py-2 text-white placeholder:text-slate-500 focus:border-cyan-300 focus:outline-none"
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="text-slate-300">Description (optional)</span>
              <input
                name="description"
                type="text"
                placeholder="e.g. Utility garage, 12x40"
                className="rounded-xl border border-cyan-400/30 bg-[#050914] px-3 py-2 text-white placeholder:text-slate-500 focus:border-cyan-300 focus:outline-none"
              />
            </label>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="rounded-xl border border-cyan-400/60 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 hover:bg-cyan-500/20"
              >
                Add Job Type
              </button>
            </div>
          </form>
        </div>

        <JobTypeLookup jobTypes={jobTypes} />

        <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-[#0c1426]/80 p-6">
          {error ? (
            <p className="text-sm leading-6 text-amber-200">
              Unable to load job types from Supabase right now. {error}
            </p>
          ) : null}

          {jobTypes.length === 0 ? (
            <div className="rounded-xl border border-cyan-500/20 bg-[#050914] p-6">
              <p className="text-lg font-semibold text-white">No job types yet</p>
              <p className="mt-2 max-w-xl text-sm text-slate-300">
                Add your first job type above so teams can reuse consistent project names.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold">Saved job types</h2>
              <div className="mt-4 space-y-3">
                {jobTypes.map((jobType) => (
                  <div
                    key={jobType.name}
                    className="flex items-center justify-between gap-3 rounded-xl border border-cyan-500/20 bg-[#050914] px-4 py-3 transition hover:border-cyan-400/60 hover:bg-[#111a2f]"
                  >
                    <div>
                      <p className="font-medium text-white">{jobType.name}</p>
                      {jobType.description ? (
                        <p className="text-xs text-slate-400">{jobType.description}</p>
                      ) : null}
                    </div>

                    <form action={deleteJobTypeAction} className="flex-shrink-0">
                      <input type="hidden" name="job_type_name" value={jobType.name} />
                      <button
                        type="submit"
                        className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-300 hover:bg-red-500/20"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
