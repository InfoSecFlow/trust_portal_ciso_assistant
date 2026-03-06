import type { RequestHandler } from './$types';

const STATIC_PAGES = ['/', '/compliance', '/controls', '/risk', '/sub-processors', '/documents'];

export const GET: RequestHandler = async ({ url }) => {
	const origin = url.origin;
	const now = new Date().toISOString().split('T')[0];

	const urls = STATIC_PAGES.map(
		(path) => `
  <url>
    <loc>${origin}${path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${path === '/' ? '1.0' : '0.8'}</priority>
  </url>`
	).join('');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

	return new Response(xml.trim(), {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, s-maxage=3600'
		}
	});
};
