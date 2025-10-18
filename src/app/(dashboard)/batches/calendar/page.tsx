'use client';

import { useRouter } from 'next/navigation';
import { useBatches } from '@/hooks/useBatches';
import BatchCalendar from '@/components/BatchCalendar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';

export default function BatchCalendarPage() {
  const router = useRouter();
  const { data: batches = [], isLoading: loading, error } = useBatches();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading batches: {error.message}</p>
        </div>
      </div>
    );
  }

  const handleSelectBatch = (batch: any) => {
    router.push(`/batches/${batch.id}`);
  };

  const handleCreateBatch = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    router.push(`/batches/new?date=${dateStr}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/batches">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <CalendarIcon className="h-8 w-8 text-amber-600" />
              Batch Timeline
            </h1>
            <p className="text-gray-600 mt-1">
              Visual calendar view of all brewing batches
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-600 font-medium">Total Batches</div>
          <div className="text-2xl font-bold text-blue-900">{batches.length}</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-sm text-yellow-600 font-medium">Active Brewing</div>
          <div className="text-2xl font-bold text-yellow-900">
            {batches.filter(b => b.status === 'BREWING').length}
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-sm text-purple-600 font-medium">Fermenting</div>
          <div className="text-2xl font-bold text-purple-900">
            {batches.filter(b => b.status === 'FERMENTING').length}
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-600 font-medium">Packaged</div>
          <div className="text-2xl font-bold text-green-900">
            {batches.filter(b => b.status === 'PACKAGED').length}
          </div>
        </div>
      </div>

      <BatchCalendar
        batches={batches}
        onSelectBatch={handleSelectBatch}
        onCreateBatch={handleCreateBatch}
      />
    </div>
  );
}