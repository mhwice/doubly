"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { LuEye, LuEyeClosed } from "react-icons/lu";

interface PasswordInputProps {
  disabled?: boolean,
  placeholder?: string
}

export function PasswordInput({ disabled = false, placeholder = "" }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex">
      <Input className="pr-[36px]" disabled={disabled} type={showPassword ? "text" : "password"} placeholder={placeholder} />
      <button type="button" className="flex items-center justify-center w-[40px] ml-[-40px]" disabled={disabled} onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? <LuEye className="h-4 w-4 text-muted-foreground" /> : <LuEyeClosed className="h-4 w-4 text-muted-foreground" />}
      </button>
    </div>
  );
}
