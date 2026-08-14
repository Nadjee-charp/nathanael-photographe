import { SITE } from './site';

// Prefixe les chemins internes avec la base de deploiement.
// En local et sur nathanaelcharpentier.com : base '/' -> u('/portrait/') === '/portrait/'
// Sur GitHub Pages (demo) : BASE_PATH=/nathanael-photographe -> '/nathanael-photographe/portrait/'
export function u(chemin: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base + chemin;
}

/** true quand le build cible la demo GitHub Pages (BASE_PATH defini). */
export const estDemo = import.meta.env.BASE_URL.replace(/\/$/, '') !== '';

/**
 * Origine absolue du deploiement courant.
 * [T-04] Sur la demo on reste sur github.io : pas de canonical ni d'og:image
 * pointant vers un domaine qui ne repond pas encore.
 */
export const origine = estDemo ? 'https://nadjee-charp.github.io' : SITE.url;

/** URL absolue d'un chemin interne — pour canonical, hreflang et og:image. */
export function abs(chemin: string): string {
  return origine + u(chemin);
}
