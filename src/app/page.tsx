import { getCurrentUser } from "@/lib/auth";
import { ArrowRight, BarChart3, CheckCircle, IndianRupee, Shield, Sparkles, TrendingDown, Zap } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="relative overflow-hidden bg-[radial-gradient(1200px_600px_at_10%_-10%,#dbeafe_0%,transparent_60%),radial-gradient(1000px_500px_at_90%_10%,#bfdbfe_0%,transparent_55%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-6 py-20 sm:py-24 lg:px-10">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-blue-700">
              <Sparkles className="h-4 w-4" />
              Modern expense intelligence
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Build a clearer money story with every spend
              <span className="mt-3 block text-blue-700">Real-time insights. Zero spreadsheet chaos.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Track expenses, visualize cash flow, and spot trends instantly. Stay organized with smart categories and a timeline that keeps every receipt accountable.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-500"
              >
                Start free today
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:text-slate-900"
              >
                Sign in to your workspace
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                Export-ready reports
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Monthly snapshot</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">₹48,520</p>
                  <p className="mt-1 text-sm text-blue-600">Down 12% from last month</p>
                </div>
                <div className="rounded-2xl bg-blue-50 p-4">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <IndianRupee className="h-5 w-5 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Housing</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">₹18,200</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <TrendingDown className="h-5 w-5 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Lifestyle</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">₹9,860</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Subscriptions</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">₹3,200</span>
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-blue-700" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800">Bank-grade encryption</p>
                    <p className="text-xs text-blue-700">Your data stays private and secure.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-10 -left-10 hidden w-40 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl lg:block">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">This week</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">₹9,240</p>
              <p className="text-xs text-blue-600">3 categories trending down</p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-6 rounded-3xl border border-slate-200 bg-white/70 p-6 text-sm text-slate-600 shadow-sm sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            Auto-categorize spend in seconds
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            Multi-device sync with instant refresh
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            Export-ready summaries for tax season
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Why teams upgrade</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">A complete command center for every expense</h2>
              <p className="mt-4 text-lg text-slate-600">Reduce the time spent reconciling receipts and redirect your focus to better financial decisions.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-blue-100 p-3">
                    <IndianRupee className="h-5 w-5 text-blue-700" />
                  </div>
                  <p className="text-lg font-semibold text-slate-900">Smart tracking</p>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">Log expenses instantly with labels that remember every vendor and category.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-sky-100 p-3">
                    <BarChart3 className="h-5 w-5 text-sky-700" />
                  </div>
                  <p className="text-lg font-semibold text-slate-900">Insightful reports</p>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">Visualize trends with crisp charts that reveal where budgets are drifting.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-blue-100 p-3">
                    <TrendingDown className="h-5 w-5 text-blue-700" />
                  </div>
                  <p className="text-lg font-semibold text-slate-900">Trend alerts</p>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">Flag unusual spikes instantly and tighten spending before month-end.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-slate-200 p-3">
                    <Shield className="h-5 w-5 text-slate-700" />
                  </div>
                  <p className="text-lg font-semibold text-slate-900">Privacy first</p>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">You control access with encrypted storage and secure sessions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 px-6 py-20 text-white sm:py-24 lg:px-10">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Built for momentum</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Move from capture to clarity in minutes</h2>
            <p className="mt-4 text-lg text-slate-300">Every action is designed to keep you in flow: scan, categorize, review, and export without switching tools.</p>
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                <p className="text-sm text-slate-300">Quick entry forms for one-tap expense capture.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                <p className="text-sm text-slate-300">Live dashboards that update as you log spend.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                <p className="text-sm text-slate-300">Shareable exports for advisors and finance teams.</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <p className="text-sm font-semibold text-slate-200">Weekly pulse</p>
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300">Healthy spend</span>
            </div>
            <div className="mt-6 space-y-5">
              {[
                { label: "Food & Travel", value: "₹4,200", pct: "68%" },
                { label: "Tools & Apps", value: "₹1,450", pct: "42%" },
                { label: "Bills", value: "₹2,090", pct: "55%" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="font-semibold text-white">{item.value}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-800">
                    <div className="h-2 rounded-full bg-blue-400" style={{ width: item.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 px-6 py-20 text-white sm:py-24 lg:px-10">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">Bring clarity to every rupee</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">Join teams that replaced messy spreadsheets with a workspace that feels effortless and polished.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 text-sm font-semibold text-blue-700 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-blue-50"
            >
              Create your free account
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-6 py-4 text-sm font-semibold text-white transition-all hover:border-white"
            >
              Already have an account?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
