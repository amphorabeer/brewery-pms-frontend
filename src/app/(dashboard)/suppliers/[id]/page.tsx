import { Metadata } from 'next';
import PurchaseOrderDetail from '@/components/purchase-orders/PurchaseOrderDetail';
import { use } from 'react';

export const metadata: Metadata = {
  title: 'Purchase Order Details | Brewery PMS',
  description: 'View purchase order details',
};

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function PurchaseOrderDetailPage({ params }: Props) {
  const resolvedParams = use(params);
  return <PurchaseOrderDetail orderId={resolvedParams.id} />;
}