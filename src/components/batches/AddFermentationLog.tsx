'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface AddFermentationLogProps {
  batchId: string;
  onSuccess: () => void;
}

export function AddFermentationLog({ batchId, onSuccess }: AddFermentationLogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    measuredAt: new Date().toISOString().slice(0, 16),
    temperature: '',
    gravity: '',
    ph: '',
    pressure: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.temperature) {
      toast.error('Temperature is required');
      return;
    }

    setLoading(true);

    try {
      await api.post(`/batches/${batchId}/fermentation-logs`, {
        measuredAt: new Date(formData.measuredAt).toISOString(),
        temperature: parseFloat(formData.temperature),
        gravity: formData.gravity ? parseFloat(formData.gravity) : undefined,
        ph: formData.ph ? parseFloat(formData.ph) : undefined,
        pressure: formData.pressure ? parseFloat(formData.pressure) : undefined,
        notes: formData.notes || undefined,
      });

      toast.success('Fermentation log added!');
      setOpen(false);
      setFormData({
        measuredAt: new Date().toISOString().slice(0, 16),
        temperature: '',
        gravity: '',
        ph: '',
        pressure: '',
        notes: '',
      });
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add log');
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} size="sm">
        <Plus className="h-4 w-4 mr-2" />
        Add Reading
      </Button>
    );
  }

  return (
    <Card className="p-4 mb-6 border-2 border-amber-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Add Fermentation Reading</h3>
        <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label htmlFor="measuredAt">Date & Time *</Label>
            <Input
              id="measuredAt"
              type="datetime-local"
              value={formData.measuredAt}
              onChange={(e) => setFormData({ ...formData, measuredAt: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="temperature">Temperature (°C) *</Label>
            <Input
              id="temperature"
              type="number"
              step="0.1"
              placeholder="18.5"
              value={formData.temperature}
              onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="gravity">Gravity (SG)</Label>
            <Input
              id="gravity"
              type="number"
              step="0.001"
              placeholder="1.050"
              value={formData.gravity}
              onChange={(e) => setFormData({ ...formData, gravity: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="ph">pH</Label>
            <Input
              id="ph"
              type="number"
              step="0.1"
              placeholder="4.5"
              value={formData.ph}
              onChange={(e) => setFormData({ ...formData, ph: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="pressure">Pressure (PSI)</Label>
            <Input
              id="pressure"
              type="number"
              step="0.1"
              placeholder="12.0"
              value={formData.pressure}
              onChange={(e) => setFormData({ ...formData, pressure: e.target.value })}
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              placeholder="Fermentation notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Reading'}
          </Button>
        </div>
      </form>
    </Card>
  );
}