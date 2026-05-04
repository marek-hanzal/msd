import { match } from "ts-pattern";
import { ValidationError } from "./error/ValidationError";
import type { CronItemSchema } from "./schema/CronItemSchema";

/**
 * Here I'm not using Zod, because requirements said: readable errors.
 *
 * Zod is far from "Readable Errors".
 */

export const validateMinMax = (min: number, max: number) => {
	if (min > max) {
		throw new ValidationError(`Min [${min}] is higher than max [${max}]`);
	}
};
export const validateMinute = (value: number) => {
	if (value < 0 || value > 59) {
		throw new ValidationError(`Invalid minute value [${value}]`);
	}
};
export const validateHour = (value: number) => {
	if (value < 0 || value > 23) {
		throw new ValidationError(`Invalid hour value [${value}]`);
	}
};
export const validateMonth = (value: number) => {
	if (value < 1 || value > 12) {
		throw new ValidationError(`Invalid month value [${value}]`);
	}
};
export const validateDayOfWeek = (value: number) => {
	if (value < 0 || value > 6) {
		throw new ValidationError(`Invalid day-of-week value [${value}]`);
	}
};
export const validateDayOfMonth = (value: number) => {
	if (value < 1 || value > 31) {
		throw new ValidationError(`Invalid day-of-month value [${value}]`);
	}
};

/**
 * May be split into pieces, but for this usecase it's enough.
 *
 * Validates ranges and values so they makes sense.
 *
 * This method knows semantics of each field and is simply able to implement
 * any validation logic, but I'll keep the implementation somehow compact, so you know
 * that I know :)
 */
export const validator = (item: CronItemSchema.Type) => {
	/**
	 * Minute validation
	 */
	match(item.minute)
		.with(
			{
				type: "literal",
			},
			({ value }) => {
				validateMinute(value);
			},
		)
		.with(
			{
				type: "range",
			},
			({ min, max }) => {
				validateMinute(min);
				validateMinute(max);
				validateMinMax(min, max);
			},
		)
		.with(
			{
				type: "wildcard",
			},
			() => {
				// noop
			},
		)
		.with(
			{
				type: "step",
			},
			({ step }) => {
				/**
				 * Assuming step is not overflowing
				 */
				validateMinute(step);
			},
		)
		.with(
			{
				type: "range-step",
			},
			({ step, min, max }) => {
				validateMinute(step);
				validateMinute(min);
				validateMinute(max);
				validateMinMax(min, max);
			},
		)
		.with(
			{
				type: "list",
			},
			({ values }) => {
				values.map(validateMinute);
			},
		)
		.exhaustive();

	/**
	 * Hour validation
	 */
	match(item.hour)
		.with(
			{
				type: "literal",
			},
			({ value }) => {
				validateHour(value);
			},
		)
		.with(
			{
				type: "range",
			},
			({ min, max }) => {
				validateHour(min);
				validateHour(max);
				validateMinMax(min, max);
			},
		)
		.with(
			{
				type: "wildcard",
			},
			() => {
				// noop
			},
		)
		.with(
			{
				type: "step",
			},
			({ step }) => {
				/**
				 * Assuming step is not overflowing
				 */
				validateHour(step);
			},
		)
		.with(
			{
				type: "range-step",
			},
			({ step, min, max }) => {
				validateHour(step);
				validateHour(min);
				validateHour(max);
				validateMinMax(min, max);
			},
		)
		.with(
			{
				type: "list",
			},
			({ values }) => {
				values.map(validateHour);
			},
		)
		.exhaustive();

	/**
	 * Month validation
	 */
	match(item.month)
		.with(
			{
				type: "literal",
			},
			({ value }) => {
				validateMonth(value);
			},
		)
		.with(
			{
				type: "range",
			},
			({ min, max }) => {
				validateMonth(min);
				validateMonth(max);
				validateMinMax(min, max);
			},
		)
		.with(
			{
				type: "wildcard",
			},
			() => {
				// noop
			},
		)
		.with(
			{
				type: "step",
			},
			({ step }) => {
				/**
				 * Assuming step is not overflowing
				 */
				validateMonth(step);
			},
		)
		.with(
			{
				type: "range-step",
			},
			({ step, min, max }) => {
				validateMonth(step);
				validateMonth(min);
				validateMonth(max);
				validateMinMax(min, max);
			},
		)
		.with(
			{
				type: "list",
			},
			({ values }) => {
				values.map(validateMonth);
			},
		)
		.exhaustive();

	/**
	 * Day of week validation
	 */
	match(item.dayOfWeek)
		.with(
			{
				type: "literal",
			},
			({ value }) => {
				validateDayOfWeek(value);
			},
		)
		.with(
			{
				type: "range",
			},
			({ min, max }) => {
				validateDayOfWeek(min);
				validateDayOfWeek(max);
				validateMinMax(min, max);
			},
		)
		.with(
			{
				type: "wildcard",
			},
			() => {
				// noop
			},
		)
		.with(
			{
				type: "step",
			},
			({ step }) => {
				/**
				 * Assuming step is not overflowing
				 */
				validateDayOfWeek(step);
			},
		)
		.with(
			{
				type: "range-step",
			},
			({ step, min, max }) => {
				validateDayOfWeek(step);
				validateDayOfWeek(min);
				validateDayOfWeek(max);
				validateMinMax(min, max);
			},
		)
		.with(
			{
				type: "list",
			},
			({ values }) => {
				values.map(validateDayOfWeek);
			},
		)
		.exhaustive();

	/**
	 * Day of month validation
	 */
	match(item.dayOfMonth)
		.with(
			{
				type: "literal",
			},
			({ value }) => {
				validateDayOfMonth(value);
			},
		)
		.with(
			{
				type: "range",
			},
			({ min, max }) => {
				validateDayOfMonth(min);
				validateDayOfMonth(max);
				validateMinMax(min, max);
			},
		)
		.with(
			{
				type: "wildcard",
			},
			() => {
				// noop
			},
		)
		.with(
			{
				type: "step",
			},
			({ step }) => {
				/**
				 * Assuming step is not overflowing
				 */
				validateDayOfMonth(step);
			},
		)
		.with(
			{
				type: "range-step",
			},
			({ step, min, max }) => {
				validateDayOfMonth(step);
				validateDayOfMonth(min);
				validateDayOfMonth(max);
				validateMinMax(min, max);
			},
		)
		.with(
			{
				type: "list",
			},
			({ values }) => {
				values.map(validateDayOfMonth);
			},
		)
		.exhaustive();
};
