import { Metadata } from 'next';
import PurchaseOrdersList from '@/components/purchase-orders/PurchaseOrdersList';

export const metadata: Metadata = {
  title: 'Purchase Orders | Brewery PMS',
  description: 'Manage purchase orders',
};

export default function PurchaseOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Purchase Orders</h1>
        <p className="text-muted-foreground mt-2">
          Track and manage ingredient purchase orders
        </p>
      </div>

      <PurchaseOrdersList />
    </div>
  );
}