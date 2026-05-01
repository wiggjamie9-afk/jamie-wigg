import { useState } from "react";
import { useQuery, getAmazonVideos } from "wasp/client/operations";

export default function AmazonVideosPage() {
  const [asinInput, setAsinInput] = useState("B072MQ5BRX");
  const [asin, setAsin] = useState<string | null>(null);

  const { data: videos, isFetching, error } = useQuery(
    getAmazonVideos,
    { asin: asin ?? "" },
    { enabled: asin !== null },
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAsin(asinInput.trim().toUpperCase());
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold">Amazon Product Videos</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Fetches the videos block from an Amazon product detail page via SerpApi.
      </p>

      <form onSubmit={onSubmit} className="mt-6 flex gap-2">
        <input
          value={asinInput}
          onChange={(e) => setAsinInput(e.target.value)}
          placeholder="ASIN (e.g. B072MQ5BRX)"
          className="flex-1 rounded border px-3 py-2"
        />
        <button
          type="submit"
          className="rounded bg-yellow-400 px-4 py-2 font-semibold hover:bg-yellow-500"
        >
          Fetch
        </button>
      </form>

      {isFetching && <p className="mt-6">Loading…</p>}
      {error && <p className="mt-6 text-red-600">{error.message}</p>}

      {videos && videos.length === 0 && (
        <p className="mt-6">No videos found for {asin}.</p>
      )}

      {videos && videos.length > 0 && (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2">
          {videos.map((v) => (
            <li key={v.position} className="rounded border p-4">
              <a href={v.link} target="_blank" rel="noopener noreferrer">
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="aspect-video w-full rounded object-cover"
                />
              </a>
              <h3 className="mt-3 font-semibold">{v.title}</h3>
              <p className="text-sm text-muted-foreground">
                {v.vendor} • {v.duration} • {v.date}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
