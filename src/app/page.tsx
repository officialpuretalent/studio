import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ViewWiseLogo from '@/components/icons/viewwise-logo';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <Card className="w-full max-w-md shadow-2xl animate-in fade-in-50 zoom-in-95 duration-500">
        <CardHeader className="items-center text-center">
          <ViewWiseLogo className="h-16 w-16 text-primary" />
          <CardTitle className="text-3xl font-bold pt-4 font-headline">
            Welcome to ViewWise
          </CardTitle>
          <CardDescription className="pt-2">
            Your smart property viewing scheduler.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-center text-muted-foreground">
            This is a demonstration of the tenant booking journey. Click the
            button below to book a viewing for a sample property.
          </p>
          <Button
            asChild
            size="lg"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
          >
            <Link href="/property/123-maple-street">Book a Viewing</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
