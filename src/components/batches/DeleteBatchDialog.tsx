'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface DeleteBatchDialogProps {
  batchId: string;
  batchNumber: string;
}

export function DeleteBatchDialog({ batchId, batchNumber }: DeleteBatchDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete batch ${batchNumber}?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      await api.delete(`/batches/${batchId}`);
      toast.success('Batch deleted successfully!');
      router.push('/batches');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete batch');
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="destructive" 
      size="sm"
      onClick={handleDelete}
      disabled={loading}
    >
      <Trash2 className="h-4 w-4 mr-2" />
      {loading ? 'Deleting...' : 'Delete Batch'}
    </Button>
  );
}