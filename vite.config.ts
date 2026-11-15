import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { wedding } from './src/config/wedding';

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Writes title, description and social-sharing tags from src/config/wedding.ts into index.html. */
function weddingMeta(): Plugin {
  return {
    name: 'wedding-meta',
    transformIndexHtml(html) {
      const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
      const base = (wedding.site.url || (vercelHost ? `https://${vercelHost}` : '')).replace(/\/$/, '');
      const abs = (path: string) => (base ? base + path : path);
      const { title, description, shareImage } = wedding.site;
      const tags = [
        `<title>${escapeHtml(title)}</title>`,
        `<meta name="description" content="${escapeHtml(description)}" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:title" content="${escapeHtml(title)}" />`,
        `<meta property="og:description" content="${escapeHtml(description)}" />`,
        `<meta property="og:image" content="${escapeHtml(abs(shareImage))}" />`,
        `<meta property="og:image:width" content="1200" />`,
        `<meta property="og:image:height" content="630" />`,
        base ? `<meta property="og:url" content="${escapeHtml(base + '/')}" />` : '',
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
        `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
        `<meta name="twitter:image" content="${escapeHtml(abs(shareImage))}" />`,
      ].filter(Boolean);
      return html.replace('<!-- wedding-meta -->', tags.join('\n    '));
    },
  };
}

export default defineConfig({
  plugins: [react(), weddingMeta()],
});
