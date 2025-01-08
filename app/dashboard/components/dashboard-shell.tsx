export function DashboardShell({
  children,
//   className,
//   ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      {children}
    </div>
  )
}

