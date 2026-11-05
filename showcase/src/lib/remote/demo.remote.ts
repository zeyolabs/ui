import { form } from '$app/server';
import { FormResult } from '@zeyolabs/kit/utils/form';

import { DemoContactSchema } from '#lib/schemas/demo-contact.schema.js';

// A real remote form — no database, no side effects. It exists purely so this page can
// demonstrate the actual <Form>/<Button form> submission flow, not just isolated fields.
export const demoContactForm = form(DemoContactSchema, async (data) => {
	return FormResult.ok(`Thanks, ${data.name} — this demo form doesn't save anything.`);
});
