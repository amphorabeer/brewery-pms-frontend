'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function EditRecipePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [recipe, setRecipe] = useState<any>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setRecipe(data);
        } else {
          alert('Failed to load recipe');
          router.push('/recipes');
        }
      } catch (error) {
        console.error('Error loading recipe:', error);
        alert('Error loading recipe');
        router.push('/recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      style: formData.get('style'),
      batchSize: parseFloat(formData.get('batchSize') as string),
      abv: formData.get('abv') ? parseFloat(formData.get('abv') as string) : undefined,
      ibu: formData.get('ibu') ? parseFloat(formData.get('ibu') as string) : undefined,
      og: formData.get('og') ? parseFloat(formData.get('og') as string) : undefined,
      fg: formData.get('fg') ? parseFloat(formData.get('fg') as string) : undefined,
      mashTemp: formData.get('mashTemp') ? parseFloat(formData.get('mashTemp') as string) : undefined,
      mashTime: formData.get('mashTime') ? parseInt(formData.get('mashTime') as string) : undefined,
      boilTime: formData.get('boilTime') ? parseInt(formData.get('boilTime') as string) : undefined,
      fermentTemp: formData.get('fermentTemp') ? parseFloat(formData.get('fermentTemp') as string) : undefined,
      fermentDays: formData.get('fermentDays') ? parseInt(formData.get('fermentDays') as string) : undefined,
      notes: formData.get('notes') || undefined,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}`,
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
        router.push(`/recipes/${id}`);
      } else {
        alert('Failed to update recipe');
      }
    } catch (error) {
      console.error('Error updating recipe:', error);
      alert('Error updating recipe');
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

  if (!recipe) {
    return null;
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <Link href={`/recipes/${id}`}>
          <Button variant="ghost" className="mb-4">
            ← Back to Recipe
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Edit Recipe</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Recipe Name *
                  </label>
                  <Input
                    name="name"
                    defaultValue={recipe.name}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Beer Style *
                  </label>
                  <Input
                    name="style"
                    defaultValue={recipe.style}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Batch Size (L) *
                  </label>
                  <Input
                    name="batchSize"
                    type="number"
                    step="0.1"
                    defaultValue={recipe.batchSize}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">ABV (%)</label>
                    <Input
                      name="abv"
                      type="number"
                      step="0.1"
                      defaultValue={recipe.abv || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">IBU</label>
                    <Input
                      name="ibu"
                      type="number"
                      step="0.1"
                      defaultValue={recipe.ibu || ''}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Original Gravity (OG)
                    </label>
                    <Input
                      name="og"
                      type="number"
                      step="0.001"
                      defaultValue={recipe.og || ''}
                      placeholder="1.050"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Final Gravity (FG)
                    </label>
                    <Input
                      name="fg"
                      type="number"
                      step="0.001"
                      defaultValue={recipe.fg || ''}
                      placeholder="1.010"
                    />
                  </div>
                </div>
              </div>

              {/* Brewing Parameters */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Brewing Parameters</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Mash Temp (°C)
                    </label>
                    <Input
                      name="mashTemp"
                      type="number"
                      step="0.1"
                      defaultValue={recipe.mashTemp || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Mash Time (min)
                    </label>
                    <Input
                      name="mashTime"
                      type="number"
                      defaultValue={recipe.mashTime || ''}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Boil Time (min)
                  </label>
                  <Input
                    name="boilTime"
                    type="number"
                    defaultValue={recipe.boilTime || ''}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Fermentation Temp (°C)
                    </label>
                    <Input
                      name="fermentTemp"
                      type="number"
                      step="0.1"
                      defaultValue={recipe.fermentTemp || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Fermentation Days
                    </label>
                    <Input
                      name="fermentDays"
                      type="number"
                      defaultValue={recipe.fermentDays || ''}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <textarea
                    name="notes"
                    defaultValue={recipe.notes || ''}
                    className="w-full px-3 py-2 border rounded-md"
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Changes'}
                </Button>
                <Link href={`/recipes/${id}`}>
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