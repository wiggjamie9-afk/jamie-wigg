import { UploadForm } from "../../components/upload-form/upload-form";

// Static export friendly — no runtime data fetching here.
export const dynamic = "force-static";

export const metadata = {
  title: "Podcasts · STARLIGHTMIX Studio",
};

export default function PodcastsPage() {
  return (
    <main className="min-h-screen w-full px-4 py-8 sm:px-6 sm:py-12 bg-starlightmix-bg">
      <div className="mx-auto w-full max-w-xl">
        <header className="mb-8">
          <p className="mb-2 font-starlightmix-mono text-xs uppercase tracking-[0.3em] text-starlightmix-cyan">
            Podcasts
          </p>
          <h1 className="font-starlightmix-display text-3xl font-black tracking-tight text-starlightmix-text sm:text-4xl">
            Turn an episode into video
          </h1>
          <p className="mt-2 text-sm text-starlightmix-text-soft">
            Drop a spoken episode and describe the backdrop. We build an
            audiogram — animated waveform over your cover art. Everything stays
            on your device.
          </p>
        </header>
        <UploadForm variant="podcast" />
      </div>
    </main>
  );
}
