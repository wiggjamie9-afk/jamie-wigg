import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Ticker } from "@/components/Ticker";
import { HowItWorks } from "@/components/HowItWorks";
import { LiveTrends } from "@/components/LiveTrends";
import { TruthFilter } from "@/components/TruthFilter";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function Page() {
  return (
    <main className="relative min-h-screen">
      <Nav />
      <Hero />
      <Ticker />
      <HowItWorks />
      <LiveTrends />
      <TruthFilter />
      <CTA />
      <Footer />
    </main>
  );
}
