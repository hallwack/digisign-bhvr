import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ ...props }, ref) => {
    const [passwordVisible, setPasswordVisible] = React.useState(false);

    function handleTogglePasswordVisibility(
      event: React.MouseEvent<HTMLButtonElement>,
    ) {
      event.preventDefault();
      setPasswordVisible((prev) => !prev);
    }

    return (
      <div className="relative w-full">
        <Input
          type={passwordVisible ? "text" : "password"}
          ref={ref}
          {...props}
        />
        <Button
          onClick={handleTogglePasswordVisibility}
          type="button"
          size="icon"
          className="absolute inset-y-0 right-0 flex items-center cursor-pointer hover:bg-transparent"
          variant="ghost"
        >
          {passwordVisible ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </Button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
