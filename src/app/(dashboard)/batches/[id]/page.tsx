'use client';

import { useBatch } from '@/hooks/useBatches';
import { StatusBadge } from '@/components/batches/StatusBadge';
import { UpdateBatchDialog } from '@/components/batches/UpdateBatchDialog';
import { DeleteBatchDialog } from '@/components/batches/DeleteBatchDialog';
import { FermentationCharts } from '@/components/batches/FermentationCharts';
import { AddFermentationLog } from '@/components/batches/AddFermentationLog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function BatchDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: batch, isLoading, error, refetch } = useBatch(id);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <p>Loading batch details...</p>
        </div>
      </div>
    );
  }

  if (error || !batch) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-600">Error loading batch</p>
          <Link href="/batches">
            <Button variant="outline" className="mt-4">
              ← Back to Batches
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/batches">
              <Button variant="ghost" className="mb-2">
                ← Back to Batches
              </Button>
            </Link>
            <h1 className="text-3xl font-bold font-mono">
              {batch.batchNumber}
            </h1>
            <p className="text-gray-600 mt-1">
              {batch.recipe?.name} - {batch.recipe?.style}
            </p>
          </div>
          <div className="flex gap-2">
            <StatusBadge status={batch.status} />
            <UpdateBatchDialog batch={batch} />
            <DeleteBatchDialog batchId={batch.id} batchNumber={batch.batchNumber} />
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">
                Expected Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{batch.expectedVolume}L</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">
                Actual Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {batch.actualVolume || '-'}L
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">
                Original Gravity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{batch.og || '-'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">
                Final Gravity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{batch.fg || '-'}</div>
            </CardContent>
          </Card>
        </div>

        {/* ABV Card */}
        {batch.abv && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Alcohol by Volume</p>
                  <p className="text-4xl font-bold text-amber-600">
                    {batch.abv}%
                  </p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>Calculated from OG/FG</p>
                  <p className="font-mono">
                    ({batch.og} - {batch.fg}) × 131.25
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recipe & Location Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Recipe Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{batch.recipe?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Style:</span>
                <span className="font-medium">{batch.recipe?.style || 'N/A'}</span>
              </div>
            </CardContent>
          </Card>

          {batch.location && (
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{batch.location.name}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Dates Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">Brew Date</span>
                <span className="text-gray-600">
                  {new Date(batch.brewDate).toLocaleDateString()}
                </span>
              </div>
              {batch.fermentationStartDate && (
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Fermentation Started</span>
                  <span className="text-gray-600">
                    {new Date(batch.fermentationStartDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              {batch.packagedDate && (
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Packaged</span>
                  <span className="text-gray-600">
                    {new Date(batch.packagedDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              {batch.finishedDate && (
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <span className="font-medium">Finished</span>
                  <span className="text-green-600">
                    {new Date(batch.finishedDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Fermentation Data Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Fermentation Data</h2>
            <AddFermentationLog batchId={batch.id} onSuccess={refetch} />
          </div>

          {/* Fermentation Charts */}
          {batch.fermentationLogs && batch.fermentationLogs.length > 0 ? (
            <FermentationCharts logs={batch.fermentationLogs} />
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <p className="text-lg font-medium">No fermentation data yet.</p>
                <p className="text-sm mt-2">Click "Add Reading" above to start tracking fermentation.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Fermentation Logs Table */}
        {batch.fermentationLogs && batch.fermentationLogs.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>
                Fermentation Logs ({batch.fermentationLogs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Temperature</TableHead>
                    <TableHead>Gravity</TableHead>
                    <TableHead>pH</TableHead>
                    <TableHead>Pressure</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batch.fermentationLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {new Date(log.measuredAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{log.temperature}°C</TableCell>
                      <TableCell>{log.gravity || '-'}</TableCell>
                      <TableCell>{log.ph || '-'}</TableCell>
                      <TableCell>{log.pressure || '-'} PSI</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {log.notes || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        {batch.notes && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{batch.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}