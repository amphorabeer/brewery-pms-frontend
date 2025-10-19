'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIngredients } from '@/hooks/useIngredients';
import Link from 'next/link';

interface SelectedIngredient {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  timing?: string;
  notes?: string;
}

type GravityUnit = 'SG' | 'Plato';

export default function NewRecipePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { ingredients } = useIngredients();
  
  // Gravity and ABV state
  const [gravityUnit, setGravityUnit] = useState<GravityUnit>('SG');
  const [og, setOg] = useState('');
  const [fg, setFg] = useState('');
  const [calculatedAbv, setCalculatedAbv] = useState<number | null>(null);
  
  // Ingredients state
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState({
    ingredientId: '',
    quantity: '',
    unit: 'kg',
    timing: '',
    notes: '',
  });

  // Calculate ABV whenever OG, FG, or unit changes
  useEffect(() => {
    if (og && fg) {
      const ogNum = parseFloat(og);
      const fgNum = parseFloat(fg);
      
      if (ogNum && fgNum && ogNum > fgNum) {
        let abv: number;
        
        if (gravityUnit === 'SG') {
          // ABV from Specific Gravity
          abv = (ogNum - fgNum) * 131.25;
        } else {
          // ABV from Plato
          abv = (ogNum - fgNum) * 0.53;
        }
        
        setCalculatedAbv(parseFloat(abv.toFixed(2)));
      } else {
        setCalculatedAbv(null);
      }
    } else {
      setCalculatedAbv(null);
    }
  }, [og, fg, gravityUnit]);

  // Convert gravity for submission (always save as SG)
  const convertToSG = (value: number, unit: GravityUnit): number => {
    if (unit === 'SG') return value;
    // Plato to SG conversion
    return 1 + (value / (258.6 - ((value / 258.2) * 227.1)));
  };

  const handleAddIngredient = () => {
    if (!currentIngredient.ingredientId || !currentIngredient.quantity) {
      alert('Please select ingredient and enter quantity');
      return;
    }

    const ingredient = ingredients?.find((i: any) => i.id === currentIngredient.ingredientId);
    if (!ingredient) return;

    const newIngredient: SelectedIngredient = {
      ingredientId: currentIngredient.ingredientId,
      ingredientName: ingredient.name,
      quantity: parseFloat(currentIngredient.quantity),
      unit: currentIngredient.unit,
      timing: currentIngredient.timing || undefined,
      notes: currentIngredient.notes || undefined,
    };

    setSelectedIngredients([...selectedIngredients, newIngredient]);
    
    // Reset form
    setCurrentIngredient({
      ingredientId: '',
      quantity: '',
      unit: 'kg',
      timing: '',
      notes: '',
    });
  };

  const handleRemoveIngredient = (index: number) => {
    setSelectedIngredients(selectedIngredients.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Convert gravity to SG if needed
    const ogValue = og ? convertToSG(parseFloat(og), gravityUnit) : undefined;
    const fgValue = fg ? convertToSG(parseFloat(fg), gravityUnit) : undefined;
    
    const recipeData = {
      name: formData.get('name'),
      style: formData.get('style'),
      batchSize: parseFloat(formData.get('batchSize') as string),
      abv: calculatedAbv || undefined,
      ibu: parseFloat(formData.get('ibu') as string) || undefined,
      og: ogValue,
      fg: fgValue,
      mashTemp: parseFloat(formData.get('mashTemp') as string) || undefined,
      mashTime: parseInt(formData.get('mashTime') as string) || undefined,
      boilTime: parseInt(formData.get('boilTime') as string) || undefined,
      fermentTemp: parseFloat(formData.get('fermentTemp') as string) || undefined,
      fermentDays: parseInt(formData.get('fermentDays') as string) || undefined,
      notes: formData.get('notes') || undefined,
    };

    try {
      // 1. Create Recipe
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recipes`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify(recipeData),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create recipe');
      }

      const recipe = await response.json();

      // 2. Add Ingredients to Recipe
      if (selectedIngredients.length > 0) {
        for (const ingredient of selectedIngredients) {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/recipes/${recipe.id}/ingredients`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              },
              body: JSON.stringify({
                ingredientId: ingredient.ingredientId,
                quantity: ingredient.quantity,
                unit: ingredient.unit,
                timing: ingredient.timing,
                notes: ingredient.notes,
              }),
            }
          );
        }
      }

      router.push('/recipes');
    } catch (error) {
      console.error('Error creating recipe:', error);
      alert('Error creating recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/recipes">
          <Button variant="ghost" className="mb-4">
            ← Back to Recipes
          </Button>
        </Link>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Input name="batchSize" type="number" step="0.1" required />
              </div>

              {/* Gravity Unit Selector */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Gravity Unit
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="SG"
                      checked={gravityUnit === 'SG'}
                      onChange={(e) => setGravityUnit(e.target.value as GravityUnit)}
                      className="mr-2"
                    />
                    Specific Gravity (SG)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="Plato"
                      checked={gravityUnit === 'Plato'}
                      onChange={(e) => setGravityUnit(e.target.value as GravityUnit)}
                      className="mr-2"
                    />
                    Plato (°P)
                  </label>
                </div>
              </div>

              {/* Gravity Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Original Gravity (OG)
                  </label>
                  <Input
                    type="number"
                    step="0.001"
                    placeholder={gravityUnit === 'SG' ? '1.050' : '12.4'}
                    value={og}
                    onChange={(e) => setOg(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {gravityUnit === 'SG' ? 'e.g. 1.050' : 'e.g. 12.4°P'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Final Gravity (FG)
                  </label>
                  <Input
                    type="number"
                    step="0.001"
                    placeholder={gravityUnit === 'SG' ? '1.010' : '3.1'}
                    value={fg}
                    onChange={(e) => setFg(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {gravityUnit === 'SG' ? 'e.g. 1.010' : 'e.g. 3.1°P'}
                  </p>
                </div>
              </div>

              {/* ABV Display */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    ABV (%) - Calculated
                  </label>
                  <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-lg font-bold text-green-700">
                      {calculatedAbv !== null ? `${calculatedAbv}%` : '---'}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-calculated from OG and FG
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">IBU</label>
                  <Input name="ibu" type="number" step="0.1" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle>Ingredients</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Ingredient Form */}
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Select Ingredient
                    </label>
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      value={currentIngredient.ingredientId}
                      onChange={(e) =>
                        setCurrentIngredient({
                          ...currentIngredient,
                          ingredientId: e.target.value,
                        })
                      }
                    >
                      <option value="">Choose ingredient...</option>
                      {ingredients?.map((ing: any) => (
                        <option key={ing.id} value={ing.id}>
                          {ing.name} ({ing.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Quantity
                      </label>
                      <Input
                        type="number"
                        step="0.001"
                        value={currentIngredient.quantity}
                        onChange={(e) =>
                          setCurrentIngredient({
                            ...currentIngredient,
                            quantity: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Unit</label>
                      <select
                        className="w-full px-3 py-2 border rounded-md"
                        value={currentIngredient.unit}
                        onChange={(e) =>
                          setCurrentIngredient({
                            ...currentIngredient,
                            unit: e.target.value,
                          })
                        }
                      >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="L">L</option>
                        <option value="ml">ml</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Timing (optional)
                    </label>
                    <Input
                      placeholder="e.g. Mash, Boil 60min, Dry hop"
                      value={currentIngredient.timing}
                      onChange={(e) =>
                        setCurrentIngredient({
                          ...currentIngredient,
                          timing: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Notes (optional)
                    </label>
                    <Input
                      placeholder="Additional notes"
                      value={currentIngredient.notes}
                      onChange={(e) =>
                        setCurrentIngredient({
                          ...currentIngredient,
                          notes: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleAddIngredient}
                  variant="outline"
                  className="w-full"
                >
                  + Add Ingredient
                </Button>
              </div>

              {/* Selected Ingredients List */}
              {selectedIngredients.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium">Selected Ingredients:</h3>
                  {selectedIngredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-white border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{ingredient.ingredientName}</p>
                        <p className="text-sm text-gray-600">
                          {ingredient.quantity} {ingredient.unit}
                          {ingredient.timing && ` • ${ingredient.timing}`}
                        </p>
                        {ingredient.notes && (
                          <p className="text-sm text-gray-500">{ingredient.notes}</p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveIngredient(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Brewing Parameters */}
          <Card>
            <CardHeader>
              <CardTitle>Brewing Parameters (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Mash Temp (°C)
                  </label>
                  <Input name="mashTemp" type="number" step="0.1" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Mash Time (min)
                  </label>
                  <Input name="mashTime" type="number" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Boil Time (min)
                </label>
                <Input name="boilTime" type="number" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Fermentation Temp (°C)
                  </label>
                  <Input name="fermentTemp" type="number" step="0.1" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Fermentation Days
                  </label>
                  <Input name="fermentDays" type="number" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  name="notes"
                  className="w-full px-3 py-2 border rounded-md"
                  rows={4}
                  placeholder="Additional brewing notes..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
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
      </div>
    </div>
  );
}