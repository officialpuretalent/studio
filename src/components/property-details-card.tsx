import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Property } from '@/lib/types';
import { BedDouble, Bath, Wallet, Star, Dumbbell, Utensils, Hospital, ShoppingCart, Coffee, CheckCircle } from 'lucide-react';
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
    <Card className="w-full overflow-hidden animate-in fade-in-50 duration-500">
      <div className="relative h-64 w-full md:h-80">
        <Image
          src={property.imageUrl}
          alt={`Photo of ${property.address}`}
          fill
          priority
          className="object-cover"
          data-ai-hint="modern house"
        />
        <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-background/80 px-3 py-1.5 text-sm font-semibold backdrop-blur-sm">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>{property.rating.toFixed(1)} / 10</span>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-2xl font-bold font-headline">
          {property.address}
        </CardTitle>
        <CardDescription className="flex items-center gap-4 pt-1 text-base">
          <span className="flex items-center gap-2 text-muted-foreground">
            <BedDouble className="w-5 h-5 text-primary" /> 2 Bedrooms
          </span>
          <span className="flex items-center gap-2 text-muted-foreground">
            <Bath className="w-5 h-5 text-primary" /> 1 Bathroom
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className="grid grid-cols-2 gap-4 text-sm">
            <div className='flex items-center gap-2 p-3 bg-secondary rounded-lg'>
                <Wallet className="w-6 h-6 text-primary" />
                <div>
                    <p className='text-muted-foreground'>Rent</p>
                    <p className='font-semibold text-lg'>{formatCurrency(property.rent)} / month</p>
                </div>
            </div>
            <div className='flex items-center gap-2 p-3 bg-secondary rounded-lg'>
                <Wallet className="w-6 h-6 text-primary" />
                <div>
                    <p className='text-muted-foreground'>Deposit</p>
                    <p className='font-semibold text-lg'>{formatCurrency(property.deposit)}</p>
                </div>
            </div>
        </div>
        
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

        {isAvailable ? (
          <Badge variant="secondary" className="text-sm">
            Choose a time to view this property
          </Badge>
        ) : (
          <Badge variant="destructive" className="text-sm">
            This property is no longer available
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
