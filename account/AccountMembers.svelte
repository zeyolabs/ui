<script lang="ts">
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import UserPlus from '@lucide/svelte/icons/user-plus';
	import { InviteSchema } from '@zeyolabs/kit/auth/account-schemas';
	import {
		getAccountMembers,
		inviteMemberForm,
		removeMemberCmd,
		revokeInviteCmd,
		setMemberPolicyCmd,
	} from '@zeyolabs/kit/auth/accounts.remote';
	import { toast } from 'svelte-sonner';

	import Badge from '../badge/Badge.svelte';
	import Boundary from '../boundary/Boundary.svelte';
	import Card from '../card/Card.svelte';
	import Button from '../form/Button.svelte';
	import { EmailField, SelectField } from '../form/fields/index';
	import Form from '../form/Form.svelte';
	import Select from '../form/primitives/Select.svelte';
	import SkeletonText from '../skeleton/SkeletonText.svelte';

	/**
	 * Members of the request's account (`@zeyolabs/kit/auth`): who is in it, with which policy,
	 * pending invites, and an invite form. Controls appear only when the caller's policy allows
	 * them; the server checks again on every change.
	 */
	let { title = 'Members' }: { title?: string } = $props();

	type PolicyOption = { key: string; name: string };

	const day = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' });

	async function run(work: () => Promise<unknown>, done?: string) {
		try {
			await work();
			if (done) toast.success(done);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Something went wrong');
		}
	}
</script>

<Boundary message="Could not load the members.">
	{const data = $derived(await getAccountMembers())}
	{const assignable = $derived(
		data.policies.filter((p) => p.key !== 'owner' || data.me.policy === 'owner') as PolicyOption[]
	)}
	{const policyName = (key: string) => data.policies.find((p) => p.key === key)?.name ?? key}

	<Card gap="sm" padding="md">
		<h2 class="account-title">{title}</h2>
		<ul class="account-list">
			{#each data.members as member (member.userId)}
				<li>
					<div class="who">
						<span class="name">{member.name}</span>
						<span class="sub">{member.email}</span>
					</div>
					{#if data.can.manage && member.userId !== data.me.userId && (member.policy !== 'owner' || data.me.policy === 'owner')}
						<Select
							class="policy"
							getKey={(p: PolicyOption) => p.key}
							getLabel={(p: PolicyOption) => p.name}
							getValue={(p: PolicyOption) => p.key}
							items={assignable}
							onchange={(policy) =>
								policy &&
								policy !== member.policy &&
								run(() => setMemberPolicyCmd({ policy, userId: member.userId }), 'Policy changed')}
							placeholder="Policy"
							value={member.policy}
						/>
						<Button
							aria-label="Remove {member.email}"
							icon
							onclick={() =>
								run(() => removeMemberCmd({ userId: member.userId }), `Removed ${member.email}`)}
							size="sm"
							variant="ghost-destructive"
						>
							<Trash2 size={13} />
						</Button>
					{:else}
						<Badge color={member.policy === 'owner' ? 'purple' : 'secondary'}>
							{policyName(member.policy)}
						</Badge>
					{/if}
				</li>
			{/each}
		</ul>

		{#if data.invites.length}
			<h3 class="account-subtitle">Pending invitations</h3>
			<ul class="account-list">
				{#each data.invites as invite (invite.email)}
					<li>
						<div class="who">
							<span class="name">{invite.email}</span>
							<span class="sub">
								{policyName(invite.policy)}, expires {day.format(invite.expiresAt)}
							</span>
						</div>
						{#if data.can.invite}
							<Button
								onclick={() =>
									run(() => revokeInviteCmd({ email: invite.email }), 'Invitation revoked')}
								size="sm"
								variant="ghost"
							>
								Revoke
							</Button>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}

		{#if data.can.invite}
			<Form class="account-invite" form={inviteMemberForm} schema={InviteSchema}>
				<EmailField name="email" form={inviteMemberForm} placeholder="name@example.com">
					Invite by email
				</EmailField>
				<SelectField
					name="policy"
					form={inviteMemberForm}
					getKey={(p: PolicyOption) => p.key}
					getLabel={(p: PolicyOption) => p.name}
					getValue={(p: PolicyOption) => p.key}
					items={assignable}
					label="Policy"
					placeholder="Choose a policy"
				/>
				<Button form={inviteMemberForm}><UserPlus size={14} /> Invite</Button>
			</Form>
		{/if}
	</Card>

	{#snippet pending()}
		<SkeletonText lines={5} />
	{/snippet}
</Boundary>

<style>
	.account-title {
		margin: 0;
		font-size: var(--text-base);
		font-weight: 600;
	}
	.account-subtitle {
		margin: 4px 0 0;
		font-size: 12px;
		font-weight: 600;
		color: var(--txs);
	}
	.account-list {
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.account-list li {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 0;
		border-top: 1px solid var(--bds);
	}
	.who {
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
	.account-list :global(.policy) {
		width: 160px;
	}
	:global(form.account-invite) {
		display: grid;
		grid-template-columns: 2fr 1fr auto;
		gap: 8px;
		align-items: end;
		padding-top: 8px;
		border-top: 1px solid var(--bds);
	}
	@media (max-width: 640px) {
		:global(form.account-invite) {
			grid-template-columns: 1fr;
		}
	}
</style>
