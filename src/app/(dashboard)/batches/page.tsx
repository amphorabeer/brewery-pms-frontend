'use client';

import { useBatches } from '@/hooks/useBatches';
import { StatusBadge } from '@/components/batches/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function BatchesPage() {
  const { data: batches, isLoading, error } = useBatches();

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <p>Loading batches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-600">Error loading batches</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">🍺 Batches</h1>
            <p className="text-gray-600 mt-1">
              Manage your brewery production batches
            </p>
          </div>
          <Link href="/batches/new">
            <Button>+ New Batch</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Batches ({batches?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {!batches || batches.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No batches yet</p>
                <p className="text-sm mt-2">Create your first batch to get started</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch Number</TableHead>
                    <TableHead>Recipe</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>ABV</TableHead>
                    <TableHead>Brew Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batches.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-mono font-semibold">
                        {batch.batchNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{batch.recipe.name}</div>
                          <div className="text-sm text-gray-500">
                            {batch.recipe.style}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={batch.status} />
                      </TableCell>
                      <TableCell>
                        {batch.actualVolume || batch.expectedVolume}L
                      </TableCell>
                      <TableCell>
                        {batch.abv ? `${batch.abv}%` : '-'}
                      </TableCell>
                      <TableCell>
                        {new Date(batch.brewDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Link href={`/batches/${batch.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}