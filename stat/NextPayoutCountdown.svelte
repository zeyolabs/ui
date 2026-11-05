<script lang="ts">
	import {
		getLocalTimeZone,
		now,
		today,
		toZoned,
		type ZonedDateTime,
	} from '@internationalized/date';
	// The next affiliate payout run — the 1st of next month, at midnight in the viewer's own
	// timezone. Shared by apps/affiliate's payments page and apps/admin's affiliate drawer so
	// admins see the same clock affiliates do.
	import { Datetime } from '@zeyolabs/kit/utils/datetime';

	import ValueBox from './ValueBox.svelte';

	let nextPayoutDate = $state<null | ZonedDateTime>(null);
	let payoutCountdownMs = $state(0);

	// $effect (not top-level script) because getLocalTimeZone() reads the runtime's zone; running
	// this during SSR would compute the server's zone instead of the browser's.
	$effect(() => {
		const zone = getLocalTimeZone();
		const firstOfThisMonth = today(zone).set({ day: 1 });
		const target = toZoned(firstOfThisMonth.add({ months: 1 }), zone);
		nextPayoutDate = target;

		const tick = () => {
			payoutCountdownMs = Math.max(0, target.compare(now(zone)));
		};
		tick();
		const interval = setInterval(tick, 1000);
		return () => clearInterval(interval);
	});

	const payoutCountdownText = $derived.by(() => {
		const totalSeconds = Math.floor(payoutCountdownMs / 1000);
		const pad = (n: number) => String(n).padStart(2, '0');
		return [
			Math.floor(totalSeconds / 3600),
			Math.floor((totalSeconds % 3600) / 60),
			totalSeconds % 60,
		]
			.map(pad)
			.join(':');
	});
</script>

<ValueBox
	label="Next payout date"
	value={nextPayoutDate ? Datetime.formatLocalDateNum(nextPayoutDate) : '—'}
/>
<ValueBox label="Time remaining" value={payoutCountdownText} />
