import { testTimeZone } from "./src/lib/defaults";

export default function globalSetup(): void {
  process.env.TZ = testTimeZone;
}
