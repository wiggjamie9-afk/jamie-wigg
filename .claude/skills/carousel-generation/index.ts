/**
 * Carousel Generation Skill for Claude Code
 *
 * Converts text posts → multi-platform carousel images
 * Supports: Threads, Instagram, LinkedIn PDF, TikTok, Stories, Presentation deck
 *
 * Usage:
 *   /carousel-generate "Your text here" --format=threads-4x5
 *   /carousel-generate <paste text> --surface=paper --accent=teal
 *
 * Integrates with:
 *   - threads-carousel-claude-skill (.claude/skills/threads-carousel/)
 *   - Nucleus Mary agent tool registry
 *   - Social media posting automation
 */

import { spawn } from 'child_process';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

interface CarouselConfig {
  format:
    | 'threads-4x5'
    | 'instagram-square'
    | 'linkedin-pdf'
    | 'tiktok-9x16'
    | 'stories-9x16'
    | 'wide-16x9';
  font?: 'minimal' | 'editorial' | 'clean' | 'mono' | 'condensed';
  surface?: 'dark' | 'white' | 'light' | 'paper' | 'gradient' | 'pastel' | 'neon' | 'ember';
  accent?: 'yellow' | 'red' | 'teal' | 'coral' | 'orange' | 'violet' | 'lime' | 'blue' | 'fuchsia' | 'pink' | 'amber';
  background?: 'none' | 'blobs' | 'dot-grid' | 'lines' | 'ruled-paper' | 'noise' | 'watermark' | 'glow';
}

export interface SlideConfig {
  type:
    | 'hook'
    | 'body'
    | 'list'
    | 'stats'
    | 'quote'
    | 'checklist'
    | 'process'
    | 'comparison'
    | 'cta'
    | 'image'
    | 'emoji'
    | 'number';
  text?: string;
  title?: string;
  badge?: string;
  items?: string[];
  stats?: Array<{ value: string; label: string }>;
  author?: string;
  role?: string;
  highlight?: string;
}

/**
 * Parse text post into slides
 *
 * Heuristics:
 * - First non-empty line → hook
 * - "**word**" → highlight: "word"
 * - Lines starting with "- " or "* " → list
 * - Lines with numbers → stats
 * - "Quote:" ... → quote
 * - Numbered steps → process
 */
export function parseTextToSlides(text: string): SlideConfig[] {
  const slides: SlideConfig[] = [];
  const lines = text.split('\n').filter((line) => line.trim());

  let i = 0;

  // First non-empty line = hook
  if (lines.length > 0) {
    slides.push({
      type: 'hook',
      text: lines[i].replace(/[*_]/g, ''),
    });
    i++;
  }

  // Parse remaining lines
  while (i < lines.length) {
    const line = lines[i];

    // List detection
    if (line.match(/^[-*]\s/)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^[-*]\s/)) {
        listItems.push(lines[i].replace(/^[-*]\s/, '').trim());
        i++;
      }
      slides.push({
        type: 'list',
        title: 'Key Points',
        items: listItems,
      });
      continue;
    }

    // Stats detection (lines with numbers and slashes/percentages)
    if (line.match(/\d+[%xX]\s*-\s*/)) {
      const statsItems: Array<{ value: string; label: string }> = [];
      while (
        i < lines.length &&
        lines[i].match(/^\d+[%xX]\s*-\s*/)
      ) {
        const match = lines[i].match(/^(\d+[%xX])\s*-\s*(.+)/);
        if (match) {
          statsItems.push({
            value: match[1],
            label: match[2].trim(),
          });
        }
        i++;
      }
      slides.push({
        type: 'stats',
        title: 'Impact',
        stats: statsItems,
      });
      continue;
    }

    // Quote detection
    if (line.toLowerCase().startsWith('quote:') || line.startsWith('"')) {
      const quoteText = line.replace(/^(quote:|")/i, '').trim();
      let author = '';
      if (i + 1 < lines.length && lines[i + 1].startsWith('—')) {
        author = lines[i + 1].replace('—', '').trim();
        i++;
      }
      slides.push({
        type: 'quote',
        text: quoteText,
        author: author || 'Someone',
        role: '2026',
      });
      i++;
      continue;
    }

    // Default: body slide
    slides.push({
      type: 'body',
      title: line.split(':')[0] || 'Key Point',
      text: line,
    });
    i++;
  }

  // Final CTA
  slides.push({
    type: 'cta',
    text: 'Follow for more',
    handle: '@yourhandle',
  });

  return slides;
}

/**
 * Generate carousel config and launch preview
 */
export async function generateCarousel(
  textPost: string,
  config: Partial<CarouselConfig> = {}
): Promise<{ previewUrl: string; configPath: string }> {
  const skillPath = join(__dirname, '../../skills/threads-carousel/template');

  // Parse text into slides
  const slides = parseTextToSlides(textPost);

  // Generate slides.ts content
  const slidesTs = `
import { SlideConfig, CarouselConfig } from "../src/lib/types";

export const DEFAULT_FORMAT: CarouselConfig["format"] = "${config.format || 'threads-4x5'}";
export const DEFAULT_FONT = "${config.font || 'minimal'}";
export const DEFAULT_SURFACE = "${config.surface || 'dark'}";
export const DEFAULT_ACCENT = "${config.accent || 'yellow'}";
export const DEFAULT_BG = "${config.background || 'glow'}";

export const SLIDES: SlideConfig[] = ${JSON.stringify(slides, null, 2)};
`;

  // Write slides.ts
  const slidesPath = join(skillPath, 'src/slides.ts');
  writeFileSync(slidesPath, slidesTs);

  console.log(`✓ Generated carousel with ${slides.length} slides`);
  console.log(`✓ Format: ${config.format || 'threads-4x5'}`);
  console.log(`✓ Font: ${config.font || 'minimal'}, Surface: ${config.surface || 'dark'}, Accent: ${config.accent || 'yellow'}`);

  // Launch dev server
  console.log(`\n🚀 Launching preview at http://localhost:3333...`);
  spawn('bun', ['dev', '--port', '3333'], {
    cwd: skillPath,
    stdio: 'inherit',
  });

  return {
    previewUrl: 'http://localhost:3333',
    configPath: slidesPath,
  };
}

// Export for skill invocation
export default generateCarousel;
