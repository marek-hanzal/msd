import { z } from "zod";
import { ValueTypeEnumSchema } from "./ValueTypeEnumSchema";

export const StepValueSchema = z
	.looseObject({
		type: ValueTypeEnumSchema.extract([
			"step",
		]),
		step: z.number().int().nonnegative(),
	})
	.strip();

export type StepValueSchema = typeof StepValueSchema;

export namespace StepValueSchema {
	export type Type = z.infer<StepValueSchema>;
}
