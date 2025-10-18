'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQcStats } from '@/hooks/useQc';
import { CheckCircle, XCircle, Clock, Target } from 'lucide-react';

interface QcStatsCardProps {
  batchId?: string;
}

export function QcStatsCard({ batchId }: QcStatsCardProps) {
  const { data: stats, isLoading } = useQcStats(batchId);

  if (isLoading || !stats) {
    return null;
  }

  if (stats.total === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>QC Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-gray-600">Total Tests</p>
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-sm text-gray-600">Passed</p>
            <p className="text-2xl font-bold text-green-600">{stats.passed}</p>
          </div>

          <div className="text-center p-4 bg-red-50 rounded-lg">
            <XCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
            <p className="text-sm text-gray-600">Failed</p>
            <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
          </div>

          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <Clock className="w-8 h-8 mx-auto mb-2 text-amber-600" />
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-1">Pass Rate</p>
          <p className="text-3xl font-bold text-gray-900">{stats.passRate}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${stats.passRate}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
