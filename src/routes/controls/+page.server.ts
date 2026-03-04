import { cisoApi } from '$lib/server/ciso-api';
import { computeControlStats } from '$lib/utils/transform';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const [appliedControls, policies] = await Promise.all([
			cisoApi.getAppliedControls(),
			cisoApi.getPolicies()
		]);

		const stats = computeControlStats(appliedControls);

		const controlsByCategory = new Map<string, typeof appliedControls>();
		for (const control of appliedControls) {
			const category = control.category || 'Other';
			if (!controlsByCategory.has(category)) controlsByCategory.set(category, []);
			controlsByCategory.get(category)!.push(control);
		}

		const categories = Array.from(controlsByCategory.entries())
			.map(([name, controls]) => ({
				name,
				controls: controls.sort((a, b) => a.name.localeCompare(b.name))
			}))
			.sort((a, b) => a.name.localeCompare(b.name));

		return {
			connected: true,
			stats,
			categories,
			policies: policies.map((p) => ({
				id: p.id,
				name: p.name,
				description: p.description,
				status: p.status || 'active'
			}))
		};
	} catch (error) {
		console.error('Failed to load controls data:', error);
		return { connected: false, stats: null, categories: [], policies: [] };
	}
};
