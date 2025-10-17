'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function EditTankPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      type: formData.get('type'),
      capacity: parseFloat(formData.get('capacity') as string),
      status: formData.get('status'),
      location: formData.get('location') || undefined,
      notes: formData.get('notes') || undefined,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tanks/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        router.push('/tanks');
      } else {
        alert('Failed to update tank');
      }
    } catch (error) {
      console.error('Error updating tank:', error);
      alert('Error updating tank');
    } finally {
      setSubmitting(false);
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
      <div className="max-w-2xl mx-auto">
        <Link href="/tanks">
          <Button variant="ghost" className="mb-4">
            ← Back to Tanks
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Edit Tank</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tank Name *
                </label>
                <Input
                  name="name"
                  defaultValue={tank.name}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type *</label>
                <select
                  name="type"
                  defaultValue={tank.type}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select type...</option>
                  <option value="Fermenter">Fermenter</option>
                  <option value="Bright Tank">Bright Tank</option>
                  <option value="Conditioning Tank">Conditioning Tank</option>
                  <option value="Maturation Tank">Maturation Tank</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Capacity (Liters) *
                </label>
                <Input
                  name="capacity"
                  type="number"
                  step="0.1"
                  defaultValue={tank.capacity}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Status *
                </label>
                <select
                  name="status"
                  defaultValue={tank.status}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="EMPTY">Empty</option>
                  <option value="IN_USE">In Use</option>
                  <option value="CLEANING">Cleaning</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Location
                </label>
                <Input
                  name="location"
                  defaultValue={tank.location || ''}
                  placeholder="e.g. Cellar A, Bay 3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  name="notes"
                  defaultValue={tank.notes || ''}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={4}
                  placeholder="Additional notes about this tank..."
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Changes'}
                </Button>
                <Link href="/tanks">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
