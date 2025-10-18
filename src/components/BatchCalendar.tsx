'use client';

import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Batch {
  id: string;
  batchNumber: string;
  recipeId: string;
  recipe?: {
    name: string;
  };
  tankId?: string;
  tank?: {
    name: string;
  };
  status: 'PLANNED' | 'BREWING' | 'FERMENTING' | 'CONDITIONING' | 'PACKAGING' | 'FINISHED' | 'CANCELLED';
  brewDate: string;
  estimatedCompletionDate?: string;
  actualCompletionDate?: string;
  volumeProduced?: number;
}

interface BatchEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Batch;
}

interface BatchCalendarProps {
  batches: Batch[];
  onSelectBatch?: (batch: Batch) => void;
  onCreateBatch?: (date: Date) => void;
}

const statusColors = {
  PLANNED: 'bg-blue-100 text-blue-800 border-blue-300',
  BREWING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  FERMENTING: 'bg-purple-100 text-purple-800 border-purple-300',
  CONDITIONING: 'bg-orange-100 text-orange-800 border-orange-300',
  PACKAGED: 'bg-green-100 text-green-800 border-green-300',
  CANCELLED: 'bg-gray-100 text-gray-800 border-gray-300',
};

const statusEventColors = {
  PLANNED: '#3b82f6',
  BREWING: '#eab308',
  FERMENTING: '#a855f7',
  CONDITIONING: '#f97316',
  PACKAGED: '#22c55e',
  CANCELLED: '#6b7280',
};

export default function BatchCalendar({ 
  batches, 
  onSelectBatch, 
  onCreateBatch 
}: BatchCalendarProps) {
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const events: BatchEvent[] = useMemo(() => {
    return batches
      .filter(batch => selectedStatus === 'all' || batch.status === selectedStatus)
      .map(batch => {
        const startDate = new Date(batch.brewDate);
        const endDate = batch.actualCompletionDate 
          ? new Date(batch.actualCompletionDate)
          : batch.estimatedCompletionDate
          ? new Date(batch.estimatedCompletionDate)
          : new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000);

        return {
          id: batch.id,
          title: `${batch.batchNumber} - ${batch.recipe?.name || 'Unknown'}`,
          start: startDate,
          end: endDate,
          resource: batch,
        };
      });
  }, [batches, selectedStatus]);

  const eventStyleGetter = (event: BatchEvent) => {
    const backgroundColor = statusEventColors[event.resource.status];
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '0.875rem',
        padding: '2px 4px',
      },
    };
  };

  const EventComponent = ({ event }: { event: BatchEvent }) => (
    <div className="text-xs font-medium truncate">
      <div>{event.resource.batchNumber}</div>
      {event.resource.tank && (
        <div className="text-[10px] opacity-90">🏭 {event.resource.tank.name}</div>
      )}
    </div>
  );

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    if (onCreateBatch) {
      onCreateBatch(slotInfo.start);
    }
  };

  const handleSelectEvent = (event: BatchEvent) => {
    if (onSelectBatch) {
      onSelectBatch(event.resource);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className={statusColors.PLANNED}>
            Planned ({batches.filter(b => b.status === 'PLANNED').length})
          </Badge>
          <Badge variant="outline" className={statusColors.BREWING}>
            Brewing ({batches.filter(b => b.status === 'BREWING').length})
          </Badge>
          <Badge variant="outline" className={statusColors.FERMENTING}>
            Fermenting ({batches.filter(b => b.status === 'FERMENTING').length})
          </Badge>
          <Badge variant="outline" className={statusColors.CONDITIONING}>
            Conditioning ({batches.filter(b => b.status === 'CONDITIONING').length})
          </Badge>
          <Badge variant="outline" className={statusColors.PACKAGED}>
            Packaged ({batches.filter(b => b.status === 'PACKAGED').length})
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="PLANNED">Planned</option>
            <option value="BREWING">Brewing</option>
            <option value="FERMENTING">Fermenting</option>
            <option value="CONDITIONING">Conditioning</option>
            <option value="PACKAGED">Packaged</option>
          </select>

          {onCreateBatch && (
            <Button onClick={() => onCreateBatch(new Date())} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New Batch
            </Button>
          )}
        </div>
      </div>

      <Card className="p-4">
        <div style={{ height: '700px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
            eventPropGetter={eventStyleGetter}
            components={{
              event: EventComponent,
            }}
            views={['month', 'week', 'day', 'agenda']}
            popup
            style={{ height: '100%' }}
          />
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-3 text-sm">Status Legend</h3>
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: statusEventColors.PLANNED }} />
            <span>Planned - Batch scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: statusEventColors.BREWING }} />
            <span>Brewing - Active brew day</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: statusEventColors.FERMENTING }} />
            <span>Fermenting - In fermentation tank</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: statusEventColors.CONDITIONING }} />
            <span>Conditioning - Secondary/aging</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: statusEventColors.PACKAGED }} />
            <span>Packaged - Ready for distribution</span>
          </div>
        </div>
      </Card>
    </div>
  );
}