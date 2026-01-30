import React from 'react';
import { cn } from '../../lib/utils';

const variants = {
  default: 'bg-primary text-primary-foreground hover:opacity-90 shadow-md',
  outline: 'border border-border bg-transparent hover:bg-secondary hover:text-secondary-foreground',
  hero: 'bg-gradient-to-r from-primary via-[hsl(199,89%,48%)] to-accent text-primary-foreground font-semibold shadow-lg hover:shadow-[0_0_40px_hsl(174,72%,56%,0.4)] hover:scale-[1.02] transition-all duration-300',
  glass: 'glass-card text-foreground hover:bg-muted/50 border border-border/50',
  wallet: 'bg-gradient-to-r from-[hsl(280,100%,70%)] to-primary text-primary-foreground font-semibold shadow-lg hover:scale-[1.02] transition-all duration-300',
};

const sizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3 text-sm',
  lg: 'h-12 rounded-lg px-8 text-base',
  xl: 'h-14 rounded-xl px-10 text-lg',
  icon: 'h-10 w-10',
};

export function Button({ className, variant = 'default', size = 'default', ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
