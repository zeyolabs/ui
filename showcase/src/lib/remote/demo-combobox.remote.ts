import { form } from '$app/server';
import { FormResult } from '@zeyolabs/kit/utils/form';

import { DemoComboboxSchema } from '#lib/schemas/demo-combobox.schema.js';

// A real remote form — no database, no side effects. Dedicated to the Combobox/OptionsField
// showcase so it doesn't share (and risk colliding with) the general Forms page's demo form.
export const demoComboboxForm = form(DemoComboboxSchema, async (data) => {
	return FormResult.ok(
		`Saved (demo only) — topic: ${data.topic}, stack: ${data.stack.join(', ') || 'none'}, priority: ${data.priority}.`
	);
});
