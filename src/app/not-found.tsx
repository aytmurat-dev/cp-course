import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <p className="text-6xl font-extrabold">
        <span className="text-gradient">404</span>
      </p>
      <p className="text-muted">Sahifa topilmadi.</p>
      <Link href="/" className="font-semibold text-accent hover:underline">
        Bosh sahifaga qaytish
      </Link>
    </main>
  );
}
