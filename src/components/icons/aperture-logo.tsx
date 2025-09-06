import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

export default function ApertureLogo({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <div
      className={cn(
        'font-logo font-extrabold text-2xl tracking-tight text-foreground',
        className
      )}
      {...props}
    >
      Aperture
    </div>
  );
}
