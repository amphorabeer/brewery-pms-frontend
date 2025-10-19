'use client';

import { useIngredients } from '@/hooks/useIngredients';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function IngredientsPage() {
  const { data: ingredients, isLoading } = useIngredients();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Ingredients</h1>
          <p className="text-gray-600">Brewing ingredients inventory</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/ingredients/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Ingredient
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ingredients List</CardTitle>
        </CardHeader>
        <CardContent>
          {ingredients && ingredients.length > 0 ? (
            <div className="space-y-4">
              {ingredients.map((ingredient: any) => (
                <div
                  key={ingredient.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-lg">{ingredient.name}</p>
                    <p className="text-sm text-gray-600">
                      Type: {ingredient.type} • Unit: {ingredient.unit}
                    </p>
                    {ingredient.currentStock !== undefined && (
                      <p className="text-sm text-gray-500">
                        Stock: {ingredient.currentStock} {ingredient.unit}
                      </p>
                    )}
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/ingredients/${ingredient.id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No ingredients found.</p>
              <p className="text-sm mt-2">
                Click "Add Ingredient" to create your first ingredient.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
