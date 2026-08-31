import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete("web_session", { path: "/" });
  return redirect("/login");
};