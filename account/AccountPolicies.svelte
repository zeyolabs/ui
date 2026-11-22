<script lang="ts">
	import Plus from '@lucide/svelte/icons/plus';
	import {
		deletePolicyCmd,
		getAccountMembers,
		savePolicyForm,
	} from '@zeyolabs/kit/auth/accounts/accounts.remote';
	import { AccountSchemas } from '@zeyolabs/kit/auth/accounts/schemas';
	import { toast } from 'svelte-sonner';

	import Badge from '../badge/Badge.svelte';
	import Boundary from '../boundary/Boundary.svelte';
	import Card from '../card/Card.svelte';
	import Button from '../form/Button.svelte';
	import CheckboxGroupField from '../form/fields/CheckboxGroupField.svelte';
	import TextField from '../form/fields/TextField.svelte';
	import Form from '../form/Form.svelte';
	import SkeletonText from '../skeleton/SkeletonText.svelte';
	import Span from '../text/Span.svelte';
	import Title from '../text/Title.svelte';

	/**
	 * The account's policies (`@zeyolabs/kit/auth`): the built-in ones, read-only, and the
	 * account's own, which owners can create, edit and delete from the app's permission keys.
	 */
	let { title = 'Policies' }: { title?: string } = $props();

	type Editing = { isNew: boolean; key: string; name: string; permissions: string[] };

	let editing = $state<Editing | null>(null);

	function edit(policy?: { key: string; name: string; permissions: readonly string[] }) {
		editing = policy
			? { isNew: false, key: policy.key, name: policy.name, permissions: [...policy.permissions] }
			: { isNew: true, key: '', name: '', permissions: [] };
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
			<Title level={2} size="xs">{title}</Title>
			{#if data.can.managePolicies && !editing}
				<Button onclick={() => edit()} size="sm" variant="secondary">
					<Plus size={13} /> New policy
				</Button>
			{/if}
		</div>

		<ul class="policies">
			{#each data.policies as policy (policy.key)}
				<li>
					<div class="what">
						<Span bold>{policy.name}</Span>
						<Span color="tertiary" size="sm">
							{policy.permissions.includes('*')
								? 'Everything'
								: policy.permissions.join(', ') || 'Nothing'}
						</Span>
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

		{#if editing}
			{#key editing.key || 'new'}
				<div class="editor">
					<Form
						defaults={{ key: editing.key, name: editing.name, permissions: editing.permissions }}
						form={savePolicyForm}
						hidden={editing.isNew ? undefined : { key: editing.key }}
						onSuccess={() => (editing = null)}
						schema={AccountSchemas.PolicyForm}
					>
						<div class="row">
							<TextField name="name" form={savePolicyForm} placeholder="Name, e.g. Support">
								Name
							</TextField>
							{#if editing.isNew}
								<TextField name="key" form={savePolicyForm} placeholder="key, e.g. support">
									Key
								</TextField>
							{/if}
						</div>
						<CheckboxGroupField
							name="permissions"
							form={savePolicyForm}
							getKey={(p) => p}
							getLabel={(p) => p}
							getValue={(p) => p}
							items={data.permissions}
							label="Permissions"
						/>
						<div class="row">
							<Button form={savePolicyForm} size="sm">Save policy</Button>
							<Button onclick={() => (editing = null)} size="sm" variant="ghost">Cancel</Button>
						</div>
					</Form>
				</div>
			{/key}
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
</style>
