import { useMemo } from "react";
import { useForm, UseFormProps, UseFormReturn } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AnyObjectSchema } from "yup";
import { merge } from "@cardboardrobots/merge";

export type UseYupFormReturn<
  TSchema extends Record<string, any>,
  TContext extends Record<string, any> = Record<string, any>,
> = UseFormReturn<TSchema, TContext>;

export const useYupForm = <
  TSchema extends AnyObjectSchema,
  TContext extends Record<string, any> = Record<string, any>,
>(
  schema: TSchema,
  {
    defaultValues = {} as any,
    ...options
  }: UseFormProps<ReturnType<TSchema["validateSync"]>, TContext> = {},
) => {
  const schemaDefault = schema.getDefault();
  const merged = useMemo(() => {
    return merge(defaultValues, schemaDefault);
  }, [defaultValues, schemaDefault]);
  return useForm<ReturnType<TSchema["validateSync"]>, TContext>({
    defaultValues: merged,
    resolver: yupResolver(schema),
    ...options,
  });
};
