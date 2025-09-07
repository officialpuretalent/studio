import Link from 'next/link';
import ApertureLogo from '@/components/icons/aperture-logo';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { Button } from './ui/button';

export function Footer() {
  return (
    <footer className="bg-card/50 backdrop-blur-sm border-t mt-auto">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1 space-y-4">
                 <ApertureLogo />
                <p className="text-sm text-muted-foreground">
                    Your smart property viewing scheduler.
                </p>
                <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="#"><Facebook className="h-5 w-5" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="#"><Twitter className="h-5 w-5" /></Link>
                    </Button>
                     <Button variant="ghost" size="icon" asChild>
                        <Link href="#"><Instagram className="h-5 w-5" /></Link>
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 md:col-span-3 gap-8">
                <div>
                    <h3 className="font-semibold text-foreground">Navigation</h3>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li><Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link></li>
                        <li><Link href="#" className="text-muted-foreground hover:text-foreground">Properties</Link></li>
                        <li><Link href="#" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
                        <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold text-foreground">Legal</h3>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li><Link href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
                        <li><Link href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                    </ul>
                </div>
            </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Aperture. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
