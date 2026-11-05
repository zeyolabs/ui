import { Schema } from '@zeyolabs/kit/utils/schema';
import { z } from 'zod';

export const DEMO_COMBOBOX_TOPICS = ['general', 'billing', 'bug'] as const;

export const DEMO_COMBOBOX_FRAMEWORKS = [
	'svelte',
	'react',
	'vue',
	'solid',
	'qwik',
	'astro',
] as const;

export const DEMO_COMBOBOX_PRIORITIES = ['low', 'normal', 'high'] as const;

export const DemoComboboxSchema = z.object({
	priority: Schema.select(DEMO_COMBOBOX_PRIORITIES),
	stack: z.array(z.enum(DEMO_COMBOBOX_FRAMEWORKS)).default([]),
	topic: Schema.select(DEMO_COMBOBOX_TOPICS),
});
