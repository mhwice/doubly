"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { ControllerRenderProps } from "react-hook-form";

interface PasswordInputProps extends ControllerRenderProps {
  disabled?: boolean;
  placeholder?: string;
}

// interface PasswordInputProps {
//   disabled?: boolean,
//   placeholder?: string,
//   // value: string;
//   // onChange: (value: string) => void;
//   // onBlur: () => void;
//   field
// }

export function PasswordInput({ disabled = false, placeholder = "", ...field }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center
          rounded-[var(--bradius)] border border-vborder
          bg-white overflow-hidden
          transition duration-300 ease-in-out
          [&:not(:focus-within):hover]:border-[#c9c9c9]
          focus-within:border-[#8d8d8d]
          focus-within:shadow-[0px_0px_0px_3px_rgba(0,0,0,0.08)]">
      <input className="pr-[36px] w-full px-4 py-2 text-vprimary text-sm outline-none placeholder:text-[#8d8d8d]" disabled={disabled} type={showPassword ? "text" : "password"} placeholder={placeholder} {...field} />
      <button type="button" className="flex items-center justify-center w-[40px] ml-[-40px]" disabled={disabled} onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? <LuEye className="h-4 w-4 text-[#8d8d8d]" /> : <LuEyeClosed className="h-4 w-4 text-[#8d8d8d]" />}
      </button>
    </div>
  );
}
