import React, { useState } from 'react';
import { Cpu, Zap, Radio, BarChart3, Database, ShieldCheck, PlayCircle, Layers, Workflow, Settings2, Puzzle, X, ChevronLeft, ChevronRight, FileText, Scale, ShieldAlert } from 'lucide-react';

interface FrequencyAiPageProps {
  setView: (view: string) => void;
}

interface VideoItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  category: string;
  isEmbed?: boolean;
  hoverSummary?: string[];
}

export const FrequencyAiPage: React.FC<FrequencyAiPageProps> = ({ setView }) => {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const videos: VideoItem[] = [
    {
      id: 'roofing-scraper',
      title: 'Roofing Lead Scraper Demo',
      category: 'Lead Gen',
      thumbnailUrl: 'https://assets.mixkit.io/videos/preview/mixkit-house-under-construction-in-the-afternoon-42511-large.mp4',
      videoUrl: 'https://assets.mixkit.io/videos/preview/mixkit-working-on-a-digital-tablet-40400-large.mp4'
    },
    {
      id: 'logistics-scraper',
      title: 'Logistics Scraper',
      category: 'Logistics',
      thumbnailUrl: 'https://assets.mixkit.io/videos/preview/mixkit-delivery-truck-driving-on-the-highway-41121-large.mp4',
      videoUrl: 'https://www.kapwing.com/e/69462ff4ea149655f75dc95e',
      isEmbed: true
    },
    {
      id: 'slope-sniper',
      title: 'Rex: The Slope Sniper',
      category: 'Specialized Agent',
      thumbnailUrl: 'https://i.postimg.cc/GpXDD4rC/Chat-GPT-Image-Dec-19-2025-11-40-08-PM.png',
      videoUrl: 'https://www.kapwing.com/e/694635031f0586b035a651a7',
      isEmbed: true,
      hoverSummary: [
        "Reviews roof insurance claims line by line.",
        "Spots weak adjuster excuses like 'minor damage'.",
        "Enforces building codes for full coverage.",
        "Flips the power dynamic against insurers."
      ]
    }
  ];

  const isVideo = (url: string) => url.toLowerCase().endsWith('.mp4');

  return (
    <div className="pt-32 pb-24 bg-brand-dark min-h-screen">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-accent/30 bg-brand-accent/10 text-brand-300 text-xs font-bold uppercase mb-6">
            Core Technology
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-8">
            Frequency <span className="text-brand-accent">AI.</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed font-light">
            The next evolution of brand visibility. We synchronize your digital presence with high-intent market signals to eliminate advertising waste and maximize ROI.
          </p>
        </div>

        {/* Video Slideshow Section */}
        <section className="mb-32">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-display font-bold text-white mb-2">Frequency in Action</h2>
              <p className="text-slate-400">See our AI Agents and Scrapers dominating real-world markets.</p>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
            {videos.map((video) => (
              <div
                key={video.id}
                className="flex-none w-72 md:w-80 snap-start group cursor-pointer"
                onClick={() => setActiveVideo(video)}
              >
                <div className="relative aspect-[9/16] rounded-3xl overflow-hidden border border-white/10 glass-card transition-all duration-500 group-hover:border-brand-accent/50 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                  {isVideo(video.thumbnailUrl) ? (
                    <video
                      src={video.thumbnailUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
                    />
                  ) : (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
                    />
                  )}

                  {/* Hover Summary Overlay */}
                  {video.hoverSummary && (
                    <div className="absolute inset-0 bg-brand-dark/90 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 p-8 flex flex-col justify-center z-20">
                      <div className="mb-6">
                         <h4 className="text-brand-accent font-bold text-xs uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                           <ShieldAlert className="w-4 h-4" /> Agent Intelligence
                         </h4>
                         <p className="text-white font-display font-bold text-lg leading-tight">Rex the Sniper: Roofing Insurance Logic</p>
                      </div>
                      <div className="space-y-4">
                        {video.hoverSummary.map((point, idx) => (
                          <div key={idx} className="flex gap-3 items-start animate-[fadeIn_0.3s_ease-out]" style={{ animationDelay: `${idx * 100}ms` }}>
                             <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 shrink-0"></div>
                             <p className="text-xs text-slate-300 leading-relaxed">{point}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-8 pt-6 border-t border-white/10 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                        Status: Analyzing Claims...
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80"></div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-brand-accent/20 backdrop-blur-md flex items-center justify-center border border-brand-accent/40 group-hover:scale-110 group-hover:bg-brand-accent transition-all duration-300">
                      <PlayCircle className="w-8 h-8 text-white fill-current" />
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold text-brand-300 uppercase tracking-widest mb-2 border border-white/5">
                      {video.category}
                    </span>
                    <h3 className="text-lg font-display font-bold text-white group-hover:text-brand-accent transition-colors leading-tight">
                      {video.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Video Modal */}
        {activeVideo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-2xl animate-[fadeIn_0.3s_ease-out]">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-8 right-8 text-white hover:text-brand-accent transition-colors bg-white/5 p-3 rounded-full border border-white/10 z-[110]"
            >
              <X className="w-8 h-8" />
            </button>
            <div
              key={activeVideo.id}
              className="relative w-full max-w-[450px] aspect-[9/16] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black"
            >
              {activeVideo.isEmbed ? (
                <iframe
                  src={activeVideo.videoUrl}
                  className="w-full h-full border-0"
                  allow="autoplay; gyroscope;"
                  allowFullScreen
                  referrerPolicy="strict-origin"
                  title={activeVideo.title}
                />
              ) : (
                <video
                  src={activeVideo.videoUrl}
                  autoPlay
                  controls
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            {activeVideo.isEmbed && (
              <div className="absolute bottom-4 right-10 text-[10px] text-slate-500 font-mono">
                Engine powered by Kapwing
              </div>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="relative">
             <div className="absolute inset-0 bg-brand-accent/10 blur-[120px] rounded-full"></div>
             <div className="relative z-10 glass-card p-2 rounded-3xl border border-white/10">
                <div className="bg-slate-950 rounded-2xl p-8 aspect-video flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                   <div className="w-24 h-24 rounded-full border-4 border-brand-accent flex items-center justify-center text-brand-accent animate-pulse relative z-10">
                      <Zap className="w-10 h-10 fill-current" />
                   </div>
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-48 border border-brand-accent/20 rounded-full animate-[ping_4s_linear_infinite]"></div>
                      <div className="w-64 h-64 border border-brand-accent/10 rounded-full animate-[ping_4s_linear_infinite] delay-1000"></div>
                      <div className="w-80 h-80 border border-brand-accent/5 rounded-full animate-[ping_4s_linear_infinite] delay-2000"></div>
                   </div>
                </div>
             </div>
          </div>

          <div className="space-y-10 text-white">
            <div>
              <h2 className="text-3xl font-display font-bold text-white mb-4">Autonomous Lead Extraction & Workflows</h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                Most marketing agencies spray and pray. **Frequency AI** uses predictive scrapers and real-time data analysis to identify the exact moments your customers are ready to convert.
              </p>

              <div className="bg-brand-accent/5 border border-brand-accent/20 p-6 rounded-2xl mb-8">
                <h4 className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Specialized Industry Agents
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "Roofing Scrapers",
                    "Tree Cutting Specialists",
                    "Brand Company Analyzers",
                    "Gym & Fitness Scrapers",
                    "Real Estate AI Agents",
                    "Logistics Scrapers"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-accent"></div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl border border-white/5 group hover:border-brand-accent/30 transition-colors">
                  <Workflow className="w-6 h-6 text-brand-glow shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Advanced Automation & Workflows</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Our platform handles the heavy lifting with complex <strong>multi-step automation</strong>. From initial scraping to lead warming, your growth is on autopilot.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl border border-white/5 group hover:border-brand-accent/30 transition-colors">
                  <Settings2 className="w-6 h-6 text-brand-500 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Customizable Agents for Your Niche</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      No two businesses are identical. We build and offer <strong>customizable AI agents and workflows</strong> tailored specifically to the unique requirements of your industry niche.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl border border-white/5 group hover:border-brand-accent/30 transition-colors">
                  <Puzzle className="w-6 h-6 text-brand-accent shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Universal CRM Integration</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Our agents extract high-intent leads and push them directly into your <strong>CRM of choice</strong> (GoHighLevel, HubSpot, Salesforce, or Pipedrive) for instant follow-up.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              {[
                { icon: Radio, title: "Signal Analysis", desc: "We scan 1,000+ data points per second to identify buyer intent." },
                { icon: ShieldCheck, title: "Algorithmic Precision", desc: "Eliminate 40% of standard ad spend waste through hyper-targeting." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-12 h-12 shrink-0 bg-slate-900 rounded-lg flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-all">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1 font-display">{item.title}</h4>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-brand-accent/20 to-brand-500/10 rounded-3xl p-12 border border-white/10 text-center">
          <h3 className="text-3xl font-display font-bold text-white mb-6">Ready to see the engine in action?</h3>
          <p className="text-slate-300 mb-10 max-w-xl mx-auto">
            Generate your first Frequency AI audit today and see how we're transforming marketing for San Antonio's leading companies.
          </p>
          <button
            onClick={() => setView('contact')}
            className="px-10 py-5 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-2xl"
          >
            Generate Audit & Strategy
          </button>
        </div>
      </div>
    </div>
  );
};
