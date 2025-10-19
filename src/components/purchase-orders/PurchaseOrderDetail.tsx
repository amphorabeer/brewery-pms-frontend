'use client';

import { usePurchaseOrder, useReceivePurchaseOrder, useUpdatePurchaseOrder } from '@/hooks/useInventory';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, Package, User, Calendar, MapPin, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import type { PurchaseOrderStatus } from '@/types';

const statusColors: Record<PurchaseOrderStatus, string> = {
  DRAFT: 'bg-gray-500',
  SUBMITTED: 'bg-blue-500',
  CONFIRMED: 'bg-yellow-500',
  PARTIALLY_RECEIVED: 'bg-orange-500',
  RECEIVED: 'bg-green-500',
  CANCELLED: 'bg-red-500',
};

const statusLabels: Record<PurchaseOrderStatus, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  CONFIRMED: 'Confirmed',
  PARTIALLY_RECEIVED: 'Partially Received',
  RECEIVED: 'Received',
  CANCELLED: 'Cancelled',
};

interface Props {
  orderId: string;
}

export default function PurchaseOrderDetail({ orderId }: Props) {
  const { data: order, isLoading } = usePurchaseOrder(orderId);
  const receiveOrder = useReceivePurchaseOrder();
  const updateOrder = useUpdatePurchaseOrder();

  const handleReceive = async () => {
    try {
      await receiveOrder.mutateAsync(orderId);
      toast.success('Purchase order received successfully');
    } catch (error) {
      toast.error('Failed to receive purchase order');
    }
  };

  const handleStatusChange = async (newStatus: PurchaseOrderStatus) => {
    try {
      await updateOrder.mutateAsync({
        id: orderId,
        data: { status: newStatus },
      });
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Purchase order not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Purchase Order</h1>
            <Badge className={statusColors[order.status as PurchaseOrderStatus]}>
              {statusLabels[order.status as PurchaseOrderStatus]}
            </Badge>
          </div>
          <p className="text-muted-foreground font-mono">{order.orderNumber}</p>
        </div>
        <div className="flex items-center gap-2">
          {order.status === 'CONFIRMED' && (
            <Button onClick={handleReceive} disabled={receiveOrder.isPending}>
              <CheckCircle className="h-4 w-4 mr-2" />
              {receiveOrder.isPending ? 'Receiving...' : 'Mark as Received'}
            </Button>
          )}
          <Link href="/dashboard/purchase-orders">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>Items included in this purchase order</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ingredient</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items?.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.ingredient?.name}
                        <div className="text-xs text-muted-foreground">
                          {item.ingredient?.unit}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">₾{item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-medium">
                        ₾{item.totalPrice.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-bold">
                      Total Amount:
                    </TableCell>
                    <TableCell className="text-right font-bold text-lg">
                      ₾{order.totalAmount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Supplier Info */}
          <Card>
            <CardHeader>
              <CardTitle>Supplier Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Supplier Name</div>
                <div className="font-medium">{order.supplier?.name}</div>
              </div>

              {order.supplier?.contactPerson && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{order.supplier.contactPerson}</span>
                </div>
              )}

              {order.supplier?.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{order.supplier.email}</span>
                </div>
              )}

              {order.supplier?.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{order.supplier.phone}</span>
                </div>
              )}

              {order.supplier?.address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{order.supplier.address}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Order Number</div>
                <div className="font-mono font-medium">{order.orderNumber}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">Order Date</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(order.orderDate).toLocaleDateString('en-GB')}</span>
                </div>
              </div>

              {order.expectedDeliveryDate && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Expected Delivery</div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(order.expectedDeliveryDate).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                </div>
              )}

              {order.actualDeliveryDate && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Actual Delivery</div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>
                      {new Date(order.actualDeliveryDate).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <div className="text-sm text-muted-foreground mb-1">Status</div>
                <Select
                  value={order.status}
                  onValueChange={(value) => handleStatusChange(value as PurchaseOrderStatus)}
                  disabled={order.status === 'RECEIVED' || order.status === 'CANCELLED'}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="SUBMITTED">Submitted</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="PARTIALLY_RECEIVED">Partially Received</SelectItem>
                    <SelectItem value="RECEIVED">Received</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}