import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Property } from '@/lib/types';
import { BedDouble, Bath, Dumbbell, Utensils, Hospital, ShoppingCart, Coffee, CheckCircle, Calendar } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface PropertyDetailsCardProps {
  property: Property;
  isAvailable: boolean;
}

const AmenityIcon = ({ name, available }: { name: string, available: boolean }) => {
    const icons: { [key: string]: React.ReactNode } = {
        gym: <Dumbbell />,
        cafe: <Coffee />,
        restaurants: <Utensils />,
        hospital: <Hospital />,
        mall: <ShoppingCart />,
    };

    return (
        <div className={`flex items-center gap-2 ${available ? 'text-foreground' : 'text-muted-foreground'}`}>
            {icons[name]}
            <span className={!available ? 'line-through' : ''}>{name.charAt(0).toUpperCase() + name.slice(1)}</span>
        </div>
    )
}

export function PropertyDetailsCard({
  property,
  isAvailable,
}: PropertyDetailsCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
    
  return (
    <Card className="w-full overflow-hidden animate-in fade-in-50 duration-500 border-0 shadow-none bg-transparent">
       <div className="relative h-96 w-full">
        <Image
          src={property.imageUrl}
          alt={`Photo of ${property.address}`}
          fill
          priority
          className="object-cover rounded-xl"
          data-ai-hint="modern house"
        />
        <div className="absolute top-4 right-4">
            <Badge variant={isAvailable ? "secondary" : "destructive"} className="text-sm backdrop-blur-sm">
                {isAvailable ? 'Available' : 'Leased'}
            </Badge>
        </div>
         <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-sm p-4 rounded-lg">
           <div className="flex justify-between items-start">
             <div>
                <h2 className="text-xl font-bold font-headline">{property.address.split(',')[0]}</h2>
                <p className="text-sm text-muted-foreground">{property.address.split(',').slice(1).join(',').trim()}</p>
             </div>
             <div className="text-right">
                <p className="text-xl font-bold">{formatCurrency(property.rent)}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                <p className="text-sm text-muted-foreground">Deposit: {formatCurrency(property.rent)}</p>
             </div>
           </div>
           <div className="border-t border-border/50 my-3"></div>
            <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-2">
                    <BedDouble className="w-5 h-5 text-primary" /> 2 Bedrooms
                </span>
                <span className="flex items-center gap-2">
                    <Bath className="w-5 h-5 text-primary" /> 1 Bathroom
                </span>
            </div>
         </div>
      </div>
      <CardContent className='space-y-6 pt-6 px-0'>
         {isAvailable ? (
          <Button asChild size="lg" className="w-full font-semibold">
            <Link href="#booking-calendar">
              <Calendar className="mr-2 h-5 w-5" />
              Book a Viewing
            </Link>
          </Button>
        ) : (
          <Badge variant="destructive" className="text-sm w-full justify-center p-3">
            This property is no longer available
          </Badge>
        )}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="affordability">
            <AccordionTrigger className="text-sm font-semibold">
              Check Affordability
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <p>
                To qualify, your gross monthly income must be at least 3 times the rental amount.
              </p>
              <p>
                For a single applicant, you need to earn at least{' '}
                <span className="font-semibold text-foreground">
                  {formatCurrency(property.rent * 3)}
                </span>{' '}
                per month.
              </p>
              <p>
                For a joint lease, the combined income of all applicants must be at least{' '}
                <span className="font-semibold text-foreground">
                  {formatCurrency(property.rent * 3)}
                </span>{' '}
                per month.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div>
            <h3 className='font-headline font-semibold text-lg mb-3'>Area Highlights</h3>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4 text-sm'>
                {Object.entries(property.amenities).map(([key, value]) => (
                    <AmenityIcon key={key} name={key} available={value} />
                ))}
                 <div className={`flex items-center gap-2 ${property.uberFriendly ? 'text-foreground' : 'text-muted-foreground'}`}>
                    <CheckCircle />
                    <span>Uber Friendly</span>
                </div>
            </div>
             <div className="mt-4 space-y-2">
                <p className="font-semibold">Points of Interest:</p>
                <div className="flex flex-wrap gap-2">
                    {property.areaInterests.map((interest) => (
                        <Badge key={interest} variant="outline">{interest}</Badge>
                    ))}
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
