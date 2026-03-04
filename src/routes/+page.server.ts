import { cisoApi } from '$lib/server/ciso-api';
import { computeComplianceStats, computeControlStats, computeRiskStats, getRequirementAssessmentCAId, resolveId } from '$lib/utils/transform';
import type { PageServerLoad } from './$types';

function settled<T>(result: PromiseSettledResult<T>, fallback: T): T {
	if (result.status === 'fulfilled') return result.value;
	console.error('[overview] Partial fetch failed:', (result.reason as Error)?.message || result.reason);
	return fallback;
}

export const load: PageServerLoad = async () => {
	try {
		const results = await Promise.allSettled([
			cisoApi.getFrameworks(),
			cisoApi.getComplianceAssessments(),
			cisoApi.getRequirementAssessments(),
			cisoApi.getAppliedControls(),
			cisoApi.getRiskScenarios(),
			cisoApi.getPolicies(),
			cisoApi.getEntities()
		]);

		const frameworks = settled(results[0], []);
		const complianceAssessments = settled(results[1], []);
		const requirementAssessments = settled(results[2], []);
		const appliedControls = settled(results[3], []);
		const riskScenarios = settled(results[4], []);
		const policies = settled(results[5], []);
		const entities = settled(results[6], []);

		const anySucceeded = results.some((r) => r.status === 'fulfilled');
		if (!anySucceeded) {
			throw new Error('All API calls failed');
		}

		const complianceStats = computeComplianceStats(requirementAssessments);
		const controlStats = computeControlStats(appliedControls);
		const riskStats = computeRiskStats(riskScenarios);

		if (requirementAssessments.length > 0) {
			const resultValues = [...new Set(requirementAssessments.map((ra) => ra.result))];
			const statusValues = [...new Set(requirementAssessments.map((ra) => ra.status))];
			console.log(`[overview] ${requirementAssessments.length} requirement assessments — results: [${resultValues.join(', ')}], statuses: [${statusValues.join(', ')}]`);
		}

		const frameworkSummaries = complianceAssessments.map((ca) => {
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
				percentComplete: stats.percentComplete,
				stats
			};
		});

		const loadedFrameworks = frameworks.map((f) => ({
			id: f.id,
			name: f.name,
			description: f.description,
			provider: f.provider || '',
			hasAssessment: complianceAssessments.some((ca) => resolveId(ca.framework) === String(f.id))
		}));

		return {
			connected: true,
			complianceStats,
			controlStats,
			riskStats,
			frameworkSummaries,
			loadedFrameworks,
			frameworkCount: frameworks.length,
			controlCount: appliedControls.length,
			policyCount: policies.length,
			entityCount: entities.length,
			lastUpdated: new Date().toISOString()
		};
	} catch (error) {
		console.error('Failed to load overview data:', error);
		return {
			connected: false,
			complianceStats: null,
			controlStats: null,
			riskStats: null,
			frameworkSummaries: [],
			loadedFrameworks: [],
			frameworkCount: 0,
			controlCount: 0,
			policyCount: 0,
			entityCount: 0,
			lastUpdated: new Date().toISOString()
		};
	}
};
