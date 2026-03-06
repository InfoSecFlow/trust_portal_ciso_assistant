import type { Handle } from '@sveltejs/kit';

const EDGE_TTL = 300;
const SWR_TTL = 60;

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	const { pathname } = event.url;

	if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
		response.headers.set('Cache-Control', 'private, no-store');
		return response;
	}

	if (pathname.startsWith('/api/')) {
		return response;
	}

	if (!response.headers.has('Cache-Control')) {
		response.headers.set(
			'Cache-Control',
			`public, s-maxage=${EDGE_TTL}, stale-while-revalidate=${SWR_TTL}`
		);
	}

	return response;
};
