import { cookies } from "next/headers";
import Portfolio from "./portfolio";
export default async function Page() {
  return <Portfolio initialLanguage={(await cookies()).get("portfolio-language")?.value === "ar" ? "ar" : "en"} />;
}
