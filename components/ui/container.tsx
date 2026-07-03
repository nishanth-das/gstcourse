import * as React from "react"

const Container = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8 ${className || ""}`}
      {...props}
    />
  )
)
Container.displayName = "Container"

export { Container }
