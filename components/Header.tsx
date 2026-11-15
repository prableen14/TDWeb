import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-black/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight"
        >
          TORONTO FINDS
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