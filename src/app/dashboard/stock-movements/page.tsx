import { Metadata } from 'next';
import StockMovementsList from '@/components/stock-movements/StockMovementsList';

export const metadata: Metadata = {
  title: 'Stock Movements | Brewery PMS',
  description: 'Track inventory stock movements',
};

export default function StockMovementsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Stock Movements</h1>
        <p className="text-muted-foreground mt-2">
          Track all inventory movements and changes
        </p>
      </div>

      <StockMovementsList />
    </div>
  );
}
