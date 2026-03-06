<script lang="ts">
	import '../app.css';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import { page } from '$app/state';

	let { children } = $props();

	const portalName = $derived(page.data?.portalName ?? 'Trust Center');
	const logoPath = $derived(page.data?.logoPath ?? '');
	const primaryColor = $derived(page.data?.primaryColor ?? '#2563eb');
	const accentColor = $derived(page.data?.accentColor ?? '#7c3aed');
	const footerText = $derived(page.data?.footerText ?? '');

	const navItems = [
		{ href: '/', label: 'Overview', icon: 'fa-solid fa-shield-halved' },
		{ href: '/compliance', label: 'Compliance', icon: 'fa-solid fa-clipboard-check' },
		{ href: '/controls', label: 'Controls', icon: 'fa-solid fa-lock' },
		{ href: '/sub-processors', label: 'Sub-Processors', icon: 'fa-solid fa-building' },
		{ href: '/risk', label: 'Risk Posture', icon: 'fa-solid fa-chart-line' },
		{ href: '/documents', label: 'Documents', icon: 'fa-solid fa-file-lines' }
	];

	function isActive(href: string): boolean {
		if (href === '/') return page.url?.pathname === '/';
		return page.url?.pathname?.startsWith(href) ?? false;
	}

	let mobileMenuOpen = $state(false);
</script>

<svelte:head>
	<title>{portalName} — InfoSecFlow</title>
	<meta name="description" content="Trust portal powered by InfoSecFlow — security, privacy, and compliance transparency for your organization." />
	<link rel="canonical" href={page.url?.href ?? ''} />
	<meta property="og:title" content="{portalName} — InfoSecFlow" />
	<meta property="og:description" content="Security posture, compliance certifications, and data protection practices." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={page.url?.href ?? ''} />
	<meta property="og:site_name" content="{portalName} — InfoSecFlow" />
	<meta property="og:image" content="{page.url?.origin ?? ''}/favicon.svg" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="{portalName} — InfoSecFlow" />
	<meta name="twitter:description" content="Security posture, compliance certifications, and data protection practices." />
</svelte:head>

<div
	class="flex min-h-full flex-col bg-gray-50"
	style:--brand-primary={primaryColor}
	style:--brand-accent={accentColor}
>
	<header class="sticky top-0 z-50 border-b border-gray-200 bg-white">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
			<a href="/" class="flex items-center gap-2.5 font-semibold text-gray-900">
				{#if logoPath}
					<img src={logoPath} alt={portalName} class="h-8 w-8 object-contain" />
				{:else}
					<i class="fa-solid fa-shield-halved" style:color={primaryColor}></i>
				{/if}
				<span>{portalName}</span>
			</a>

			<nav class="hidden items-center gap-1 md:flex">
				{#each navItems as item}
					<a
						href={item.href}
						class="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
						class:text-gray-500={!isActive(item.href)}
						class:hover:bg-gray-100={!isActive(item.href)}
						class:hover:text-gray-800={!isActive(item.href)}
						style:background-color={isActive(item.href) ? `${primaryColor}10` : undefined}
						style:color={isActive(item.href) ? primaryColor : undefined}
					>
						{item.label}
					</a>
				{/each}
			</nav>

			<button
				class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden"
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				aria-label="Toggle navigation menu"
			>
				<i class="fa-solid {mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-lg"></i>
			</button>
		</div>

		{#if mobileMenuOpen}
			<nav class="border-t border-gray-100 px-4 pb-3 md:hidden">
				{#each navItems as item}
					<a
						href={item.href}
						class="block rounded-lg px-3 py-2 text-sm font-medium"
						class:text-gray-500={!isActive(item.href)}
						class:hover:bg-gray-100={!isActive(item.href)}
						style:background-color={isActive(item.href) ? `${primaryColor}10` : undefined}
						style:color={isActive(item.href) ? primaryColor : undefined}
						onclick={() => (mobileMenuOpen = false)}
					>
						<i class="{item.icon} mr-2 w-4 text-center text-xs"></i>
						{item.label}
					</a>
				{/each}
			</nav>
		{/if}
	</header>

	<main class="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
		{@render children()}
	</main>

	<footer class="border-t border-gray-200 bg-white">
		<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
			<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
				<p class="text-sm text-gray-400">
				{#if footerText}
					{footerText}
				{:else}
					Powered by
					<a href="https://infosecflow.com" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-gray-700">InfoSecFlow</a>
				{/if}
			</p>
			<p class="text-sm text-gray-400">&copy; {new Date().getFullYear()} &middot; {portalName} &middot; <a href="https://infosecflow.com" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-gray-700">InfoSecFlow</a></p>
			</div>
		</div>
	</footer>
</div>
