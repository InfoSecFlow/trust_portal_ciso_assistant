import { env } from '$env/dynamic/private';

export function isAdminAuthorized(request: Request): boolean {
	const authHeader = request.headers.get('authorization');
	if (!authHeader) return false;

	const [scheme, credentials] = authHeader.split(' ', 2);
	if (scheme?.toLowerCase() !== 'basic' || !credentials) return false;

	try {
		const decoded = atob(credentials);
		const [, password] = decoded.split(':', 2);
		return password === env.ADMIN_PASSWORD;
	} catch {
		return false;
	}
}

export function isAdminCookieValid(cookies: { get(name: string): string | undefined }): boolean {
	const token = cookies.get('admin_session');
	if (!token || !env.ADMIN_PASSWORD) return false;
	return token === hashSession(env.ADMIN_PASSWORD);
}

export function hashSession(password: string): string {
	let hash = 0;
	const str = `trust-portal-admin:${password}`;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash |= 0;
	}
	return Math.abs(hash).toString(36);
}

export function getAdminPassword(): string {
	return env.ADMIN_PASSWORD || '';
}
