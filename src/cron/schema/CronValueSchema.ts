import { z } from "zod";
import { ListValueSchema } from "./ListValueSchema";
import { LiteralValueSchema } from "./LiteralValueSchema";
import { RangeStepValueSchema } from "./RangeStepValueSchema";
import { RangeValueSchema } from "./RangeValueSchema";
import { StepValueSchema } from "./StepValueSchema";
import { WildcardValueSchema } from "./WildcardValueSchema";

export const CronValueSchema = z.discriminatedUnion("type", [
	LiteralValueSchema,
	WildcardValueSchema,
	RangeValueSchema,
	StepValueSchema,
	RangeStepValueSchema,
	ListValueSchema,
]);

export type CronValueSchema = typeof CronValueSchema;

export namespace CronValueSchema {
	export type Type = z.infer<CronValueSchema>;
}
