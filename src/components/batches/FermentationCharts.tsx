'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

interface FermentationLog {
  id: string;
  measuredAt: string;
  temperature: number;
  gravity?: number;
  ph?: number;
  pressure?: number;
  notes?: string;
}

interface FermentationChartsProps {
  logs: FermentationLog[];
}

export function FermentationCharts({ logs }: FermentationChartsProps) {
  if (!logs || logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fermentation Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <p>No fermentation logs yet.</p>
            <p className="text-sm mt-2">Add logs to see temperature and gravity charts.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform data for charts
  const chartData = logs.map((log) => ({
    date: format(new Date(log.measuredAt), 'MM/dd'),
    fullDate: format(new Date(log.measuredAt), 'MMM dd, yyyy'),
    temperature: log.temperature,
    gravity: log.gravity ? parseFloat(log.gravity.toString()) : null,
    ph: log.ph ? parseFloat(log.ph.toString()) : null,
    pressure: log.pressure ? parseFloat(log.pressure.toString()) : null,
  }));

  // Check if we have data for each metric
  const hasGravity = chartData.some(d => d.gravity !== null);
  const hasPH = chartData.some(d => d.ph !== null);
  const hasPressure = chartData.some(d => d.pressure !== null);

  return (
    <div className="space-y-6">
      {/* Temperature Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Temperature Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                label={{ value: '°C', angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                        <p className="font-semibold text-sm">{payload[0].payload.fullDate}</p>
                        <p className="text-amber-600 text-sm">
                          Temperature: {payload[0].value}°C
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="#d97706"
                fill="#fbbf24"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gravity Chart */}
      {hasGravity && (
        <Card>
          <CardHeader>
            <CardTitle>Specific Gravity Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  label={{ value: 'SG', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 12 }}
                  domain={['dataMin - 0.005', 'dataMax + 0.005']}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                          <p className="font-semibold text-sm">{payload[0].payload.fullDate}</p>
                          <p className="text-blue-600 text-sm">
                            Gravity: {payload[0].value?.toFixed(3)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="gravity"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* pH Chart */}
      {hasPH && (
        <Card>
          <CardHeader>
            <CardTitle>pH Level Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  label={{ value: 'pH', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 12 }}
                  domain={[3, 6]}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                          <p className="font-semibold text-sm">{payload[0].payload.fullDate}</p>
                          <p className="text-green-600 text-sm">
                            pH: {payload[0].value?.toFixed(2)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ph"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Pressure Chart */}
      {hasPressure && (
        <Card>
          <CardHeader>
            <CardTitle>Pressure Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  label={{ value: 'PSI', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                          <p className="font-semibold text-sm">{payload[0].payload.fullDate}</p>
                          <p className="text-purple-600 text-sm">
                            Pressure: {payload[0].value?.toFixed(1)} PSI
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="pressure"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={{ fill: '#a855f7', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Summary Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <p className="text-sm text-gray-600">Avg Temperature</p>
              <p className="text-2xl font-bold text-amber-600">
                {(chartData.reduce((sum, d) => sum + d.temperature, 0) / chartData.length).toFixed(1)}°C
              </p>
            </div>
            {hasGravity && (
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Gravity Drop</p>
                <p className="text-2xl font-bold text-blue-600">
                  {(() => {
                    const gravities = chartData.filter(d => d.gravity !== null).map(d => d.gravity!);
                    if (gravities.length < 2) return 'N/A';
                    return (gravities[0] - gravities[gravities.length - 1]).toFixed(3);
                  })()}
                </p>
              </div>
            )}
            {hasPH && (
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Current pH</p>
                <p className="text-2xl font-bold text-green-600">
                  {chartData[chartData.length - 1].ph?.toFixed(2) || 'N/A'}
                </p>
              </div>
            )}
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Readings</p>
              <p className="text-2xl font-bold text-purple-600">
                {chartData.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
