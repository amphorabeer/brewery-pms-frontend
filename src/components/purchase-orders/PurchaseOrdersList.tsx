'use client';

import { useState } from 'react';
import { usePurchaseOrders, useDeletePurchaseOrder, useReceivePurchaseOrder } from '@/hooks/useInventory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, Trash2, Eye, Plus, Package, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
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

export default function PurchaseOrdersList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: orders, isLoading } = usePurchaseOrders();
  const deleteOrder = useDeletePurchaseOrder();
  const receiveOrder = useReceivePurchaseOrder();

  const filteredOrders = orders?.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteOrder.mutateAsync(deleteId);
      toast.success('Purchase order deleted successfully');
      setDeleteId(null);
    } catch (error) {
      toast.error('Failed to delete purchase order');
    }
  };

  const handleReceive = async (id: string) => {
    try {
      await receiveOrder.mutateAsync(id);
      toast.success('Purchase order received successfully');
    } catch (error) {
      toast.error('Failed to receive purchase order');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Link href="/dashboard/purchase-orders/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Purchase Order
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-sm text-muted-foreground">Total Orders</div>
          <div className="text-2xl font-bold">{orders?.length || 0}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-sm text-muted-foreground">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">
            {orders?.filter(o => ['SUBMITTED', 'CONFIRMED'].includes(o.status)).length || 0}
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-sm text-muted-foreground">Received</div>
          <div className="text-2xl font-bold text-green-600">
            {orders?.filter(o => o.status === 'RECEIVED').length || 0}
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-sm text-muted-foreground">Total Value</div>
          <div className="text-2xl font-bold">
            ₾{orders?.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2) || '0.00'}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Expected Delivery</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders && filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono font-medium">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>{order.supplier?.name || '-'}</TableCell>
                  <TableCell>
                    {new Date(order.orderDate).toLocaleDateString('en-GB')}
                  </TableCell>
                  <TableCell>
                    {order.expectedDeliveryDate
                      ? new Date(order.expectedDeliveryDate).toLocaleDateString('en-GB')
                      : '-'}
                  </TableCell>
                  <TableCell className="font-medium">
                    ₾{order.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status]}>
                      {statusLabels[order.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/dashboard/purchase-orders/${order.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      {order.status === 'CONFIRMED' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReceive(order.id)}
                          disabled={receiveOrder.isPending}
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                      {order.status === 'DRAFT' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(order.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No purchase orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Purchase Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this purchase order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}