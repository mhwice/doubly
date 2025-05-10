import React from 'react';
import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from '@/components/ui/button';
import { RiLoader2Fill } from '@remixicon/react';
import { cva, VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const buttonStyles = cva(
  'gap-1 font-medium border border-transparent',
  {
    variants: {
      size: {
        sm: 'h-8 p-3 text-sm',
        md: 'h-10 p-4 text-sm',
        lg: 'h-12 p-5 text-md',
      },
      variant: {
        default: 'bg-xtext text-white hover:shadow-[0px_0px_0px_1px_rgba(0,0,0,0.08)]',
        outline: 'bg-white hover:bg-xcomp-bg text-xtext border-xborder hover:border-xcomp-bg-active',
        destructive: 'bg-xerror hover:bg-xerror-dark text-white',
        ghost: 'bg-transparent hover:bg-xcomp-bg text-xtext',
      },
      rounded: {
        true: 'rounded-full',
        false: 'rounded-xmd',
      },
      shadow: {
        true: 'shadow-lg',
        false: 'shadow-none',
      },
      disabled: {
        true: 'pointer-events-none bg-xcomp-bg-active text-xtext border-xborder-hover !opacity-40'
      }
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
      rounded: false,
      shadow: false,
      disabled: false
    },
  }
);

export interface CustomButtonProps extends Omit<ShadcnButtonProps, 'disabled' | 'prefix' | 'suffix' | 'size' | 'variant'>, VariantProps<typeof buttonStyles> {
  loading?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Button: React.FC<CustomButtonProps> = ({
  size,
  variant,
  rounded,
  shadow,
  loading = false,
  prefix,
  suffix,
  className,
  disabled,
  ...props
}) => {
  const merged = twMerge(
    className,
    buttonStyles({ size, variant, rounded, shadow, disabled: disabled || loading })
  );

  if (loading || disabled) return (
    <span className="cursor-not-allowed">
      <ShadcnButton className={merged} disabled {...props}>
        {loading && <RiLoader2Fill className="size-4 shrink-0 animate-spin mr-2" aria-hidden />}
        {prefix}
        {props.children}
        {suffix}
      </ShadcnButton>
    </span>
  );

  return (
    <ShadcnButton className={merged} {...props}>
      {prefix}
      {props.children}
      {suffix}
    </ShadcnButton>
  );
};
