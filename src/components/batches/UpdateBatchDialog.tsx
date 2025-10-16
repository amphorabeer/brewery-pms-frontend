'use client';

import { useState } from 'react';
import { useUpdateBatch } from '@/hooks/useBatches';
import { Batch, BatchStatus } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const statusOptions: { value: BatchStatus; label: string }[] = [
  { value: 'PLANNED', label: 'Planned' },
  { value: 'BREWING', label: 'Brewing' },
  { value: 'FERMENTING', label: 'Fermenting' },
  { value: 'CONDITIONING', label: 'Conditioning' },
  { value: 'PACKAGING', label: 'Packaging' },
  { value: 'FINISHED', label: 'Finished' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

interface UpdateBatchDialogProps {
  batch: Batch;
}

export function UpdateBatchDialog({ batch }: UpdateBatchDialogProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<BatchStatus>(batch.status);
  const [actualVolume, setActualVolume] = useState(batch.actualVolume?.toString() || '');
  const [og, setOg] = useState(batch.og?.toString() || '');
  const [fg, setFg] = useState(batch.fg?.toString() || '');
  const [notes, setNotes] = useState('');

  const updateBatch = useUpdateBatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updateData: any = {
      status,
      notes: notes || undefined,
    };

    // Add fields based on status
    if (actualVolume) {
      updateData.actualVolume = parseFloat(actualVolume);
    }

    if (og) {
      updateData.og = parseFloat(og);
    }

    if (fg) {
      updateData.fg = parseFloat(fg);
    }

    try {
      await updateBatch.mutateAsync({
        id: batch.id,
        data: updateData,
      });

      toast.success('Batch updated successfully!');
      setOpen(false);

      // Reset form
      setNotes('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update batch');
    }
  };

  // Determine which fields to show based on status transition
  const showOgField = status === 'BREWING' && !batch.og;
  const showFgField = status === 'PACKAGING' && !batch.fg;
  const showVolumeField = status === 'FERMENTING' && !batch.actualVolume;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Update Status</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Batch Status</DialogTitle>
          <DialogDescription>
            Update the status and details of batch {batch.batchNumber}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Current Status Display */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Current Status</p>
            <p className="font-semibold">{batch.status}</p>
          </div>

          {/* New Status Select */}
          <div className="space-y-2">
            <Label htmlFor="status">New Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as BatchStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Conditional Fields Based on Status */}
          {showOgField && (
            <div className="space-y-2">
              <Label htmlFor="og">Original Gravity (OG)</Label>
              <Input
                id="og"
                type="number"
                step="0.001"
                placeholder="1.055"
                value={og}
                onChange={(e) => setOg(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Set when starting to brew
              </p>
            </div>
          )}

          {showVolumeField && (
            <div className="space-y-2">
              <Label htmlFor="actualVolume">Actual Volume (L)</Label>
              <Input
                id="actualVolume"
                type="number"
                step="0.1"
                placeholder="98"
                value={actualVolume}
                onChange={(e) => setActualVolume(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Volume after transferring to fermentation
              </p>
            </div>
          )}

          {showFgField && (
            <div className="space-y-2">
              <Label htmlFor="fg">Final Gravity (FG)</Label>
              <Input
                id="fg"
                type="number"
                step="0.001"
                placeholder="1.012"
                value={fg}
                onChange={(e) => setFg(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Set when ready for packaging
              </p>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Add any notes about this status change..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={updateBatch.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateBatch.isPending}>
              {updateBatch.isPending ? 'Updating...' : 'Update Batch'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}