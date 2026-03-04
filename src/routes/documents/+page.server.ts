import { cisoApi } from '$lib/server/ciso-api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const [evidences, policies] = await Promise.all([
			cisoApi.getEvidences(),
			cisoApi.getPolicies()
		]);

		return {
			connected: true,
			evidences: evidences.map((e) => ({
				id: e.id,
				name: e.name,
				description: e.description || '',
				hasAttachment: !!e.attachment
			})),
			policies: policies.map((p) => ({
				id: p.id,
				name: p.name,
				description: p.description,
				status: p.status || 'active'
			}))
		};
	} catch (error) {
		console.error('Failed to load documents data:', error);
		return { connected: false, evidences: [], policies: [] };
	}
};
