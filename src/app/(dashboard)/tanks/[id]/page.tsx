'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, Pencil } from 'lucide-react';

export default function TankDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [tank, setTank] = useState<any>(null);

  useEffect(() => {
    const fetchTank = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tanks/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setTank(data);
        } else {
          alert('Failed to load tank');
          router.push('/tanks');
        }
      } catch (error) {
        console.error('Error loading tank:', error);
        alert('Error loading tank');
        router.push('/tanks');
      } finally {
        setLoading(false);
      }
    };

    fetchTank();
  }, [id, router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EMPTY':
        return 'bg-gray-100 text-gray-800';
      case 'IN_USE':
        return 'bg-blue-100 text-blue-800';
      case 'CLEANING':
        return 'bg-yellow-100 text-yellow-800';
      case 'MAINTENANCE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!tank) {
    return null;
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/tanks">
            <Button variant="ghost" className="mb-2">
              ← Back to Tanks
            </Button>
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{tank.name}</h1>
              <p className="text-gray-600 mt-1 text-lg">{tank.type}</p>
            </div>
            <Link href={`/tanks/${tank.id}/edit`}>
              <Button variant="outline">
                <Pencil className="h-4 w-4 mr-2" />
                Edit Tank
              </Button>
            </Link>
          </div>
        </div>

        {/* Tank Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  tank.status
                )}`}
              >
                {tank.status}
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Capacity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{tank.capacity}L</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Location</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{tank.location || 'Not specified'}</p>
            </CardContent>
          </Card>
        </div>

        {/* Current Batches */}
        {tank.batches && tank.batches.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Current Batches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tank.batches.map((batch: any) => (
                  <div
                    key={batch.id}
                    className="flex justify-between items-center p-4 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">{batch.batchNumber}</p>
                      <p className="text-sm text-gray-600">
                        {batch.recipe.name} - {batch.recipe.style}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Brew Date: {new Date(batch.brewDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium
                          ${
                            batch.status === 'FERMENTING'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                      >
                        {batch.status}
                      </span>
                      <p className="text-sm text-gray-600 mt-1">
                        {batch.actualVolume || batch.expectedVolume}L
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {(!tank.batches || tank.batches.length === 0) && (
          <Card className="mb-8">
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No batches currently in this tank</p>
              {tank.status === 'EMPTY' && (
                <Link href="/batches/new">
                  <Button className="mt-4">Start a New Batch</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        {tank.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{tank.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
