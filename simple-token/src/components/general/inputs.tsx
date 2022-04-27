import type { UseFormRegister } from "react-hook-form";
import { combineClassNames } from "../../utils/html";

export function Input({
  register,
  fieldName,
  fieldType,
  errors,
  className,
}: {
  register: UseFormRegister<Record<string, any>>;
  fieldName: string;
  fieldType: string;
  errors?: { [x: string]: any };
  className?: string;
}) {
  return (
    <>
      <input
        {...register(fieldName)}
        id={fieldName}
        name={fieldName}
        type={fieldType}
        autoComplete={fieldName}
        className={combineClassNames(
          "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm",
          className,
          errors[fieldName]?.message ? "error" : ""
        )}
      />

      {errors[fieldName]?.message ? (
        <span className="flex items-center font-medium text-red-500 text-xs mt-1">
          {errors[fieldName].message}
        </span>
      ) : null}
    </>
  );
}
