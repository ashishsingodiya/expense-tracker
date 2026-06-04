import { getExpenseById, deleteExpense } from "@/app/actions/expense-actions";
import { getCurrentUserId } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { DeleteButton } from "@/components/DeleteButton";
import { ArrowLeft, Edit, Calendar, Tag, FileText, IndianRupee } from "lucide-react";

export default async function ExpenseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  const { id } = await params;
  const expense = await getExpenseById(id, userId);

  if (!expense) {
    notFound();
  }

  const deleteExpenseWithId = deleteExpense.bind(null, expense.id, userId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/expenses" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to expenses
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-200">
          <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{expense.title}</h1>
                <div className="mt-2 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-semibold text-blue-800 shadow-sm">{expense.category}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <dl className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
              <div className="col-span-2">
                <dt className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <IndianRupee className="h-4 w-4" />
                  Amount
                </dt>
                <dd className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">₹{expense.amount.toFixed(2)}</span>
                </dd>
              </div>

              <div className="col-span-2">
                <dt className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <FileText className="h-4 w-4" />
                  Description
                </dt>
                <dd className="mt-2 text-sm text-gray-900">{expense.description || <span className="italic text-gray-400">No description provided</span>}</dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <Calendar className="h-4 w-4" />
                  Created At
                </dt>
                <dd className="mt-2 text-sm text-gray-900">
                  {new Date(expense.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <Calendar className="h-4 w-4" />
                  Last Updated
                </dt>
                <dd className="mt-2 text-sm text-gray-900">
                  {new Date(expense.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </dd>
              </div>
            </dl>
          </div>

          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex gap-3">
              <Link
                href={`/expenses/${expense.id}/edit`}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Link>
              <DeleteButton action={deleteExpenseWithId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
