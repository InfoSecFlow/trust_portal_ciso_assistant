<script lang="ts">
	import StatCard from '$lib/components/StatCard.svelte';
	import ProgressRing from '$lib/components/ProgressRing.svelte';
	import FrameworkBadge from '$lib/components/FrameworkBadge.svelte';
	import { page } from '$app/state';

	let { data } = $props();

	const portalName = $derived(page.data?.portalName ?? 'Trust Center');
	const portalDescription = $derived(page.data?.portalDescription ?? 'Transparency into our security posture, compliance certifications, and data protection practices.');
</script>

<svelte:head>
	<title>{portalName} — InfoSecFlow Trust Portal</title>
	<meta name="description" content="Security posture overview for {portalName}. Compliance frameworks, security controls, risk management, and vendor transparency powered by InfoSecFlow." />
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "WebSite",
		"name": `${portalName} — InfoSecFlow`,
		"url": "https://trust.infosecflow.com",
		"publisher": {
			"@type": "Organization",
			"name": "InfoSecFlow",
			"url": "https://infosecflow.com"
		},
		"description": "Security posture, compliance certifications, and data protection practices."
	})}</script>`}
</svelte:head>

<div class="space-y-12">
	<!-- Hero -->
	<section class="pt-4 text-center">
		<h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
			{portalName}
		</h1>
		<p class="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
			{portalDescription}
		</p>
	</section>

	{#if !data.connected}
		<div class="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center">
			<i class="fa-solid fa-triangle-exclamation text-amber-500"></i>
			<p class="mt-1 text-sm font-medium text-amber-800">Unable to connect to the security platform. Please try again later.</p>
		</div>
	{:else}
		<!-- Framework badges -->
		{#if data.loadedFrameworks.length > 0}
			<section class="rounded-2xl border border-gray-200 bg-white px-6 py-8">
				<p class="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">Compliance Certifications</p>
				<div class="flex flex-wrap items-start justify-center gap-8">
					{#each data.loadedFrameworks as fw}
						<a href="/compliance" class="group">
							<FrameworkBadge name={fw.name} size="lg" />
						</a>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Metrics -->
		<section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<StatCard title="Frameworks" value={data.frameworkCount} icon="fa-solid fa-clipboard-check" color="text-blue-600" subtitle="Active frameworks" />
			<StatCard title="Controls" value={data.controlCount} icon="fa-solid fa-lock" color="text-teal-600" subtitle="{data.controlStats?.active || 0} active" />
			<StatCard title="Policies" value={data.policyCount} icon="fa-solid fa-file-shield" color="text-violet-600" />
			<StatCard title="Vendors" value={data.entityCount} icon="fa-solid fa-building" color="text-amber-600" subtitle="Monitored sub-processors" />
		</section>

		<!-- Assessments -->
		{#if data.frameworkSummaries.length > 0}
			<section>
				<div class="mb-5 flex items-center justify-between">
					<h2 class="text-xl font-semibold text-gray-900">Assessment Progress</h2>
					<a href="/compliance" class="text-sm font-medium text-blue-600 hover:text-blue-700">
						View all &rarr;
					</a>
				</div>
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.frameworkSummaries as framework}
					{@const totalApplicable = framework.stats.total - framework.stats.notApplicable}
					<a href="/compliance/{framework.id}" class="group rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-blue-200">
						<div class="flex items-start gap-4">
							<ProgressRing percent={framework.percentComplete} size={72} strokeWidth={5} />
							<div class="min-w-0 flex-1">
								<h3 class="truncate text-sm font-semibold text-gray-900 group-hover:text-blue-600">{framework.name}</h3>
								<p class="mt-0.5 text-xs text-gray-400">{framework.stats.percentAssessed}% assessed &middot; {totalApplicable} requirements</p>
								<div class="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
									<span class="flex items-center gap-1"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>{framework.stats.compliant} compliant</span>
									<span class="flex items-center gap-1"><span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>{framework.stats.partiallyCompliant} partial</span>
									<span class="flex items-center gap-1"><span class="h-1.5 w-1.5 rounded-full bg-red-500"></span>{framework.stats.nonCompliant} non-compliant</span>
									{#if framework.stats.notAssessed > 0}
										<span class="flex items-center gap-1"><span class="h-1.5 w-1.5 rounded-full bg-gray-300"></span>{framework.stats.notAssessed} pending</span>
									{/if}
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
			</section>
		{/if}

		<!-- Resources -->
		<section>
			<h2 class="mb-5 text-xl font-semibold text-gray-900">Resources</h2>
			<div class="grid gap-4 sm:grid-cols-3">
				{@render resourceLink('/controls', 'fa-solid fa-lock', 'text-teal-600', 'bg-teal-50', 'Security Controls', `${data.controlCount} controls implemented`)}
				{@render resourceLink('/sub-processors', 'fa-solid fa-building', 'text-amber-600', 'bg-amber-50', 'Sub-Processors', `${data.entityCount} vendors monitored`)}
				{@render resourceLink('/documents', 'fa-solid fa-file-lines', 'text-violet-600', 'bg-violet-50', 'Documents', 'Policies & certifications')}
			</div>
		</section>

		<p class="text-center text-xs text-gray-400">
			Last updated: {new Date(data.lastUpdated).toLocaleString()}
		</p>
	{/if}
</div>

{#snippet resourceLink(href: string, icon: string, iconColor: string, iconBg: string, title: string, subtitle: string)}
	<a href={href} class="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-blue-200">
		<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg {iconBg}">
			<i class="{icon} {iconColor}"></i>
		</div>
		<div>
			<h3 class="text-sm font-semibold text-gray-900 group-hover:text-blue-600">{title}</h3>
			<p class="text-xs text-gray-500">{subtitle}</p>
		</div>
	</a>
{/snippet}
