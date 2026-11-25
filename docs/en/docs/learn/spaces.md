---
title: Spaces
description: State, laws, participants, the three properties, and capabilities.
---

A space is made of three things: a **state**, a set of typed things and the relations between them; **laws**, which decide the outcome of everything that happens; and **participants**, who observe and act in it.

## Three properties

Every space keeps three promises that participants can check through the protocol:

- **Consistent**: every observation carries a record sequence number, satisfies the constraints the space declares and agrees with the record; in the real world, it reports what the sensors confirmed and when.
- **Complete**: every action and edit with an ID gets exactly one final outcome, every verb has a default outcome, and every undeclared capability is a clear “unsupported”.
- **Recorded**: actions, outcomes, edits and events are appended to the record, each exactly once.

See [Three properties](../../../specification/draft/properties/).

## Capabilities

Every other difference between spaces is a declared capability: where the state is, lifetime, participants and roles, observation and input forms, editing, saving, episodes, pace, consent, pausing, derived observations and doors; the views extension adds a space's own interfaces. A capability a space has not declared is unsupported, and using it gets “unsupported”, never silence. See [Capabilities](../../../specification/draft/capabilities/).

## Vocabulary

Each space publishes a vocabulary: the types of things (each with at most one parent), relations, verbs with their parameters, outcomes, defaults and class of effect, events, constraints, forms, and pages for models to read. A participant that knows the protocol but not the space learns from the vocabulary what it can see and do. See [Vocabulary](../../../specification/draft/vocabulary/).
