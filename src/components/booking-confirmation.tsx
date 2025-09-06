'use client';

import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarPlus, Loader2 } from 'lucide-react';
import { getCalendarInvite } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Skeleton } from './ui/skeleton';
import Image from 'next/image';

export function BookingConfirmation() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formattedTime, setFormattedTime] = useState<string | null>(null);

  const propertyAddress = searchParams.get('propertyAddress');
  const viewingTime = searchParams.get('viewingTime');
  const tenantName = searchParams.get('tenantName');
  const tenantEmail = searchParams.get('tenantEmail');

  useEffect(() => {
    if (viewingTime) {
      setFormattedTime(
        format(new Date(viewingTime), "EEEE, do LLLL yyyy 'at' h:mm a")
      );
    }
  }, [viewingTime]);

  if (!propertyAddress || !viewingTime || !tenantName || !tenantEmail) {
    return (
      <Card className="border">
        <CardHeader>
          <CardTitle className="text-destructive">
            Booking Confirmation Error
          </CardTitle>
          <CardDescription>
            Could not retrieve all booking details. Please check your email for
            confirmation.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const handleDownloadInvite = async () => {
    setIsLoading(true);
    const result = await getCalendarInvite({
      propertyAddress,
      tenantName,
      tenantEmail,
      viewingTime,
    });
    setIsLoading(false);

    if (result.success && result.icsContent) {
      const blob = new Blob([result.icsContent], {
        type: 'text/calendar;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'viewing-invite.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to generate invite',
        description: result.error,
      });
    }
  };

  return (
    <Card className="animate-in fade-in-50 zoom-in-95 duration-500 border">
      <CardHeader>
        <div className="flex justify-center mb-4">
            <Image
                src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjJvaHE3dXJscWZudWdjd2JmdnQ5d2ExZ2htNW10MGYwbWxjaXRsaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wKKnvfqzNOzo3Q3TwY/giphy.gif"
                alt="Confirmation GIF"
                width={160}
                height={160}
                unoptimized
            />
        </div>
        <CardTitle className="text-3xl font-bold font-headline">
          Your viewing is confirmed!
        </CardTitle>
        <CardDescription className="pt-2">
          We have sent a confirmation and a calendar invite to your email and
          WhatsApp.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-left bg-muted p-4 rounded-lg border space-y-2">
          <div>
            <span className="font-semibold text-card-foreground/80">
              What:
            </span>{' '}
            Viewing for {propertyAddress}
          </div>
          <div>
            <span className="font-semibold text-card-foreground/80">
              When:
            </span>{' '}
            {formattedTime ? (
              formattedTime
            ) : (
              <Skeleton className="h-5 w-48 inline-block" />
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            className="w-full font-semibold"
            onClick={handleDownloadInvite}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CalendarPlus className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Generating...' : 'Add to Calendar'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground px-4">
          Clicking "Add to Calendar" will download an .ics file that you can
          open with Google Calendar, Outlook, and other calendar apps.
        </p>
      </CardContent>
    </Card>
  );
}
