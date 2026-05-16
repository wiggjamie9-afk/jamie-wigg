import { LibraryGrid } from "../../components/library-grid/library-grid";

// Static export friendly — the actual data fetch (IndexedDB) happens
// client-side inside <LibraryGrid />.
export const dynamic = "force-static";

export const metadata = {
  title: "Library · RHYTHMIX Studio",
};

export default function LibraryPage() {
  return (
    <main className="min-h-screen w-full px-4 py-8 sm:px-6 sm:py-12 bg-rhythmix-bg">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8">
          <h1 className="font-rhythmix-display text-3xl font-black tracking-tight text-rhythmix-text sm:text-4xl">
            Library
          </h1>
          <p className="mt-2 text-sm text-rhythmix-text-soft">
            Your past renders, kept on this device. Up to 50 most-recent — the
            oldest is auto-removed when you cross the limit.
          </p>
        </header>
        <LibraryGrid />
      </div>
    </main>
  );
}
