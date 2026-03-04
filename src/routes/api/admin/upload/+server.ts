import { json } from '@sveltejs/kit';
import { isAdminCookieValid } from '$lib/server/admin-auth';
import { saveConfig } from '$lib/server/config';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { RequestHandler } from './$types';

const UPLOAD_DIR = join(process.cwd(), 'static', 'uploads');
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];

export const POST: RequestHandler = async ({ request, cookies }) => {
	if (!isAdminCookieValid(cookies)) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const formData = await request.formData().catch(() => null);
	if (!formData) {
		return json({ error: 'Invalid form data' }, { status: 400 });
	}

	const file = formData.get('logo') as File | null;
	if (!file || file.size === 0) {
		return json({ error: 'No file provided' }, { status: 400 });
	}

	if (file.size > MAX_FILE_SIZE) {
		return json({ error: 'File too large (max 2MB)' }, { status: 400 });
	}

	if (!ALLOWED_TYPES.includes(file.type)) {
		return json({ error: 'Invalid file type. Use PNG, JPEG, SVG, or WebP' }, { status: 400 });
	}

	if (!existsSync(UPLOAD_DIR)) {
		mkdirSync(UPLOAD_DIR, { recursive: true });
	}

	const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
	const filename = `logo.${ext}`;
	const filePath = join(UPLOAD_DIR, filename);

	const buffer = Buffer.from(await file.arrayBuffer());
	writeFileSync(filePath, buffer);

	const publicPath = `/uploads/${filename}`;
	saveConfig({ logoPath: publicPath });

	return json({ logoPath: publicPath });
};
