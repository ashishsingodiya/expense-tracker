export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-6 text-slate-500 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-center text-xs sm:flex-row sm:text-left">
        <span>© {new Date().getFullYear()} Expense Tracker</span>
        <span>
          Built by{" "}
          <a href="https://ashish.pro" className="font-semibold text-slate-600 transition-colors hover:text-blue-600" target="_blank" rel="noreferrer">
            Ashish
          </a>
        </span>
      </div>
    </footer>
  );
}
