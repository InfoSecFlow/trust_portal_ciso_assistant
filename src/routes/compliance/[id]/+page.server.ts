import { cisoApi } from '$lib/server/ciso-api';
import { computeComplianceStats, getRequirementAssessmentCAId, resolveId, resolveField } from '$lib/utils/transform';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const [frameworks, complianceAssessments, allRequirementAssessments, requirementNodes] =
			await Promise.all([
				cisoApi.getFrameworks(),
				cisoApi.getComplianceAssessments(),
				cisoApi.getRequirementAssessments(),
				cisoApi.getRequirementNodes()
			]);

		const assessment = complianceAssessments.find((ca) => ca.id === params.id);
		if (!assessment) throw error(404, 'Compliance assessment not found');

		const frameworkId = resolveId(assessment.framework);
		const framework = frameworks.find((f) => String(f.id) === frameworkId);
		const assessmentId = String(assessment.id);

		const reqAssessments = allRequirementAssessments.filter(
			(ra) => getRequirementAssessmentCAId(ra) === assessmentId
		);

		const frameworkNodes = requirementNodes.filter(
			(rn) => resolveId(rn.framework) === frameworkId
		);

		const assessmentMap = new Map(reqAssessments.map((ra) => [resolveId(ra.requirement), ra]));

		const topLevelNodes = frameworkNodes.filter((n) => !n.parent_urn);
		const childMap = new Map<string, typeof frameworkNodes>();
		for (const node of frameworkNodes) {
			if (node.parent_urn) {
				if (!childMap.has(node.parent_urn)) childMap.set(node.parent_urn, []);
				childMap.get(node.parent_urn)!.push(node);
			}
		}

		interface SectionData {
			id: string;
			ref_id: string;
			name: string;
			description: string;
			assessable: boolean;
			status: string | null;
			children: SectionData[];
		}

		function buildSection(node: (typeof frameworkNodes)[0]): SectionData {
			const children = (childMap.get(node.urn || '') || [])
				.sort((a, b) => (a.ref_id || '').localeCompare(b.ref_id || ''))
				.map(buildSection);

			const ra = assessmentMap.get(String(node.id));
			const status = ra ? (resolveField(ra.result) || resolveField(ra.status) || null) : null;

			return {
				id: node.id,
				ref_id: node.ref_id || '',
				name: node.name || '',
				description: node.description || '',
				assessable: node.assessable,
				status,
				children
			};
		}

		const sections = topLevelNodes
			.sort((a, b) => (a.ref_id || '').localeCompare(b.ref_id || ''))
			.map(buildSection);

		const overallStats = computeComplianceStats(reqAssessments);

		return {
			connected: true,
			assessment: {
				id: assessment.id,
				name: framework?.name || assessment.name,
				description: framework?.description || assessment.description,
				provider: framework?.provider || ''
			},
			sections,
			overallStats,
			totalRequirements: reqAssessments.length
		};
	} catch (err: unknown) {
		if (err && typeof err === 'object' && 'status' in err) throw err;
		console.error('Failed to load framework detail:', err);
		return {
			connected: false,
			assessment: null,
			sections: [],
			overallStats: null,
			totalRequirements: 0
		};
	}
};
