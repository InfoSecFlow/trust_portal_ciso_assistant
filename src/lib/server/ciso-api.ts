import { CISO_API_URL, CISO_API_TOKEN } from '$env/static/private';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const REQUEST_TIMEOUT_MS = 30_000;   // 30 seconds per request

interface CacheEntry<T> {
	data: T;
	expiresAt: number;
}

interface PaginatedResponse<T> {
	count: number;
	next: string | null;
	previous: string | null;
	results: T[];
}

const cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | null {
	const entry = cache.get(key);
	if (!entry) return null;
	if (Date.now() > entry.expiresAt) {
		cache.delete(key);
		return null;
	}
	return entry.data as T;
}

function setCache<T>(key: string, data: T, ttl = CACHE_TTL_MS): void {
	cache.set(key, { data, expiresAt: Date.now() + ttl });
}

function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = REQUEST_TIMEOUT_MS): Promise<Response> {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);
	return fetch(url, { ...init, signal: controller.signal }).finally(() => clearTimeout(timer));
}

class CisoApiClient {
	private baseUrl: string;
	private token: string;

	constructor() {
		this.baseUrl = CISO_API_URL.replace(/\/+$/, '');
		this.token = CISO_API_TOKEN;
	}

	private get headers(): Record<string, string> {
		return {
			Authorization: `Token ${this.token}`,
			'Content-Type': 'application/json'
		};
	}

	private async request<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
		const url = new URL(`${this.baseUrl}${endpoint}`);
		if (params) {
			Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
		}

		const response = await fetchWithTimeout(url.toString(), { headers: this.headers });

		if (!response.ok) {
			throw new Error(`CISO API error: ${response.status} ${response.statusText} for ${endpoint}`);
		}

		return response.json();
	}

	private async fetchAll<T>(endpoint: string, params?: Record<string, string>): Promise<T[]> {
		const allParams = { page_size: '200', ...params };
		const first = await this.request<PaginatedResponse<T>>(endpoint, allParams);
		let results = first.results;

		let nextUrl = first.next;
		while (nextUrl) {
			const response = await fetchWithTimeout(nextUrl, { headers: this.headers });
			if (!response.ok) break;
			const page: PaginatedResponse<T> = await response.json();
			results = results.concat(page.results);
			nextUrl = page.next;
		}

		return results;
	}

	private async cachedFetchAll<T>(key: string, endpoint: string, params?: Record<string, string>): Promise<T[]> {
		const cached = getCached<T[]>(key);
		if (cached) {
			console.log(`[cache] HIT  ${key} (${cached.length} items)`);
			return cached;
		}
		console.log(`[cache] MISS ${key} — fetching from API`);
		const data = await this.fetchAll<T>(endpoint, params);
		setCache(key, data);
		return data;
	}

	private async cachedRequest<T>(key: string, endpoint: string, params?: Record<string, string>): Promise<T> {
		const cached = getCached<T>(key);
		if (cached) return cached;
		const data = await this.request<T>(endpoint, params);
		setCache(key, data);
		return data;
	}

	async healthCheck(): Promise<boolean> {
		try {
			await this.request('/health/');
			return true;
		} catch {
			return false;
		}
	}

	async getFrameworks() {
		return this.cachedFetchAll<CisoFramework>('frameworks', '/frameworks/');
	}

	async getComplianceAssessments() {
		return this.cachedFetchAll<CisoComplianceAssessment>('compliance-assessments', '/compliance-assessments/');
	}

	async getRequirementAssessments(params?: Record<string, string>) {
		const key = 'requirement-assessments' + (params ? ':' + JSON.stringify(params) : '');
		return this.cachedFetchAll<CisoRequirementAssessment>(key, '/requirement-assessments/', params);
	}

	async getRequirementNodes(params?: Record<string, string>) {
		const key = 'requirement-nodes' + (params ? ':' + JSON.stringify(params) : '');
		return this.cachedFetchAll<CisoRequirementNode>(key, '/requirement-nodes/', params);
	}

	async getAppliedControls() {
		return this.cachedFetchAll<CisoAppliedControl>('applied-controls', '/applied-controls/');
	}

	async getReferenceControls() {
		return this.cachedFetchAll<CisoReferenceControl>('reference-controls', '/reference-controls/');
	}

	async getPolicies() {
		return this.cachedFetchAll<CisoPolicy>('policies', '/policies/');
	}

	async getRiskAssessments() {
		return this.cachedFetchAll<CisoRiskAssessment>('risk-assessments', '/risk-assessments/');
	}

	async getRiskMatrices() {
		return this.cachedFetchAll<CisoRiskMatrix>('risk-matrices', '/risk-matrices/');
	}

	async getRiskScenarios() {
		return this.cachedFetchAll<CisoRiskScenario>('risk-scenarios', '/risk-scenarios/');
	}

	async getEntities() {
		return this.cachedFetchAll<CisoEntity>('entities', '/entities/');
	}

	async getEntityAssessments() {
		return this.cachedFetchAll<CisoEntityAssessment>('entity-assessments', '/entity-assessments/');
	}

	async getFolders() {
		return this.cachedFetchAll<CisoFolder>('folders', '/folders/');
	}

	async getEvidences() {
		return this.cachedFetchAll<CisoEvidence>('evidences', '/evidences/');
	}

	async getCounters() {
		return this.cachedRequest<CisoCounters>('counters', '/get_counters/');
	}

	async getMetrics() {
		return this.cachedRequest<CisoMetrics>('metrics', '/get_metrics/');
	}

	async getCombinedAssessmentsStatus() {
		return this.cachedRequest<CisoCombinedAssessmentsStatus>('combined-status', '/get_combined_assessments_status/');
	}

	async getAggData() {
		return this.cachedRequest<CisoAggData>('agg-data', '/agg_data/');
	}

	invalidateCache(): void {
		cache.clear();
		console.log('[cache] All entries cleared');
	}
}

