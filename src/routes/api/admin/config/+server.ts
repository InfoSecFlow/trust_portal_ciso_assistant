import { json } from '@sveltejs/kit';
import { isAdminCookieValid } from '$lib/server/admin-auth';
import { getConfig, saveConfig } from '$lib/server/config';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	if (!isAdminCookieValid(cookies)) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	return json(getConfig());
};

export const PUT: RequestHandler = async ({ request, cookies }) => {
	if (!isAdminCookieValid(cookies)) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const body = await request.json().catch(() => null);
	if (!body || typeof body !== 'object') {
		return json({ error: 'Invalid request body' }, { status: 400 });
	}

	const allowedFields = ['portalName', 'portalDescription', 'logoPath', 'primaryColor', 'accentColor', 'footerText'];
	const updates: Record<string, string> = {};
	for (const field of allowedFields) {
		if (field in body && typeof (body as Record<string, unknown>)[field] === 'string') {
			updates[field] = (body as Record<string, string>)[field];
		}
	}

	const updated = saveConfig(updates);
	return json(updated);
};
