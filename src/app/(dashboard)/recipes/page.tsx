'use client';

import { useRecipes } from '@/hooks/useRecipes';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useState } from 'react';

export default function RecipesPage() {
  const { data: recipes, isLoading, error } = useRecipes();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter recipes by search query
  const filteredRecipes = recipes?.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.style.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <p>Loading recipes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-600">Error loading recipes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">📖 Recipes</h1>
            <p className="text-gray-600 mt-1">
              Manage your brewery recipes
            </p>
          </div>
          <Link href="/recipes/new">
            <Button>+ New Recipe</Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <Input
            placeholder="Search recipes by name or style..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Recipes Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredRecipes?.length || 0} of {recipes?.length || 0} recipes
          </p>
        </div>

        {/* Recipes Grid */}
        {!filteredRecipes || filteredRecipes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {searchQuery ? (
              <>
                <p className="text-lg">No recipes found matching "{searchQuery}"</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              </>
            ) : (
              <>
                <p className="text-lg">No recipes yet</p>
                <p className="text-sm mt-2">Create your first recipe to get started</p>
                <Link href="/recipes/new">
                  <Button className="mt-4">Create Recipe</Button>
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}