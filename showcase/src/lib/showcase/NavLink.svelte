<script lang="ts">
	import type { Component } from 'svelte';

	import { page } from '$app/state';
	import SidebarItem from '@zeyolabs/ui/sidebar/SidebarItem.svelte';

	let { href, icon, label }: { href: string; icon?: Component<{ size?: number }>; label: string } =
		$props();
</script>

<SidebarItem current={page.url.pathname === href} {href} {icon}>{label}</SidebarItem>
