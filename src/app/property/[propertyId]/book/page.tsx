import { Suspense } from 'react';
import { BookingForm } from '@/components/booking-form';
import ViewWiseLogo from '@/components/icons/viewwise-logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function BookingFormSkeleton() {
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl">Confirm Your Details</CardTitle>
                <Skeleton className="h-4 w-3/4 mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
    )
}

function BookingPageContent({ propertyId }: { propertyId: string }) {
  return (
    <BookingForm
      propertyId={propertyId}
      propertyAddress="456 Oak Avenue, Sandton, Johannesburg, 2196"
    />
  );
}

export default function BookPage({ params }: { params: { propertyId: string } }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <ViewWiseLogo className="h-12 w-12 text-primary" />
        </div>
        <Suspense fallback={<BookingFormSkeleton />}>
          <BookingPageContent propertyId={params.propertyId} />
        </Suspense>
      </div>
    </div>
  );
}
