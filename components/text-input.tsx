"use client";

import { ControllerRenderProps } from "react-hook-form";

interface TextInputProps extends ControllerRenderProps {
  disabled?: boolean;
  placeholder?: string;
  type?: string
}

export function TextInput({
  disabled = false,
  placeholder = "",
  type = "text",
  ...field
}: TextInputProps) {
  return (
    <div
      className="
        flex items-center
        rounded-[var(--bradius)] border border-vborder
        bg-white overflow-hidden
        transition duration-300 ease-in-out
        [&:not(:focus-within):hover]:border-[#c9c9c9]
        focus-within:border-[#8d8d8d]
        focus-within:shadow-[0px_0px_0px_3px_rgba(0,0,0,0.08)]
      "
    >
      {/* <div className="flex-shrink-0 px-4 py-[10px] bg-[var(--dashboard-bg)] text-[#8f8f8f] text-sm font-normal border-r border-vborder">
        https://
      </div> */}
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-2 text-vprimary text-sm outline-none placeholder:text-[#8d8d8d]"
        {...field}
      />
    </div>
  );
}
