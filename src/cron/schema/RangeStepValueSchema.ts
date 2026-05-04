import { z } from "zod";
import { ValueTypeEnumSchema } from "./ValueTypeEnumSchema";

export const RangeStepValueSchema = z
	.looseObject({
		type: ValueTypeEnumSchema.extract([
			"range-step",
		]),
		min: z.number().int().nonnegative(),
		max: z.number().int().nonnegative(),
		step: z.number().int().nonnegative(),
	})
	.strip();

export type RangeStepValueSchema = typeof RangeStepValueSchema;

export namespace RangeStepValueSchema {
	export type Type = z.infer<RangeStepValueSchema>;
}
