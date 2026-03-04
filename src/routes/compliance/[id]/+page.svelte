<script lang="ts">
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import ProgressRing from '$lib/components/ProgressRing.svelte';

	let { data } = $props();

	interface SectionData {
		id: string;
		ref_id: string;
		name: string;
		description: string;
		assessable: boolean;
		status: string | null;
		children: SectionData[];
	}

	let expandedSections = $state<Set<string>>(new Set());

	function toggleSection(id: string) {
		const next = new Set(expandedSections);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		expandedSections = next;
	}

	function expandAll(sections: SectionData[]) {
		const ids = new Set<string>();
		function collect(s: SectionData[]) {
			for (const sec of s) {
				if (sec.children.length > 0) {
					ids.add(sec.id);
					collect(sec.children);
				}
			}
		}
		collect(sections);
		expandedSections = ids;
	}

	function collapseAll() {
		expandedSections = new Set();
	}
</script>

<div class="space-y-8">
	<a href="/compliance" class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600">
		<i class="fa-solid fa-arrow-left"></i>
		Back to Compliance
	</a>

	{#if !data.connected || !data.assessment}
		<div class="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center">
			<i class="fa-solid fa-triangle-exclamation text-amber-500"></i>
			<p class="mt-1 text-sm font-medium text-amber-800">Unable to load framework data</p>
		</div>
	{:else}
		<div class="rounded-xl border border-gray-200 bg-white p-6">
			<div class="flex flex-col gap-6 md:flex-row md:items-center">
				<ProgressRing percent={data.overallStats?.percentComplete ?? 0} size={110} strokeWidth={8} label="complete" />
				<div class="flex-1">
					<h1 class="text-2xl font-bold text-gray-900">{data.assessment.name}</h1>
					{#if data.assessment.provider}
						<p class="mt-1 text-xs font-medium uppercase tracking-wider text-gray-400">{data.assessment.provider}</p>
					{/if}
					<p class="mt-2 text-sm text-gray-500">{data.assessment.description}</p>
				</div>
			</div>

			{#if data.overallStats}
				<div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
					<div class="rounded-lg bg-emerald-50 p-3 text-center">
						<p class="text-2xl font-bold text-emerald-700">{data.overallStats.compliant}</p>
						<p class="text-xs text-emerald-600">Compliant</p>
					</div>
					<div class="rounded-lg bg-amber-50 p-3 text-center">
						<p class="text-2xl font-bold text-amber-700">{data.overallStats.partiallyCompliant}</p>
						<p class="text-xs text-amber-600">Partial</p>
					</div>
					<div class="rounded-lg bg-red-50 p-3 text-center">
						<p class="text-2xl font-bold text-red-700">{data.overallStats.nonCompliant}</p>
						<p class="text-xs text-red-600">Non-Compliant</p>
					</div>
					<div class="rounded-lg bg-gray-50 p-3 text-center">
						<p class="text-2xl font-bold text-gray-600">{data.overallStats.notAssessed}</p>
						<p class="text-xs text-gray-500">Not Assessed</p>
					</div>
					<div class="rounded-lg bg-gray-50 p-3 text-center">
						<p class="text-2xl font-bold text-gray-500">{data.overallStats.notApplicable}</p>
						<p class="text-xs text-gray-400">N/A</p>
					</div>
				</div>
			{/if}
		</div>

		<div class="flex gap-2">
			<button
				class="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200"
				onclick={() => expandAll(data.sections)}
			>
				<i class="fa-solid fa-expand mr-1"></i> Expand All
			</button>
			<button
				class="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200"
				onclick={collapseAll}
			>
				<i class="fa-solid fa-compress mr-1"></i> Collapse All
			</button>
		</div>

		<div class="space-y-2">
			{#each data.sections as section}
				{@render requirementSection(section, 0)}
			{/each}
		</div>
	{/if}
</div>

{#snippet requirementSection(section: SectionData, depth: number)}
	<div class="rounded-lg border border-gray-200 bg-white {depth > 0 ? 'ml-4 border-l-2 border-l-gray-300' : ''}">
		<button
			class="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50"
			onclick={() => section.children.length > 0 && toggleSection(section.id)}
		>
			{#if section.children.length > 0}
				<i class="fa-solid {expandedSections.has(section.id) ? 'fa-chevron-down' : 'fa-chevron-right'} w-4 text-xs text-gray-400"></i>
			{:else}
				<span class="w-4"></span>
			{/if}

			{#if section.ref_id}
				<span class="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-xs font-mono font-medium text-gray-600">
					{section.ref_id}
				</span>
			{/if}

			<span class="min-w-0 flex-1 text-sm font-medium text-gray-800">
				{section.name || section.description}
			</span>

			{#if section.status}
				<StatusBadge status={section.status} size="sm" />
			{/if}
		</button>

		{#if expandedSections.has(section.id) && section.children.length > 0}
			<div class="border-t border-gray-100 px-2 pb-2 pt-1">
				{#each section.children as child}
					{@render requirementSection(child, depth + 1)}
				{/each}
			</div>
		{/if}
	</div>
{/snippet}
