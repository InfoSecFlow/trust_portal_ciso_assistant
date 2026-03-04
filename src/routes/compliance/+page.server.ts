import { cisoApi } from '$lib/server/ciso-api';
import { computeComplianceStats, getRequirementAssessmentCAId, resolveId } from '$lib/utils/transform';
import type { PageServerLoad } from './$types';

function settled<T>(result: PromiseSettledResult<T>, fallback: T): T {
	if (result.status === 'fulfilled') return result.value;
	console.error('[compliance] Partial fetch failed:', (result.reason as Error)?.message || result.reason);
	return fallback;
}

export const load: PageServerLoad = async () => {
	try {
		const results = await Promise.allSettled([
			cisoApi.getFrameworks(),
			cisoApi.getComplianceAssessments(),
			cisoApi.getRequirementAssessments()
		]);

		const frameworks = settled(results[0], []);
		const complianceAssessments = settled(results[1], []);
		const requirementAssessments = settled(results[2], []);

		const anySucceeded = results.some((r) => r.status === 'fulfilled');
		if (!anySucceeded) throw new Error('All API calls failed');

		const assessments = complianceAssessments.map((ca) => {
			const framework = frameworks.find((f) => f.id === ca.framework);
			const caId = String(ca.id);
			const reqAssessments = requirementAssessments.filter(
				(ra) => getRequirementAssessmentCAId(ra) === caId
			);
			const stats = computeComplianceStats(reqAssessments);

			return {
				id: ca.id,
				name: framework?.name || ca.name,
				description: framework?.description || ca.description,
				provider: framework?.provider || '',
				status: ca.status || 'in_progress',
				stats,
				totalRequirements: reqAssessments.length
			};
		});

		const loadedFrameworks = frameworks.map((f) => {
			const assessment = complianceAssessments.find((ca) => resolveId(ca.framework) === String(f.id));
			return {
				id: f.id,
				name: f.name,
				description: f.description,
				provider: f.provider || '',
				assessmentId: assessment?.id || null,
				hasAssessment: !!assessment
			};
		});

		return { assessments, loadedFrameworks, connected: true };
	} catch (error) {
		console.error('Failed to load compliance data:', error);
		return { assessments: [], loadedFrameworks: [], connected: false };
	}
};
