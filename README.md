# msd
The Cron's Quest

## Packages

- vitest - obvious, I need to test & run the code somehow
- biome - I'm used to it as all-in-one format/lint
- typescript - ou yaaay!
- ts-pattern - incredibly powerful library for pattern matching, useful with discriminated unions and dynamic values (as we've here)
- zod - Scheme or not Schema, that's the Question with obvious answer

# The implementation

The whole thing may be implemented using some crazy RegExp magic, but I'm using the way I think is more expandable (e.g. to 6th/7th slot)
and clear if you get ts-pattern and Zod schemas.

The point:
- we're using discriminated unions, so we understand in each point what a value is
- we split input by empty spaces (this assumes nowhere else spaces are allowed)
- we've "part" parser which uses some small RegExp guys to understand the input translating value into discriminated values
- then we can finalize whole meaning (minute/hour/...) so we're able to validate the input with quite nice errors
