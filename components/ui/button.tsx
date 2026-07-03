import * as React from "react"


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    let baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50"
    
    let variantStyles = ""
    switch (variant) {
      case "default":
        variantStyles = "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] shadow"
        break
      case "secondary":
        variantStyles = "bg-[var(--color-surface)] text-[var(--color-text-dark)] hover:bg-gray-200"
        break
      case "outline":
        variantStyles = "border border-gray-300 bg-transparent hover:bg-[var(--color-surface)] text-[var(--color-text-dark)]"
        break
      case "ghost":
        variantStyles = "hover:bg-[var(--color-surface)] text-[var(--color-text-dark)]"
        break
    }

    let sizeStyles = ""
    switch (size) {
      case "default":
        sizeStyles = "h-9 px-4 py-2"
        break
      case "sm":
        sizeStyles = "h-8 rounded-md px-3 text-xs"
        break
      case "lg":
        sizeStyles = "h-10 rounded-md px-8"
        break
    }

    return (
      <button
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className || ""}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
