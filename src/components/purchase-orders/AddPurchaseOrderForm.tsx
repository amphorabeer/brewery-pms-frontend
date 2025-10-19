'use client';

import { useState } from 'react';
import { useCreatePurchaseOrder } from '@/hooks/useInventory';
import { useSuppliers } from '@/hooks/useInventory';
import { useIngredients } from '@/hooks/useIngredients';
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type { CreatePurchaseOrderItemDto } from '@/types';

interface OrderItem extends CreatePurchaseOrderItemDto {
  tempId: string;
}

export default function AddPurchaseOrderForm() {
  const router = useRouter();
  const createOrder = useCreatePurchaseOrder();
  const { data: suppliers } = useSuppliers();
  const { ingredients } = useIngredients();

  const [formData, setFormData] = useState({
    supplierId: '',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: '',
    notes: '',
  });

  const [items, setItems] = useState<OrderItem[]>([]);
  const [newItem, setNewItem] = useState({
    ingredientId: '',
    quantity: '',
    unitPrice: '',
  });

  const activeSuppliers = suppliers?.filter((s: any) => s.isActive) || [];

  const handleAddItem = () => {
    if (!newItem.ingredientId || !newItem.quantity || !newItem.unitPrice) {
      toast.error('Please fill all item fields');
      return;
    }

    const ingredient = ingredients?.find((i: any) => i.id === newItem.ingredientId);
    if (!ingredient) return;

    const quantity = parseFloat(newItem.quantity);
    const unitPrice = parseFloat(newItem.unitPrice);

    if (quantity <= 0 || unitPrice <= 0) {
      toast.error('Quantity and price must be positive');
      return;
    }

    const orderItem: OrderItem = {
      tempId: Date.now().toString(),
      ingredientId: newItem.ingredientId,
      quantity,
      unitPrice,
    };

    setItems([...items, orderItem]);
    setNewItem({ ingredientId: '', quantity: '', unitPrice: '' });
    toast.success('Item added');
  };

  const handleRemoveItem = (tempId: string) => {
    setItems(items.filter((item: any) => item.tempId !== tempId));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.supplierId) {
      toast.error('Please select a supplier');
      return;
    }

    if (items.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    try {
      await createOrder.mutateAsync({
        supplierId: formData.supplierId,
        orderDate: formData.orderDate,
        expectedDeliveryDate: formData.expectedDeliveryDate || undefined,
        notes: formData.notes || undefined,
        items: items.map(({ tempId, ...item }) => item),
      });

      toast.success('Purchase order created successfully');
      router.push('/dashboard/purchase-orders');
    } catch (error) {
      toast.error('Failed to create purchase order');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">New Purchase Order</h1>
          <p className="text-muted-foreground">
            Create a purchase order for ingredients
          </p>
        </div>
        <Link href="/dashboard/purchase-orders">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Order Info */}
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
              <CardDescription>Basic details about this purchase order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplierId">
                    Supplier <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.supplierId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, supplierId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeSuppliers.map((supplier: any) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orderDate">Order Date</Label>
                  <Input
                    id="orderDate"
                    type="date"
                    value={formData.orderDate}
                    onChange={(e) =>
                      setFormData({ ...formData, orderDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedDeliveryDate">Expected Delivery Date</Label>
                <Input
                  id="expectedDeliveryDate"
                  type="date"
                  value={formData.expectedDeliveryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expectedDeliveryDate: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>Add ingredients to this order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Item Form */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50">
                <div className="space-y-2">
                  <Label>Ingredient</Label>
                  <Select
                    value={newItem.ingredientId}
                    onValueChange={(value) =>
                      setNewItem({ ...newItem, ingredientId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ingredient" />
                    </SelectTrigger>
                    <SelectContent>
                      {ingredients?.map((ingredient: any) => (
                        <SelectItem key={ingredient.id} value={ingredient.id}>
                          {ingredient.name} ({ingredient.unit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Unit Price (₾)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newItem.unitPrice}
                    onChange={(e) => setNewItem({ ...newItem, unitPrice: e.target.value })}
                  />
                </div>

                <div className="flex items-end">
                  <Button type="button" onClick={handleAddItem} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </div>

              {/* Items Table */}
              {items.length > 0 ? (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ingredient</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="w-[60px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item: any) => {
                        const ingredient = ingredients?.find((i: any) => i.id === item.ingredientId);
                        const total = item.quantity * item.unitPrice;
                        return (
                          <TableRow key={item.tempId}>
                            <TableCell className="font-medium">
                              {ingredient?.name}
                              <div className="text-xs text-muted-foreground">
                                {ingredient?.unit}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">₾{item.unitPrice.toFixed(2)}</TableCell>
                            <TableCell className="text-right font-medium">
                              ₾{total.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(item.tempId)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-bold">
                          Total Amount:
                        </TableCell>
                        <TableCell className="text-right font-bold text-lg">
                          ₾{calculateTotal().toFixed(2)}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground border rounded-lg">
                  No items added yet. Add items using the form above.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-6">
          <Link href="/dashboard/purchase-orders">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={createOrder.isPending || items.length === 0}>
            <Save className="h-4 w-4 mr-2" />
            {createOrder.isPending ? 'Creating...' : 'Create Order'}
          </Button>
        </div>
      </form>
    </div>
  );
}