import * as React from "react"
import { cn } from "@/lib/utils"

const Alert = React.forwardRef(({ className, variant, ...props }, ref) => {
  const variantClasses = {
    default: "bg-background text-foreground border-gray-200",
    destructive: "border-red-500/50 text-red-900 bg-red-50 [&>svg]:text-red-600",
  }

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-4",
        "[&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px]",
        "[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
        variantClasses[variant || "default"],
        className
      )}
      {...props}
    />
  )
})
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }