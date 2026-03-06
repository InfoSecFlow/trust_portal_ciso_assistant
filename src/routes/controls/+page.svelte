<script lang="ts">
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import StatCard from '$lib/components/StatCard.svelte';

	let { data } = $props();

	let activeTab = $state<'controls' | 'policies'>('controls');
</script>

<svelte:head>
	<title>Security Controls — InfoSecFlow Trust Portal</title>
	<meta name="description" content="Implemented security controls and policies protecting our organization. View control categories, implementation status, and active policies." />
</svelte:head>

<div class="space-y-8">
	<div>
		<h1 class="text-3xl font-bold text-gray-900">Security Controls</h1>
		<p class="mt-2 text-gray-500">Implemented controls and security policies protecting our organization.</p>
	</div>

	{#if !data.connected}
		<div class="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center">
			<i class="fa-solid fa-triangle-exclamation text-amber-500"></i>
			<p class="mt-1 text-sm font-medium text-amber-800">Unable to load controls data</p>
		</div>
	{:else}
		{#if data.stats}
			<div class="grid gap-4 sm:grid-cols-3">
				<StatCard title="Total Controls" value={data.stats.total} icon="fa-solid fa-lock" color="text-blue-600" />
				<StatCard title="Active" value={data.stats.active} icon="fa-solid fa-circle-check" color="text-emerald-600" />
				<StatCard title="Planned" value={data.stats.planned} icon="fa-solid fa-clock" color="text-amber-600" />
			</div>
		{/if}

		<div class="flex gap-1 rounded-lg bg-gray-100 p-1">
			<button
				class="flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors
					{activeTab === 'controls' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}"
				onclick={() => (activeTab = 'controls')}
			>
				Controls ({data.stats?.total || 0})
			</button>
			<button
				class="flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors
					{activeTab === 'policies' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}"
				onclick={() => (activeTab = 'policies')}
			>
				Policies ({data.policies.length})
			</button>
		</div>

		{#if activeTab === 'controls'}
			<div class="space-y-5">
				{#each data.categories as category}
					<div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
						<div class="border-b border-gray-100 px-5 py-3">
							<div class="flex items-center justify-between">
								<h2 class="text-sm font-semibold text-gray-900 capitalize">{category.name}</h2>
								<span class="text-xs text-gray-400">{category.controls.length}</span>
							</div>
						</div>
						<div class="divide-y divide-gray-100">
							{#each category.controls as control}
								<div class="px-5 py-3">
									<div class="flex items-start justify-between gap-4">
										<div class="min-w-0">
											<h3 class="text-sm font-medium text-gray-800">{control.name}</h3>
											{#if control.description}
												<p class="mt-0.5 line-clamp-2 text-xs text-gray-500">{control.description}</p>
											{/if}
										</div>
										{#if control.status}
											<StatusBadge status={control.status} size="sm" />
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="space-y-3">
				{#each data.policies as policy}
					<div class="rounded-xl border border-gray-200 bg-white p-5">
						<div class="flex items-start justify-between gap-4">
							<div class="flex items-start gap-3">
								<div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50">
									<i class="fa-solid fa-file-shield text-xs text-violet-600"></i>
								</div>
								<div>
									<h3 class="text-sm font-semibold text-gray-900">{policy.name}</h3>
									{#if policy.description}
										<p class="mt-1 text-xs text-gray-500">{policy.description}</p>
									{/if}
								</div>
							</div>
							<StatusBadge status={policy.status} size="sm" />
						</div>
					</div>
				{/each}
				{#if data.policies.length === 0}
					<div class="rounded-xl border border-gray-200 bg-white p-12 text-center">
						<i class="fa-solid fa-file-shield text-3xl text-gray-300"></i>
						<p class="mt-3 text-gray-500">No policies available.</p>
					</div>
				{/if}
			</div>
		{/if}
	{/if}
</div>
