"use client";

import { useMemo, useState } from "react";

type JobType = {
  name: string;
  description?: string | null;
};

type JobTypeLookupProps = {
  jobTypes: JobType[];
};

export function JobTypeLookup({ jobTypes }: JobTypeLookupProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return jobTypes;
    }

    return jobTypes.filter((jobType) => {
      const nameMatch = jobType.name.toLowerCase().includes(query);
      const descriptionMatch = (jobType.description ?? "").toLowerCase().includes(query);
      return nameMatch || descriptionMatch;
    });
  }, [jobTypes, search]);

  return (
    <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-[#0c1426]/80 p-6">
      <h2 className="text-xl font-semibold">Lookup job type</h2>
      <p className="mt-2 text-sm text-slate-300">
        Search for a project type like UG 12x40 to confirm it exists in the database.
      </p>

      <div className="mt-4">
        <label className="text-xs font-semibold uppercase tracking-wide text-cyan-200" htmlFor="job-type-search">
          Search
        </label>
        <input
          id="job-type-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Example: UG 12x40"
          className="mt-1 w-full rounded-xl border border-cyan-500/30 bg-[#050914] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
        />
      </div>

      <div className="mt-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-cyan-500/20 bg-[#050914] p-4">
            <p className="text-sm text-slate-300">No matching job types found.</p>
          </div>
        ) : (
          filtered.map((jobType) => (
            <div
              key={jobType.name}
              className="rounded-xl border border-cyan-500/20 bg-[#050914] p-4"
            >
              <p className="font-medium text-white">{jobType.name}</p>
              {jobType.description ? (
                <p className="mt-1 text-sm text-slate-400">{jobType.description}</p>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
