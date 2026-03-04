<script lang="ts">
	interface Props {
		title: string;
		value: string | number;
		icon: string;
		color?: string;
		subtitle?: string;
	}

	let { title, value, icon, color = 'text-blue-600', subtitle }: Props = $props();
</script>

<div class="rounded-xl border border-gray-200 bg-white p-5">
	<div class="flex items-center gap-3">
		<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50">
			<i class="{icon} {color}"></i>
		</div>
		<div>
			<p class="text-sm text-gray-500">{title}</p>
			<p class="text-2xl font-semibold text-gray-900">{value}</p>
		</div>
	</div>
	{#if subtitle}
		<p class="mt-2 text-xs text-gray-400">{subtitle}</p>
	{/if}
</div>
