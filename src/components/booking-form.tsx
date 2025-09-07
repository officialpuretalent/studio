'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { bookViewing } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useState, useTransition, useEffect } from 'react';
import { Skeleton } from './ui/skeleton';

const bookingSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(50, { message: 'Name must be less than 50 characters.' }),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address.' })
    .max(100, { message: 'Email must be less than 100 characters.' }),
  mobileNumber: z
    .string()
    .min(10, { message: 'Please enter a valid mobile number.' })
    .max(15, { message: 'Phone number too long.' })
    .refine((phone) => {
      const cleanPhone = phone.replace(/\s+/g, '');
      return /^(\+27|0)[0-9]{9}$/.test(cleanPhone) || /^\+[1-9]\d{1,14}$/.test(cleanPhone);
    }, { message: 'Please enter a valid phone number with country code or SA format (0xx xxx xxxx).' }),
});

export function BookingForm({
  propertyId,
  propertyAddress,
}: {
  propertyId: string;
  propertyAddress: string;
}) {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [formattedTime, setFormattedTime] = useState<string | null>(null);

  const time = searchParams.get('time');

  useEffect(() => {
    if (time) {
      setFormattedTime(
        format(new Date(time), "h:mm a 'on' EEEE, do LLLL")
      );
    }
  }, [time]);

  if (!time) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">
            Booking time not specified. Please go back and select a time slot.
          </p>
        </CardContent>
      </Card>
    );
  }
  const selectedTime = new Date(time);

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: '',
      email: '',
      mobileNumber: '',
    },
  });

  function onFormSubmit(values: z.infer<typeof bookingSchema>) {
    setShowConfirmationDialog(true);
  }

  function handleBookingConfirmation() {
    startTransition(async () => {
      const values = form.getValues();
      const result = await bookViewing({
        ...values,
        propertyId,
        propertyAddress,
        viewingTime: selectedTime.toISOString(),
      });

      if (result && !result.success) {
        // Check if it's a rate limit error
        const isRateLimited = 'rateLimited' in result && result.rateLimited;
        
        toast({
          variant: 'destructive',
          title: isRateLimited ? 'Too Many Requests' : 'Booking Failed',
          description: result.error,
          duration: isRateLimited ? 8000 : 5000, // Show rate limit errors longer
        });
      }
    });
    setShowConfirmationDialog(false);
  }

  return (
    <>
      <Card className="w-full animate-in fade-in-50 zoom-in-95 duration-500">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">
            Confirm Your Details
          </CardTitle>
          <CardDescription>
            You've selected{' '}
            {formattedTime ? (
              <span className="font-semibold text-foreground">
                {formattedTime}
              </span>
            ) : (
              <Skeleton className="h-5 w-48 inline-block" />
            )}
            .
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onFormSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+27 82 123 4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full font-semibold"
                disabled={isPending}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? 'Booking...' : 'Book Viewing'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <AlertDialog
        open={showConfirmationDialog}
        onOpenChange={setShowConfirmationDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Please ensure the number you provided is a valid WhatsApp number. We will send a confirmation and calendar invite to your email and WhatsApp, allowing you to manage your schedule.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBookingConfirmation}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
