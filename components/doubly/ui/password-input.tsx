"use client";

import { CustomInputProps, Input } from "./input";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { useState } from "react";

export function PasswordInput({ ...props }: CustomInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      type={showPassword ? "text" : "password"}
      suffix={showPassword ? <LuEye size={16} /> : <LuEyeClosed size={16} />}
      suffixStyling={false}
      onSuffixClick={() => setShowPassword(!showPassword)}
      {...props}
    />
  );
}
