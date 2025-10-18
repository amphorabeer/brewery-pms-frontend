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
import { Plus } from 'lucide-react';
import { useQcTestTypes, useCreateQcTest } from '@/hooks/useQc';
import { toast } from 'sonner';
import { QcTestResult } from '@/types';

interface AddQcTestDialogProps {
  batchId: string;
  onSuccess?: () => void;
}

export function AddQcTestDialog({ batchId, onSuccess }: AddQcTestDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    testTypeId: '',
    testedAt: new Date().toISOString().slice(0, 16),
    result: 'PENDING' as QcTestResult,
    value: '',
    notes: '',
  });

  const { data: testTypes = [], isLoading: loadingTypes } = useQcTestTypes();
  const createMutation = useCreateQcTest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.testTypeId) {
      toast.error('Please select a test type');
      return;
    }

    try {
      await createMutation.mutateAsync({
        batchId,
        testTypeId: formData.testTypeId,
        testedAt: new Date(formData.testedAt).toISOString(),
        result: formData.result,
        value: formData.value ? parseFloat(formData.value) : undefined,
        notes: formData.notes || undefined,
      });

      toast.success('QC test added successfully');
      setOpen(false);
      setFormData({
        testTypeId: '',
        testedAt: new Date().toISOString().slice(0, 16),
        result: 'PENDING',
        value: '',
        notes: '',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add QC test');
    }
  };

  const selectedTestType = testTypes.find((t) => t.id === formData.testTypeId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add QC Test
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Quality Control Test</DialogTitle>
            <DialogDescription>
              Record a quality control test result for this batch
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="testType">Test Type *</Label>
              <Select
                value={formData.testTypeId}
                onValueChange={(value) =>
                  setFormData({ ...formData, testTypeId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  {loadingTypes ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : testTypes.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      No test types available
                    </SelectItem>
                  ) : (
                    testTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name} ({type.category})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {selectedTestType?.description && (
                <p className="text-sm text-muted-foreground">
                  {selectedTestType.description}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="testedAt">Test Date & Time *</Label>
              <Input
                id="testedAt"
                type="datetime-local"
                value={formData.testedAt}
                onChange={(e) =>
                  setFormData({ ...formData, testedAt: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="result">Result *</Label>
                <Select
                  value={formData.result}
                  onValueChange={(value: QcTestResult) =>
                    setFormData({ ...formData, result: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PASS">✅ Pass</SelectItem>
                    <SelectItem value="FAIL">❌ Fail</SelectItem>
                    <SelectItem value="PENDING">⏳ Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedTestType?.unit && (
                <div className="grid gap-2">
                  <Label htmlFor="value">
                    Value ({selectedTestType.unit})
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.1"
                    placeholder={
                      selectedTestType.minValue !== undefined &&
                      selectedTestType.maxValue !== undefined
                        ? `${selectedTestType.minValue}-${selectedTestType.maxValue}`
                        : ''
                    }
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: e.target.value })
                    }
                  />
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any observations or notes..."
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
              {createMutation.isPending ? 'Adding...' : 'Add Test'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
