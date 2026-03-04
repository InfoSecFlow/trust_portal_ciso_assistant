<script lang="ts">
	interface Props {
		name: string;
		description?: string;
		size?: 'sm' | 'md' | 'lg';
	}

	let { name, description, size = 'md' }: Props = $props();

	interface FrameworkVisual {
		shortName: string;
		icon: string;
		color: string;
		bg: string;
		border: string;
	}

	const frameworkDb: { pattern: RegExp; visual: FrameworkVisual }[] = [
		// --- ISO Standards ---
		{ pattern: /iso.?\/?\s*(?:iec)?\s*27001/i, visual: { shortName: 'ISO 27001', icon: 'fa-shield-halved', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /iso.?\/?\s*(?:iec)?\s*27701/i, visual: { shortName: 'ISO 27701', icon: 'fa-user-shield', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200' } },
		{ pattern: /iso.?\s*22301/i, visual: { shortName: 'ISO 22301', icon: 'fa-rotate', color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200' } },
		{ pattern: /iso.?\s*42001/i, visual: { shortName: 'ISO 42001', icon: 'fa-brain', color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200' } },

		// --- NIST ---
		{ pattern: /nist\s*csf/i, visual: { shortName: 'NIST CSF', icon: 'fa-landmark', color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' } },
		{ pattern: /nist\s*(?:sp\s*)?800[\s-]*53/i, visual: { shortName: 'NIST 800-53', icon: 'fa-landmark', color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' } },
		{ pattern: /nist\s*(?:sp\s*)?800[\s-]*171/i, visual: { shortName: 'NIST 800-171', icon: 'fa-landmark', color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' } },
		{ pattern: /nist\s*(?:sp\s*)?800[\s-]*66/i, visual: { shortName: 'NIST 800-66', icon: 'fa-landmark', color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' } },
		{ pattern: /nist\s*(?:sp\s*)?800[\s-]*82/i, visual: { shortName: 'NIST 800-82', icon: 'fa-industry', color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' } },
		{ pattern: /nist\s*ai\s*rmf/i, visual: { shortName: 'NIST AI RMF', icon: 'fa-robot', color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' } },
		{ pattern: /nist\s*privacy/i, visual: { shortName: 'NIST Privacy', icon: 'fa-user-lock', color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' } },
		{ pattern: /nist\s*ssdf|secure\s*software\s*development/i, visual: { shortName: 'NIST SSDF', icon: 'fa-code', color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' } },
		{ pattern: /nist/i, visual: { shortName: 'NIST', icon: 'fa-landmark', color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' } },

		// --- SOC ---
		{ pattern: /soc\s*2/i, visual: { shortName: 'SOC 2', icon: 'fa-certificate', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' } },

		// --- PCI DSS ---
		{ pattern: /pci[\s-]*dss/i, visual: { shortName: 'PCI DSS', icon: 'fa-credit-card', color: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-200' } },

		// --- HIPAA ---
		{ pattern: /hipaa/i, visual: { shortName: 'HIPAA', icon: 'fa-heart-pulse', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' } },

		// --- Privacy / Data Protection ---
		{ pattern: /gdpr/i, visual: { shortName: 'GDPR', icon: 'fa-scale-balanced', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' } },
		{ pattern: /ccpa/i, visual: { shortName: 'CCPA', icon: 'fa-user-lock', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' } },
		{ pattern: /fadp|federal\s*act.*data\s*protection/i, visual: { shortName: 'FADP', icon: 'fa-user-shield', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' } },
		{ pattern: /india.*dpdpa|digital\s*personal\s*data\s*protection/i, visual: { shortName: 'DPDPA', icon: 'fa-user-lock', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' } },

		// --- Automotive ---
		{ pattern: /tisax|trusted\s+information\s+security\s+assessment/i, visual: { shortName: 'TISAX', icon: 'fa-car', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' } },
		{ pattern: /vcsa|vehicle\s*cyber/i, visual: { shortName: 'VCSA', icon: 'fa-car-side', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' } },

		// --- EU Directives & Regulations ---
		{ pattern: /nis[\s-]*2/i, visual: { shortName: 'NIS2', icon: 'fa-network-wired', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /nis[\s-]*1/i, visual: { shortName: 'NIS', icon: 'fa-network-wired', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /dora|digital\s*operational\s*resilience/i, visual: { shortName: 'DORA', icon: 'fa-building-columns', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200' } },
		{ pattern: /rts[\s-]*dora/i, visual: { shortName: 'RTS DORA', icon: 'fa-building-columns', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200' } },
		{ pattern: /its[\s-]*dora/i, visual: { shortName: 'ITS DORA', icon: 'fa-building-columns', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200' } },
		{ pattern: /ai\s*act/i, visual: { shortName: 'EU AI Act', icon: 'fa-brain', color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200' } },
		{ pattern: /cyber\s*resilience\s*act|cra[\s-]*resolution/i, visual: { shortName: 'CRA', icon: 'fa-shield-halved', color: 'text-cyan-700', bg: 'bg-cyan-50', border: 'border-cyan-200' } },
		{ pattern: /tiber[\s-]*eu/i, visual: { shortName: 'TIBER-EU', icon: 'fa-vial', color: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-200' } },
		{ pattern: /esrs/i, visual: { shortName: 'ESRS', icon: 'fa-leaf', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' } },
		{ pattern: /part[\s-]*is/i, visual: { shortName: 'Part-IS', icon: 'fa-plane', color: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-200' } },
		{ pattern: /enisa.*5g/i, visual: { shortName: 'ENISA 5G', icon: 'fa-tower-cell', color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200' } },
		{ pattern: /cloud\s*sovereignty/i, visual: { shortName: 'Cloud Sov.', icon: 'fa-cloud', color: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-200' } },
		{ pattern: /croe.*fmi|ecb.*cyber/i, visual: { shortName: 'CROE', icon: 'fa-building-columns', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },

		// --- US Government ---
		{ pattern: /cmmc/i, visual: { shortName: 'CMMC', icon: 'fa-flag-usa', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /fedramp/i, visual: { shortName: 'FedRAMP', icon: 'fa-cloud-arrow-up', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /cjis/i, visual: { shortName: 'CJIS', icon: 'fa-fingerprint', color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200' } },
		{ pattern: /dfs[\s-]*500|ny\s*dfs/i, visual: { shortName: 'NY DFS', icon: 'fa-building-columns', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /itar/i, visual: { shortName: 'ITAR', icon: 'fa-globe', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' } },
		{ pattern: /ftc.*safeguard|safeguarding\s*customer/i, visual: { shortName: 'FTC Safeguards', icon: 'fa-shield-halved', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /cisa[\s-]*scrm/i, visual: { shortName: 'CISA SCRM', icon: 'fa-link', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },

		// --- French Frameworks ---
		{ pattern: /secnumcloud/i, visual: { shortName: 'SecNumCloud', icon: 'fa-cloud-arrow-up', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /rgs/i, visual: { shortName: 'RGS', icon: 'fa-flag', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /lpm[\s-]*oiv/i, visual: { shortName: 'LPM/OIV', icon: 'fa-shield-halved', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /3cf/i, visual: { shortName: '3CF', icon: 'fa-flag', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /hds/i, visual: { shortName: 'HDS', icon: 'fa-hospital', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' } },
		{ pattern: /anssi.*hygiène|anssi.*hygiene/i, visual: { shortName: 'ANSSI Hygiène', icon: 'fa-broom', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /anssi.*genai|anssi.*ia\s*générative/i, visual: { shortName: 'ANSSI GenAI', icon: 'fa-robot', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /anssi.*active\s*directory/i, visual: { shortName: 'ANSSI AD', icon: 'fa-sitemap', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /anssi.*crypto/i, visual: { shortName: 'ANSSI Crypto', icon: 'fa-key', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /anssi.*linux/i, visual: { shortName: 'ANSSI Linux', icon: 'fa-terminal', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /anssi.*tls/i, visual: { shortName: 'ANSSI TLS', icon: 'fa-lock', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /anssi.*ssh/i, visual: { shortName: 'ANSSI SSH', icon: 'fa-terminal', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /anssi.*ipsec/i, visual: { shortName: 'ANSSI IPsec', icon: 'fa-network-wired', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /anssi.*journalisation/i, visual: { shortName: 'ANSSI Logs', icon: 'fa-scroll', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /anssi.*crise/i, visual: { shortName: 'ANSSI Crise', icon: 'fa-triangle-exclamation', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /anssi.*interconnexion/i, visual: { shortName: 'ANSSI Interco', icon: 'fa-network-wired', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /anssi.*vidéo|anssi.*accès\s*physique/i, visual: { shortName: 'ANSSI Physique', icon: 'fa-video', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /anssi.*architectures?\s*si/i, visual: { shortName: 'ANSSI Archi SI', icon: 'fa-diagram-project', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /anssi.*admin/i, visual: { shortName: 'ANSSI Admin', icon: 'fa-user-gear', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /anssi.*sie/i, visual: { shortName: 'ANSSI SIE', icon: 'fa-industry', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /anssi/i, visual: { shortName: 'ANSSI', icon: 'fa-flag', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /cnil/i, visual: { shortName: 'CNIL', icon: 'fa-user-lock', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200' } },
		{ pattern: /pgssi/i, visual: { shortName: 'PGSSI-S', icon: 'fa-hospital', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' } },
		{ pattern: /mcas|pssi[\s-]*mcas/i, visual: { shortName: 'PSSI-MCAS', icon: 'fa-hospital', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' } },
		{ pattern: /pssi[\s-]*e|pssi\s*etat/i, visual: { shortName: 'PSSI Etat', icon: 'fa-flag', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /pdis/i, visual: { shortName: 'PDIS', icon: 'fa-magnifying-glass', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /clausier.*santé|clausier.*sante/i, visual: { shortName: 'Clausier Santé', icon: 'fa-notes-medical', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' } },
		{ pattern: /ii[\s-]*901/i, visual: { shortName: 'II 901', icon: 'fa-lock', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /igi[\s-]*1300/i, visual: { shortName: 'IGI 1300', icon: 'fa-lock', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },

		// --- German Frameworks ---
		{ pattern: /bsi.*grundschutz|it[\s-]*grundschutz/i, visual: { shortName: 'BSI Grundschutz', icon: 'fa-shield-halved', color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200' } },
		{ pattern: /bsi[\s-]*c5/i, visual: { shortName: 'BSI C5', icon: 'fa-cloud', color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200' } },
		{ pattern: /mindeststandard.*bsi|bsi.*cloud[\s-]*dienste/i, visual: { shortName: 'BSI Cloud', icon: 'fa-cloud', color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200' } },

		// --- UK Frameworks ---
		{ pattern: /ncsc.*caf|cyber\s*assessment\s*framework/i, visual: { shortName: 'NCSC CAF', icon: 'fa-shield-halved', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },
		{ pattern: /cyber\s*essentials/i, visual: { shortName: 'Cyber Essentials', icon: 'fa-shield-halved', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },

		// --- Australian Frameworks ---
		{ pattern: /pspf|protective\s*security\s*policy/i, visual: { shortName: 'PSPF', icon: 'fa-shield-halved', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' } },
		{ pattern: /essential\s*eight/i, visual: { shortName: 'Essential 8', icon: 'fa-list-ol', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' } },
		{ pattern: /cps[\s-]*230/i, visual: { shortName: 'CPS 230', icon: 'fa-building-columns', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' } },
		{ pattern: /cps[\s-]*234/i, visual: { shortName: 'CPS 234', icon: 'fa-building-columns', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' } },

		// --- Italian Frameworks ---
		{ pattern: /agid|controlli\s*minimi/i, visual: { shortName: 'AGID', icon: 'fa-flag', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' } },
		{ pattern: /fncs|framework\s*nazionale.*cyber/i, visual: { shortName: 'FNCS', icon: 'fa-flag', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' } },

		// --- Spanish Frameworks ---
		{ pattern: /ens|esquema\s*nacional/i, visual: { shortName: 'ENS', icon: 'fa-flag', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' } },

		// --- Swiss Frameworks ---
		{ pattern: /ict[\s-]*minim/i, visual: { shortName: 'ICT Minimum', icon: 'fa-shield-halved', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' } },
		{ pattern: /finma/i, visual: { shortName: 'FINMA', icon: 'fa-building-columns', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' } },

		// --- Belgian Frameworks ---
		{ pattern: /ccb|cyberfundamentals|cyfun/i, visual: { shortName: 'CyFun', icon: 'fa-shield-halved', color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' } },

		// --- Dutch Frameworks ---
		{ pattern: /bio2|baseline\s*information\s*security/i, visual: { shortName: 'BIO2', icon: 'fa-shield-halved', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' } },

		// --- Danish Frameworks ---
		{ pattern: /tekniske\s*minimumskrav/i, visual: { shortName: 'DK Minimum', icon: 'fa-flag', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' } },

		// --- Moroccan / North African Frameworks ---
		{ pattern: /dnssi/i, visual: { shortName: 'DNSSI', icon: 'fa-flag', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' } },
		{ pattern: /loi.*05[\s-]*20/i, visual: { shortName: 'Loi 05-20', icon: 'fa-gavel', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' } },
		{ pattern: /rnsi.*alg[eé]rie/i, visual: { shortName: 'RNSI', icon: 'fa-flag', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' } },
		{ pattern: /ancs.*tunisie|référentiel.*audit.*ssi/i, visual: { shortName: 'ANCS Tunisie', icon: 'fa-flag', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' } },
		{ pattern: /pssie.*b[eé]nin/i, visual: { shortName: 'PSSIE Bénin', icon: 'fa-flag', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' } },

		// --- Baltic / Nordic Frameworks ---
		{ pattern: /kibernetinio|lietuvos/i, visual: { shortName: 'LT Cyber Law', icon: 'fa-gavel', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' } },
		{ pattern: /e[\s-]*its.*2024/i, visual: { shortName: 'E-ITS', icon: 'fa-shield-halved', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },

		// --- Korean Frameworks ---
		{ pattern: /k[\s-]*isms[\s-]*p/i, visual: { shortName: 'K-ISMS-P', icon: 'fa-shield-halved', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },

		// --- Indian Frameworks ---
		{ pattern: /rbi.*master|india.*rbi/i, visual: { shortName: 'RBI', icon: 'fa-building-columns', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' } },

		// --- Saudi / Middle East ---
		{ pattern: /ecc|essential\s*cybersecurity\s*controls/i, visual: { shortName: 'ECC', icon: 'fa-shield-halved', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' } },
		{ pattern: /sama/i, visual: { shortName: 'SAMA CSF', icon: 'fa-building-columns', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' } },
		{ pattern: /otcc/i, visual: { shortName: 'OTCC', icon: 'fa-industry', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' } },

		// --- OWASP ---
		{ pattern: /owasp.*asvs/i, visual: { shortName: 'OWASP ASVS', icon: 'fa-bug', color: 'text-fuchsia-700', bg: 'bg-fuchsia-50', border: 'border-fuchsia-200' } },
		{ pattern: /owasp.*masvs/i, visual: { shortName: 'OWASP MASVS', icon: 'fa-mobile-screen', color: 'text-fuchsia-700', bg: 'bg-fuchsia-50', border: 'border-fuchsia-200' } },
		{ pattern: /owasp.*top\s*10/i, visual: { shortName: 'OWASP Top 10', icon: 'fa-ranking-star', color: 'text-fuchsia-700', bg: 'bg-fuchsia-50', border: 'border-fuchsia-200' } },
		{ pattern: /owasp.*llm|llm.*checklist/i, visual: { shortName: 'OWASP LLM', icon: 'fa-robot', color: 'text-fuchsia-700', bg: 'bg-fuchsia-50', border: 'border-fuchsia-200' } },
		{ pattern: /owasp.*multi[\s-]*agent|owasp.*mas/i, visual: { shortName: 'OWASP MAS', icon: 'fa-users-gear', color: 'text-fuchsia-700', bg: 'bg-fuchsia-50', border: 'border-fuchsia-200' } },
		{ pattern: /owasp/i, visual: { shortName: 'OWASP', icon: 'fa-bug', color: 'text-fuchsia-700', bg: 'bg-fuchsia-50', border: 'border-fuchsia-200' } },

		// --- MITRE ---
		{ pattern: /mitre.*att[&a]ck/i, visual: { shortName: 'MITRE ATT&CK', icon: 'fa-crosshairs', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' } },
		{ pattern: /mitre.*d3fend/i, visual: { shortName: 'MITRE D3FEND', icon: 'fa-shield-halved', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' } },

		// --- CIS ---
		{ pattern: /cis.*kubernetes/i, visual: { shortName: 'CIS K8s', icon: 'fa-dharmachakra', color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200' } },
		{ pattern: /cis\s+controls|cis\s+benchmark/i, visual: { shortName: 'CIS', icon: 'fa-server', color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200' } },

		// --- Cloud / Vendor Frameworks ---
		{ pattern: /saif|google.*(?:saif|ai\s*framework)/i, visual: { shortName: 'Google SAIF', icon: 'fa-robot', color: 'text-cyan-700', bg: 'bg-cyan-50', border: 'border-cyan-200' } },
		{ pattern: /adobe.*ccf/i, visual: { shortName: 'Adobe CCF', icon: 'fa-palette', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' } },
		{ pattern: /cisco.*ccf/i, visual: { shortName: 'Cisco CCF', icon: 'fa-network-wired', color: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-200' } },
		{ pattern: /microsoft.*cloud\s*security|mcsb/i, visual: { shortName: 'MCSB', icon: 'fa-cloud', color: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-200' } },
		{ pattern: /scf|secure\s*controls\s*framework/i, visual: { shortName: 'SCF', icon: 'fa-shield-halved', color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200' } },

		// --- Financial ---
		{ pattern: /swift.*cscf/i, visual: { shortName: 'SWIFT CSCF', icon: 'fa-money-bill-transfer', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' } },

		// --- Aviation ---
		{ pattern: /aircyber/i, visual: { shortName: 'AirCyber', icon: 'fa-plane', color: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-200' } },

		// --- Other ---
		{ pattern: /pqc|post[\s-]*quantum/i, visual: { shortName: 'PQC', icon: 'fa-atom', color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200' } },
		{ pattern: /agile\s*security|asf[\s-]*baseline/i, visual: { shortName: 'ASF', icon: 'fa-bolt', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' } },
		{ pattern: /vendor\s*due\s*diligence/i, visual: { shortName: 'Vendor DD', icon: 'fa-handshake', color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200' } },
		{ pattern: /intuitem.*common|usual.*controls|doc[\s-]*pol/i, visual: { shortName: 'Common', icon: 'fa-list-check', color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200' } },
	];

	const defaultVisual: FrameworkVisual = {
		shortName: '',
		icon: 'fa-clipboard-check',
		color: 'text-violet-700',
		bg: 'bg-violet-50',
		border: 'border-violet-200'
	};

	function resolveVisual(frameworkName: string): FrameworkVisual {
		for (const entry of frameworkDb) {
			if (entry.pattern.test(frameworkName)) {
				return entry.visual;
			}
		}
		const short = frameworkName.length > 16
			? frameworkName.split(/[:\-–—]/)[0].trim().substring(0, 16)
			: frameworkName;
		return { ...defaultVisual, shortName: short };
	}

	const visual = $derived(resolveVisual(name));

	const sizes = {
		sm: { box: 'h-16 w-16', icon: 'text-lg', label: 'text-[8px]', descText: 'text-xs' },
		md: { box: 'h-20 w-20', icon: 'text-xl', label: 'text-[9px]', descText: 'text-xs' },
		lg: { box: 'h-24 w-24', icon: 'text-2xl', label: 'text-[10px]', descText: 'text-sm' }
	};

	const s = $derived(sizes[size]);
</script>

<div class="flex flex-col items-center gap-2">
	<div class="{s.box} flex flex-col items-center justify-center rounded-2xl border-2 {visual.bg} {visual.border} transition-transform group-hover:scale-105">
		<i class="fa-solid {visual.icon} {s.icon} {visual.color}"></i>
		<span class="mt-1 px-1 text-center font-bold leading-tight {s.label} {visual.color} uppercase tracking-wide">{visual.shortName}</span>
	</div>
	{#if description}
		<p class="max-w-[9rem] text-center {s.descText} text-gray-500 line-clamp-2">{description}</p>
	{/if}
</div>
