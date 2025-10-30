import { URL } from 'url';

const normalizeUrl = (url: URL): string => {
  try {
    // 1️⃣ Normaliser le protocole et l’hôte
    url.protocol = url.protocol.toLowerCase();
    url.hostname = url.hostname.toLowerCase();

    // 2️⃣ Supprimer le slash final (sauf si c’est la racine)
    if (url.pathname.endsWith('/') && url.pathname !== '/') {
      url.pathname = url.pathname.slice(0, -1);
    }

    // 3️⃣ Supprimer les fragments (#section)
    url.hash = '';

    // // 4️⃣ Supprimer les paramètres inutiles (tracking, sessions, etc.)
    // const paramsToRemove = [
    //   /^utm_/,
    //   /^fbclid$/,
    //   /^gclid$/,
    //   /^mc_eid$/,
    //   /^mc_cid$/,
    //   /^ref$/,
    //   /^session/,
    //   /^trk/,
    //   /^aff/,
    //   /^campaign/
    // ];
    // for (const key of [...u.searchParams.keys()]) {
    //   if (paramsToRemove.some((rx) => rx.test(key))) {
    //     u.searchParams.delete(key);
    //   }
    // }

    // 5️⃣ Trier les paramètres restants par ordre alphabétique et les encoder correctement
    url.search = [...url.searchParams.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');

    if (url.search) url.search = '?' + url.search;

    return url.toString();
  } catch (err) {
    console.error('Error normalizing URL ', url, ': ', err);
    return url.toString();
  }
};

export { normalizeUrl };
