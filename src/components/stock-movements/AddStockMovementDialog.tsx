'use client';

import { useState } from 'react';
import { useCreateStockMovement } from '@/hooks/useInventory';
import { useIngredients } from '@/hooks/useIngredients';
import { useLocations } from '@/hooks/useLocations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import type { StockMovementType } from '@/types';

const movementTypes: { value: StockMovementType; label: string; description: string }[] = [
  { value: 'PURCHASE', label: 'Purchase', description: 'Received from supplier' },
  { value: 'PRODUCTION_USE', label: 'Production Use', description: 'Used in brewing' },
  { value: 'ADJUSTMENT', label: 'Adjustment', description: 'Inventory correction' },
  { value: 'TRANSFER', label: 'Transfer', description: 'Moved between locations' },
  { value: 'WASTE', label: 'Waste', description: 'Spoiled or damaged' },
];

export default function AddStockMovementDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    ingredientId: '',
    locationId: '',
    movementType: '' as StockMovementType,
    quantity: '',
    unitCost: '',
    notes: '',
  });

  const createMovement = useCreateStockMovement();
  const { ingredients } = useIngredients();
  const { data: locations } = useLocations();

  const resetForm = () => {
    setFormData({
      ingredientId: '',
      locationId: '',
      movementType: '' as StockMovementType,
      quantity: '',
      unitCost: '',
      notes: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.ingredientId || !formData.movementType || !formData.quantity) {
      toast.error('Please fill all required fields');
      return;
    }

    const quantity = parseFloat(formData.quantity);
    if (isNaN(quantity) || quantity === 0) {
      toast.error('Invalid quantity');
      return;
    }

    try {
      await createMovement.mutateAsync({
        ingredientId: formData.ingredientId,
        locationId: formData.locationId || undefined,
        movementType: formData.movementType,
        quantity,
        unitCost: formData.unitCost ? parseFloat(formData.unitCost) : undefined,
        notes: formData.notes || undefined,
      });

      toast.success('Stock movement recorded successfully');
      setOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to record stock movement');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Movement
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Stock Movement</DialogTitle>
          <DialogDescription>
            Add a new stock movement for inventory tracking
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ingredient */}
          <div className="space-y-2">
            <Label htmlFor="ingredientId">
              Ingredient <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.ingredientId}
              onValueChange={(value) =>
                setFormData({ ...formData, ingredientId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ingredient" />
              </SelectTrigger>
              <SelectContent>
                {ingredients?.map((ingredient: any) => (
                  <SelectItem key={ingredient.id} value={ingredient.id}>
                    {ingredient.name} ({ingredient.unit})
                    {ingredient.currentStock !== null && (
                      <span className="text-muted-foreground ml-2">
                        - Stock: {ingredient.currentStock}
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Movement Type */}
          <div className="space-y-2">
            <Label htmlFor="movementType">
              Movement Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.movementType}
              onValueChange={(value) =>
                setFormData({ ...formData, movementType: value as StockMovementType })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {movementTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {type.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="locationId">Location</Label>
            <Select
              value={formData.locationId}
              onValueChange={(value) =>
                setFormData({ ...formData, locationId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location (optional)" />
              </SelectTrigger>
              <SelectContent>
                {locations?.map((location: any) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity & Unit Cost */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Use positive (+) for additions, negative (-) for reductions
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitCost">Unit Cost (₾)</Label>
              <Input
                id="unitCost"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.unitCost}
                onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional information..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMovement.isPending}>
              {createMovement.isPending ? 'Recording...' : 'Record Movement'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}