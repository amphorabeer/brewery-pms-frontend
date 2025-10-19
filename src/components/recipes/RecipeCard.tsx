import { Recipe } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{recipe.name}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{recipe.style}</p>
          </div>
          <Link href={`/recipes/${recipe.id}`}>
            <Button variant="outline" size="sm">
              View
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600">Batch Size</p>
            <p className="text-lg font-semibold">{recipe.batchSize}L</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">ABV</p>
            <p className="text-lg font-semibold text-amber-600">
              {recipe.abv}%
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">IBU</p>
            <p className="text-lg font-semibold">{recipe.ibu}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">OG</p>
            <p className="text-lg font-semibold">{recipe.og}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
