import { z } from "zod";
import { ValueTypeEnumSchema } from "./ValueTypeEnumSchema";

const item = z.number().int().nonnegative();

export const ListValueSchema = z
	.looseObject({
		type: ValueTypeEnumSchema.extract([
			"list",
		]),
		values: z.tuple(
			[
				item,
			],
			item,
		),
	})
	.strip();

export type ListValueSchema = typeof ListValueSchema;

export namespace ListValueSchema {
	export type Type = z.infer<ListValueSchema>;
}
