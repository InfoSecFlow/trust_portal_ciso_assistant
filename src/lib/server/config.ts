import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface PortalConfig {
	portalName: string;
	portalDescription: string;
	logoPath: string;
	primaryColor: string;
	accentColor: string;
	footerText: string;
}

const DEFAULT_CONFIG: PortalConfig = {
	portalName: 'Trust Center',
	portalDescription: 'Our commitment to security, privacy, and compliance',
	logoPath: '',
	primaryColor: '#2563eb',
	accentColor: '#7c3aed',
	footerText: ''
};

const DATA_DIR = join(process.cwd(), 'data');
const CONFIG_PATH = join(DATA_DIR, 'portal-config.json');

let cached: PortalConfig | null = null;

function ensureDataDir(): void {
	if (!existsSync(DATA_DIR)) {
		mkdirSync(DATA_DIR, { recursive: true });
	}
}

export function getConfig(): PortalConfig {
	if (cached) return cached;

	ensureDataDir();

	if (!existsSync(CONFIG_PATH)) {
		cached = { ...DEFAULT_CONFIG };
		return cached;
	}

	try {
		const raw = readFileSync(CONFIG_PATH, 'utf-8');
		cached = { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
		return cached!;
	} catch (err) {
		console.error('[config] Failed to read config file:', err);
		cached = { ...DEFAULT_CONFIG };
		return cached;
	}
}

export function saveConfig(partial: Partial<PortalConfig>): PortalConfig {
	ensureDataDir();

	const current = getConfig();
	const updated = { ...current, ...partial };

	try {
		writeFileSync(CONFIG_PATH, JSON.stringify(updated, null, 2), 'utf-8');
		cached = updated;
		console.log('[config] Saved portal config');
	} catch (err) {
		console.error('[config] Failed to save config file:', err);
		throw new Error('Failed to save configuration');
	}

	return updated;
}

export function invalidateConfigCache(): void {
	cached = null;
}
