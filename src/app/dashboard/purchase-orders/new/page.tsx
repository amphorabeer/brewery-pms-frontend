'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreatePurchaseOrder } from '@/hooks/usePurchaseOrders';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useIngredients } from '@/hooks/useIngredients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrderItem {
  ingredientId: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export default function NewPurchaseOrderPage() {
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

  const [items, setItems] = useState<OrderItem[]>([
    { ingredientId: '', quantity: 0, unitPrice: 0, notes: '' },
  ]);

  const addItem = () => {
    setItems([...items, { ingredientId: '', quantity: 0, unitPrice: 0, notes: '' }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
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

    const validItems = items.filter(
      item => item.ingredientId && item.quantity > 0 && item.unitPrice > 0
    );

    if (validItems.length === 0) {
      toast.error('Please add at least one valid item');
      return;
    }

    try {
      const orderData = {
        ...formData,
        items: validItems.map(item => ({
          ingredientId: item.ingredientId,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          notes: item.notes || undefined,
        })),
      };

      await createOrder.mutateAsync(orderData);
      toast.success('Purchase order created successfully');
      router.push('/dashboard/purchase-orders');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create purchase order');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/purchase-orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Purchase Order</h1>
          <p className="text-gray-600">Create a new purchase order</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order Information */}
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="supplierId">Supplier *</Label>
              <select
                id="supplierId"
                value={formData.supplierId}
                onChange={(e) =>
                  setFormData({ ...formData, supplierId: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Select supplier...</option>
                {suppliers?.map((supplier: any) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="orderDate">Order Date *</Label>
                <Input
                  id="orderDate"
                  type="date"
                  value={formData.orderDate}
                  onChange={(e) =>
                    setFormData({ ...formData, orderDate: e.target.value })
                  }
                  required
                />
              </div>

              <div>
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
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Additional notes..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Order Items</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-4">
                      <div>
                        <Label>Ingredient *</Label>
                        <select
                          value={item.ingredientId}
                          onChange={(e) =>
                            updateItem(index, 'ingredientId', e.target.value)
                          }
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        >
                          <option value="">Select ingredient...</option>
                          {ingredients?.map((ing: any) => (
                            <option key={ing.id} value={ing.id}>
                              {ing.name} ({ing.unit})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <Label>Quantity *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.quantity || ''}
                            onChange={(e) =>
                              updateItem(index, 'quantity', e.target.value)
                            }
                            placeholder="0"
                            required
                          />
                        </div>

                        <div>
                          <Label>Unit Price (₾) *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.unitPrice || ''}
                            onChange={(e) =>
                              updateItem(index, 'unitPrice', e.target.value)
                            }
                            placeholder="0.00"
                            required
                          />
                        </div>

                        <div>
                          <Label>Subtotal</Label>
                          <div className="px-3 py-2 bg-gray-50 rounded-md font-semibold">
                            ₾{(item.quantity * item.unitPrice).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label>Item Notes</Label>
                        <Input
                          value={item.notes || ''}
                          onChange={(e) => updateItem(index, 'notes', e.target.value)}
                          placeholder="Optional notes for this item..."
                        />
                      </div>
                    </div>

                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-end items-center gap-4">
                <span className="text-lg font-semibold">Total Amount:</span>
                <span className="text-2xl font-bold text-blue-600">
                  ₾{calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={createOrder.isPending}>
            {createOrder.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Order
          </Button>
        </div>
      </form>
    </div>
  );
}
