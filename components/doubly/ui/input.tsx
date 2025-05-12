import * as React from "react";
import { cn } from "@/lib/utils";
import { Input as ShadcnInput } from "@/components/ui/input";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { OctagonXIcon } from "lucide-react";

const wrapperVariants = cva(
  "flex items-center rounded-xmd border border-vborder bg-white overflow-hidden transition duration-300 ease-in-out [&:not(:focus-within):hover]:border-[#c9c9c9] focus-within:border-[#8d8d8d] focus-within:shadow-[0px_0px_0px_3px_rgba(0,0,0,0.08)]",
  {
    variants: {
      size: {
        sm: "h-8 text-sm",
        md: "h-10 text-sm",
        lg: "h-12 text-base",
      },
      disabled: {
        true: "pointer-events-none bg-[#f2f2f2]"
      },
      error: {
        true: "border-red-500 shadow-[0px_0px_0px_3px_rgba(198,25,25,0.08)] [&:not(:focus-within):hover]:shadow-[0px_0px_0px_3px_rgba(198,25,25,0.2)] [&:not(:focus-within):hover]:border-red-500 focus-within:border-red-500 focus-within:shadow-[0px_0px_0px_3px_rgba(198,25,25,0.08)]"
      }
    },
    defaultVariants: {
      size: "md",
      disabled: false,
      error: false
    },
  }
);

const inputVariants = cva("outline-none border-none shadow-none focus-visible:ring-0 text-xtext placeholder:text-[#c3c3c3] bg-transparent", {
  variants: {
    variant: {
      default: "",
      primary: "",
      destructive: "bg-red-500",
    },
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
    variant: "default",
    size: "md",
    disabled: false
  },
});

// type CustomInputProps = React.ComponentProps<typeof ShadcnInput> & VariantProps<typeof inputVariants>;

type BaseInputProps = Omit<
  React.ComponentProps<typeof ShadcnInput>,
  "disabled" | "suffix" | "prefix" | "size" | "variant" | "className"
>;

// 3) Compose your final props type
export type CustomInputProps = BaseInputProps & VariantProps<
  typeof inputVariants
> & {
  className?: string;
  prefix?: string | React.ReactNode;
  suffix?: string | React.ReactNode;
  prefixStyling?: boolean;
  suffixStyling?: boolean;
  error?: string
};

const Input = React.forwardRef<HTMLInputElement, CustomInputProps>(({ variant, size, className, prefix, suffix, prefixStyling = true, suffixStyling = true, disabled, error, ...props }, ref) => {
    if (disabled) return (
      <div className="cursor-not-allowed">
        <div className={cn(wrapperVariants({ size, disabled }))}>
          {prefix && (<div className={cn("pl-4 text-[#8f8f8f] font-normal flex-shrink-0 items-center justify-center text-center h-full flex", prefixStyling && "bg-[var(--dashboard-bg)] border-r border-vborder pr-4")}>{prefix}</div>)}
          <ShadcnInput
            ref={ref}
            disabled
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            className={twMerge(inputVariants({ variant, size, disabled }), className)}
            {...props}
          />
          {suffix && (<div className={cn("pr-4 text-[#8f8f8f] font-normal flex-shrink-0 items-center justify-center text-center h-full flex", suffixStyling && "bg-[var(--dashboard-bg)] border-l border-vborder pl-4")}>{suffix}</div>)}
        </div>
      </div>
    );

    if (!!error) return (
      <div className="flex flex-col gap-2">
        <div className={cn(wrapperVariants({ size, error: !!error }))}>
          {prefix && (<div className={cn("pl-4 text-[#8f8f8f] font-normal flex-shrink-0 items-center justify-center text-center h-full flex", prefixStyling && "bg-[var(--dashboard-bg)] border-r border-vborder pr-4")}>{prefix}</div>)}
          <ShadcnInput
            ref={ref}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            className={twMerge(inputVariants({ variant, size }), className)}
            {...props}
          />
          {suffix && (<div className={cn("pr-4 text-[#8f8f8f] font-normal flex-shrink-0 items-center justify-center text-center h-full flex", suffixStyling && "bg-[var(--dashboard-bg)] border-l border-vborder pl-4")}>{suffix}</div>)}
        </div>
        <span className={`flex items-center gap-1 text-red-500 ${size === "lg" ? "text-base" : "text-sm"}`}><OctagonXIcon size="18"/>{error}</span>
      </div>
    );

    return (
      <div className={cn(wrapperVariants({ size }))}>
        {prefix && (<div className={cn("pl-4 text-[#8f8f8f] font-normal flex-shrink-0 items-center justify-center text-center h-full flex", prefixStyling && "bg-[var(--dashboard-bg)] border-r border-vborder pr-4")}>{prefix}</div>)}
        <ShadcnInput
          ref={ref}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          className={twMerge(inputVariants({ variant, size }), className)}
          {...props}
        />
        {suffix && (<div className={cn("pr-4 text-[#8f8f8f] font-normal flex-shrink-0 items-center justify-center text-center h-full flex", suffixStyling && "bg-[var(--dashboard-bg)] border-l border-vborder pl-4")}>{suffix}</div>)}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
