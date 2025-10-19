'use client';

import { useState } from 'react';
import { useStockMovements } from '@/hooks/useInventory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Plus, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import type { StockMovementType } from '@/types';

const movementTypeColors: Record<StockMovementType, string> = {
  PURCHASE: 'bg-green-500',
  PRODUCTION_USE: 'bg-blue-500',
  ADJUSTMENT: 'bg-yellow-500',
  TRANSFER: 'bg-purple-500',
  WASTE: 'bg-red-500',
};

const movementTypeLabels: Record<StockMovementType, string> = {
  PURCHASE: 'Purchase',
  PRODUCTION_USE: 'Production Use',
  ADJUSTMENT: 'Adjustment',
  TRANSFER: 'Transfer',
  WASTE: 'Waste',
};

const movementTypeIcons: Record<StockMovementType, React.ReactNode> = {
  PURCHASE: <TrendingUp className="h-4 w-4" />,
  PRODUCTION_USE: <TrendingDown className="h-4 w-4" />,
  ADJUSTMENT: <AlertCircle className="h-4 w-4" />,
  TRANSFER: <TrendingUp className="h-4 w-4" />,
  WASTE: <TrendingDown className="h-4 w-4" />,
};

export default function StockMovementsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<StockMovementType | 'ALL'>('ALL');

  const { data: movements, isLoading } = useStockMovements();

  const filteredMovements = movements?.filter(movement => {
    const matchesSearch =
      movement.ingredient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.location?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'ALL' || movement.movementType === filterType;

    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search movements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={filterType}
            onValueChange={(value) => setFilterType(value as StockMovementType | 'ALL')}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="PURCHASE">Purchase</SelectItem>
              <SelectItem value="PRODUCTION_USE">Production Use</SelectItem>
              <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
              <SelectItem value="TRANSFER">Transfer</SelectItem>
              <SelectItem value="WASTE">Waste</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Link href="/dashboard/stock-movements/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Movement
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {(['PURCHASE', 'PRODUCTION_USE', 'ADJUSTMENT', 'TRANSFER', 'WASTE'] as StockMovementType[]).map(
          (type) => {
            const count = movements?.filter((m) => m.movementType === type).length || 0;
            return (
              <div key={type} className="bg-card p-4 rounded-lg border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  {movementTypeIcons[type]}
                  <span>{movementTypeLabels[type]}</span>
                </div>
                <div className="text-2xl font-bold">{count}</div>
              </div>
            );
          }
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Ingredient</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Unit Cost</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMovements && filteredMovements.length > 0 ? (
              filteredMovements.map((movement) => {
                const isPositive = ['PURCHASE', 'TRANSFER'].includes(movement.movementType);
                return (
                  <TableRow key={movement.id}>
                    <TableCell>
                      {new Date(movement.createdAt).toLocaleDateString('en-GB')}
                      <div className="text-xs text-muted-foreground">
                        {new Date(movement.createdAt).toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {movement.ingredient?.name || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge className={movementTypeColors[movement.movementType]}>
                        {movementTypeLabels[movement.movementType]}
                      </Badge>
                    </TableCell>
                    <TableCell>{movement.location?.name || '-'}</TableCell>
                    <TableCell className="text-right">
                      <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
                        {isPositive ? '+' : '-'}
                        {Math.abs(movement.quantity)} {movement.ingredient?.unit || ''}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {movement.unitCost ? `₾${movement.unitCost.toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {movement.notes || '-'}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No stock movements found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}