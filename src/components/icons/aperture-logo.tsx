import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

export default function ApertureLogo({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <div
      className={cn(
        'font-headline font-bold text-2xl tracking-tight text-primary',
        className
      )}
      {...props}
    >
      Aperture
    </div>
  );
}
