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
import { bookViewing } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';

const bookingSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  mobileNumber: z
    .string()
    .min(10, { message: 'Please enter a valid mobile number.' }),
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

  const time = searchParams.get('time');
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

  function onSubmit(values: z.infer<typeof bookingSchema>) {
    startTransition(async () => {
      const result = await bookViewing({
        ...values,
        propertyId,
        propertyAddress,
        viewingTime: selectedTime.toISOString(),
      });

      if (result && !result.success) {
        toast({
          variant: 'destructive',
          title: 'Booking Failed',
          description: result.error,
        });
      }
    });
  }

  return (
    <Card className="w-full animate-in fade-in-50 zoom-in-95 duration-500">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Confirm Your Details</CardTitle>
        <CardDescription>
          You've selected{' '}
          <span className="font-semibold text-primary">
            {format(selectedTime, "h:mm a 'on' EEEE, do LLLL")}
          </span>
          .
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
  );
}
