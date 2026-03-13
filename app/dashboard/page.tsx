import { redirect } from "next/navigation"

// Legacy /dashboard route — redirect to new /office
export default function DashboardPage() {
  redirect("/office")
}
