import type {
	CisoRequirementAssessment,
	CisoRequirementNode,
	CisoRiskScenario,
	CisoAppliedControl,
	CisoEntity,
	CisoFolder
} from '$lib/server/ciso-api';

export interface ComplianceStats {
	total: number;
	compliant: number;
	partiallyCompliant: number;
	nonCompliant: number;
	notApplicable: number;
	notAssessed: number;
	percentComplete: number;
	percentAssessed: number;
}

export interface ControlStats {
	total: number;
	active: number;
	planned: number;
	inactive: number;
	byCategory: Record<string, number>;
}

export interface RiskStats {
	total: number;
	byTreatment: Record<string, number>;
	byLevel: Record<string, number>;
}

export interface EntityGroup {
	folderName: string;
	entities: CisoEntity[];
}

/**
 * CISO Assistant API returns fields as either plain strings or nested objects
 * like { id: "...", str: "..." }. This extracts the usable string value.
 */
export function resolveField(val: unknown): string {
	if (val == null) return '';
	if (typeof val === 'string') return val;
	if (typeof val === 'number') return String(val);
	if (typeof val === 'object') {
		const obj = val as Record<string, unknown>;
		if (typeof obj.str === 'string') return obj.str;
		if (typeof obj.id === 'string') return obj.id;
		if (typeof obj.name === 'string') return obj.name;
	}
	return String(val);
}

export function resolveId(val: unknown): string {
	if (val == null) return '';
	if (typeof val === 'string') return val;
	if (typeof val === 'number') return String(val);
	if (typeof val === 'object') {
		const obj = val as Record<string, unknown>;
		if (typeof obj.id === 'string') return obj.id;
		if (typeof obj.id === 'number') return String(obj.id);
	}
	return String(val);
}

const STATUS_MAP: Record<string, keyof Omit<ComplianceStats, 'total' | 'percentComplete' | 'percentAssessed'>> = {
	compliant: 'compliant',
	partially_compliant: 'partiallyCompliant',
	non_compliant: 'nonCompliant',
	not_applicable: 'notApplicable',
	not_assessed: 'notAssessed'
};

export function getRequirementAssessmentCAId(ra: CisoRequirementAssessment): string {
	return resolveId(ra.compliance_assessment);
}

export function getRequirementAssessmentResult(ra: CisoRequirementAssessment): string {
	return resolveField(ra.result).toLowerCase();
}

export function getRequirementAssessmentStatus(ra: CisoRequirementAssessment): string {
	return resolveField(ra.status).toLowerCase();
}

export function computeComplianceStats(assessments: CisoRequirementAssessment[]): ComplianceStats {
	const stats: ComplianceStats = {
		total: assessments.length,
		compliant: 0,
		partiallyCompliant: 0,
		nonCompliant: 0,
		notApplicable: 0,
		notAssessed: 0,
		percentComplete: 0,
		percentAssessed: 0
	};

	for (const assessment of assessments) {
		const result = getRequirementAssessmentResult(assessment);
		const status = getRequirementAssessmentStatus(assessment);
		const key = STATUS_MAP[result] || STATUS_MAP[status];
		if (key) {
			stats[key]++;
		} else {
			stats.notAssessed++;
		}
	}

	const applicable = stats.total - stats.notApplicable;
	const assessed = applicable - stats.notAssessed;

	const score = stats.compliant + stats.partiallyCompliant * 0.5;
	stats.percentComplete = assessed > 0 ? Math.round((score / assessed) * 100) : 0;
	stats.percentAssessed = applicable > 0 ? Math.round((assessed / applicable) * 100) : 0;

	return stats;
}

export function computeControlStats(controls: CisoAppliedControl[]): ControlStats {
	const stats: ControlStats = {
		total: controls.length,
		active: 0,
		planned: 0,
		inactive: 0,
		byCategory: {}
	};

	for (const control of controls) {
		const status = resolveField(control.status).toLowerCase();
		if (status === 'active' || status === 'operational') stats.active++;
		else if (status === 'planned') stats.planned++;
		else stats.inactive++;

		const category = resolveField(control.category) || 'Uncategorized';
		stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
	}

	return stats;
}

export function computeRiskStats(scenarios: CisoRiskScenario[]): RiskStats {
	const stats: RiskStats = {
		total: scenarios.length,
		byTreatment: {},
		byLevel: {}
	};

	for (const scenario of scenarios) {
		const treatment = resolveField(scenario.treatment) || 'untreated';
		stats.byTreatment[treatment] = (stats.byTreatment[treatment] || 0) + 1;

		if (scenario.current_level !== undefined && scenario.current_level !== null) {
			const level = String(scenario.current_level);
			stats.byLevel[level] = (stats.byLevel[level] || 0) + 1;
		}
	}

	return stats;
}

export function groupEntitiesByFolder(
	entities: CisoEntity[],
	folders: CisoFolder[]
): EntityGroup[] {
	const folderMap = new Map(folders.map((f) => [f.id, f.name]));
	const groups = new Map<string, CisoEntity[]>();

	for (const entity of entities) {
		const folderId = resolveId(entity.folder);
		const folderName = folderMap.get(folderId) || 'Other';
		if (!groups.has(folderName)) groups.set(folderName, []);
		groups.get(folderName)!.push(entity);
	}

	return Array.from(groups.entries())
		.map(([folderName, entities]) => ({ folderName, entities: entities.sort((a, b) => a.name.localeCompare(b.name)) }))
		.sort((a, b) => a.folderName.localeCompare(b.folderName));
}

export function buildRequirementTree(nodes: CisoRequirementNode[]): CisoRequirementNode & { children: CisoRequirementNode[] }[] {
	const nodeMap = new Map<string | undefined, CisoRequirementNode[]>();

	for (const node of nodes) {
		const parentKey = node.parent_urn || '__root__';
		if (!nodeMap.has(parentKey)) nodeMap.set(parentKey, []);
		nodeMap.get(parentKey)!.push(node);
	}

	function attachChildren(parentUrn: string | undefined): (CisoRequirementNode & { children: any[] })[] {
		const children = nodeMap.get(parentUrn || '__root__') || [];
		return children.map((node) => ({
			...node,
			children: attachChildren(node.urn)
		}));
	}

	return attachChildren(undefined);
}