export const cisoApi = new CisoApiClient();

// --- Types ---

export interface CisoFramework {
	id: string;
	name: string;
	description: string;
	urn?: string;
	ref_id?: string;
	provider?: string;
	locale?: string;
	folder: string;
	is_loaded?: boolean;
}

export interface CisoComplianceAssessment {
	id: string;
	name: string;
	description: string;
	framework: string;
	project?: string;
	status?: string;
	eta?: string;
	folder: string;
	result?: Record<string, unknown>;
}

export interface CisoRequirementAssessment {
	id: string;
	status: string | { str?: string; id?: string } | null;
	result: string | { str?: string; id?: string } | null;
	requirement: string | { id?: string; str?: string } | null;
	compliance_assessment: string | { id?: string; str?: string; name?: string } | null;
	applied_controls: (string | { id?: string })[];
	evidences: (string | { id?: string })[];
	observation?: string;
	folder: string | { id?: string };
}

export interface CisoRequirementNode {
	id: string;
	urn?: string;
	ref_id?: string;
	name?: string;
	description?: string;
	parent_urn?: string;
	assessable: boolean;
	framework: string;
	folder: string;
}

export interface CisoAppliedControl {
	id: string;
	name: string;
	description: string;
	category?: string;
	status?: string;
	effort?: string;
	folder: string;
	reference_control?: string;
}

export interface CisoReferenceControl {
	id: string;
	name: string;
	description?: string;
	category?: string;
	folder: string;
}

export interface CisoPolicy {
	id: string;
	name: string;
	description: string;
	status?: string;
	effort?: string;
	folder: string;
}

export interface CisoRiskAssessment {
	id: string;
	name: string;
	description: string;
	risk_matrix: string;
	status?: string;
	folder: string;
}

export interface CisoRiskMatrix {
	id: string;
	name: string;
	description?: string;
	json_definition: Record<string, unknown>;
	folder: string;
}

export interface CisoRiskScenario {
	id: string;
	name: string;
	description: string;
	existing_controls?: string;
	current_level?: number;
	residual_level?: number;
	treatment?: string;
	risk_assessment: string;
	threats: string[];
	vulnerabilities: string[];
	assets: string[];
	applied_controls: string[];
	folder: string;
}

export interface CisoEntity {
	id: string;
	name: string;
	description: string;
	mission?: string;
	reference_link?: string;
	folder: string;
	owned_folders?: string[];
}

export interface CisoEntityAssessment {
	id: string;
	name: string;
	description: string;
	entity: string;
	status?: string;
	eta?: string;
	folder: string;
}

export interface CisoFolder {
	id: string;
	name: string;
	description?: string;
	parent_folder?: string;
	content_type?: string;
}

export interface CisoEvidence {
	id: string;
	name: string;
	description?: string;
	attachment?: string;
	folder: string;
}

export interface CisoCounters {
	[key: string]: number;
}

export interface CisoMetrics {
	[key: string]: unknown;
}

export interface CisoCombinedAssessmentsStatus {
	[key: string]: unknown;
}

export interface CisoAggData {
	[key: string]: unknown;
}
