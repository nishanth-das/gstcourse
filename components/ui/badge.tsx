import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "error"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  let variantStyles = ""
  switch (variant) {
    case "default":
      variantStyles = "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
      break
    case "secondary":
      variantStyles = "bg-[var(--color-surface)] text-[var(--color-text-dark)] hover:bg-gray-200"
      break
    case "outline":
      variantStyles = "text-[var(--color-text-dark)] border border-gray-300"
      break
    case "success":
      variantStyles = "bg-[var(--color-success)] text-white"
      break
    case "error":
      variantStyles = "bg-[var(--color-error)] text-white"
      break
  }

  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variantStyles} ${className || ""}`}
      {...props}
    />
  )
}

export { Badge }
