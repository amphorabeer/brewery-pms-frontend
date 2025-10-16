'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useIngredients } from '@/hooks/useIngredients';

export default function NewIngredientPage() {
  const router = useRouter();
  const { createIngredient } = useIngredients();
  const [loading, setLoading] = useState(false);

  const ingredientTypes = ['Grain', 'Hop', 'Yeast', 'Adjunct', 'Water', 'Other'];
  const units = ['kg', 'g', 'l', 'ml', 'unit'];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      supplier: formData.get('supplier') as string || undefined,
      costPerUnit: formData.get('costPerUnit') ? parseFloat(formData.get('costPerUnit') as string) : undefined,
      unit: formData.get('unit') as string,
      stock: formData.get('stock') ? parseFloat(formData.get('stock') as string) : undefined,
      notes: formData.get('notes') as string || undefined,
    };

    try {
      await createIngredient(data);
      router.push('/ingredients');
    } catch (error) {
      alert('Failed to create ingredient');
    } finally {
      setLoading(false);
    }
  };

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
            <CardTitle>Create New Ingredient</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Name *
                </label>
                <Input name="name" required placeholder="Pilsner Malt" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Type *
                </label>
                <select
                  name="type"
                  required
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="">Select type...</option>
                  {ingredientTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Supplier
                </label>
                <Input name="supplier" placeholder="Supplier name" />
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
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Unit *
                  </label>
                  <select
                    name="unit"
                    required
                    className="w-full border rounded-md px-3 py-2"
                  >
                    {units.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
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
                  placeholder="0.000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Additional information..."
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Ingredient'}
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