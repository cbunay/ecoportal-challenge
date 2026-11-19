import { connection } from "next/server";
import { formatToolbarDate } from "@/lib/format-toolbar-date";

export async function CurrentMonth() {
  await connection();
  return formatToolbarDate(new Date());
}
