import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "../general/button";
import { showNotification } from "../../utils/toast";
import { combineClassNames } from "../../utils/html";

const schema = yup
  .object({
    amount: yup
      .number()
      .positive("Amount should be positive number")
      .required(),
  })
  .required();

export function WithdrawForm() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    setIsLoading(true);
    showNotification("Success Notification !", "success");

    console.log("Inputs", data);

    setIsLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4">
          <div className="">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount
            </label>
            <div className="mt-1 w-full flex rounded-md shadow-sm">
              <input
                {...register("amount")}
                type="number"
                step="0.000001"
                name="amount"
                id="amount"
                autoComplete="amount"
                min="0"
                className={combineClassNames(
                  "appearance-none flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 block w-full min-w-0 rounded-none rounded-l-md sm:text-sm border-gray-300",
                  errors["amount"]?.message ? "error" : ""
                )}
              />
              <span className="inline-flex px-3 py-2 items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                token
              </span>
            </div>
            {errors["amount"]?.message ? (
              <span className="flex items-center font-medium text-red-500 text-xs mt-1">
                {errors["amount"].message}
              </span>
            ) : null}
          </div>
          <Button
            type="submit"
            text="Withdraw"
            className="text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            isDisabled={isLoading}
            disabledText="Loading ..."
          />
        </div>
      </form>
    </>
  );
}
