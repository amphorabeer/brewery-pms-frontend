'use client';

import { useBatches } from '@/hooks/useBatches';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Eye } from 'lucide-react';
import Link from 'next/link';

const statusColors = {
  PLANNED: 'bg-blue-100 text-blue-800',
  BREWING: 'bg-yellow-100 text-yellow-800',
  FERMENTING: 'bg-purple-100 text-purple-800',
  CONDITIONING: 'bg-orange-100 text-orange-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
};

export default function BatchesPage() {
  const { data: batches = [], isLoading: loading, error } = useBatches();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading batches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Batches</h1>
          <p className="text-gray-600 mt-1">Manage brewing batches and production</p>
        </div>
        <div className="flex gap-2">
          <Link href="/batches/calendar">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar View
            </Button>
          </Link>
          <Link href="/batches/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Batch
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600">Total Batches</div>
          <div className="text-2xl font-bold">{batches.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-blue-600">Planned</div>
          <div className="text-2xl font-bold text-blue-600">
            {batches.filter(b => b.status === 'PLANNED').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-yellow-600">Brewing</div>
          <div className="text-2xl font-bold text-yellow-600">
            {batches.filter(b => b.status === 'BREWING').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-purple-600">Fermenting</div>
          <div className="text-2xl font-bold text-purple-600">
            {batches.filter(b => b.status === 'FERMENTING').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-green-600">Finished</div>
          <div className="text-2xl font-bold text-green-600">
            {batches.filter(b => b.status === 'FINISHED').length}
          </div>
        </Card>
      </div>

      {batches.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Calendar className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No batches yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start by creating your first brewing batch
          </p>
          <Link href="/batches/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create First Batch
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map((batch) => (
            <Card key={batch.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{batch.batchNumber}</h3>
                  <p className="text-sm text-gray-600">
                    {batch.recipe?.name || 'Unknown Recipe'}
                  </p>
                </div>
                <Badge className={statusColors[batch.status]}>
                  {batch.status}
                </Badge>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                {batch.tank && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Tank:</span>
                    <span>{batch.tank.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="font-medium">Brew Date:</span>
                  <span>{new Date(batch.brewDate).toLocaleDateString()}</span>
                </div>
                {batch.volumeProduced && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Volume:</span>
                    <span>{batch.volumeProduced}L</span>
                  </div>
                )}
              </div>

              <Link href={`/batches/${batch.id}`}>
                <Button variant="outline" className="w-full" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}