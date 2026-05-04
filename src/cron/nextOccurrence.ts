import { DateTime } from "luxon";
import { match } from "ts-pattern";
import type { CronItemSchema } from "./schema/CronItemSchema";
import type { CronValueSchema } from "./schema/CronValueSchema";

const range = (min: number, max: number): number[] => {
	return Array.from(
		{
			length: max - min + 1,
		},
		(_, index) => min + index,
	);
};

const stepRange = (min: number, max: number, step: number): number[] => {
	return Array.from(
		{
			length: Math.floor((max - min) / step) + 1,
		},
		(_, index) => min + index * step,
	);
};

const allowedValues = (item: CronValueSchema.Type, min: number, max: number) => {
	return match(item)
		.with(
			{
				type: "wildcard",
			},
			() => {
				return range(min, max);
			},
		)
		.with(
			{
				type: "literal",
			},
			({ value }) => {
				return [
					value,
				];
			},
		)
		.with(
			{
				type: "list",
			},
			({ values }) => {
				return values;
			},
		)
		.with(
			{
				type: "range",
			},
			({ min, max }) => {
				return range(min, max);
			},
		)
		.with(
			{
				type: "step",
			},
			({ step }) => {
				return stepRange(min, max, step);
			},
		)
		.with(
			{
				type: "range-step",
			},
			({ min, max, step }) => {
				return stepRange(min, max, step);
			},
		)
		.exhaustive();
};

const next = (
	values: number[],
	current: number,
	zero: number = 0,
): {
	value: number;
	overflow: boolean;
} => {
	for (const value of values) {
		if (value >= current) {
			return {
				value,
				overflow: false,
			};
		}
	}

	return {
		value: values[0] ?? zero,
		overflow: true,
	};
};

export const nextOccurrence = (item: CronItemSchema.Type, referenceTimestamp: number) => {
	const cursor = DateTime.fromMillis(referenceTimestamp, {
		zone: "utc",
	});

	const minutes = allowedValues(item.minute, 0, 59);
	const nextMinute = next(minutes, cursor.minute);
	//
	const hours = allowedValues(item.hour, 0, 23);
	const nextHour = next(hours, cursor.hour + (nextMinute.overflow ? 1 : 0));
	//
	const months = allowedValues(item.month, 1, 12);
	const nextMonth = next(months, cursor.month + (nextHour.overflow ? 1 : 0));
	//
	const daysOfMonth = allowedValues(item.dayOfMonth, 1, 31);
	const daysOfWeek = allowedValues(item.dayOfWeek, 0, 6);

	console.log("allowed minutes", {
		minutes,
		nextMinute,
		hours,
		nextHour,
		months,
		nextMonth,
		daysOfMonth,
		daysOfWeek,
	});
};
