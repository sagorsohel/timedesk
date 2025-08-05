import { Card, CardContent } from "@/components/ui/card"
import clsx from "clsx"

type SummaryCardProps = {
  label: string
  value: string
}

export function SummaryCard({ label, value }: SummaryCardProps) {
  const bgColor = clsx({
    "bg-red-100 text-red-600": label.toLowerCase().includes("remaining"),
    "bg-green-100 text-green-700": label.toLowerCase().includes("done"),
    "": label.toLowerCase().includes("total"),
  })

  return (
    <Card className={clsx("rounded-2xl shadow-md", bgColor)}>
      <CardContent className="p-6 flex flex-col items-center justify-center text-center">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-xl font-semibold">{value}</span>
      </CardContent>
    </Card>
  )
}
