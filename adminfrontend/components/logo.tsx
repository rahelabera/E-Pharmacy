import { PillIcon } from "lucide-react"
import Link from "next/link"

interface LogoProps {
  size?: "small" | "medium" | "large"
  variant?: "default" | "white"
  asLink?: boolean
}

export function Logo({ size = "medium", variant = "default", asLink = true }: LogoProps) {
  const sizeClasses = {
    small: "h-5 w-5",
    medium: "h-6 w-6",
    large: "h-8 w-8",
  }

  const textClasses = {
    small: "text-lg",
    medium: "text-xl",
    large: "text-2xl",
  }

  const iconBgClass = variant === "white" ? "bg-white text-blue-500" : "bg-blue-500 text-white"
  const textColorClass = variant === "white" ? "text-white" : "text-blue-500"

  const content = (
    <>
      <div className={`${iconBgClass} p-1 rounded-md`}>
        <PillIcon className={sizeClasses[size]} />
      </div>
      <span className={`font-bold ${textColorClass} ${textClasses[size]}`}>E-Market Pharmacy</span>
    </>
  )

  if (asLink) {
    return (
      <Link href="/dashboard" className="flex items-center gap-2">
        {content}
      </Link>
    )
  }

  return <div className="flex items-center gap-2">{content}</div>
}
