import { ExpenseForm } from "@/components/ExpenseForm";
import { updateExpense, getExpenseById } from "@/app/actions/expense-actions";
import { getCurrentUserId } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";

export default async function EditExpensePage({ params }: { params: Promise<{ id: string }> }) {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  const { id } = await params;
  const expense = await getExpenseById(id, userId);

  if (!expense) {
    notFound();
  }

  const updateExpenseWithId = updateExpense.bind(null, expense.id, userId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href={`/expenses/${expense.id}`} className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to expense
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 p-2 shadow-md">
              <Edit className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Expense</h1>
              <p className="mt-1 text-sm text-gray-600">Update the details of your expense</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
          <ExpenseForm
            action={updateExpenseWithId}
            defaultValues={{
              title: expense.title,
              amount: expense.amount,
              category: expense.category,
              description: expense.description,
            }}
            submitLabel="Update Expense"
          />
        </div>
      </div>
    </div>
  );
}
