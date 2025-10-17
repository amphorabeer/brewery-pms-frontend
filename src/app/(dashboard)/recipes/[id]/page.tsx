'use client';

import { useRecipe } from '@/hooks/useRecipes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function RecipeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: recipe, isLoading, error } = useRecipe(id);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <p>Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-red-600">Error loading recipe</p>
          <Link href="/recipes">
            <Button variant="outline" className="mt-4">
              ← Back to Recipes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/recipes">
            <Button variant="ghost" className="mb-2">
              ← Back to Recipes
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{recipe.name}</h1>
          <p className="text-gray-600 mt-1 text-lg">{recipe.style}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Batch Size</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{recipe.batchSize}L</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">ABV</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-600">{recipe.abv}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">IBU</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{recipe.ibu}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Color</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">-</p>
            </CardContent>
          </Card>
        </div>

        {/* Ingredients Section - NEW */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Ingredients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recipe.ingredients.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.ingredient.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.ingredient.type}
                        {item.timing && ` • ${item.timing}`}
                      </p>
                      {item.notes && (
                        <p className="text-sm text-gray-500 mt-1">{item.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {item.quantity} {item.unit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Gravity */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Gravity Readings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Original Gravity (OG)</p>
                <p className="text-3xl font-bold">{recipe.og}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Final Gravity (FG)</p>
                <p className="text-3xl font-bold">{recipe.fg}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brewing Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Mash</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Temperature</span>
                <span className="font-medium">{recipe.mashTemp}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">{recipe.mashTime} min</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Boil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">{recipe.boilTime} min</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fermentation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Fermentation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Temperature</p>
                <p className="text-xl font-bold">{recipe.fermentTemp}°C</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Duration</p>
                <p className="text-xl font-bold">{recipe.fermentDays} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        {recipe.notes && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{recipe.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <Link href={`/recipes/${recipe.id}/edit`}>
            <Button variant="outline">Edit Recipe</Button>
          </Link>
          <Button variant="outline" className="text-red-600 hover:text-red-700">
            Delete Recipe
          </Button>
        </div>
      </div>
    </div>
  );
}