import { ExpenseForm } from "@/components/ExpenseForm";
import { createExpense } from "@/app/actions/expense-actions";
import { getCurrentUserId } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";

export default async function NewExpensePage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  const createExpenseWithUserId = createExpense.bind(null, userId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 p-2 shadow-md">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Expense</h1>
              <p className="mt-1 text-sm text-gray-600">Fill in the details below to track your expense</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
          <ExpenseForm action={createExpenseWithUserId} submitLabel="Create Expense" />
        </div>
      </div>
    </div>
  );
}
