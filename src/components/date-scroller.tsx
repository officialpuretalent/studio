
'use client';

import { useMemo, useEffect, useRef } from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DateScrollerProps {
  availableDays: Date[];
  selectedDate?: Date;
  onSelectDate: (date?: Date) => void;
}

export function DateScroller({
  availableDays,
  selectedDate,
  onSelectDate,
}: DateScrollerProps) {
  const selectedDateRef = useRef<HTMLButtonElement>(null);

  const days = useMemo(() => {
    if (availableDays.length === 0) return [];
    const daysArray: Date[] = [];
    const firstDay = availableDays.sort((a,b) => a.getTime() - b.getTime())[0] || new Date();
    // Show 30 days from the first available day
    const lastDay = addDays(firstDay, 30);
    
    let currentDate = firstDay;
    while(currentDate <= lastDay) {
        daysArray.push(currentDate);
        currentDate = addDays(currentDate, 1);
    }
    return daysArray;
  }, [availableDays]);


  useEffect(() => {
    if (selectedDateRef.current) {
      selectedDateRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [selectedDate]);

  const isDayAvailable = (day: Date) => {
    return availableDays.some((availableDay) => isSameDay(day, availableDay));
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-2 pb-4">
        {days.map((day) => {
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          return (
            <Button
              key={day.toString()}
              ref={isSelected ? selectedDateRef : null}
              variant={isSelected ? 'default' : 'outline'}
              className={cn(
                'flex h-auto w-20 flex-shrink-0 flex-col items-center justify-center p-3',
                !isDayAvailable(day) && 'text-muted-foreground'
              )}
              onClick={() => onSelectDate(day)}
              disabled={!isDayAvailable(day)}
            >
              <span className="text-xs font-normal">{format(day, 'E')}</span>
              <span className="text-lg font-bold">{format(day, 'd')}</span>
            </Button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
