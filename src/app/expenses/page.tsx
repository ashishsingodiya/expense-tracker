import { getExpenses } from "@/app/actions/expense-actions";
import { getCurrentUserId } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { IndianRupee, Plus, Receipt } from "lucide-react";
import { Suspense } from "react";

async function ExpensesContent({ userId }: { userId: string }) {
  const expenses = await getExpenses(userId);

  return (
    <>
      {expenses.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-200">
          <Receipt className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No expenses yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new expense.</p>
          <div className="mt-6">
            <Link
              href="/expenses/new"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="h-4 w-4" />
              Add your first expense
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <ul className="divide-y divide-gray-200">
              {expenses.map((expense) => (
                <li key={expense.id}>
                  <Link href={`/expenses/${expense.id}`} className="block transition-colors hover:bg-gray-50">
                    <div className="px-6 py-5">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <p className="truncate text-base font-semibold text-gray-900">{expense.title}</p>
                            <div className="ml-4 flex flex-shrink-0">
                              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">{expense.category}</span>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500">
                              <p className="truncate">{expense.description || "No description"}</p>
                            </div>
                            <div className="ml-4 flex items-center gap-4">
                              <p className="text-sm text-gray-500">
                                {new Date(expense.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                              <div className="flex items-center gap-1">
                                <IndianRupee className="h-5 w-5 text-green-600" />
                                <p className="text-xl font-bold text-gray-900">{expense.amount.toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {expenses.length > 0 && (
            <div className="mt-6 flex items-center justify-between rounded-xl bg-white px-6 py-4 shadow-sm ring-1 ring-gray-200">
              <div className="flex flex-1 justify-between sm:hidden">
                <span className="text-sm font-medium text-gray-700">
                  Total: {expenses.length} expense{expenses.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Showing <span className="font-bold">{expenses.length}</span> expense{expenses.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-green-600" />
                  <p className="text-base font-bold text-gray-900">Total: {expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default async function ExpensesPage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
            <p className="mt-2 text-sm text-gray-600">Manage all your expenses in one place</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href="/expenses/new"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Add Expense
            </Link>
          </div>
        </div>

        <Suspense fallback={<ExpensesSkeleton />}>
          <ExpensesContent userId={userId} />
        </Suspense>
      </div>
    </div>
  );
}

function ExpensesSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
      <ul className="divide-y divide-gray-200">
        {[1, 2, 3, 4, 5].map((i) => (
          <li key={i} className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-48 animate-pulse rounded bg-gray-200" />
                  <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-4 w-64 animate-pulse rounded bg-gray-200" />
                  <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
