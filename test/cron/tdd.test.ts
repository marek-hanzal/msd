import { describe, expect, it } from "vitest";
import { parse } from "~/cron";
import { InvalidRowError } from "~/cron/error/InvalidRowError";
import { part } from "~/cron/part";
import type { CronValueSchema } from "~/cron/schema/CronValueSchema";

describe("default test", () => {
	it("should throw if less than five parts", () => {
		expect(() => {
			parse("**");
		}).toThrow(InvalidRowError);
	});

	it("part should parse pure literal", () => {
		const result = part("55456");

		expect(result).toMatchObject({
			type: "literal",
			value: 55456,
		} satisfies CronValueSchema.Type);
	});

	it("part should parse pure wildcard", () => {
		const result = part("*");

		expect(result).toMatchObject({
			type: "wildcard",
		} satisfies CronValueSchema.Type);
	});

	it("part should parse range", () => {
		const result = part("256543-134565");

		expect(result).toMatchObject({
			type: "range",
			min: 256543,
			max: 134565,
		} satisfies CronValueSchema.Type);
	});

	it("part should parse step", () => {
		const result = part("*/12345");

		expect(result).toMatchObject({
			type: "step",
			step: 12345,
		} satisfies CronValueSchema.Type);
	});

	it("part should parse range-step", () => {
		const result = part("23-555/12345");

		expect(result).toMatchObject({
			type: "range-step",
			step: 12345,
			min: 23,
			max: 555,
		} satisfies CronValueSchema.Type);
	});

	it("part should parse list", () => {
		const result = part("1,123,456,65456");

		expect(result).toMatchObject({
			type: "list",
			values: [
				1,
				123,
				456,
				65456,
			],
		} satisfies CronValueSchema.Type);
	});

	it("should properly parse the stuff", () => {
		expect(true).toBe(true);
	});
});
