'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTanks } from '@/hooks/useTanks';
import Link from 'next/link';

export default function NewTankPage() {
  const router = useRouter();
  const { createTank } = useTanks();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const tankData = {
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      capacity: parseFloat(formData.get('capacity') as string),
      status: formData.get('status') as string,
      location: (formData.get('location') as string) || undefined,
      notes: (formData.get('notes') as string) || undefined,
    };

    const success = await createTank(tankData);
    if (success) {
      router.push('/tanks');
    } else {
      alert('Failed to create tank');
    }
    setLoading(false);
  };

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
            <CardTitle>New Tank</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tank Name *
                </label>
                <Input name="name" required placeholder="e.g. FV-01" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type *</label>
                <select
                  name="type"
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
                  required
                  placeholder="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Status *
                </label>
                <select
                  name="status"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                  defaultValue="EMPTY"
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
                  placeholder="e.g. Cellar A, Bay 3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  name="notes"
                  className="w-full px-3 py-2 border rounded-md"
                  rows={4}
                  placeholder="Additional notes about this tank..."
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Tank'}
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
