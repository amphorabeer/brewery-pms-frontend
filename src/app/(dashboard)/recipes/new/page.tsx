'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function NewRecipePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      style: formData.get('style'),
      batchSize: parseFloat(formData.get('batchSize') as string),
      abv: parseFloat(formData.get('abv') as string) || undefined,
      ibu: parseFloat(formData.get('ibu') as string) || undefined,
      og: parseFloat(formData.get('og') as string) || undefined,
      fg: parseFloat(formData.get('fg') as string) || undefined,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recipes`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        router.push('/recipes');
      } else {
        alert('Failed to create recipe');
      }
    } catch (error) {
      alert('Error creating recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/recipes">
          <Button variant="ghost" className="mb-4">
            ← Back to Recipes
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Create New Recipe</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Recipe Name *
                </label>
                <Input name="name" required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Beer Style *
                </label>
                <Input name="style" required placeholder="e.g. IPA, Stout" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Batch Size (L) *
                </label>
                <Input
                  name="batchSize"
                  type="number"
                  step="0.1"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    ABV (%)
                  </label>
                  <Input name="abv" type="number" step="0.1" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    IBU
                  </label>
                  <Input name="ibu" type="number" step="0.1" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Original Gravity (OG)
                  </label>
                  <Input name="og" type="number" step="0.001" placeholder="1.050" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Final Gravity (FG)
                  </label>
                  <Input name="fg" type="number" step="0.001" placeholder="1.010" />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Recipe'}
                </Button>
                <Link href="/recipes">
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
