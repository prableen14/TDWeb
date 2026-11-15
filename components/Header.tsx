import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="border-b border-black/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        <Link
          href="/"
          className="flex items-center gap-3" aria-label="Toronto Discounts — Home"
        >
          <Image src="/logo_TDiscounts.png" alt="Toronto Discounts" width={64} height={64} priority className="h-14 w-14 object-contain" />
          <span className="text-lg font-extrabold tracking-tight">TORONTO DISCOUNTS</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/deals">Deals</Link>
          <Link href="/freebies">Freebies</Link>
          <Link href="/events">Events</Link>
          <Link href="/things-to-do">Things To Do</Link>
          <Link href="/food">Food</Link>
          <Link href="/for-brands" className="font-semibold">For Brands</Link>
        </nav>

        <Link href="/near-me" className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white">
          📍 Near Me
        </Link>

      </div>
    </header>
  );
}