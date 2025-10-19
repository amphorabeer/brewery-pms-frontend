import { Metadata } from 'next';
import AddSupplierForm from '@/components/suppliers/AddSupplierForm';

export const metadata: Metadata = {
  title: 'Add Supplier | Brewery PMS',
  description: 'Create a new supplier',
};

export default function NewSupplierPage() {
  return <AddSupplierForm />;
}