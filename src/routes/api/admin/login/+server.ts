import { json } from '@sveltejs/kit';
import { getAdminPassword, hashSession } from '$lib/server/admin-auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body = await request.json().catch(() => ({}));
	const { password } = body as { password?: string };

	const adminPw = getAdminPassword();
	if (!adminPw) {
		return json({ error: 'Admin access is not configured' }, { status: 403 });
	}

	if (password !== adminPw) {
		return json({ error: 'Invalid password' }, { status: 401 });
	}

	cookies.set('admin_session', hashSession(adminPw), {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		maxAge: 60 * 60 * 4 // 4 hours
	});

	return json({ ok: true });
};
