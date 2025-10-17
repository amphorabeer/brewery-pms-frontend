'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTanks } from '@/hooks/useTanks';
import Link from 'next/link';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';

export default function TanksPage() {
  const router = useRouter();
  const { tanks, isLoading, deleteTank } = useTanks();

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete tank "${name}"?`)) {
      await deleteTank(id);
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tanks</h1>
          <p className="text-muted-foreground">Manage fermentation vessels</p>
        </div>
        <Link href="/tanks/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Tank
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tanks?.map((tank) => (
          <Card key={tank.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{tank.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{tank.type}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/tanks/${tank.id}/edit`)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(tank.id, tank.name)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      tank.status
                    )}`}
                  >
                    {tank.status}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Capacity:</span>
                  <span className="text-sm font-medium">{tank.capacity}L</span>
                </div>

                {tank.location && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Location:</span>
                    <span className="text-sm font-medium">{tank.location}</span>
                  </div>
                )}

                {tank.batches && tank.batches.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-1">
                      Current Batch:
                    </p>
                    <p className="text-sm font-medium">
                      {tank.batches[0].recipe.name}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tanks?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tanks found</p>
          <Link href="/tanks/new">
            <Button className="mt-4">Create your first tank</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
