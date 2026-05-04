import { z } from "zod";
import { CronValueSchema } from "./CronValueSchema";

export const CronItemSchema = z
	.looseObject({
		minute: CronValueSchema,
		hour: CronValueSchema,
		dayOfMonth: CronValueSchema,
		month: CronValueSchema,
		dayOfWeek: CronValueSchema,
	})
	.strip();

export type CronItemSchema = typeof CronItemSchema;

export namespace CronItemSchema {
	export type Type = z.infer<CronItemSchema>;
}
