import { cisoApi } from '$lib/server/ciso-api';
import { computeRiskStats } from '$lib/utils/transform';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const [riskAssessments, riskScenarios, riskMatrices] = await Promise.all([
			cisoApi.getRiskAssessments(),
			cisoApi.getRiskScenarios(),
			cisoApi.getRiskMatrices()
		]);

		const stats = computeRiskStats(riskScenarios);

		const treatmentLabels: Record<string, string> = {
			mitigate: 'Mitigated',
			accept: 'Accepted',
			avoid: 'Avoided',
			transfer: 'Transferred',
			untreated: 'Untreated'
		};

		const treatmentSummary = Object.entries(stats.byTreatment).map(([key, count]) => ({
			label: treatmentLabels[key] || key,
			count,
			key
		}));

		const levelLabels: Record<string, { label: string; color: string }> = {
			'0': { label: 'Very Low', color: '#22c55e' },
			'1': { label: 'Low', color: '#84cc16' },
			'2': { label: 'Medium', color: '#eab308' },
			'3': { label: 'High', color: '#f97316' },
			'4': { label: 'Very High', color: '#ef4444' }
		};

		const levelSummary = Object.entries(stats.byLevel).map(([level, count]) => ({
			level: parseInt(level),
			label: levelLabels[level]?.label || `Level ${level}`,
			color: levelLabels[level]?.color || '#94a3b8',
			count
		})).sort((a, b) => a.level - b.level);

		return {
			connected: true,
			stats,
			treatmentSummary,
			levelSummary,
			assessmentCount: riskAssessments.length,
			scenarioCount: riskScenarios.length
		};
	} catch (error) {
		console.error('Failed to load risk data:', error);
		return {
			connected: false,
			stats: null,
			treatmentSummary: [],
			levelSummary: [],
			assessmentCount: 0,
			scenarioCount: 0
		};
	}
};
