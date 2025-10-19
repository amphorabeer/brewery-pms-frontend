import { Badge } from '@/components/ui/badge';
import { BatchStatus } from '@/types';

const statusConfig: Record<BatchStatus, { label: string; className: string }> = {
  PLANNED: { label: 'Planned', className: 'bg-slate-100 text-slate-800' },
  BREWING: { label: 'Brewing', className: 'bg-amber-100 text-amber-800' },
  FERMENTING: { label: 'Fermenting', className: 'bg-violet-100 text-violet-800' },
  CONDITIONING: { label: 'Conditioning', className: 'bg-purple-100 text-purple-800' },
  PACKAGING: { label: 'Packaging', className: 'bg-blue-100 text-blue-800' },
  FINISHED: { label: 'Finished', className: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Cancelled', className: 'bg-red-100 text-red-800' },
};

export function StatusBadge({ status }: { status: BatchStatus }) {
  const config = statusConfig[status];
  
  return (
    <Badge className={config.className} variant="secondary">
      {config.label}
    </Badge>
  );
}
