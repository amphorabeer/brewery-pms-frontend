'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useIngredients } from '@/hooks/useIngredients';
import { Loader2, Plus, Search, Pencil, Trash2 } from 'lucide-react';

export default function IngredientsPage() {
  const router = useRouter();
  const { ingredients, isLoading, deleteIngredient } = useIngredients();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  const filteredIngredients = ingredients?.filter((ingredient: any) => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === '' || ingredient.type === filterType;
    return matchesSearch && matchesType;
  });

  const ingredientTypes = ['Grain', 'Hop', 'Yeast', 'Adjunct', 'Water', 'Other'];

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      await deleteIngredient(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Ingredients</h1>
          <p className="text-muted-foreground">Manage your brewing ingredients</p>
        </div>
        <Link href="/ingredients/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Ingredient
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search ingredients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="">All Types</option>
              {ingredientTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredIngredients?.map((ingredient: any) => (
          <Card key={ingredient.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{ingredient.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{ingredient.type}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/ingredients/${ingredient.id}`)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(ingredient.id, ingredient.name)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {ingredient.supplier && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Supplier:</span>
                    <span>{ingredient.supplier}</span>
                  </div>
                )}
                {ingredient.stock && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stock:</span>
                    <span>
                      {ingredient.stock} {ingredient.unit}
                    </span>
                  </div>
                )}
                {ingredient.costPerUnit && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost:</span>
                    <span>${ingredient.costPerUnit}/{ingredient.unit}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredIngredients?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No ingredients found</p>
          <Link href="/ingredients/new">
            <Button className="mt-4">Create your first ingredient</Button>
          </Link>
        </div>
      )}
    </div>
  );
}