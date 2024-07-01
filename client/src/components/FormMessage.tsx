import { useFormContext } from "react-hook-form";

export function FormErrorMessage({ name }: { name: string }) {
  const formService = useFormContext();

  return (
    <>
      {formService.formState.errors?.[name] && (
        <p className="text-sm text-red-500 pt-2">
          {formService.formState.errors[name]?.message as string}
        </p>
      )}
    </>
  );
}
