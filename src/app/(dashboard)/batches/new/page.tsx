'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRecipes } from '@/hooks/useRecipes';
import { useLocations } from '@/hooks/useLocations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import Link from 'next/link';
import api from '@/lib/api';

export default function NewBatchPage() {
  const router = useRouter();
  const { data: recipes, isLoading: recipesLoading } = useRecipes();
  const { data: locations, isLoading: locationsLoading } = useLocations();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    recipeId: '',
    locationId: '',
    brewDate: new Date().toISOString().split('T')[0],
    expectedVolume: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.recipeId) {
      toast.error('Please select a recipe');
      return;
    }
    
    if (!formData.locationId) {
      toast.error('Please select a location');
      return;
    }
    
    if (!formData.expectedVolume) {
      toast.error('Please enter expected volume');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/batches', {
        recipeId: formData.recipeId,
        locationId: formData.locationId,
        brewDate: formData.brewDate,
        expectedVolume: parseFloat(formData.expectedVolume),
        notes: formData.notes || undefined,
      });

      toast.success('Batch created successfully!');
      router.push(`/batches/${response.data.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create batch');
    } finally {
      setLoading(false);
    }
  };

  if (recipesLoading || locationsLoading) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/batches">
            <Button variant="ghost" className="mb-2">
              ← Back to Batches
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Create New Batch</h1>
          <p className="text-gray-600 mt-1">
            Start a new brewing batch from a recipe
          </p>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Batch Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Recipe Selection */}
              <div className="space-y-2">
                <Label htmlFor="recipe">Recipe *</Label>
                <Select
                  value={formData.recipeId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, recipeId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a recipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {recipes?.map((recipe) => (
                      <SelectItem key={recipe.id} value={recipe.id}>
                        {recipe.name} - {recipe.style}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Choose the recipe for this batch
                </p>
              </div>

              {/* Selected Recipe Info */}
              {formData.recipeId && recipes && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  {(() => {
                    const selectedRecipe = recipes.find(
                      (r) => r.id === formData.recipeId
                    );
                    if (!selectedRecipe) return null;

                    return (
                      <div>
                        <p className="font-semibold text-amber-900 mb-2">
                          {selectedRecipe.name}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm text-amber-800">
                          <div>Style: {selectedRecipe.style}</div>
                          <div>ABV: {selectedRecipe.abv}%</div>
                          <div>Batch Size: {selectedRecipe.batchSize}L</div>
                          <div>IBU: {selectedRecipe.ibu}</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Location Selection */}
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Select
                  value={formData.locationId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, locationId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations?.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                        {location.address && ` - ${location.address}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Where will this batch be brewed?
                </p>
              </div>

              {/* Brew Date */}
              <div className="space-y-2">
                <Label htmlFor="brewDate">Brew Date *</Label>
                <Input
                  id="brewDate"
                  type="date"
                  value={formData.brewDate}
                  onChange={(e) =>
                    setFormData({ ...formData, brewDate: e.target.value })
                  }
                  required
                />
                <p className="text-xs text-gray-500">
                  When will this batch be brewed?
                </p>
              </div>

              {/* Expected Volume */}
              <div className="space-y-2">
                <Label htmlFor="expectedVolume">Expected Volume (L) *</Label>
                <Input
                  id="expectedVolume"
                  type="number"
                  step="0.1"
                  placeholder="100"
                  value={formData.expectedVolume}
                  onChange={(e) =>
                    setFormData({ ...formData, expectedVolume: e.target.value })
                  }
                  required
                />
                <p className="text-xs text-gray-500">
                  Target volume for this batch
                </p>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <textarea
                  id="notes"
                  className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Add any notes about this batch..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> The batch will be created with status{' '}
                  <strong>PLANNED</strong>. You can update the status as you
                  progress through brewing.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4">
                <Link href="/batches">
                  <Button type="button" variant="outline" disabled={loading}>
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Batch'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* No Recipes/Locations Warning */}
        {((recipes && recipes.length === 0) || (locations && locations.length === 0)) && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              <strong>Missing required data:</strong>
            </p>
            <ul className="list-disc list-inside text-yellow-800 mt-2">
              {recipes && recipes.length === 0 && (
                <li>You need to create at least one recipe.</li>
              )}
              {locations && locations.length === 0 && (
                <li>You need to create at least one location.</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}