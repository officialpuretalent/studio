
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CheckCircle, Phone, Mail, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const agentDetails = {
    name: 'Talent Qwabe',
    phone: '+27821234567',
    email: 'talent.qwabe@aperture.com',
    whatsapp: '27821234567',
    image: '/images/talent_qwabe.jpeg'
}

export function AgentCard() {
  return (
    <Dialog>
      <div className="relative w-full h-full mx-auto overflow-hidden rounded-2xl shadow-lg animate-in fade-in-50 duration-500 delay-300">
        <Image
          src={agentDetails.image}
          alt={`Portrait of the listing agent, ${agentDetails.name}`}
          fill
          className="object-cover w-full h-full"
          data-ai-hint="professional woman"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-bold font-headline">{agentDetails.name}</h3>
            <CheckCircle className="w-5 h-5 text-white fill-blue-500" />
          </div>
          <p className="mt-1 text-sm text-white/90">
            Senior Property Consultant focused on creating seamless client
            experiences.
          </p>
          <DialogTrigger asChild>
            <Button className="w-full mt-6 font-semibold bg-white text-black hover:bg-white/90">
              Contact {agentDetails.name.split(' ')[0]}
            </Button>
          </DialogTrigger>
        </div>
      </div>
      <DialogContent className="w-[90%] sm:max-w-[425px] rounded-lg">
        <DialogHeader>
          <DialogTitle>Contact {agentDetails.name}</DialogTitle>
          <DialogDescription>
            Reach out to Talent for any questions about the property.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button asChild variant="outline" className="justify-start">
            <Link href={`tel:${agentDetails.phone}`}>
              <Phone className="mr-2 h-4 w-4" />
              Call Talent
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
             <Link href={`https://wa.me/${agentDetails.whatsapp}`} target="_blank">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp Talent
            </Link>
          </Button>
           <Button asChild variant="outline" className="justify-start">
            <Link href={`mailto:${agentDetails.email}`}>
                <Mail className="mr-2 h-4 w-4" />
                Email Talent
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
