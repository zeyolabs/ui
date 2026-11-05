<!--
  Compact inline stat: optional colour dot + value + muted label. A lightweight
  alternative to <Stat> for dense breakdowns where a full card wastes space.
-->
<script lang="ts">
	let { dot, label, value }: { dot?: string; label: string; value: number | string } = $props();
</script>

<div class="flex items-center gap-1.5">
	{#if dot}<span style="background: {dot};" class="w-1.5 h-1.5 shrink-0"></span>{/if}
	<span class="text-(--tx) tabular-nums">{value}</span>
	<span class="text-(--txs)">{label}</span>
</div>
