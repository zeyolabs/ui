import { SchemaForm } from '@zeyolabs/kit/utils/form';
import { Schema } from '@zeyolabs/kit/utils/schema';
import { z } from 'zod';

export const DEMO_CONTACT_TOPICS = ['general', 'billing', 'bug'] as const;

export const DemoContactSchema = z.object({
	email: Schema.Email,
	message: SchemaForm.nullable(Schema.Text.max(500)),
	name: Schema.Text.max(80),
	seats: SchemaForm.nullable(SchemaForm.Number),
	subscribe: SchemaForm.Boolean,
	topic: Schema.select(DEMO_CONTACT_TOPICS),
	urgent: SchemaForm.Boolean,
});
