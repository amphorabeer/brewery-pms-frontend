'use client';

import { useBatchStatistics, useBatches } from '@/hooks/useBatches';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/batches/StatusBadge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { data: statistics, isLoading: statsLoading } = useBatchStatistics();
  const { data: batches, isLoading: batchesLoading } = useBatches();

  // Get recent batches (last 5)
  const recentBatches = batches?.slice(0, 5) || [];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Overview of your brewery operations
          </p>
        </div>

        {/* Statistics Cards */}
        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Batches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {statistics?.totalBatches || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">
                  Active Batches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {statistics?.activeBatches || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">In production</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">
                  Finished
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {statistics?.finishedBatches || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">Completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">
                  Avg ABV
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {statistics?.averageAbv || '0'}%
                </div>
                <p className="text-xs text-gray-500 mt-1">Alcohol content</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Volume Produced Card */}
        {statistics && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Production Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Total Volume Produced</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {statistics.totalVolumeProduced}L
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cancelled Batches</p>
                  <p className="text-2xl font-bold text-red-600">
                    {statistics.cancelledBatches}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {statistics.totalBatches > 0
                      ? Math.round(
                          ((statistics.finishedBatches /
                            statistics.totalBatches) *
                            100)
                        )
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Breakdown */}
        {statistics && statistics.statusBreakdown && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Batches by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {Object.entries(statistics.statusBreakdown).map(
                  ([status, count]) => (
                    <div
                      key={status}
                      className="text-center p-4 bg-gray-50 rounded-lg"
                    >
                      <StatusBadge status={status as any} />
                      <p className="text-2xl font-bold mt-2">{count as number}</p>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Batches */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Batches</CardTitle>
            <Link href="/batches">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {batchesLoading ? (
              <p className="text-gray-500">Loading...</p>
            ) : recentBatches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No batches yet</p>
                <Link href="/batches/new">
                  <Button className="mt-4">Create Your First Batch</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentBatches.map((batch) => (
                  <Link
                    key={batch.id}
                    href={`/batches/${batch.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <div>
                        <div className="font-semibold font-mono">
                          {batch.batchNumber}
                        </div>
                        <div className="text-sm text-gray-600">
                          {batch.recipe.name} - {batch.recipe.style}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <StatusBadge status={batch.status} />
                        <span className="text-sm text-gray-600">
                          {batch.actualVolume || batch.expectedVolume}L
                        </span>
                        {batch.abv && (
                          <span className="text-sm font-semibold">
                            {batch.abv}% ABV
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}