import { z } from "zod";

/**
 * Supported values, used as discriminant.
 */
export const ValueTypeEnumSchema = z.enum([
	"literal",
	"wildcard",
	"range",
	"step",
	"range-step",
	"list",
]);

export type ValueTypeEnumSchema = typeof ValueTypeEnumSchema;

export namespace ValueTypeEnumSchema {
	export type Type = z.infer<ValueTypeEnumSchema>;
}
