<script lang="ts">
	interface Props {
		percent: number;
		size?: number;
		strokeWidth?: number;
		label?: string;
	}

	let { percent, size = 120, strokeWidth = 8, label }: Props = $props();

	const radius = $derived((size - strokeWidth) / 2);
	const circumference = $derived(2 * Math.PI * radius);
	const dashOffset = $derived(circumference - (percent / 100) * circumference);

	const colorClass = $derived(
		percent >= 80 ? 'stroke-emerald-500' : percent >= 50 ? 'stroke-amber-500' : 'stroke-red-500'
	);
</script>

<div class="relative inline-flex items-center justify-center" style:width="{size}px" style:height="{size}px">
	<svg class="-rotate-90" width={size} height={size}>
		<circle
			cx={size / 2}
			cy={size / 2}
			r={radius}
			fill="none"
			stroke-width={strokeWidth}
			class="stroke-gray-200"
		/>
		<circle
			cx={size / 2}
			cy={size / 2}
			r={radius}
			fill="none"
			stroke-width={strokeWidth}
			stroke-linecap="round"
			class={colorClass}
			stroke-dasharray={circumference}
			stroke-dashoffset={dashOffset}
			style="transition: stroke-dashoffset 0.6s ease"
		/>
	</svg>
	<div class="absolute text-center">
		<span class="text-xl font-bold text-gray-900">{percent}%</span>
		{#if label}
			<span class="block text-[10px] text-gray-400">{label}</span>
		{/if}
	</div>
</div>
