import { getExpenses } from "@/app/actions/expense-actions";
import { getCurrentUserId } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";
import { BarChart3, Calendar, TrendingUp, IndianRupee } from "lucide-react";
import { CategoryBarChart } from "@/components/charts/CategoryBarChart";
import { Suspense } from "react";

async function ReportsContent({ userId }: { userId: string }) {
  const expenses = await getExpenses(userId);

  const categoryTotals = expenses.reduce(
    (acc, exp) => {
      acc[exp.category] = {
        total: (acc[exp.category]?.total || 0) + exp.amount,
        count: (acc[exp.category]?.count || 0) + 1,
      };
      return acc;
    },
    {} as Record<string, { total: number; count: number }>,
  );

  const monthlyTotals = expenses.reduce(
    (acc, exp) => {
      const date = new Date(exp.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const monthLabel = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });

      if (!acc[monthKey]) {
        acc[monthKey] = { label: monthLabel, total: 0, count: 0 };
      }

      acc[monthKey].total += exp.amount;
      acc[monthKey].count += 1;
      return acc;
    },
    {} as Record<string, { label: string; total: number; count: number }>,
  );

  const sortedMonths = Object.entries(monthlyTotals).sort(([a], [b]) => b.localeCompare(a));

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const maxCategoryAmount = Math.max(...Object.values(categoryTotals).map((c) => c.total), 1);

  const barChartData = Object.entries(categoryTotals).map(([category, data]) => ({
    category,
    amount: data.total,
    count: data.count,
  }));

  return (
    <>
      {expenses.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-200">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No data to display</h3>
          <p className="mt-1 text-sm text-gray-500">Start tracking expenses to see your spending reports.</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="rounded-lg bg-blue-100 p-3">
                      <IndianRupee className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">Total Spent</dt>
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
                      <BarChart3 className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">Categories</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">{Object.keys(categoryTotals).length}</dd>
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
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">This Month</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">₹{sortedMonths[0]?.[1]?.total.toFixed(2) || "0.00"}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Chart */}
          <div className="mt-8 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Category-wise Spending</h2>
              </div>
              <p className="text-sm text-gray-500 mb-6">Comparison of expenses across all categories</p>
              <CategoryBarChart data={barChartData} />
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="mt-8 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900">Detailed Breakdown</h2>
              <p className="mt-1 text-sm text-gray-500 mb-6">Spending amount and percentage by category</p>

              <div className="space-y-4">
                {CATEGORIES.map((category) => {
                  const data = categoryTotals[category] || { total: 0, count: 0 };
                  const percentage = totalAmount > 0 ? (data.total / totalAmount) * 100 : 0;
                  const barWidth = maxCategoryAmount > 0 ? (data.total / maxCategoryAmount) * 100 : 0;

                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="font-medium text-gray-900">{category}</span>
                        <span className="text-gray-500">
                          {data.count} expense{data.count !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="h-8 w-full overflow-hidden rounded-lg bg-gray-100">
                            <div className="h-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500" style={{ width: `${barWidth}%` }} />
                          </div>
                        </div>
                        <div className="flex min-w-[140px] items-baseline gap-2">
                          <span className="text-lg font-bold text-gray-900">₹{data.total.toFixed(2)}</span>
                          <span className="text-sm text-gray-500">({percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Summary */}
          <div className="mt-8 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Monthly Spending Summary</h2>
              </div>
              <p className="text-sm text-gray-500 mb-6">Track your spending trends over time</p>

              {sortedMonths.length === 0 ? (
                <p className="text-center text-sm text-gray-500 py-8">No monthly data available</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Month</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Expenses</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Amount</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Average</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {sortedMonths.map(([key, data]) => (
                        <tr key={key} className="hover:bg-gray-50 transition-colors">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{data.label}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {data.count} expense{data.count !== 1 ? "s" : ""}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-gray-900">₹{data.total.toFixed(2)}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">₹{(data.total / data.count).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default async function ReportsPage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="mt-2 text-sm text-gray-600">Analyze your spending patterns and track your expenses</p>
        </div>

        <Suspense fallback={<ReportsSkeleton />}>
          <ReportsContent userId={userId} />
        </Suspense>
      </div>
    </div>
  );
}

function ReportsSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
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
      <div className="mt-8 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        <div className="p-6">
          <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
          <div className="mt-6 h-[300px] animate-pulse rounded bg-gray-100" />
        </div>
      </div>
    </>
  );
}
