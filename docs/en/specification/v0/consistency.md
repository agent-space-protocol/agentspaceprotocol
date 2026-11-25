---
title: Consistency
description: Constraints, atomic commits and honesty about external state.
---

## Constraints and atomic commits

Each space declares its constraints in its vocabulary: the types of things and properties, ranges
of values, rules of relations (a thing is in one place at a time, for example), and its own
conservation laws and bounds.

All the changes an action or an edit causes MUST take effect atomically:

- either all of them, with every constraint still holding, recorded together with the outcome;
- or none of them, with the outcome `refused`, the reason `constraint`, and the name of the
  constraint that would have broken in `reason.data.constraint`. The state and the record are
  unchanged, apart from the `asp.act` and `asp.outcome` entries themselves.

Edits have no privilege and go through the same checks.

## Observations agree with the record

An observation at sequence number `n` reflects every entry up to `n` and nothing after it.
Observations by the same role at the same `n` have the same content. Observations never break a
declared constraint.

## External state: consistency is honesty

For a space whose state is outside (`state: "external"`), consistency means honesty:

- The state an adapter reports is what the outside system confirmed, with the time it was
  confirmed (`confirmed`).
- What it can check before acting, such as parameters, ranges and safety rules, it checks, and
  refuses when the check fails.
- What the outside system does afterwards it reports as it is, inventing nothing that is not there,
  and gives `unknown` with what it knows when it cannot confirm.
- It cannot stop others from changing things in the outside system; `basis` detects staleness, and
  events with the source `outside` tell participants what others changed.
