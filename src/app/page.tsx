import { cookies } from "next/headers";
import { HomeClient } from "@/components/HomeClient";

export default async function HomePage() {
  const cookieStore = await cookies();
  const countryCookie = cookieStore.get("user-country")?.value || "US";
  const isIndia = countryCookie === "IN";

  return <HomeClient isIndia={isIndia} />;
}