# msd
The Cron's Quest

## Packages

- vitest - obvious, I need to test & run the code somehow
- biome - I'm used to it as all-in-one format/lint
- typescript - ou yaaay!
- ts-pattern - incredibly powerful library for pattern matching, useful with discriminated unions and dynamic values (as we've here)
- zod - Scheme or not Schema, that's the Question with obvious answer
- luxon - we're heavy on time operations and this lib has pretty nice API to work with (aaaand I'm used to it)

## The implementation

The whole thing may be implemented using some crazy RegExp magic, but I'm using the way I think is more expandable (e.g. to 6th/7th slot)
and clear if you get ts-pattern and Zod schemas.

The point:
- we're using discriminated unions, so we understand in each point what a value is
- we split input by empty spaces (this assumes nowhere else spaces are allowed)
- we've "part" parser which uses some small RegExp guys to understand the input translating value into discriminated values
- then we can finalize whole meaning (minute/hour/...) so we're able to validate the input with quite nice errors

## To Be Honest - Part 01

I've chosen TypeScript as it's my native language, almost like talking Czech (thou my girlfriend does not find this funny). If I would
write this software using Rust, it will be more "hey, Codex, do the thing" than me showcasing how I approach the solution using
tools I'm familiar with.

## To Be Honest - Part 02

LLM. Cron parsing stuff (that easier part) is done purely by hand (I don't have Cursor subscription... ou, I don't event have Cursor anymore :D ).

But...

...the "nextOccurrence" was a bit of nut to crack, so I had overall idea how to do the thing, which data I need, how to approach it,
but it's more ChatGPT's handwork, than mine - it's not blind copy-paste, but you may feel it's more LLM-ish, than the rest of codebase.

It's been healthy cooperation, when I was trying to push GPT to one direction, but it was really stubborn and forced me to use the one
I'm presenting you - and yes, it's correct.

## Tests

I've used TDD during this quest, some tests are written by hand, some are generated to find some edge-cases, but in general I understand
what tests are doing.
