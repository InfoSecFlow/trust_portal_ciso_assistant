import { cisoApi } from '$lib/server/ciso-api';
import { groupEntitiesByFolder } from '$lib/utils/transform';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const [entities, folders] = await Promise.all([
			cisoApi.getEntities(),
			cisoApi.getFolders()
		]);

		const groups = groupEntitiesByFolder(entities, folders);

		return {
			connected: true,
			groups,
			totalEntities: entities.length
		};
	} catch (error) {
		console.error('Failed to load entities data:', error);
		return { connected: false, groups: [], totalEntities: 0 };
	}
};
