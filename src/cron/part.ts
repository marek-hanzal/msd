import { match } from "ts-pattern";
import { InvalidExpressionError } from "./error/InvalidExpressionError";
import type { CronValueSchema } from "./schema/CronValueSchema";

const Literal = /^[0-9]+$/u;
const Range = /^(?<min>[0-9]+)-(?<max>[0-9]+)$/u;
const RangeStep = /^(?<min>[0-9]+)-(?<max>[0-9]+)\/(?<step>[0-9]+)$/u;
const Step = /^\*\/(?<step>[0-9]+)$/u;
const List = /^[0-9]+(?:,[0-9]+)+$/u;

export const part = (expression: string): CronValueSchema.Type => {
	return match(expression)
		.when(
			() => {
				return Literal.test(expression);
			},
			() => {
				return {
					type: "literal",
					value: Number(expression),
				} satisfies CronValueSchema.Type;
			},
		)
		.when(
			() => {
				return Range.test(expression);
			},
			() => {
				const groups = Range.exec(expression);

				if (!groups) {
					throw new InvalidExpressionError(`Cannot parse range groups [${expression}]`);
				}

				return {
					type: "range",
					min: Number(groups.groups?.min),
					max: Number(groups.groups?.max),
				} satisfies CronValueSchema.Type;
			},
		)
		.when(
			() => {
				return Step.test(expression);
			},
			() => {
				const groups = Step.exec(expression);

				if (!groups) {
					throw new InvalidExpressionError(`Cannot parse step group [${expression}]`);
				}

				return {
					type: "step",
					step: Number(groups.groups?.step),
				} satisfies CronValueSchema.Type;
			},
		)
		.when(
			() => {
				return RangeStep.test(expression);
			},
			() => {
				const groups = RangeStep.exec(expression);

				if (!groups) {
					throw new InvalidExpressionError(
						`Cannot parse range-step group [${expression}]`,
					);
				}

				return {
					type: "range-step",
					step: Number(groups.groups?.step),
					min: Number(groups.groups?.min),
					max: Number(groups.groups?.max),
				} satisfies CronValueSchema.Type;
			},
		)
		.when(
			() => {
				return List.test(expression);
			},
			() => {
				const items = expression.split(",");

				if (!items.length) {
					throw new InvalidExpressionError(`Invalid list items [${expression}]`);
				}

				return {
					type: "list",
					values: items.map((item) => Number(item)) as [
						number,
						...number[],
					],
				} satisfies CronValueSchema.Type;
			},
		)
		.when(
			() => {
				return Literal.test(expression);
			},
			() => {
				return {
					type: "literal",
					value: Number(expression),
				} satisfies CronValueSchema.Type;
			},
		)
		.when(
			() => {
				return expression === "*";
			},
			() => {
				return {
					type: "wildcard",
				} satisfies CronValueSchema.Type;
			},
		)
		.otherwise(() => {
			throw new InvalidExpressionError(`Cannot swallow given expression [${expression}]`);
		});
};
