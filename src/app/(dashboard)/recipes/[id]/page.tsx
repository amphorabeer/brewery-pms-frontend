'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function EditIngredientPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [ingredient, setIngredient] = useState<any>(null);

  useEffect(() => {
    const fetchIngredient = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/ingredients/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setIngredient(data);
        } else {
          alert('Failed to load ingredient');
          router.push('/ingredients');
        }
      } catch (error) {
        console.error('Error loading ingredient:', error);
        alert('Error loading ingredient');
        router.push('/ingredients');
      } finally {
        setLoading(false);
      }
    };

    fetchIngredient();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      type: formData.get('type'),
      supplier: formData.get('supplier') || undefined,
      costPerUnit: formData.get('costPerUnit')
        ? parseFloat(formData.get('costPerUnit') as string)
        : undefined,
      unit: formData.get('unit'),
      stock: formData.get('stock')
        ? parseFloat(formData.get('stock') as string)
        : undefined,
      notes: formData.get('notes') || undefined,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ingredients/${id}`,
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
        router.push('/ingredients');
      } else {
        alert('Failed to update ingredient');
      }
    } catch (error) {
      console.error('Error updating ingredient:', error);
      alert('Error updating ingredient');
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

  if (!ingredient) {
    return null;
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/ingredients">
          <Button variant="ghost" className="mb-4">
            ← Back to Ingredients
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Edit Ingredient</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Ingredient Name *
                </label>
                <Input
                  name="name"
                  defaultValue={ingredient.name}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type *</label>
                <select
                  name="type"
                  defaultValue={ingredient.type}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select type...</option>
                  <option value="Grain">Grain</option>
                  <option value="Hop">Hop</option>
                  <option value="Yeast">Yeast</option>
                  <option value="Adjunct">Adjunct</option>
                  <option value="Water">Water</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Supplier
                </label>
                <Input
                  name="supplier"
                  defaultValue={ingredient.supplier || ''}
                  placeholder="Optional"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Cost per Unit
                  </label>
                  <Input
                    name="costPerUnit"
                    type="number"
                    step="0.01"
                    defaultValue={ingredient.costPerUnit || ''}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Unit *</label>
                  <select
                    name="unit"
                    defaultValue={ingredient.unit}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="L">L</option>
                    <option value="ml">ml</option>
                    <option value="unit">unit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Current Stock
                </label>
                <Input
                  name="stock"
                  type="number"
                  step="0.001"
                  defaultValue={ingredient.stock || ''}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  name="notes"
                  defaultValue={ingredient.notes || ''}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={4}
                  placeholder="Additional notes about this ingredient..."
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Changes'}
                </Button>
                <Link href="/ingredients">
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