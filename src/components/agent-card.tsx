import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CheckCircle, Users, CheckSquare, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AgentCard() {
  return (
    <div className="relative w-full h-full mx-auto overflow-hidden rounded-2xl shadow-lg animate-in fade-in-50 duration-500 delay-300">
      <Image
        src="/images/talent_qwabe.jpeg"
        alt="Portrait of the listing agent, Talent Qwabe"
        fill
        className="object-cover w-full h-full"
        data-ai-hint="professional woman"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-bold font-headline">Sophie Bennett</h3>
          <CheckCircle className="w-5 h-5 text-white fill-blue-500" />
        </div>
        <p className="mt-1 text-sm text-white/90">
          Senior Property Consultant focused on creating seamless client experiences.
        </p>
        <div className="flex items-center gap-6 mt-4 text-sm text-white/90">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>312 Properties Sold</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            <span>48 Active Listings</span>
          </div>
        </div>
        <Button className="w-full mt-6 font-semibold bg-white text-black hover:bg-white/90">
            <Plus className="w-4 h-4 mr-2" />
            Follow
        </Button>
      </div>
    </div>
  );
}
