import { Suspense } from 'react';
import { BookingConfirmation } from '@/components/booking-confirmation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function ConfirmationSkeleton() {
    return (
        <Card className="w-full max-w-lg">
            <CardHeader className="items-center">
                 <Skeleton className="w-16 h-16 rounded-full" />
                 <Skeleton className="h-8 w-3/4 mt-4" />
                 <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-6 text-center">
                <div className="text-left bg-muted p-4 rounded-lg border space-y-4">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
        </Card>
    )
}

export default function ConfirmedPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg text-center">
        <Suspense fallback={<ConfirmationSkeleton />}>
          <BookingConfirmation />
        </Suspense>
      </div>
    </div>
  );
}
