import React from "react";

interface UnderlineInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const UnderlineInput = ({ label, className = "", ...props }: UnderlineInputProps) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-xl font-bold text-gray-400 dark:text-gray-500">{label}</label>
      <input
        className="w-full bg-transparent border-b-[3px] border-brand/60 focus:border-brand text-xl text-gray-700 dark:text-gray-200 pb-2 focus:outline-none transition-colors placeholder-transparent"
        {...props}
      />
    </div>
  );
};
