import { Metadata } from 'next';
import AddPurchaseOrderForm from '@/components/purchase-orders/AddPurchaseOrderForm';

export const metadata: Metadata = {
  title: 'New Purchase Order | Brewery PMS',
  description: 'Create a new purchase order',
};

export default function NewPurchaseOrderPage() {
  return <AddPurchaseOrderForm />;
}