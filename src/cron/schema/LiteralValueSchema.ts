import { z } from "zod";
import { ValueTypeEnumSchema } from "./ValueTypeEnumSchema";

export const LiteralValueSchema = z
	.looseObject({
		type: ValueTypeEnumSchema.extract([
			"literal",
		]),
		value: z.number().int().nonnegative(),
	})
	.strip();

export type LiteralValueSchema = typeof LiteralValueSchema;

export namespace LiteralValueSchema {
	export type Type = z.infer<LiteralValueSchema>;
}
