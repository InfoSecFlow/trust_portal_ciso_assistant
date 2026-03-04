import { getConfig } from '$lib/server/config';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const config = getConfig();
	return {
		portalName: config.portalName,
		portalDescription: config.portalDescription,
		logoPath: config.logoPath,
		primaryColor: config.primaryColor,
		accentColor: config.accentColor,
		footerText: config.footerText
	};
};
