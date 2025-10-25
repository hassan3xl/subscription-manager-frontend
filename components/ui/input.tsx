"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Check, X, ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface InputProps {
  label?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  field?: "input" | "textarea" | "checkbox" | "select" | "radio" | "calendar";
  type?: string;
  placeholder?: string;
  value?: string | boolean;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  error?: string;
  success?: string;
  disabled?: boolean;
  options?: Option[];
  rows?: number;
  multiple?: boolean;
  [key: string]: any;
}

const Input: React.FC<InputProps> = ({
  label,
  icon: Icon,
  field = "input",
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  success,
  disabled = false,
  options = [],
  rows = 4,
  multiple = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const { className: incomingClassName = "", ...restProps } = props;

  const inputType = type === "password" && showPassword ? "text" : type;

  const getContainerClasses = () => {
    const base =
      "relative flex items-center rounded-xl transition-all duration-300 border border-border";
    const state = error
      ? "border-red-500 bg-red-50 dark:bg-red-950/20"
      : success
      ? "border-green-500 bg-green-50 dark:bg-green-950/20"
      : focused
      ? "border-gray-700 dark:border-gray-300 bg-background ring-2 ring-gray-400/20 shadow-sm"
      : "border-gray-300 dark:border-gray-700 bg-background hover:border-gray-400";
    const disabledState = disabled ? "opacity-50 cursor-not-allowed" : "";
    return `${base} ${state} ${disabledState}`;
  };

  const getIconClasses = () =>
    error
      ? "text-red-500"
      : success
      ? "text-green-500"
      : "text-gray-500 dark:text-gray-400";

  const fieldClass =
    `flex-1 px-4 py-2 border border-border bg-backround outline-none text-foreground placeholder:text-gray-400 ${incomingClassName}`.trim();

  const renderInput = () => {
    switch (field) {
      case "textarea":
        return (
          <div className={getContainerClasses()}>
            {Icon && (
              <Icon
                size={20}
                className={`ml-4 self-start  mt-3 ${getIconClasses()}`}
              />
            )}
            <textarea
              placeholder={placeholder}
              value={(value as string) || ""}
              onChange={onChange}
              rows={rows}
              disabled={disabled}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className={`${fieldClass} resize-none`}
              {...restProps}
            />
          </div>
        );

      case "select":
        return (
          <div className={`${getContainerClasses()} relative`}>
            {Icon && <Icon size={20} className={`ml-4 ${getIconClasses()}`} />}
            <select
              value={(value as string) || ""}
              onChange={onChange}
              disabled={disabled}
              multiple={multiple}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className={`${fieldClass} pr-10 appearance-none cursor-pointer`}
              {...restProps}
            >
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary"
            />
          </div>
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-3">
            <div
              className={`w-6 h-6 border-2 rounded-md flex items-center justify-center cursor-pointer transition-all duration-200 ${
                value
                  ? "bg-primary border-primary"
                  : "border-gray-400 dark:border-gray-600"
              }`}
              onClick={() =>
                !disabled &&
                onChange({ target: { value: !(value as boolean) } } as any)
              }
            >
              {value && <Check size={16} className="text-white" />}
            </div>
            {label && (
              <label className="text-sm text-secondary select-none">
                {label}
              </label>
            )}
          </div>
        );

      default:
        return (
          <div className={getContainerClasses()}>
            {Icon && <Icon size={20} className={`ml-4 ${getIconClasses()}`} />}
            <input
              type={inputType}
              placeholder={placeholder}
              value={(value as string) || ""}
              onChange={onChange}
              disabled={disabled}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className={fieldClass}
              {...restProps}
            />
            {type === "password" && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            )}
          </div>
        );
    }
  };

  return (
    <div className="mb-6 w-full">
      {label && field !== "checkbox" && (
        <label className="block mb-2 text-sm font-medium text-foreground text-left">
          {label}
        </label>
      )}
      {renderInput()}
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <X size={14} className="mr-1" /> {error}
        </p>
      )}
      {success && (
        <p className="mt-2 text-sm text-green-600 flex items-center">
          <Check size={14} className="mr-1" /> {success}
        </p>
      )}
    </div>
  );
};

export { Input };
