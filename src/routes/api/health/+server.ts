import { cisoApi } from '$lib/server/ciso-api';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const healthy = await cisoApi.healthCheck();
	return json(
		{
			status: healthy ? 'ok' : 'error',
			cisoAssistant: healthy ? 'connected' : 'unreachable',
			timestamp: new Date().toISOString()
		},
		{ status: healthy ? 200 : 503 }
	);
};
