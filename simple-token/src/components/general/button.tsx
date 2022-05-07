export function Button({
  onClick,
  className,
  type,
  text,
  isDisabled,
  disabledText,
}: {
  onClick?: () => void;
  className?: string;
  type: "button" | "submit" | "reset";
  text: string;
  isDisabled?: boolean;
  disabledText?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex justify-center py-2 px-4 shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
      disabled={isDisabled}
    >
      {isDisabled && disabledText ? disabledText : text}
    </button>
  );
}
