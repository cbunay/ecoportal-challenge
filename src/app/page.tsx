import { paths } from "@/lib/calendar-paths";
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect(paths.home());
}
