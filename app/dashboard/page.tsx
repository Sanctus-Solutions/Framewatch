import { inventoryLogs, materials } from "../src/lib/mock-data";

export default function DashboardPage() {
  const materialsIn = inventoryLogs
    .filter((log) => log.action === "in")
    .reduce((sum, log) => sum + log.quantity, 0);

  const materialsOut = inventoryLogs
    .filter((log) => log.action === "out")
    .reduce((sum, log) => sum + log.quantity, 0);

  const wasteEvents = inventoryLogs.filter((log) => log.action === "waste");
  const salvagedItems = inventoryLogs
    .filter((log) => log.action === "salvaged")
    .reduce((sum, log) => sum + log.quantity, 0);

  const recentActivity = [...inventoryLogs]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5)
    .map((log) => {
      const material = materials.find((item) => item.id === log.materialId);

      return {
        ...log,
        materialName: material?.name ?? "Unknown Material",
      };
    });

  const topLossMaterialsMap = wasteEvents.reduce<Record<string, number>>(
    (acc, log) => {
      acc[log.materialId] = (acc[log.materialId] ?? 0) + log.quantity;
      return acc;
    },
    {}
  );

  const topLossMaterials = Object.entries(topLossMaterialsMap)
    .map(([materialId, quantity]) => {
      const material = materials.find((item) => item.id === materialId);

      return {
        materialId,
        materialName: material?.name ?? "Unknown Material",
        quantity,
      };
    })
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const stats = [
    { label: "Materials Logged In", value: String(materialsIn) },
    { label: "Materials Used", value: String(materialsOut) },
    { label: "Waste Events", value: String(wasteEvents.length) },
    { label: "Salvaged Items", value: String(salvagedItems) },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              FrameWatch overview
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Early MVP dashboard for Tuckertown Buildings material usage, waste,
              and loss visibility.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/materials"
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-900"
            >
              View Materials
            </a>

            <a
              href="/"
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-900"
            >
              Back Home
            </a>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
            >
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className="mt-3 text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-xl font-semibold">Top Material Loss Areas</h2>

            {topLossMaterials.length === 0 ? (
              <p className="mt-3 text-sm leading-6 text-slate-300">
                No waste has been logged yet.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {topLossMaterials.map((item) => (
                  <div
                    key={item.materialId}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-white">{item.materialName}</p>
                      <p className="text-xs text-slate-400">Waste quantity</p>
                    </div>
                    <p className="text-lg font-bold text-amber-400">
                      {item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-xl font-semibold">Recent Activity</h2>

            {recentActivity.length === 0 ? (
              <p className="mt-3 text-sm leading-6 text-slate-300">
                No activity has been logged yet.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {recentActivity.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-medium text-white">{item.materialName}</p>
                      <span className="rounded-full border border-slate-700 px-2 py-1 text-xs uppercase tracking-wide text-slate-300">
                        {item.action}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-300">
                      Quantity: {item.quantity}
                      {item.jobName ? ` • Job: ${item.jobName}` : ""}
                    </p>

                    {item.note ? (
                      <p className="mt-1 text-xs text-slate-400">{item.note}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
