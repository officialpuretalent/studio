
'use client';

import { useMemo, useEffect, useRef } from 'react';
import { format, addDays, isSameDay, getMonth, getYear } from 'date-fns';
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
  const monthRefs = useRef<(HTMLDivElement | null)[]>([]);

  const days = useMemo(() => {
    if (availableDays.length === 0) return [];
    const daysArray: Date[] = [];
    const firstDay = availableDays.sort((a,b) => a.getTime() - b.getTime())[0] || new Date();
    const lastDay = availableDays.sort((a,b) => b.getTime() - a.getTime())[0] || addDays(new Date(), 30);
    
    let currentDate = firstDay;
    while(currentDate <= lastDay) {
        daysArray.push(currentDate);
        currentDate = addDays(currentDate, 1);
    }

    if(daysArray.length < 30) {
        const lastDate = daysArray.length > 0 ? daysArray[daysArray.length - 1] : new Date();
        for(let i=daysArray.length; i<30; i++) {
            daysArray.push(addDays(lastDate, i - daysArray.length + 1));
        }
    }

    return daysArray;
  }, [availableDays]);


  useEffect(() => {
    if (selectedDateRef.current) {
      selectedDateRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedDate]);

  const isDayAvailable = (day: Date) => {
    return availableDays.some((availableDay) => isSameDay(day, availableDay));
  };
  
  const groupedDays = useMemo(() => {
      const groups: {[key: string]: Date[]} = {};
      days.forEach(day => {
          const monthKey = format(day, 'MMMM yyyy');
          if(!groups[monthKey]) {
              groups[monthKey] = [];
          }
          groups[monthKey].push(day);
      })
      return groups;
  }, [days])


  return (
    <div className="space-y-4 w-full">
      {Object.entries(groupedDays).map(([month, monthDays], index) => (
        <div key={month} ref={el => monthRefs.current[index] = el} className="space-y-2">
          <h3 className="font-semibold text-lg font-headline pl-2">{month}</h3>
          <div className="flex flex-col gap-2">
            {monthDays.map((day) => {
                const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                return (
                    <Button
                        key={day.toString()}
                        ref={isSelected ? selectedDateRef : null}
                        variant={isSelected ? 'default' : 'ghost'}
                        className={cn(
                        'flex justify-between h-auto p-3 rounded-lg w-full items-center',
                        !isDayAvailable(day) && 'text-muted-foreground pointer-events-none'
                        )}
                        onClick={() => onSelectDate(day)}
                        disabled={!isDayAvailable(day)}
                    >
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-normal">{format(day, 'E')}</span>
                            <span className="font-bold text-lg">{format(day, 'd')}</span>
                        </div>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                    </Button>
                )
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
