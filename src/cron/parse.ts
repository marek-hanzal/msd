import { InvalidRowError } from "./error/InvalidRowError";
import { part } from "./part";
import type { CronItemSchema } from "./schema/CronItemSchema";
import { validator } from "./validator";

export const parse = (expression: string): CronItemSchema.Type => {
	const parts = expression.trim().split(/\s+/u) as [
		string,
		string,
		string,
		string,
		string,
	];

	if (parts.length < 5) {
		throw new InvalidRowError(`Missing parts (we've [${parts.length}])`);
	}

	if (parts.length > 5) {
		throw new InvalidRowError(`Extra parts (we've [${parts.length}]), expected 5`);
	}

	const minute = part(parts[0]);
	const hour = part(parts[1]);
	const dayOfMonth = part(parts[2]);
	const month = part(parts[3]);
	const dayOfWeek = part(parts[4]);

	const result = {
		minute,
		hour,
		dayOfMonth,
		month,
		dayOfWeek,
	} satisfies CronItemSchema.Type;

	validator(result);

	return result;
};
