import { DataExportImport } from "../../src/components/data-export-import";

export default function DataExportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#050914] to-slate-950 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Data Export & Import</h1>
          <p className="mt-2 text-sm text-slate-400">
            Manage your data backups and prepare for migration to multi-tenant system
          </p>
        </div>

        {/* Export/Import Component */}
        <DataExportImport />

        {/* FAQ Section */}
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold text-white">FAQ</h2>
          
          <details className="rounded-lg border border-cyan-400/20 bg-[#0c1426]/80 p-4">
            <summary className="cursor-pointer font-semibold text-white hover:text-cyan-300">
              What data gets exported?
            </summary>
            <div className="mt-3 text-sm text-slate-300 space-y-1">
              <p>All current data including:</p>
              <ul className="list-disc list-inside ml-2">
                <li>Materials and SKUs</li>
                <li>Inventory logs</li>
                <li>Waste logs</li>
                <li>Used materials logs</li>
                <li>Units and conversions</li>
                <li>Categories and job types</li>
                <li>Buildings</li>
              </ul>
            </div>
          </details>

          <details className="rounded-lg border border-cyan-400/20 bg-[#0c1426]/80 p-4">
            <summary className="cursor-pointer font-semibold text-white hover:text-cyan-300">
              Can I use this to backup my data?
            </summary>
            <div className="mt-3 text-sm text-slate-300">
              Yes! Download an export regularly to create backups. The JSON format is human-readable and future-proof.
            </div>
          </details>

          <details className="rounded-lg border border-cyan-400/20 bg-[#0c1426]/80 p-4">
            <summary className="cursor-pointer font-semibold text-white hover:text-cyan-300">
              How do I prepare data for multi-tenant migration?
            </summary>
            <div className="mt-3 text-sm text-slate-300 space-y-2">
              <p>1. Export your data here (creates JSON file)</p>
              <p>2. When migrating to multi-tenant system:</p>
              <ul className="list-disc list-inside ml-2">
                <li>Upload the exported JSON</li>
                <li>Assign imported rows to Tuckertown company_id in the migration step</li>
                <li>Run count checks to confirm records match pre-migration export</li>
              </ul>
            </div>
          </details>

          <details className="rounded-lg border border-cyan-400/20 bg-[#0c1426]/80 p-4">
            <summary className="cursor-pointer font-semibold text-white hover:text-cyan-300">
              Is the import feature fully implemented?
            </summary>
            <div className="mt-3 text-sm text-slate-300">
              Yes. Import writes data into the current environment and supports both legacy raw exports and the new backup-envelope JSON format.
            </div>
          </details>

          <details className="rounded-lg border border-cyan-400/20 bg-[#0c1426]/80 p-4">
            <summary className="cursor-pointer font-semibold text-white hover:text-cyan-300">
              What should Tuckertown do before migration day?
            </summary>
            <div className="mt-3 text-sm text-slate-300 space-y-2">
              <p>1. Export at least two backups (start-of-day and pre-cutover).</p>
              <p>2. Save copies in cloud storage and one local copy.</p>
              <p>3. Keep the latest backup file for post-migration restore verification.</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
