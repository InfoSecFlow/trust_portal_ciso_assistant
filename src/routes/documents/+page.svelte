<script lang="ts">
	let { data } = $props();

	let searchQuery = $state('');

	const filteredEvidences = $derived(
		data.evidences.filter(
			(e) =>
				e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				e.description.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	const filteredPolicies = $derived(
		data.policies.filter(
			(p) =>
				p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				p.description.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);
</script>

<svelte:head>
	<title>Documents & Resources — InfoSecFlow Trust Portal</title>
	<meta name="description" content="Security policies, certifications, evidence, and compliance documentation available for review." />
</svelte:head>

<div class="space-y-8">
	<div>
		<h1 class="text-3xl font-bold text-gray-900">Documents & Resources</h1>
		<p class="mt-2 text-gray-500">Security policies, certifications, and compliance documentation.</p>
	</div>

	{#if !data.connected}
		<div class="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center">
			<i class="fa-solid fa-triangle-exclamation text-amber-500"></i>
			<p class="mt-1 text-sm font-medium text-amber-800">Unable to load documents</p>
		</div>
	{:else}
		<div class="relative">
			<i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
			<input
				type="text"
				placeholder="Search documents..."
				class="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
				bind:value={searchQuery}
			/>
		</div>

		{#if filteredPolicies.length > 0}
			<section>
				<h2 class="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
					<i class="fa-solid fa-file-shield text-violet-500"></i>
					Policies
				</h2>
				<div class="grid gap-3 sm:grid-cols-2">
					{#each filteredPolicies as policy}
						<div class="rounded-xl border border-gray-200 bg-white p-4">
							<h3 class="text-sm font-medium text-gray-900">{policy.name}</h3>
							{#if policy.description}
								<p class="mt-1 line-clamp-2 text-xs text-gray-500">{policy.description}</p>
							{/if}
						</div>
					{/each}
				</div>
			</section>
		{/if}

		{#if filteredEvidences.length > 0}
			<section>
				<h2 class="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
					<i class="fa-solid fa-file-lines text-blue-500"></i>
					Evidence & Certifications
				</h2>
				<div class="grid gap-3 sm:grid-cols-2">
					{#each filteredEvidences as evidence}
						<div class="rounded-xl border border-gray-200 bg-white p-4">
							<div class="flex items-start gap-2">
								{#if evidence.hasAttachment}
									<i class="fa-solid fa-file-arrow-down mt-0.5 text-xs text-blue-500"></i>
								{/if}
								<div>
									<h3 class="text-sm font-medium text-gray-900">{evidence.name}</h3>
									{#if evidence.description}
										<p class="mt-1 line-clamp-2 text-xs text-gray-500">{evidence.description}</p>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		{#if filteredPolicies.length === 0 && filteredEvidences.length === 0}
			<div class="rounded-xl border border-gray-200 bg-white p-12 text-center">
				<i class="fa-solid fa-file-lines text-3xl text-gray-300"></i>
				<p class="mt-3 text-gray-500">{searchQuery ? 'No documents match your search.' : 'No documents available.'}</p>
			</div>
		{/if}
	{/if}
</div>
