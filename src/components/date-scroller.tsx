
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

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
  const [api, setApi] = useState<CarouselApi>();
  const [currentMonth, setCurrentMonth] = useState('');

  const days = useMemo(() => {
    if (availableDays.length === 0) return [];
    const daysArray = [];
    const firstDay = availableDays[0] || new Date();
    for (let i = 0; i < 30; i++) {
      daysArray.push(addDays(firstDay, i));
    }
    return daysArray;
  }, [availableDays]);

  useEffect(() => {
    if (!api) {
      return;
    }

    const updateMonth = () => {
      const firstVisibleIndex = api.scrollSnapList()[0];
      if (days[firstVisibleIndex]) {
        setCurrentMonth(format(days[firstVisibleIndex], 'MMMM yyyy'));
      }
    };

    updateMonth();
    api.on('select', updateMonth);
    return () => {
      api.off('select', updateMonth);
    };
  }, [api, days]);

  useEffect(() => {
    if (api && selectedDate) {
      const selectedIndex = days.findIndex((day) =>
        isSameDay(day, selectedDate)
      );
      if (selectedIndex !== -1) {
        api.scrollTo(selectedIndex, true);
      }
    }
  }, [api, selectedDate, days]);

  const isDayAvailable = (day: Date) => {
    return availableDays.some((availableDay) => isSameDay(day, availableDay));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg font-headline">{currentMonth}</h3>
        <div className="flex items-center gap-2">
            {/* The calendar icon can be used to open a full calendar view in the future */}
            {/* <Button variant="outline" size="icon"><CalendarIcon /></Button> */}
        </div>
      </div>
      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          dragFree: true,
          containScroll: 'keepSnaps',
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2">
          {days.map((day, index) => (
            <CarouselItem
              key={index}
              className="basis-1/7 pl-2 md:basis-[calc(100%/8)]"
            >
              <Button
                variant={
                  isSameDay(day, selectedDate || new Date())
                    ? 'default'
                    : 'outline'
                }
                className={cn(
                  'flex flex-col h-auto p-3 rounded-full aspect-square w-full items-center justify-center gap-1',
                  !isDayAvailable(day) &&
                    'bg-muted text-muted-foreground pointer-events-none'
                )}
                onClick={() => onSelectDate(day)}
                disabled={!isDayAvailable(day)}
              >
                <span className="text-sm">{format(day, 'E')}</span>
                <span className="font-bold text-lg">{format(day, 'd')}</span>
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
            <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2" />
        </div>
      </Carousel>
    </div>
  );
}
