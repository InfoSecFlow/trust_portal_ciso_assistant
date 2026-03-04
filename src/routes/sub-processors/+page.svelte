<script lang="ts">
	let { data } = $props();

	let searchQuery = $state('');

	const filteredGroups = $derived(
		data.groups
			.map((group) => ({
				...group,
				entities: group.entities.filter(
					(e) =>
						e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
						(e.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
						(e.mission || '').toLowerCase().includes(searchQuery.toLowerCase())
				)
			}))
			.filter((group) => group.entities.length > 0)
	);

	const filteredTotal = $derived(filteredGroups.reduce((sum, g) => sum + g.entities.length, 0));
</script>

<div class="space-y-8">
	<div>
		<h1 class="text-3xl font-bold text-gray-900">Sub-Processors</h1>
		<p class="mt-2 text-gray-500">Third-party vendors and service providers we work with, organized by domain.</p>
	</div>

	{#if !data.connected}
		<div class="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center">
			<i class="fa-solid fa-triangle-exclamation text-amber-500"></i>
			<p class="mt-1 text-sm font-medium text-amber-800">Unable to load sub-processor data</p>
		</div>
	{:else}
		<div class="flex items-center gap-4">
			<div class="relative flex-1">
				<i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
				<input
					type="text"
					placeholder="Search vendors..."
					class="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
					bind:value={searchQuery}
				/>
			</div>
			<span class="text-sm text-gray-400">{filteredTotal} vendor{filteredTotal !== 1 ? 's' : ''}</span>
		</div>

		<div class="space-y-8">
			{#each filteredGroups as group}
				<div>
					<div class="mb-3 flex items-center gap-2">
						<i class="fa-solid fa-folder text-sm text-blue-500"></i>
						<h2 class="text-sm font-semibold text-gray-900">{group.folderName}</h2>
						<span class="text-xs text-gray-400">({group.entities.length})</span>
					</div>

					<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{#each group.entities as entity}
							<div class="rounded-xl border border-gray-200 bg-white p-4">
								<div class="flex items-start justify-between gap-2">
									<h3 class="text-sm font-medium text-gray-900">{entity.name}</h3>
									{#if entity.reference_link}
										<a href={entity.reference_link} target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-blue-500" title="Visit website">
											<i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
										</a>
									{/if}
								</div>
								{#if entity.mission}
									<p class="mt-1 text-xs font-medium text-blue-600">{entity.mission}</p>
								{/if}
								{#if entity.description}
									<p class="mt-1.5 line-clamp-2 text-xs text-gray-500">{entity.description}</p>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/each}

			{#if filteredGroups.length === 0}
				<div class="rounded-xl border border-gray-200 bg-white p-12 text-center">
					<i class="fa-solid fa-search text-3xl text-gray-300"></i>
					<p class="mt-3 text-gray-500">No vendors match your search.</p>
				</div>
			{/if}
		</div>
	{/if}
</div>
