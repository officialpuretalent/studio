'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, User } from 'lucide-react';
import type { ViewingSlot } from '@/lib/types';
import { format } from 'date-fns';

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

    if (futureSlots.length > 0) {
      const firstAvailableDate = futureSlots.sort(
        (a, b) => a.startTime.getTime() - b.startTime.getTime()
      )[0].startTime;
      setDate(firstAvailableDate);
    }
  }, [viewingSlots]);

  const availableDays = useMemo(() => {
    const dates = new Set<string>();
    displaySlots.forEach((slot) => {
      dates.add(format(slot.startTime, 'yyyy-MM-dd'));
    });
    return Array.from(dates).map((d) => new Date(d + 'T00:00:00'));
  }, [displaySlots]);

  const slotsForSelectedDate = useMemo(() => {
    if (!date) return [];
    return displaySlots
      .filter(
        (slot) => format(slot.startTime, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      )
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }, [date, displaySlots]);

  return (
    <Card className="animate-in fade-in-50 duration-500 delay-150">
      <CardHeader>
        <CardTitle className="font-headline">Select a Date & Time</CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-8">
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiers={{ available: availableDays }}
            modifiersClassNames={{
              available: 'bg-accent/20 text-accent-foreground font-semibold',
            }}
            disabled={(d) =>
              d < new Date(new Date().setDate(new Date().getDate() - 1)) ||
              !availableDays.some(
                (ad) => format(ad, 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd')
              )
            }
          />
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-lg font-headline">
            Available Slots for {date ? format(date, 'EEEE, LLLL do') : '...'}
          </h3>
          <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-2">
            {slotsForSelectedDate.length > 0 ? (
              slotsForSelectedDate.map((slot) => {
                const isBooked = slot.bookedSlots >= slot.totalSlots;
                const availableSlots = slot.totalSlots - slot.bookedSlots;

                return (
                  <Button
                    key={slot.id}
                    asChild
                    variant="outline"
                    className="h-auto justify-between p-3 transition-all duration-300 ease-in-out hover:shadow-md hover:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isBooked}
                    aria-label={
                      isBooked
                        ? `Slot at ${format(slot.startTime, 'p')} is booked`
                        : `Book a viewing at ${format(slot.startTime, 'p')}`
                    }
                  >
                    <Link
                      href={`/property/${propertyId}/book?time=${slot.startTime.toISOString()}`}
                    >
                      <div className="flex items-center gap-3">
                        {slot.type === 'Group Viewing' ? (
                          <Users className="w-5 h-5 text-primary" />
                        ) : (
                          <User className="w-5 h-5 text-primary" />
                        )}
                        <div className="text-left">
                          <p className="font-semibold">
                            {format(slot.startTime, 'p')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {slot.type}
                          </p>
                        </div>
                      </div>
                      {isBooked ? (
                        <Badge variant="destructive">Booked</Badge>
                      ) : (
                        <Badge
                          variant={
                            slot.type === 'Group Viewing' ? 'default' : 'secondary'
                          }
                        >
                          {slot.type === 'Group Viewing'
                            ? `${availableSlots} slot${
                                availableSlots > 1 ? 's' : ''
                              } left`
                            : 'Available'}
                        </Badge>
                      )}
                    </Link>
                  </Button>
                );
              })
            ) : (
              <p className="text-muted-foreground pt-4">
                No available slots for this date.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
