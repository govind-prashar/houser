"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      closeButton
      toastOptions={{
        classNames: {
          toast: "group toast !bg-[#FBF8F5] !opacity-100 !text-[#222225] !border-[#B65A2A] !border-solid !shadow-xl !pr-14 font-sans",
          description: "!text-[#222225]/80",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
          closeButton: "!absolute !right-2 !top-2 !bg-[#E5E5E5] !text-[#222225] !opacity-100 !border !border-[#B65A2A]/20 !p-1 hover:!bg-[#B65A2A]/20 rounded-full transition-colors [&>svg]:!opacity-100 [&>svg]:!stroke-2"
        },
        style: {
          background: '#FBF8F5',
          border: '1px solid #B65A2A',
          color: '#222225',
        }
      }}
      icons={{
        success: <CircleCheckIcon className="size-4 text-green-600" />,
        info: <InfoIcon className="size-4 text-blue-600" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-600" />,
        error: <></>,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      {...props}
    />
  )
}

export { Toaster }
