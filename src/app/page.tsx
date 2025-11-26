import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
        Creative Autopilot
      </h1>
      <p className="text-slate-300 max-w-xl text-center mb-8">
        Fully autonomous AI system that designs, validates and optimizes retail creatives end-to-end.
      </p>
      <Link
        href="/studio"
        className="px-6 py-3 rounded-xl bg-violet-500 hover:bg-violet-600 transition"
      >
        Start Prototype
      </Link>
    </main>
  );
}
