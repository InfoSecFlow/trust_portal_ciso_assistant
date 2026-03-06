<script lang="ts">
	import StatCard from '$lib/components/StatCard.svelte';

	let { data } = $props();

	const treatmentIcons: Record<string, string> = {
		mitigate: 'fa-shield-halved',
		accept: 'fa-circle-check',
		avoid: 'fa-ban',
		transfer: 'fa-arrow-right-arrow-left',
		untreated: 'fa-circle-question'
	};

	const treatmentStyles: Record<string, { bg: string; text: string }> = {
		mitigate: { bg: 'bg-blue-50', text: 'text-blue-700' },
		accept: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
		avoid: { bg: 'bg-gray-50', text: 'text-gray-700' },
		transfer: { bg: 'bg-violet-50', text: 'text-violet-700' },
		untreated: { bg: 'bg-amber-50', text: 'text-amber-700' }
	};
</script>

<svelte:head>
	<title>Risk Posture — InfoSecFlow Trust Portal</title>
	<meta name="description" content="High-level overview of our risk management approach, risk level distribution, and treatment strategies." />
</svelte:head>

<div class="space-y-8">
	<div>
		<h1 class="text-3xl font-bold text-gray-900">Risk Posture</h1>
		<p class="mt-2 text-gray-500">High-level overview of our risk management approach and current posture.</p>
	</div>

	{#if !data.connected}
		<div class="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center">
			<i class="fa-solid fa-triangle-exclamation text-amber-500"></i>
			<p class="mt-1 text-sm font-medium text-amber-800">Unable to load risk data</p>
		</div>
	{:else}
		<div class="grid gap-4 sm:grid-cols-2">
			<StatCard title="Risk Assessments" value={data.assessmentCount} icon="fa-solid fa-chart-line" color="text-blue-600" subtitle="Active assessments" />
			<StatCard title="Risk Scenarios" value={data.scenarioCount} icon="fa-solid fa-triangle-exclamation" color="text-amber-600" subtitle="Identified and tracked" />
		</div>

		{#if data.levelSummary.length > 0}
			<div class="rounded-xl border border-gray-200 bg-white p-5">
				<h2 class="mb-5 text-sm font-semibold text-gray-900">Risk Level Distribution</h2>
				<div class="space-y-3">
					{#each data.levelSummary as level}
						{@const maxCount = Math.max(...data.levelSummary.map((l) => l.count))}
						<div class="flex items-center gap-3">
							<span class="w-20 text-xs font-medium text-gray-600">{level.label}</span>
							<div class="flex-1">
								<div class="h-7 rounded-md bg-gray-100">
									<div
										class="flex h-full items-center rounded-md px-2 text-xs font-semibold text-white"
										style:width="{maxCount > 0 ? (level.count / maxCount) * 100 : 0}%"
										style:background-color={level.color}
										style:min-width={level.count > 0 ? '2rem' : '0'}
									>
										{#if level.count > 0}{level.count}{/if}
									</div>
								</div>
							</div>
							<span class="w-8 text-right text-xs text-gray-400">{level.count}</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if data.treatmentSummary.length > 0}
			<div class="rounded-xl border border-gray-200 bg-white p-5">
				<h2 class="mb-5 text-sm font-semibold text-gray-900">Risk Treatment</h2>
				<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{#each data.treatmentSummary as treatment}
						{@const style = treatmentStyles[treatment.key] || { bg: 'bg-gray-50', text: 'text-gray-700' }}
						<div class="flex items-center gap-3 rounded-lg {style.bg} p-4">
							<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
								<i class="fa-solid {treatmentIcons[treatment.key] || 'fa-circle'} {style.text}"></i>
							</div>
							<div>
								<p class="text-xl font-bold {style.text}">{treatment.count}</p>
								<p class="text-xs text-gray-500">{treatment.label}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if data.scenarioCount === 0}
			<div class="rounded-xl border border-gray-200 bg-white p-12 text-center">
				<i class="fa-solid fa-chart-line text-3xl text-gray-300"></i>
				<p class="mt-3 text-gray-500">No risk data available.</p>
			</div>
		{/if}
	{/if}
</div>
