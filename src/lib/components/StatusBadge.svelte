<script lang="ts">
	interface Props {
		status: string;
		size?: 'sm' | 'md';
	}

	let { status, size = 'md' }: Props = $props();

	const statusMap: Record<string, { label: string; bg: string; text: string; dot: string }> = {
		active: { label: 'Active', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
		operational: { label: 'Operational', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
		compliant: { label: 'Compliant', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
		in_progress: { label: 'In Progress', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
		partially_compliant: { label: 'Partial', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
		planned: { label: 'Planned', bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400' },
		non_compliant: { label: 'Non-Compliant', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
		deprecated: { label: 'Deprecated', bg: 'bg-gray-50', text: 'text-gray-500', dot: 'bg-gray-400' },
		not_applicable: { label: 'N/A', bg: 'bg-gray-50', text: 'text-gray-500', dot: 'bg-gray-400' }
	};

	const resolved = $derived(
		statusMap[status?.toLowerCase()] || { label: status || 'Unknown', bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400' }
	);

	const sizeClass = $derived(size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1');
</script>

<span class="inline-flex items-center gap-1.5 rounded-full font-medium {resolved.bg} {resolved.text} {sizeClass}">
	<span class="h-1.5 w-1.5 rounded-full {resolved.dot}"></span>
	{resolved.label}
</span>
