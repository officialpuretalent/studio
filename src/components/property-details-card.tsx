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
import { BedDouble, Bath, Wallet } from 'lucide-react';

interface PropertyDetailsCardProps {
  property: Property;
  isAvailable: boolean;
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
      <div className="relative h-64 w-full">
        <Image
          src={property.imageUrl}
          alt={`Photo of ${property.address}`}
          fill
          priority
          className="object-cover"
          data-ai-hint="modern house"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-bold font-headline">
          {property.address}
        </CardTitle>
        <CardDescription className="flex items-center gap-4 pt-2 text-base">
          <span className="flex items-center gap-2 text-muted-foreground">
            <BedDouble className="w-5 h-5 text-primary" /> 2 Bedrooms
          </span>
          <span className="flex items-center gap-2 text-muted-foreground">
            <Bath className="w-5 h-5 text-primary" /> 1 Bathroom
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className="grid grid-cols-2 gap-4 text-sm">
            <div className='flex items-center gap-2'>
                <Wallet className="w-5 h-5 text-primary" />
                <div>
                    <p className='text-muted-foreground'>Rent</p>
                    <p className='font-semibold'>{formatCurrency(property.rent)} / month</p>
                </div>
            </div>
            <div className='flex items-center gap-2'>
                <Wallet className="w-5 h-5 text-primary" />
                <div>
                    <p className='text-muted-foreground'>Deposit</p>
                    <p className='font-semibold'>{formatCurrency(property.deposit)}</p>
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
