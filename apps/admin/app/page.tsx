import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function HomePage() {
  const sesion = await getSession();

  if (!sesion) {
    redirect("/login");
  }

  redirect("/estudiantes");
}