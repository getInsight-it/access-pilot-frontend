import * as React from "react";
import { cn } from "../../../config/lib/utils.ts";
import { Search, X } from "lucide-react";

export type CustomInputProps = React.InputHTMLAttributes<HTMLInputElement>

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(({ className, type, ...props }, ref) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleClear = () => {
    if(inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
    props.onChange?.({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="">
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded border border-primary focus:border-none bg-background pl-10 pr-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={(node) => {
          if (inputRef) inputRef.current = node;
          if(typeof ref === "function") {
            ref(node);
          } else if(ref) {
            ref.current = node;
          }
        }}
        value={props.value}
        onChange={props.onChange}
        {...props}
      />
      <div className="absolute top-2.5 left-3 flex items-center pointer-events-none">
        {props.value ? (
          <X className="h-5 w-5 text-gray-400 cursor-pointer pointer-events-auto" onClick={handleClear} />
        ) : (
          <Search className="h-5 w-5 text-gray-400" />
        )}
      </div>
    </div>
  );
});
CustomInput.displayName = "CustomInput";

export { CustomInput };

