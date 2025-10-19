'use client';

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your brewery operations
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Total Batches</h3>
          <p className="text-2xl font-bold">--</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Active Batches</h3>
          <p className="text-2xl font-bold">--</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Suppliers</h3>
          <p className="text-2xl font-bold">--</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Ingredients</h3>
          <p className="text-2xl font-bold">--</p>
        </div>
      </div>
    </div>
  );
}
