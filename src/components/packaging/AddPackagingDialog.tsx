'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Package } from 'lucide-react';
import { usePackageFormats, useCreatePackagingOperation } from '@/hooks/usePackaging';
import { toast } from 'sonner';
import { PackagingStatus } from '@/types';

interface AddPackagingDialogProps {
  batchId: string;
  onSuccess?: () => void;
}

export function AddPackagingDialog({ batchId, onSuccess }: AddPackagingDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    packageFormatId: '',
    quantity: '',
    volumePackaged: '',
    packagedAt: new Date().toISOString().slice(0, 16),
    status: 'COMPLETED' as PackagingStatus,
    notes: '',
  });

  const { data: formats = [], isLoading: loadingFormats } = usePackageFormats();
  const createMutation = useCreatePackagingOperation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.packageFormatId || !formData.quantity || !formData.volumePackaged) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createMutation.mutateAsync({
        batchId,
        packageFormatId: formData.packageFormatId,
        quantity: parseInt(formData.quantity),
        volumePackaged: parseFloat(formData.volumePackaged),
        packagedAt: new Date(formData.packagedAt).toISOString(),
        status: formData.status,
        notes: formData.notes || undefined,
      });

      toast.success('Packaging operation added successfully');
      setOpen(false);
      setFormData({
        packageFormatId: '',
        quantity: '',
        volumePackaged: '',
        packagedAt: new Date().toISOString().slice(0, 16),
        status: 'COMPLETED',
        notes: '',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add packaging operation');
    }
  };

  const selectedFormat = formats.find((f) => f.id === formData.packageFormatId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Package className="w-4 h-4 mr-2" />
          Add Packaging
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Packaging Operation</DialogTitle>
            <DialogDescription>
              Record a packaging operation for this batch
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="packageFormat">Package Format *</Label>
              <Select
                value={formData.packageFormatId}
                onValueChange={(value) =>
                  setFormData({ ...formData, packageFormatId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select package format" />
                </SelectTrigger>
                <SelectContent>
                  {loadingFormats ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : formats.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      No package formats available
                    </SelectItem>
                  ) : (
                    formats.map((format) => (
                      <SelectItem key={format.id} value={format.id}>
                        {format.name} ({format.size}{format.unit} {format.type})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {selectedFormat?.description && (
                <p className="text-sm text-muted-foreground">
                  {selectedFormat.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  placeholder="Number of units"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="volumePackaged">Volume (L) *</Label>
                <Input
                  id="volumePackaged"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Total volume"
                  value={formData.volumePackaged}
                  onChange={(e) =>
                    setFormData({ ...formData, volumePackaged: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="packagedAt">Packaged Date & Time *</Label>
              <Input
                id="packagedAt"
                type="datetime-local"
                value={formData.packagedAt}
                onChange={(e) =>
                  setFormData({ ...formData, packagedAt: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: PackagingStatus) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COMPLETED">✅ Completed</SelectItem>
                  <SelectItem value="IN_PROGRESS">⏳ In Progress</SelectItem>
                  <SelectItem value="PLANNED">📋 Planned</SelectItem>
                  <SelectItem value="CANCELLED">❌ Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Adding...' : 'Add Operation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
