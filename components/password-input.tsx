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
    <div className="flex">
      <Input className="pr-[36px]" disabled={disabled} type={showPassword ? "text" : "password"} placeholder={placeholder} {...field} />
      <button type="button" className="flex items-center justify-center w-[40px] ml-[-40px]" disabled={disabled} onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? <LuEye className="h-4 w-4 text-muted-foreground" /> : <LuEyeClosed className="h-4 w-4 text-muted-foreground" />}
      </button>
    </div>
  );
}
