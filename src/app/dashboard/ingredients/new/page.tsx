'use client';

import { useRouter } from 'next/navigation';
import { useCreateIngredient } from '@/hooks/useIngredients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewIngredientPage() {
  const router = useRouter();
  const createIngredient = useCreateIngredient();

  const [formData, setFormData] = useState({
    name: '',
    type: 'MALT',
    unit: 'kg',
    costPerUnit: 0,
    supplier: '',
    reorderLevel: 0,
    reorderQuantity: 0,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error('Ingredient name is required');
      return;
    }

    try {
      const ingredientData = {
        ...formData,
        costPerUnit: Number(formData.costPerUnit),
        reorderLevel: Number(formData.reorderLevel),
        reorderQuantity: Number(formData.reorderQuantity),
      };

      await createIngredient.mutateAsync(ingredientData);
      toast.success('Ingredient created successfully');
      router.push('/dashboard/ingredients');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create ingredient');
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/ingredients">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Ingredient</h1>
          <p className="text-gray-600">Add a new brewing ingredient</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Ingredient Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Pilsner Malt"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="type">Type *</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="MALT">Malt</option>
                  <option value="HOPS">Hops</option>
                  <option value="YEAST">Yeast</option>
                  <option value="ADJUNCT">Adjunct</option>
                  <option value="WATER_TREATMENT">Water Treatment</option>
                  <option value="FINING">Fining</option>
                  <option value="FRUIT">Fruit</option>
                  <option value="SPICE">Spice</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="unit">Unit of Measurement *</Label>
                <select
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => handleChange('unit', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="g">Grams (g)</option>
                  <option value="l">Liters (l)</option>
                  <option value="ml">Milliliters (ml)</option>
                  <option value="units">Units</option>
                  <option value="sachets">Sachets</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="supplier">Supplier (Optional)</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => handleChange('supplier', e.target.value)}
                placeholder="Georgian Hops Ltd"
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Inventory */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="costPerUnit">Cost Per Unit (₾)</Label>
              <Input
                id="costPerUnit"
                type="number"
                step="0.01"
                min="0"
                value={formData.costPerUnit || ''}
                onChange={(e) => handleChange('costPerUnit', e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="reorderLevel">Reorder Level</Label>
                <Input
                  id="reorderLevel"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.reorderLevel || ''}
                  onChange={(e) => handleChange('reorderLevel', e.target.value)}
                  placeholder="Minimum stock level"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Alert when stock falls below this level
                </p>
              </div>

              <div>
                <Label htmlFor="reorderQuantity">Reorder Quantity</Label>
                <Input
                  id="reorderQuantity"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.reorderQuantity || ''}
                  onChange={(e) => handleChange('reorderQuantity', e.target.value)}
                  placeholder="Suggested order quantity"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Suggested quantity to reorder
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Additional notes about this ingredient..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={createIngredient.isPending}>
            {createIngredient.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Ingredient
          </Button>
        </div>
      </form>
    </div>
  );
}
