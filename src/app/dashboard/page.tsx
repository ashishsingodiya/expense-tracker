import { getExpenses } from "@/app/actions/expense-actions";
import { CategoryChart } from "@/components/charts/CategoryChart";
import { TrendChart } from "@/components/charts/TrendChart";
import { getCurrentUserId } from "@/lib/auth";
import { IndianRupee, Plus, Receipt, TrendingUp } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function DashboardContent({ userId }: { userId: string }) {
  const expenses = await getExpenses(userId);
  const recentExpenses = expenses.slice(0, 5);
  const totalExpenses = expenses.length;
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categoryTotals = expenses.reduce(
    (acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    },
    {} as Record<string, number>,
  );

  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const categoryChartData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  const monthlyData = expenses.reduce(
    (acc, exp) => {
      const date = new Date(exp.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      acc[monthKey] = (acc[monthKey] || 0) + exp.amount;
      return acc;
    },
    {} as Record<string, number>,
  );

  const trendChartData = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, amount]) => {
      const [year, monthNum] = month.split("-");
      const date = new Date(parseInt(year), parseInt(monthNum) - 1);
      return {
        month: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        amount,
      };
    });

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-lg bg-blue-100 p-3">
                  <Receipt className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Total Expenses</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{totalExpenses}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-lg bg-green-100 p-3">
                  <IndianRupee className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Total Amount</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">₹{totalAmount.toFixed(2)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-lg bg-purple-100 p-3">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Average Expense</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">₹{totalExpenses > 0 ? (totalAmount / totalExpenses).toFixed(2) : "0.00"}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900">Category Breakdown</h2>
            <p className="mt-1 text-sm text-gray-500">Distribution of expenses by category</p>
            <div className="mt-4">
              <CategoryChart data={categoryChartData} />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900">Spending Trend</h2>
            <p className="mt-1 text-sm text-gray-500">Last 6 months spending overview</p>
            <div className="mt-4">
              <TrendChart data={trendChartData} />
            </div>
          </div>
        </div>
      </div>

      {topCategories.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Top Spending Categories</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {topCategories.map(([category, amount], index) => (
              <div key={category} className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-all duration-200 hover:scale-105">
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          index === 0 ? "bg-yellow-100 text-yellow-800" : index === 1 ? "bg-gray-100 text-gray-800" : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        #{index + 1}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{category}</p>
                        <p className="text-2xl font-bold text-gray-900">₹{amount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Expenses</h2>
          <Link href="/expenses" className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-500 sm:mt-0">
            View all →
          </Link>
        </div>

        {recentExpenses.length === 0 ? (
          <div className="mt-4 rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-200">
            <IndianRupee className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No expenses yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first expense.</p>
            <div className="mt-6">
              <Link
                href="/expenses/new"
                className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
              >
                Add Expense
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <ul className="divide-y divide-gray-200">
              {recentExpenses.map((expense) => (
                <li key={expense.id} className="transition-colors hover:bg-gray-50">
                  <Link href={`/expenses/${expense.id}`} className="block">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="truncate text-sm font-medium text-blue-600">{expense.title}</p>
                          <p className="mt-1 text-sm text-gray-500">{expense.description || "No description"}</p>
                        </div>
                        <div className="ml-4 flex flex-shrink-0 items-center">
                          <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">{expense.category}</span>
                          <span className="ml-4 text-lg font-bold text-gray-900">₹{expense.amount.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">
                          {new Date(expense.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default async function DashboardPage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">Overview of your expenses and spending</p>
          </div>

          <div>
            <Link
              href="/expenses/new"
              className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              Add New Expense
            </Link>
          </div>
        </div>

        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent userId={userId} />
        </Suspense>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-200" />
                <div className="ml-5 flex-1 space-y-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                  <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="p-6">
              <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
              <div className="mt-4 h-[300px] animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
