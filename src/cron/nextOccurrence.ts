import { DateTime } from "luxon";
import { match } from "ts-pattern";
import { ScheduleError } from "./error/ScheduleError";
import type { CronItemSchema } from "./schema/CronItemSchema";
import type { CronValueSchema } from "./schema/CronValueSchema";

const range = (min: number, max: number, step = 1): number[] => {
	return Array.from(
		{
			length: Math.floor((max - min) / step) + 1,
		},
		(_, index) => min + index * step,
	);
};

const uniqSorted = (values: number[]): number[] => {
	return [
		...new Set(values),
	].sort((a, b) => a - b);
};

const available = (
	item: CronValueSchema.Type,
	min: number,
	max: number,
): [
	number,
	...number[],
] => {
	const values = match(item)
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
				return range(min, max, step);
			},
		)
		.with(
			{
				type: "range-step",
			},
			({ min, max, step }) => {
				return range(min, max, step);
			},
		)
		.exhaustive();

	/**
	 * We should already by in the "validated zone", so it **should** be safe
	 * to lie to TypeScript we've at least one guaranteed value.
	 */
	return uniqSorted(values) as [
		number,
		...number[],
	];
};

const next = (
	values: number[],
	current: number,
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
		value: values[0] ?? 0,
		overflow: true,
	};
};

export const nextOccurrence = (item: CronItemSchema.Type, referenceTimestamp: number): number => {
	/**
	 * Collect available time pieces we can work with.
	 */
	const minutes = available(item.minute, 0, 59);
	const hours = available(item.hour, 0, 23);
	const daysOfMonth = available(item.dayOfMonth, 1, 31);
	const months = available(item.month, 1, 12);
	const daysOfWeek = available(item.dayOfWeek, 0, 6);

	/**
	 * Starting point: we've timestamp as epoch seconds, force UTC timezone.
	 *
	 * Because lowest resolution are minutes, we should start at minute beginning (strange wording, isn't it?)
	 */
	let cursor = DateTime.fromSeconds(referenceTimestamp, {
		zone: "utc",
	})
		.plus({
			minutes: 1,
		})
		.startOf("minute");

	/**
	 * Yep, we're running towards some hard limit, e.g. if you want to try leap years
	 * 29th february or something like that.
	 */
	const limit = cursor.plus({
		years: 8,
	});

	/**
	 * The core: we're going though time doing various magic to match/update cursor for the next
	 * available "slot"; every value reset we've to properly update all values "around", so
	 * we won't stay with stuff like 05:40 when it should be 05:00.
	 */
	while (cursor < limit) {
		/**
		 * Resolve next month we can use.
		 *
		 * We're starting from the highest point to prevent unnecessary computations, e.g. when minute triggers
		 * hour and so on; month is last (highest) without nobody else to kick it.
		 *
		 * If we should e.g. support also years in crontab, it will be _before_ month.
		 */
		const month = next(months, cursor.month);

		/**
		 * We're out of available months, time to move to the next year.
		 *
		 * - month.value already has first available month
		 * - hours and minutes are used to reset to the first available hour/minute
		 */
		if (month.overflow) {
			cursor = DateTime.utc(cursor.year + 1, month.value, 1, hours[0], minutes[0]);

			continue;
		}

		/**
		 * Here we don't need to leap over the year, but we're jumping to the next available
		 * month while resting hours/minutes. This is optimization, so we don't need to run minute
		 * by minute.
		 */
		if (month.value !== cursor.month) {
			cursor = DateTime.utc(cursor.year, month.value, 1, hours[0], minutes[0]);

			continue;
		}

		if (cursor.daysInMonth == null) {
			throw new ScheduleError(`Invalid cursor: ${cursor.toISO()}`);
		}

		let day: number | null = null;

		/**
		 * This is little piece of crap, because...
		 *
		 * We've to fulfill _both_ daysOfMonth AND daysOfWeek as both contains
		 * available days.
		 *
		 * This piece has basically two flavors:
		 * - classic cron (DoW OR DoM)
		 * - this implementation (intuitive one I think) - both must match
		 */
		for (let candidate = cursor.day; candidate <= cursor.daysInMonth; candidate++) {
			const check = DateTime.utc(cursor.year, cursor.month, candidate);

			/**
			 * The "% 7" modulo trick is to convert Luxon 1-7 (sunday) to 0(sunday)-6 range
			 */
			if (daysOfMonth.includes(candidate) && daysOfWeek.includes(check.weekday % 7)) {
				day = candidate;
				break;
			}
		}

		/**
		 * No available day in current run, try next month
		 */
		if (day === null) {
			cursor = DateTime.utc(cursor.year, cursor.month, 1, hours[0], minutes[0]).plus({
				months: 1,
			});

			continue;
		}

		/**
		 * Another day, another round: we've to drop hours and minutes to first available in that day.
		 */
		if (day !== cursor.day) {
			cursor = cursor.set({
				day: day,
				hour: hours[0],
				minute: minutes[0],
				second: 0,
				millisecond: 0,
			});

			continue;
		}

		/**
		 * Aaaaand from here down it's the same: wait for overflow/change, update surrounding values, continue.
		 *
		 * Tadaa, simple.
		 */

		const hour = next(hours, cursor.hour);

		if (hour.overflow) {
			cursor = cursor
				.plus({
					days: 1,
				})
				.set({
					hour: hours[0],
					minute: minutes[0],
					second: 0,
					millisecond: 0,
				});

			continue;
		}

		if (hour.value !== cursor.hour) {
			cursor = cursor.set({
				hour: hour.value,
				minute: minutes[0],
				second: 0,
				millisecond: 0,
			});

			continue;
		}

		const minute = next(minutes, cursor.minute);

		if (minute.overflow) {
			cursor = cursor
				.plus({
					hours: 1,
				})
				.set({
					minute: minutes[0],
					second: 0,
					millisecond: 0,
				});

			continue;
		}

		if (minute.value !== cursor.minute) {
			cursor = cursor.set({
				minute: minute.value,
				second: 0,
				millisecond: 0,
			});

			continue;
		}

		return Math.floor(cursor.toSeconds());
	}

	throw new ScheduleError("No next occurrence found");
};
