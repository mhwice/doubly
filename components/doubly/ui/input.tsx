import * as React from "react";
import { cn } from "@/lib/utils";
import { Input as ShadcnInput } from "@/components/ui/input";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { OctagonXIcon } from "lucide-react";

const wrapperVariants = cva(
  "flex items-center rounded-xmd border border-xborder bg-white overflow-hidden transition duration-300 ease-in-out [&:not(:focus-within):hover]:border-xborder-hover focus-within:border-xborder-active focus-within:shadow-[0px_0px_0px_3px_rgba(0,0,0,0.08)]",
  {
    variants: {
      size: {
        sm: "h-8 text-sm w-[300px]",
        md: "h-10 text-sm w-[400px]",
        lg: "h-12 text-base w-[500px]",
      },
      disabled: {
        true: "pointer-events-none bg-[#f2f2f2]"
      },
      error: {
        true: "border-xerror-dark shadow-[0px_0px_0px_3px_rgba(238,0,0,0.1)] [&:not(:focus-within):hover]:shadow-[0px_0px_0px_3px_rgba(238,0,0,0.25)] [&:not(:focus-within):hover]:border-xerror focus-within:border-xerror focus-within:shadow-[0px_0px_0px_3px_rgba(238,0,0,0.1)]"
      },
      fullWidth: {
        true: "w-full"
      }
    },
    defaultVariants: {
      size: "md",
      disabled: false,
      error: false,
      fullWidth: false
    },
  }
);

const inputVariants = cva("outline-none border-none shadow-none focus-visible:ring-0 text-xtext placeholder:text-xsecondary bg-transparent", {
  variants: {
    size: {
      sm: "h-8 text-sm md:text-sm",
      md: "h-10 text-sm md:text-sm",
      lg: "h-12 text-base md:text-base",
    },
    disabled: {
      true: "placeholder:text-[#8f8f8f]"
    }
  },
  defaultVariants: {
    size: "md",
    disabled: false
  },
});

type BaseInputProps = Omit<
  React.ComponentProps<typeof ShadcnInput>,
  "fullWidth" | "disabled" | "suffix" | "prefix" | "size" | "className"
>;

export type CustomInputProps = BaseInputProps & VariantProps<
  typeof inputVariants
> & {
  className?: string;
  prefix?: string | React.ReactNode;
  suffix?: string | React.ReactNode;
  prefixStyling?: boolean;
  suffixStyling?: boolean;
  error?: string,
  fullWidth?: boolean;
  onPrefixClick?: () => void;
  onSuffixClick?: () => void;
};

interface AffixProps {
  side: 'left' | 'right';
  enabled: boolean;
  styling: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const Affix = ({ side, enabled, styling, children, onClick }: AffixProps) => {
  if (!enabled) return null;
  const borderClass = side === 'left' ? 'border-r' : 'border-l';
  let padding = "pr-4 pl-4";
  if (!styling && !onClick) padding = side === 'left' ? 'pl-4 pr-0' : 'pr-4 pl-0';

  const base = cn(
    'flex-shrink-0 flex items-center justify-center h-full text-[#8f8f8f] text-sm font-normal',
    styling && `bg-[var(--dashboard-bg)] ${borderClass} border-vborder`,
    padding
  );

  if (onClick) return <button onClick={onClick} type="button" className={cn(base, "cursor-pointer")}>{children}</button>
  return <div className={base}>{children}</div>
};

interface ErrorMessageProps {
  disabled: boolean,
  error?: string,
  size: "sm" | "md" | "lg"
}

const ErrorMessage = ({ disabled, error, size }: ErrorMessageProps) => {
  if (disabled || !error) return null;
  return <span className={`flex items-center gap-1 text-xerror-dark ${size === "lg" ? "text-base" : "text-sm"}`}><OctagonXIcon size="18"/>{error}</span>
}

const Input = React.memo(React.forwardRef<HTMLInputElement, CustomInputProps>(({ size, className, prefix, suffix, prefixStyling = true, suffixStyling = true, disabled, error, fullWidth = false, onPrefixClick, onSuffixClick, ...props }, ref) => {

  const hasError = !!error;
  const hasPrefix = !!prefix;
  const hasSuffix = !!suffix;

  const wrapperClass = React.useMemo(() => cn(wrapperVariants({ size, disabled, error: !disabled && hasError, fullWidth })), [size, disabled, error, fullWidth]);
  const inputClass = React.useMemo(() => cn(twMerge(inputVariants({ size, disabled }), className), (onSuffixClick && !suffixStyling) && "pr-0", (onPrefixClick && !prefixStyling) && "pl-0"), [size, disabled, className]);

  return (
    <div className={cn(disabled ? "cursor-not-allowed" : hasError ? "flex flex-col gap-2" : "")}>
      <div className={wrapperClass}>
        <Affix enabled={hasPrefix} side="left" styling={prefixStyling} onClick={onPrefixClick}>{prefix}</Affix>
        <ShadcnInput
          ref={ref}
          disabled={!!disabled}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          className={inputClass}
          {...props}
        />
        <Affix enabled={hasSuffix} side="right" styling={suffixStyling} onClick={onSuffixClick}>{suffix}</Affix>
      </div>
      <ErrorMessage disabled={!!disabled} error={error} size={size as "sm" | "md" | "lg"} />
    </div>
  );
}));

Input.displayName = "Input";

export { Input, inputVariants };
