<script lang="ts">
	import Plus from '@lucide/svelte/icons/plus';
	import {
		deletePolicyCmd,
		getAccountMembers,
		savePolicyCmd,
	} from '@zeyolabs/kit/auth/accounts.remote';
	import { toast } from 'svelte-sonner';

	import Badge from '../badge/Badge.svelte';
	import Boundary from '../boundary/Boundary.svelte';
	import Card from '../card/Card.svelte';
	import Button from '../form/Button.svelte';
	import Checkbox from '../form/primitives/Checkbox.svelte';
	import Input from '../form/primitives/Input.svelte';
	import SkeletonText from '../skeleton/SkeletonText.svelte';

	/**
	 * The account's policies (`@zeyolabs/kit/auth`): the built-in ones, read-only, and the
	 * account's own, which owners can create, edit and delete from the app's permission keys.
	 */
	let { title = 'Policies' }: { title?: string } = $props();

	type Draft = { isNew: boolean; key: string; name: string; permissions: string[] };

	let draft = $state<Draft | null>(null);
	let saving = $state(false);

	function edit(policy?: { key: string; name: string; permissions: readonly string[] }) {
		draft = policy
			? { isNew: false, key: policy.key, name: policy.name, permissions: [...policy.permissions] }
			: { isNew: true, key: '', name: '', permissions: [] };
	}

	function toggle(permission: string, on: boolean) {
		if (!draft) return;
		draft.permissions = on
			? [...draft.permissions, permission]
			: draft.permissions.filter((p) => p !== permission);
	}

	async function save() {
		if (!draft) return;
		saving = true;
		try {
			const { key, name, permissions } = draft;
			await savePolicyCmd({ key: key.trim(), name, permissions });
			toast.success(`Saved ${name}`);
			draft = null;
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Could not save the policy');
		} finally {
			saving = false;
		}
	}

	async function remove(key: string) {
		try {
			await deletePolicyCmd({ key });
			toast.success('Policy deleted');
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Could not delete the policy');
		}
	}
</script>

<Boundary message="Could not load the policies.">
	{const data = $derived(await getAccountMembers())}

	<Card gap="sm" padding="md">
		<div class="head">
			<h2 class="policies-title">{title}</h2>
			{#if data.can.managePolicies && !draft}
				<Button onclick={() => edit()} size="sm" variant="secondary">
					<Plus size={13} /> New policy
				</Button>
			{/if}
		</div>

		<ul class="policies">
			{#each data.policies as policy (policy.key)}
				<li>
					<div class="what">
						<span class="name">{policy.name}</span>
						<span class="sub">
							{policy.permissions.includes('*')
								? 'Everything'
								: policy.permissions.join(', ') || 'Nothing'}
						</span>
					</div>
					{#if policy.builtIn}
						<Badge dot={false}>Built in</Badge>
					{:else if data.can.managePolicies}
						<Button onclick={() => edit(policy)} size="sm" variant="ghost">Edit</Button>
						<Button onclick={() => remove(policy.key)} size="sm" variant="ghost-destructive">
							Delete
						</Button>
					{/if}
				</li>
			{/each}
		</ul>

		{#if draft}
			<div class="editor">
				<div class="row">
					<Input
						aria-label="Policy name"
						placeholder="Name, e.g. Support"
						bind:value={draft.name}
					/>
					<Input
						aria-label="Policy key"
						disabled={!draft.isNew}
						placeholder="key, e.g. support"
						bind:value={draft.key}
					/>
				</div>
				<div class="grants">
					{#each data.permissions as permission (permission)}
						<Checkbox
							checked={draft.permissions.includes(permission)}
							onCheckedChange={(on) => toggle(permission, on)}
						>
							{permission}
						</Checkbox>
					{/each}
				</div>
				<div class="row">
					<Button
						disabled={saving || !draft.name.trim() || !draft.key.trim()}
						onclick={save}
						size="sm"
					>
						{saving ? 'Saving…' : 'Save policy'}
					</Button>
					<Button onclick={() => (draft = null)} size="sm" variant="ghost">Cancel</Button>
				</div>
			</div>
		{/if}
	</Card>

	{#snippet pending()}
		<SkeletonText lines={4} />
	{/snippet}
</Boundary>

<style>
	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.policies-title {
		margin: 0;
		font-size: var(--text-base);
		font-weight: 600;
	}
	.policies {
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.policies li {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 0;
		border-top: 1px solid var(--bds);
	}
	.what {
		display: flex;
		flex: 1;
		flex-direction: column;
		min-width: 0;
	}
	.name {
		font-weight: 500;
	}
	.sub {
		color: var(--txt);
		font-size: 12px;
	}
	.editor {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding-top: 8px;
		border-top: 1px solid var(--bds);
	}
	.row {
		display: flex;
		gap: 8px;
	}
	.grants {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: 6px;
	}
</style>
