# svelte-animations (playground)

A SvelteKit 2 + Svelte 5 + TypeScript + Tailwind project, scaffolded as a valid install
target for the **SikandarJODD/animations** component library (see the `svelte-animations`
skill). Static adapter (`@sveltejs/adapter-static`), so it can deploy alongside the other
static sites in this repo.

## Run

```bash
cd apps/svelte-animations
npm install     # node_modules is gitignored
npm run dev     # http://localhost:5173
npm run build   # static output
```

## Add animation components

Components install from the registry via the shadcn-svelte CLI. Copy the exact `add` URL
for each component from https://sv-animations.vercel.app (don't guess the path):

```bash
npx shadcn-svelte@latest add <component-registry-url-from-sv-animations.vercel.app>
```

`motion-sv` (the motion library the components build on) is already a dependency.

## Status

Bare, ready-to-use scaffold — no components added yet, because which ones depends on what
you're building. Add them on demand with the command above. See
`.agents/skills/svelte-animations/SKILL.md` for the catalog (Aceternity / Magic / Luxe UI
ports: Text Animate, Pixel Image, Dither Shader, Ripple Button, Vanish Input, etc.).

---

Scaffolded with `npx sv create` (Svelte CLI). To recreate:

```sh
npx sv create apps/svelte-animations --template minimal --types ts \
  --add tailwindcss="plugins:none" sveltekit-adapter="adapter:static" --install npm
```
