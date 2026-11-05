<script lang="ts" module>
	import { type CountryCode, getCountries, getCountryCallingCode } from 'libphonenumber-js';

	type Country = { dial: string; flag: string; iso: CountryCode; name: string };

	/** ISO 3166-1 alpha-2 → regional-indicator flag emoji. */
	function flagEmoji(iso: string): string {
		return iso.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
	}

	// Locale-independent country data (ISO, calling code, flag) — built once at module load.
	// Display names are locale-dependent, so they're resolved per-instance (see the script below).
	type StaticCountry = Omit<Country, 'name'>;
	const STATIC_COUNTRIES: StaticCountry[] = getCountries().map((iso) => ({
		dial: `+${getCountryCallingCode(iso)}`,
		flag: flagEmoji(iso),
		iso,
	}));
</script>

<script lang="ts">
	import type { RemoteForm } from '$app/server';
	import type { Snippet } from 'svelte';

	import { isValidPhoneNumber, parsePhoneNumberFromString } from 'libphonenumber-js';

	let {
		children,
		defaultCountry = 'US',
		form,
		locale = 'en',
		name = 'phone',
		optional = false,
		placeholder = 'Phone number',
	}: {
		/** Label content. */
		children?: Snippet;
		defaultCountry?: CountryCode;
		// Loose form typing so any remote form with a phone field can use it.
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		form: RemoteForm<any, unknown>;
		/** BCP 47 locale for the country display names (e.g. 'en', 'fr'). */
		locale?: string;
		name?: string;
		optional?: boolean;
		placeholder?: string;
	} = $props();

	const field = $derived(form.fields[name]);
	// Same source the other fields use — populated live by the parent <Form>'s `oninput`
	// revalidation, so errors appear as you type rather than only after submit.
	const issues = $derived(field.issues() ?? []);
	const required = $derived(!optional);

	// Initial country only — it intentionally doesn't react to later `defaultCountry` changes.
	// svelte-ignore state_referenced_locally
	let country = $state<CountryCode>(defaultCountry);
	let national = $state('');
	let open = $state(false);
	let search = $state('');

	// Display names are locale-dependent, so they're re-derived if `locale` changes. Deriving
	// here (not in the module script) keeps names consistent between SSR and client — the same
	// instance resolves them once — and lets a consumer localise the picker via the prop.
	const regionNames = $derived(
		typeof Intl !== 'undefined' && 'DisplayNames' in Intl
			? new Intl.DisplayNames([locale], { type: 'region' })
			: undefined
	);
	const COUNTRIES = $derived(
		STATIC_COUNTRIES.map((c) => ({ ...c, name: regionNames?.of(c.iso) ?? c.iso })).sort((a, b) =>
			a.name.localeCompare(b.name)
		)
	);

	const selected = $derived(COUNTRIES.find((c) => c.iso === country) ?? COUNTRIES[0]);

	const filtered = $derived.by(() => {
		const q = search.trim().toLowerCase();
		if (!q) return COUNTRIES;
		return COUNTRIES.filter(
			(c) => c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.iso.toLowerCase() === q
		);
	});

	/** National number + country → the canonical E.164 (or '' if unparseable). */
	function toE164(nationalNumber: string, iso: CountryCode): string {
		if (!nationalNumber.trim()) return '';
		return parsePhoneNumberFromString(nationalNumber, iso)?.number ?? '';
	}

	// The value the form submits + validates against, carried by the hidden input below.
	const e164 = $derived(toE164(national, country));

	// Live as-you-type invalidity (shown while typing a non-empty, not-yet-valid number),
	// plus any form-level issues (e.g. the required check on submit).
	const invalid = $derived(national.trim() !== '' && !isValidPhoneNumber(national, country));
	const showError = $derived(invalid || issues.length > 0);

	function selectCountry(iso: CountryCode) {
		country = iso;
		open = false;
		search = '';
	}

	function focusOnMount(node: HTMLElement) {
		node.focus();
	}
</script>

<div class="form-field">
	{#if children}
		<label class="form-label" for="{name}-input">
			{@render children()}
			{#if required}<span class="form-required-star" aria-hidden="true">*</span>{/if}
		</label>
	{/if}

	<div class="flex gap-2">
		<div class="relative shrink-0">
			<button
				class="flex h-full cursor-pointer items-center gap-1.5 rounded-md border border-[var(--bd,#e4e2e0)] bg-[var(--bg,#fff)] px-2.5 text-[13px] text-[var(--tx,#121014)]"
				aria-expanded={open}
				aria-haspopup="listbox"
				aria-label="Country code, {selected.name} {selected.dial}"
				onclick={() => (open = !open)}
				type="button"
			>
				<span class="lg">{selected.flag}</span>
				<span>{selected.dial}</span>
				<span class="sm opacity-60" aria-hidden="true">▾</span>
			</button>

			{#if open}
				<button
					class="fixed inset-0 z-40 cursor-default"
					aria-label="Close country list"
					onclick={() => {
						open = false;
						search = '';
					}}
					tabindex="-1"
					type="button"
				></button>
				<div
					class="absolute left-0 top-[calc(100%+4px)] z-50 flex w-[300px] max-w-[80vw] flex-col overflow-hidden rounded-md border border-[var(--bd,#e4e2e0)] bg-[var(--bg,#fff)] shadow-lg"
					aria-label="Countries"
					role="listbox"
				>
					<input
						class="border-0 border-b border-[var(--bd,#e4e2e0)] bg-transparent px-3 py-2 text-[var(--tx,#121014)] outline-none"
						onkeydown={(event) => {
							if (event.key === 'Enter') {
								event.preventDefault();
								if (filtered.length > 0) selectCountry(filtered[0].iso);
							} else if (event.key === 'Escape') {
								event.preventDefault();
								open = false;
								search = '';
							}
						}}
						placeholder="Search country"
						type="text"
						bind:value={search}
						use:focusOnMount
					/>
					<div class="max-h-[260px] overflow-y-auto">
						{#each filtered as c (c.iso)}
							<button
								class="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-[var(--tx,#121014)] hover:bg-[var(--sf,#f3f2f1)] {c.iso ===
								country
									? 'bg-[var(--sf,#f3f2f1)]'
									: ''}"
								aria-selected={c.iso === country}
								onclick={() => selectCountry(c.iso)}
								role="option"
								type="button"
							>
								<span class="lg">{c.flag}</span>
								<span class="min-w-0 flex-1 truncate">{c.name}</span>
								<span class="text-[var(--txs,#6b6a69)] tabular-nums">{c.dial}</span>
							</button>
						{/each}
						{#if filtered.length === 0}
							<p class="px-3 py-3 text-center text-[var(--txs,#6b6a69)]">No matches</p>
						{/if}
					</div>
				</div>
			{/if}
		</div>

		<input
			id="{name}-input"
			class="form-input min-w-0 flex-1"
			aria-invalid={showError}
			autocomplete="tel-national"
			inputmode="tel"
			{placeholder}
			type="tel"
			bind:value={national}
		/>
	</div>

	<!-- Register the value with the form (web-svelte's mechanism). `as('hidden', …)`
	     throws on empty, so render it only when there's a parseable E.164; an empty or
	     unparseable number leaves the field unset → the schema's error shows below. -->
	{#if e164}
		<input {...field.as('hidden', e164)} />
	{/if}

	{#if showError}
		<p class="form-error">{issues[0]?.message ?? 'Enter a valid phone number'}</p>
	{/if}
</div>
