import { UploadForm } from "../../components/upload-form/upload-form";

// Static export friendly — no runtime data fetching here.
export const dynamic = "force-static";

export const metadata = {
  title: "New video · STARLIGHTMIX Studio",
};

export default function NewPage() {
  return (
    <main className="min-h-screen w-full px-4 py-8 sm:px-6 sm:py-12 bg-starlightmix-bg">
      <div className="mx-auto w-full max-w-xl">
        <header className="mb-8">
          <h1 className="font-starlightmix-display text-3xl font-black tracking-tight text-starlightmix-text sm:text-4xl">
            New video
          </h1>
          <p className="mt-2 text-sm text-starlightmix-text-soft">
            Drop your track and describe the look. Everything stays on your
            device.
          </p>
        </header>
        <UploadForm />
      </div>
    </main>
  );
}
