'use client';

import { usePackagingOperations, useDeletePackagingOperation } from '@/hooks/usePackaging';
import { Button } from '@/components/ui/button';
import { Trash2, Package } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface PackagingOperationsListProps {
  batchId?: string;
}

const statusColors = {
  COMPLETED: 'bg-green-100 text-green-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  PLANNED: 'bg-yellow-100 text-yellow-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const statusIcons = {
  COMPLETED: '✅',
  IN_PROGRESS: '⏳',
  PLANNED: '📋',
  CANCELLED: '❌',
};

export function PackagingOperationsList({ batchId }: PackagingOperationsListProps) {
  const { data: operations = [], isLoading } = usePackagingOperations(batchId);
  const deleteMutation = useDeletePackagingOperation();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this packaging operation?')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Packaging operation deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete operation');
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading packaging operations...</div>;
  }

  if (operations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No packaging operations recorded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">
        Packaging Operations ({operations.length})
      </h3>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3 text-sm font-medium">SKU</th>
              <th className="text-left p-3 text-sm font-medium">Format</th>
              <th className="text-left p-3 text-sm font-medium">Quantity</th>
              <th className="text-left p-3 text-sm font-medium">Volume</th>
              <th className="text-left p-3 text-sm font-medium">Date</th>
              <th className="text-left p-3 text-sm font-medium">Status</th>
              <th className="text-left p-3 text-sm font-medium">Packaged By</th>
              <th className="text-left p-3 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {operations.map((operation) => (
              <tr key={operation.id} className="border-t">
                <td className="p-3 text-sm font-mono">{operation.sku || 'N/A'}</td>
                <td className="p-3 text-sm">
                  {operation.packageFormat?.name || 'Unknown'}
                  <div className="text-xs text-muted-foreground">
                    {operation.packageFormat?.size}{operation.packageFormat?.unit} {operation.packageFormat?.type}
                  </div>
                </td>
                <td className="p-3 text-sm font-medium">{operation.quantity}</td>
                <td className="p-3 text-sm">{operation.volumePackaged}L</td>
                <td className="p-3 text-sm">
                  {format(new Date(operation.packagedAt), 'MMM dd, yyyy HH:mm')}
                </td>
                <td className="p-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      statusColors[operation.status]
                    }`}
                  >
                    {statusIcons[operation.status]} {operation.status}
                  </span>
                </td>
                <td className="p-3 text-sm">
                  {operation.user
                    ? `${operation.user.firstName} ${operation.user.lastName}`
                    : 'Unknown'}
                </td>
                <td className="p-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(operation.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {operations.some((op) => op.notes) && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium">Notes:</h4>
          {operations
            .filter((op) => op.notes)
            .map((op) => (
              <div key={op.id} className="text-sm p-2 bg-muted rounded">
                <span className="font-medium">{op.sku}:</span> {op.notes}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
