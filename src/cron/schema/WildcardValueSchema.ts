import { z } from "zod";
import { ValueTypeEnumSchema } from "./ValueTypeEnumSchema";

export const WildcardValueSchema = z
	.looseObject({
		type: ValueTypeEnumSchema.extract([
			"wildcard",
		]),
	})
	.strip();

export type WildcardValueSchema = typeof WildcardValueSchema;

export namespace WildcardValueSchema {
	export type Type = z.infer<WildcardValueSchema>;
}
