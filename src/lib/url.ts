// Prefixe les chemins internes avec la base de deploiement.
// En local et sur nathanaelcharpentier.com : base '/' -> u('/portrait/') === '/portrait/'
// Sur GitHub Pages (demo) : BASE_PATH=/nathanael-photographe -> '/nathanael-photographe/portrait/'
export function u(chemin: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base + chemin;
}
