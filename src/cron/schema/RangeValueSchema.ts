import { z } from "zod";
import { ValueTypeEnumSchema } from "./ValueTypeEnumSchema";

export const RangeValueSchema = z
	.looseObject({
		type: ValueTypeEnumSchema.extract([
			"range",
		]),
		min: z.number().int().nonnegative(),
		max: z.number().int().nonnegative(),
	})
	.strip();

export type RangeValueSchema = typeof RangeValueSchema;

export namespace RangeValueSchema {
	export type Type = z.infer<RangeValueSchema>;
}
