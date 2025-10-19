import { Metadata } from 'next';
import SuppliersList from '@/components/suppliers/SuppliersList';

export const metadata: Metadata = {
  title: 'Suppliers | Brewery PMS',
  description: 'Manage your suppliers',
};

export default function SuppliersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Suppliers</h1>
        <p className="text-muted-foreground mt-2">
          Manage your ingredient suppliers and vendors
        </p>
      </div>

      <SuppliersList />
    </div>
  );
}