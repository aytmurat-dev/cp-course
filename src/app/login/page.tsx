import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Kirish" };

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(user.role === "admin" ? "/admin" : "/topics");

  return (
    <>
      <Header user={null} />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <h1 className="text-center text-3xl font-extrabold">
            <span className="text-gradient">Kirish</span>
          </h1>
          <p className="mt-2 text-center text-sm text-muted">
            Login va parolni kurs administratoridan oling.
          </p>
          <LoginForm />
        </div>
      </main>
    </>
  );
}
