"use client";

import { ExpenseFormState } from "@/app/actions/expense-actions";
import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

type ExpenseFormProps = {
  action: (prevState: ExpenseFormState, formData: FormData) => Promise<ExpenseFormState>;
  defaultValues?: {
    title: string;
    amount: number;
    category: string;
    description?: string | null;
  };
  submitLabel: string;
};

export function ExpenseForm({ action, defaultValues, submitLabel }: ExpenseFormProps) {
  const initialState: ExpenseFormState = { errors: {}, message: undefined };
  const [state, formAction] = useActionState(action, initialState);

  useEffect(() => {
    if (state.message) {
      toast.error(state.message);
    }
  }, [state.message]);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          defaultValue={defaultValues?.title}
          className="text-gray-700 mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          aria-describedby="title-error"
        />
        {state.errors?.title && (
          <div id="title-error" className="mt-1 text-sm text-red-600">
            {state.errors.title.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <input
          type="number"
          name="amount"
          id="amount"
          step="0.01"
          min="0"
          defaultValue={defaultValues?.amount}
          className="text-gray-700 mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          aria-describedby="amount-error"
        />
        {state.errors?.amount && (
          <div id="amount-error" className="mt-1 text-sm text-red-600">
            {state.errors.amount.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          name="category"
          id="category"
          defaultValue={defaultValues?.category}
          className="text-gray-700 mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          aria-describedby="category-error"
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {state.errors?.category && (
          <div id="category-error" className="mt-1 text-sm text-red-600">
            {state.errors.category.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description (Optional)
        </label>
        <textarea
          name="description"
          id="description"
          rows={3}
          defaultValue={defaultValues?.description || ""}
          className="text-gray-700 mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          aria-describedby="description-error"
        />
        {state.errors?.description && (
          <div id="description-error" className="mt-1 text-sm text-red-600">
            {state.errors.description.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          {submitLabel}
        </button>
        <Link
          href="/expenses"
          className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
