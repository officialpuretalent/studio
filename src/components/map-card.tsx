import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Share2 } from 'lucide-react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';

interface MapCardProps {
    address: string;
}

export function MapCard({ address }: MapCardProps) {
  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden rounded-2xl shadow-lg animate-in fade-in-50 duration-500 delay-300">
      <div className="relative h-64 w-full">
        <Image
          src="https://picsum.photos/400/300"
          alt="Map showing the location of the property"
          fill
          className="object-cover"
          data-ai-hint="city map"
        />
        <div className="absolute inset-x-4 bottom-4">
            <div className="bg-background/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-bold text-lg font-headline">{address.split(',')[0]}</h3>
                        <p className="text-sm text-muted-foreground">{address.split(',').slice(1).join(',').trim()}</p>
                    </div>
                     <Button variant="ghost" size="icon" className="w-8 h-8 flex-shrink-0">
                        <Share2 className="w-4 h-4" />
                    </Button>
                </div>
                <div className="flex items-center gap-4 mt-3 text-sm">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>2km away</span>
                    </div>
                     <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                        <span>4.8 rating</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </Card>
  );
}
