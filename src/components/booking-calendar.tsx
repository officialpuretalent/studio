'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ViewingSlot } from '@/lib/types';
import { format } from 'date-fns';
import { DateScroller } from './date-scroller';

interface BookingCalendarProps {
  propertyId: string;
  viewingSlots: ViewingSlot[];
}

export function BookingCalendar({
  propertyId,
  viewingSlots,
}: BookingCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [displaySlots, setDisplaySlots] = useState<ViewingSlot[]>([]);

  useEffect(() => {
    const now = new Date();
    const futureSlots = viewingSlots
      .map((slot) => ({
        ...slot,
        startTime: new Date(slot.startTime),
        endTime: new Date(slot.endTime),
      }))
      .filter((slot) => slot.startTime > now);
    setDisplaySlots(futureSlots);

    if (futureSlots.length > 0 && !date) {
      const firstAvailableDate = futureSlots.sort(
        (a, b) => a.startTime.getTime() - b.startTime.getTime()
      )[0].startTime;
      setDate(new Date(firstAvailableDate.setHours(0, 0, 0, 0)));
    }
  }, [viewingSlots, date]);

  const availableDays = useMemo(() => {
    const dates = new Set<string>();
    displaySlots.forEach((slot) => {
      const day = new Date(slot.startTime);
      day.setHours(0, 0, 0, 0);
      dates.add(day.toISOString());
    });
    return Array.from(dates).map((d) => new Date(d));
  }, [displaySlots]);

  const slotsForSelectedDate = useMemo(() => {
    if (!date) return [];
    return displaySlots
      .filter(
        (slot) =>
          format(slot.startTime, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      )
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }, [date, displaySlots]);

  return (
    <Card className="animate-in fade-in-50 duration-500 delay-150">
      <CardHeader className="p-5 pb-0">
        <CardTitle className="font-headline text-xl">Select a time</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        <DateScroller
          availableDays={availableDays}
          selectedDate={date}
          onSelectDate={setDate}
        />
        <div className="flex flex-col gap-3 overflow-y-auto pr-2 max-h-[18rem]">
          {slotsForSelectedDate.length > 0 ? (
            slotsForSelectedDate.map((slot) => {
              const isBooked = slot.bookedSlots >= slot.totalSlots;
              return (
                <Button
                  key={slot.id}
                  asChild
                  variant="outline"
                  className="h-auto justify-start p-3 transition-all duration-300 ease-in-out hover:shadow-md hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isBooked}
                  aria-label={
                    isBooked
                      ? `Slot at ${format(slot.startTime, 'p')} is booked`
                      : `Book a viewing at ${format(slot.startTime, 'p')}`
                  }
                >
                  <Link
                    href={`/property/${propertyId}/book?time=${slot.startTime.toISOString()}`}
                    className={isBooked ? 'pointer-events-none' : ''}
                  >
                    <div className="flex items-center justify-between w-full">
                      <p className="font-semibold text-base">
                        {format(slot.startTime, 'HH:mm')}
                      </p>
                      {isBooked ? (
                        <Badge variant="destructive">Booked</Badge>
                      ) : (
                        slot.type === 'Group Viewing' && (
                          <Badge variant="secondary">Group Viewing</Badge>
                        )
                      )}
                    </div>
                  </Link>
                </Button>
              );
            })
          ) : (
            <p className="text-muted-foreground text-center pt-8">
              No available slots for this date.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
