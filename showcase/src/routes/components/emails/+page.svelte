<script lang="ts">
	import { type EmailParams, renderEmail } from '@zeyolabs/kit/utils/email';
	import PageHero from '@zeyolabs/ui/page-hero/PageHero.svelte';

	import ShowcaseSection from '#lib/showcase/ShowcaseSection.svelte';

	// The shop's brand colours as hex (mail clients have no CSS variables). Kept in step with
	// packages/core/shopping.ts.
	const brand: EmailParams['brand'] = {
		accent: '#85b02b',
		accentDark: '#4a6a12',
		accentSoft: '#e2edb1',
		address: '59 Central Road, Worcester Park, KT4 8EB',
		name: 'Example Shop',
		supportEmail: 'support@example.com',
	};

	const order: EmailParams = {
		badge: 'Paid',
		brand,
		cta: { href: 'https://example.com/shipping', label: 'Delivery and returns' },
		eyebrow: 'Order EX-7K3M9Q',
		footnote: 'Keep this email as your receipt. Quote EX-7K3M9Q if you contact us.',
		heading: 'Thank you, Sam',
		intro: [
			'We have your order and your payment of £40.50. We will pack it carefully and send it by Royal Mail.',
			'UK orders usually arrive 2 to 10 working days after dispatch.',
		],
		preheader: 'Order EX-7K3M9Q is confirmed. Thank you for shopping with Example Shop.',
		sections: [
			{
				rows: [
					{ label: 'Espresso mini cup white', sub: '2 × £18.00', value: '£36.00' },
					{ label: 'Palm Cup Clam Design', sub: '1 × £12.00', value: '£12.00' },
				],
				title: 'Your order',
			},
			{
				rows: [
					{ label: 'Subtotal', value: '£48.00' },
					{ label: 'Delivery', value: 'Free' },
					{ label: 'Total', strong: true, value: '£48.00' },
				],
			},
			{
				lines: ['Sam Smith', '1 Test Street', 'London', 'SW1A 1AA', 'United Kingdom'],
				title: 'Delivering to',
			},
		],
	};
</script>

<svelte:head>
	<title>Emails — Zeyo UI</title>
</svelte:head>

<PageHero
	eyebrow="Components"
	sub="Transactional emails use one table-based, fully inlined shell from @zeyolabs/kit (the only markup mail clients render consistently). The shop supplies the brand colours and the wording."
	title="Emails"
/>

<ShowcaseSection
	code={`import { renderEmail, renderEmailText } from '@zeyolabs/kit/utils/email';

const html = renderEmail(params); // table layout, inline styles
const text = renderEmailText(params); // same content, plain text`}
	description="Order confirmation, rendered live from the same function the shop sends."
	title="Order confirmation"
>
	<iframe
		class="email-frame"
		sandbox=""
		srcdoc={renderEmail(order)}
		title="Order confirmation email preview"
	></iframe>
</ShowcaseSection>

<style>
	.email-frame {
		width: 100%;
		height: 980px;
		border: 1px solid var(--bd);
		border-radius: var(--radius-md);
		background: #f4f5f0;
	}
</style>
