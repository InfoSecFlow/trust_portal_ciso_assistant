<script lang="ts">
	import ProgressRing from '$lib/components/ProgressRing.svelte';
	import FrameworkBadge from '$lib/components/FrameworkBadge.svelte';

	let { data } = $props();
</script>

<div class="space-y-10">
	<div>
		<h1 class="text-3xl font-bold text-gray-900">Compliance Frameworks</h1>
		<p class="mt-2 text-gray-500">Our active compliance certifications and assessment progress.</p>
	</div>

	{#if !data.connected}
		<div class="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center">
			<i class="fa-solid fa-triangle-exclamation text-amber-500"></i>
			<p class="mt-1 text-sm font-medium text-amber-800">Unable to load compliance data</p>
		</div>
	{:else}
		{#if data.loadedFrameworks.length > 0}
			<section class="rounded-2xl border border-gray-200 bg-white px-6 py-8">
				<h2 class="mb-1 text-center text-lg font-semibold text-gray-900">Enabled Frameworks</h2>
				<p class="mb-8 text-center text-sm text-gray-400">
					{data.loadedFrameworks.length} framework{data.loadedFrameworks.length !== 1 ? 's' : ''} loaded
				</p>

				<div class="flex flex-wrap items-start justify-center gap-10">
					{#each data.loadedFrameworks as fw}
						<div class="flex flex-col items-center gap-3">
							{#if fw.assessmentId}
								<a href="/compliance/{fw.assessmentId}" class="group">
									<FrameworkBadge name={fw.name} size="lg" />
								</a>
							{:else}
								<div class="group">
									<FrameworkBadge name={fw.name} size="lg" />
								</div>
							{/if}
							<div class="max-w-[13rem] text-center">
								<p class="text-sm font-medium text-gray-800">{fw.name}</p>
								{#if fw.description}
									<p class="mt-1 text-xs text-gray-400 line-clamp-2">{fw.description}</p>
								{/if}
								<span class="mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium
									{fw.hasAssessment ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}">
									<span class="h-1.5 w-1.5 rounded-full {fw.hasAssessment ? 'bg-emerald-500' : 'bg-blue-500'}"></span>
									{fw.hasAssessment ? 'Assessment Active' : 'Framework Loaded'}
								</span>
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		{#if data.assessments.length > 0}
			<section>
				<h2 class="mb-5 text-lg font-semibold text-gray-900">Assessment Progress</h2>
				<div class="grid gap-4 lg:grid-cols-2">
					{#each data.assessments as assessment}
						{@const applicable = assessment.stats.total - assessment.stats.notApplicable}
						<a href="/compliance/{assessment.id}" class="group rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-blue-200">
							<div class="flex items-start gap-5">
								<ProgressRing percent={assessment.stats.percentComplete} size={90} strokeWidth={6} label="compliance" />
								<div class="min-w-0 flex-1">
									<h3 class="font-semibold text-gray-900 group-hover:text-blue-600">{assessment.name}</h3>
									{#if assessment.provider}
										<p class="mt-0.5 text-xs font-medium uppercase tracking-wider text-gray-400">{assessment.provider}</p>
									{/if}
									<p class="mt-0.5 text-xs text-gray-400">{assessment.stats.percentAssessed}% assessed &middot; {applicable} requirements</p>

									<div class="mt-3 space-y-1.5">
										<div class="flex h-2 overflow-hidden rounded-full bg-gray-100">
											{#if assessment.stats.compliant > 0}
												<div class="bg-emerald-500" style:width="{(assessment.stats.compliant / applicable) * 100}%"></div>
											{/if}
											{#if assessment.stats.partiallyCompliant > 0}
												<div class="bg-amber-400" style:width="{(assessment.stats.partiallyCompliant / applicable) * 100}%"></div>
											{/if}
											{#if assessment.stats.nonCompliant > 0}
												<div class="bg-red-500" style:width="{(assessment.stats.nonCompliant / applicable) * 100}%"></div>
											{/if}
											{#if assessment.stats.notAssessed > 0}
												<div class="bg-gray-200" style:width="{(assessment.stats.notAssessed / applicable) * 100}%"></div>
											{/if}
										</div>
										<div class="flex flex-wrap gap-x-3 text-xs text-gray-400">
											<span><span class="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"></span> {assessment.stats.compliant} Compliant</span>
											<span><span class="inline-block h-1.5 w-1.5 rounded-full bg-amber-400"></span> {assessment.stats.partiallyCompliant} Partial</span>
											<span><span class="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span> {assessment.stats.nonCompliant} Non-Compliant</span>
											{#if assessment.stats.notAssessed > 0}
												<span><span class="inline-block h-1.5 w-1.5 rounded-full bg-gray-300"></span> {assessment.stats.notAssessed} Pending</span>
											{/if}
										</div>
									</div>
								</div>
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/if}

		{#if data.loadedFrameworks.length === 0 && data.assessments.length === 0}
			<div class="rounded-xl border border-gray-200 bg-white p-12 text-center">
				<i class="fa-solid fa-clipboard-check text-3xl text-gray-300"></i>
				<p class="mt-3 text-gray-500">No compliance frameworks available.</p>
			</div>
		{/if}
	{/if}
</div>
