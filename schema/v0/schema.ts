/**
 * Agent Space Protocol (ASP), v0: every part at version 0, frozen on 2026-11-25.
 *
 * This file is the single source of the protocol's messages. `schema.json` (JSON Schema 2020-12)
 * and the reference documentation are generated from it; never edit them by hand.
 *
 * Every message is one JSON object with a `type`. A request carries an `id`, unique for the
 * participant that sends it. Unknown fields must be ignored and passed on unchanged, so every
 * object here accepts members it does not list; extensions put their members under a namespace
 * (`"x.example.field"` or a member whose name contains a dot).
 *
 * Parts and versions: the protocol is divided into parts (`core` and one part per capability that
 * has messages). Every part has an integer version of its own. All parts are at version 0 in this
 * release, which only grows by addition.
 *
 * @module
 */

/* ───────────────────────────── Basic values ───────────────────────────── */

/**
 * The ID of a request: an action, an edit or any other message that expects an answer.
 * Unique for the participant that sends it, for at least as long as the space keeps its record.
 *
 * @minLength 1
 * @maxLength 128
 */
export type RequestId = string;

/**
 * A record sequence number. The record of a space starts at 1 and every entry takes the next number.
 *
 * @TJS-type integer
 * @minimum 0
 */
export type Seq = number;

/**
 * An integer version of one part of the protocol.
 *
 * @TJS-type integer
 * @minimum 0
 */
export type PartVersion = number;

/**
 * A time as an RFC 3339 string in UTC, for example `2026-11-24T21:05:12Z`.
 *
 * @format date-time
 */
export type Time = string;

/**
 * A content hash: `sha256:` followed by 64 lowercase hexadecimal digits. Structured content is
 * hashed in its RFC 8785 canonical JSON form.
 *
 * @pattern ^sha256:[0-9a-f]{64}$
 */
export type Hash = string;

/**
 * The identity of a participant or a space: `ed25519:` followed by the unpadded base64url form of
 * the 32-byte Ed25519 public key. A participant that connects with a local token is shown as
 * `token:<name>`; one with neither is anonymous and is known only by its presence.
 *
 * @pattern ^(ed25519:[A-Za-z0-9_-]{43}|token:.+)$
 */
export type Identity = string;

/** The ID of a thing in a space, unique within that space, for example `lamp:1`. */
export type ThingId = string;

/**
 * A namespaced name: a vocabulary namespace, a dot, and the local name, for example `chat.reply`.
 * Names that start with `asp.` belong to the protocol.
 *
 * @pattern ^[a-z][a-z0-9_-]*(\.[a-z0-9_-]+)+$
 */
export type QualifiedName = string;

/** Any JSON value. */
export type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

/** A JSON Schema (2020-12) describing a value. */
export interface JSONSchemaObject {
  [key: string]: unknown;
}

/* ───────────────────────────── Parts and negotiation ───────────────────────────── */

/**
 * The names of the parts of the protocol. `core` covers entering, observing, acting, editing,
 * outcomes, events, the record and the vocabulary. Every other part belongs to the capability of
 * the same name. A part name outside this list must carry a namespace.
 */
export type PartName =
  | "core"
  | "forms"
  | "snapshot"
  | "episode"
  | "consent"
  | "pause"
  | "senses"
  | "views"
  | "doors"
  | QualifiedName;

/**
 * The versions supported for each part, as sent by the side that offers them.
 * Every list is non-empty; a part that is not supported is left out.
 */
export interface SupportedParts {
  /**
   * The versions of the core supported.
   *
   * @minItems 1
   * @items.type integer
   * @items.minimum 0
   */
  core: PartVersion[];
  [part: string]: PartVersion[];
}

/**
 * The version used for each part, the highest version both sides support. A part with no
 * version in common is left out and counts as unsupported for this connection.
 */
export interface NegotiatedParts {
  /** The version of the core used. */
  core: PartVersion;
  [part: string]: PartVersion;
}

/* ───────────────────────────── Capabilities ───────────────────────────── */

/**
 * The capability table of a space, declared item by item. A capability that is not declared is
 * unsupported: using it gets `refused` with the reason `unsupported` (or, for a message without
 * an ID, an `error` with the code `unsupported`). A capability declared with an empty object is
 * read at its most conservative value.
 */
export interface Capabilities {
  /** Where the state is: `held` by the space itself, or `external`, reached by an adapter. */
  state?: "held" | "external";
  /** Whether the space lasts or is thrown away after use. */
  lifetime?: "lasting" | "disposable";
  /** Participants, roles and presences. */
  participants?: ParticipantsCapability;
  /**
   * The observation forms the space offers. `structure` is always available and need not be
   * listed. Each name refers to a form declared in the vocabulary, which gives its media type.
   */
  forms?: string[];
  /** The media types an action's parameters may carry, such as `audio/ogg` or `image/png`. */
  inputs?: string[];
  /** Editing the world itself. */
  edit?: EditCapability;
  /** Saving and restoring. */
  snapshot?: SnapshotCapability;
  /** Episodes started from a task and a seed. */
  episode?: EpisodeCapability;
  /** The pace of the space. */
  pace?: PaceCapability;
  /** Actions that wait for another participant's agreement before they run. */
  consent?: ConsentCapability;
  /** Holding an action under way and continuing it later. */
  pause?: PauseCapability;
  /** Derived observations placed by participants. */
  senses?: SensesCapability;
  /** The space's own interfaces, for hosts to embed. */
  views?: ViewsCapability;
  /** Links to other spaces. */
  doors?: DoorsCapability;
}

/** The key of a capability in the capability table. */
export type CapabilityKey = keyof Capabilities;

/** The `participants` capability. */
export interface ParticipantsCapability {
  /**
   * How many presences at most.
   *
   * @TJS-type integer
   * @minimum 1
   */
  max?: number;
  /** The roles of the space, by name. Defaults are `owner`, `member` and `guest`. */
  roles?: { [role: string]: Role };
  /** The role given when `join` asks for none. */
  default_role?: string;
  /** Whether there are participants outside the protocol, whose changes appear as events with the source `outside`. */
  outside?: boolean;
  /**
   * How long a presence is kept after its connection drops, in seconds. Within this time the
   * participant can resume the presence with `join` and its `resume` token.
   *
   * @minimum 0
   */
  grace_seconds?: number;
}

/**
 * A role and its permissions, after Matrix power levels.
 */
export interface Role {
  /** One line describing the role. */
  line?: string;
  /** The verbs this role may use. `["*"]` means every verb in the vocabulary. */
  verbs?: string[];
  /** Whether this role may edit the world. */
  edit?: boolean;
  /** Whether this role may agree to or refuse waiting actions (capability `consent`). */
  consent?: boolean;
  /** What this role does not see in observations and in the record. */
  hide?: Hidden;
}

/** What a role does not see. */
export interface Hidden {
  /** Property names left out of every thing this role observes. */
  properties?: string[];
  /** Kinds of record entries this role never receives. */
  events?: string[];
}

/** The `edit` capability. */
export interface EditCapability {
  /** The roles that may edit. Each must also have `edit: true` in its role. */
  roles?: string[];
  /** The kinds of change accepted: `add`, `set`, `remove`, `relate`, `unrelate`, or namespaced kinds. */
  changes?: string[];
  /** Whether edits written as a sentence are taken. */
  sentences?: boolean;
}

/** The `snapshot` capability. */
export interface SnapshotCapability {
  /** Whether a saved state can be restored. */
  restore?: boolean;
}

/** The `episode` capability. */
export interface EpisodeCapability {
  /** The tasks an episode can be started from. */
  tasks?: string[];
  /** The role that receives scores. Defaults to `evaluator`. */
  evaluator?: string;
}

/** The `pace` capability. */
export interface PaceCapability {
  /**
   * The most actions a second for each presence.
   *
   * @exclusiveMinimum 0
   */
  max_hz?: number;
  /** Whether time follows the wall clock or advances in steps. */
  clock?: "wall" | "stepped";
  /**
   * How long one step is, in seconds, when the clock advances in steps.
   *
   * @exclusiveMinimum 0
   */
  step_seconds?: number;
}

/** The `consent` capability. */
export interface ConsentCapability {
  /** The verbs that wait for consent, by verb name. */
  verbs?: { [verb: string]: ConsentRule };
}

/** Who must agree to a verb, and how long the space waits. */
export interface ConsentRule {
  /** The role whose presences may agree. */
  by: string;
  /**
   * How long the space waits, in seconds. A consent nobody answers in this time ends the action
   * as `cancelled` with the reason `deadline`.
   *
   * @exclusiveMinimum 0
   */
  seconds: number;
}

/** The `pause` capability. */
export interface PauseCapability {
  /** The verbs whose actions can be paused. Absent means every verb. */
  verbs?: string[];
}

/** The `senses` capability. */
export interface SensesCapability {
  /** The languages a derived observation can be written in, such as `jsonpath` or `javascript`. */
  languages?: string[];
  /**
   * The most senses each presence may place.
   *
   * @TJS-type integer
   * @minimum 1
   */
  max?: number;
}

/** The `views` capability. Interfaces are listed with the `views` message. */
export interface ViewsCapability {
  /**
   * How many interfaces the space brings.
   *
   * @TJS-type integer
   * @minimum 0
   */
  count?: number;
}

/** The `doors` capability. */
export interface DoorsCapability {
  /** The doors of this space. */
  doors?: Door[];
  /** Whether the space accepts things handed over from other spaces. */
  takes?: boolean;
}

/** A door: a thing on this side that points to another space. */
export interface Door {
  /** The thing that is the door on this side. */
  thing: ThingId;
  /** The address of the space on the other side. */
  to: string;
  /** The identity of the space on the other side, which signs its passes. */
  space?: Identity;
}

/* ───────────────────────────── Record ───────────────────────────── */

/** What a space says about its record in `hello`. */
export interface RecordInfo {
  /** The sequence number of the latest entry, 0 for an empty record. */
  head: Seq;
  /** The earliest sequence number still kept. Queries before it are answered with `expired`. */
  earliest: Seq;
  /**
   * How long entries are kept, in seconds; `null` means for ever.
   *
   * @minimum 0
   */
  keep_seconds: number | null;
}

/**
 * The source of a record entry: `space` for the space itself, `presence/<presence>` for a
 * participant's presence, and `outside` or `outside/<who>` for participants outside the protocol.
 *
 * @pattern ^(space|presence/.+|outside(/.+)?)$
 */
export type EntrySource = string;

/**
 * One entry of the record. The envelope follows CloudEvents 1.0 in its JSON format: `id`,
 * `source`, `type` and `specversion` are always present. ASP adds `seq`, `aspcore`, `cause`,
 * `things` and `roles`.
 */
export interface Entry {
  /** The CloudEvents version, always `1.0`. */
  specversion: "1.0";
  /** The entry's ID: its sequence number written as a decimal string. */
  id: string;
  /** Who caused the entry. */
  source: EntrySource;
  /**
   * The kind of entry. Kinds of the protocol start with `asp.`; the space's own kinds of event
   * are named in its vocabulary.
   */
  type: string;
  /** When the entry was appended. */
  time: Time;
  /** The record sequence number. */
  seq: Seq;
  /** The version of the core part the entry was written with. */
  aspcore: PartVersion;
  /** The sequence number of the entry that led to this one, so anything can be traced back to where it started. */
  cause?: Seq;
  /** The things involved. */
  things?: ThingId[];
  /** If present, only these roles receive the entry. */
  roles?: string[];
  /** The media type of `data`, `application/json` when absent. */
  datacontenttype?: string;
  /** The content of the entry. */
  data?: JSONValue;
  /** Large content stored only as a hash and fetched with `blob`. */
  dataref?: Hash;
}

/* ───────────────────────────── Observation ───────────────────────────── */

/**
 * A thing as observed: its ID, its type and its properties, written as members of the object.
 * `id` and `type` are reserved; every other member is a property named in the vocabulary.
 */
export interface Thing {
  /** The ID of the thing. */
  id: ThingId;
  /** The type of the thing, named in the vocabulary. */
  type: string;
  /** When an external state confirmed this thing, if it differs from the observation. */
  confirmed?: Time;
  [property: string]: unknown;
}

/** A relation between two things. */
export interface Relation {
  /** The kind of relation, named in the vocabulary, for example `room.in`. */
  rel: string;
  /** The thing the relation starts from. */
  from: ThingId;
  /** The thing the relation points to. */
  to: ThingId;
}

/** The structure form: things, their properties and the relations between them, in the vocabulary's terms. */
export interface Structure {
  /** The things this presence perceives. */
  things: Thing[];
  /** The relations between them. */
  relations?: Relation[];
}

/** One observation in a form other than structure. Either `data` or `blob` is present. */
export interface FormContent {
  /** The media type, as declared for the form in the vocabulary. */
  media: string;
  /** The content: text as is, binary content as base64. */
  data?: string;
  /** Large content stored by hash and fetched with `blob`. */
  blob?: Hash;
}

/* ───────────────────────────── Outcomes ───────────────────────────── */

/**
 * The five final outcomes.
 *
 * - `done`: carried out; has the result and the events it caused.
 * - `refused`: nothing happened; decided before any effect.
 * - `failed`: tried and not achieved; lists the effects that did happen.
 * - `cancelled`: confirmed stopped; lists the effects from before it stopped.
 * - `unknown`: may or may not have happened; says what is known and what is not confirmed.
 */
export type End = "done" | "refused" | "failed" | "cancelled" | "unknown";

/**
 * The reasons defined by the protocol. Any other reason code carries a namespace.
 *
 * - `unsupported`: a capability, part, message or verb the space does not have.
 * - `forbidden`: the presence's role may not do this.
 * - `malformed`: the message does not match the schema or the verb's parameters.
 * - `stale`: the observation named by `basis` is out of date and the verb refuses stale actions.
 * - `constraint`: the change would break a constraint; nothing was changed.
 * - `deadline`: the deadline, or the time to wait for consent, passed.
 * - `closed`: the space closed, or the presence ended.
 * - `restarted`: the space restarted and could not confirm the outcome.
 * - `expired`: the record no longer keeps what was asked for.
 */
export type ProtocolReason =
  | "unsupported"
  | "forbidden"
  | "malformed"
  | "stale"
  | "constraint"
  | "deadline"
  | "closed"
  | "restarted"
  | "expired";

/** A reason: a code and one sentence. */
export interface Reason {
  /** A protocol reason, or a namespaced code such as `chat.delivery_timeout`. */
  code: ProtocolReason | string;
  /** One sentence for people and models. */
  text?: string;
  /** Details, such as the name of the broken constraint. */
  data?: JSONValue;
}

/** An effect that did happen, listed by `failed`, `cancelled` and `unknown`. */
export interface Effect {
  /** The thing affected, when there is one. */
  thing?: ThingId;
  /** One sentence describing the effect. */
  text?: string;
  [key: string]: unknown;
}

/* ───────────────────────────── Vocabulary ───────────────────────────── */

/**
 * The vocabulary of a space: what a participant can see, what it can do and what outcomes to
 * expect. Referenced by the hash of its canonical JSON and cacheable.
 */
export interface Vocabulary {
  /** The namespaces it is assembled from, with the version of the package each comes from. */
  namespaces: { [namespace: string]: NamespaceInfo };
  /** Kinds of things, by qualified name. */
  types?: { [name: string]: TypeDecl };
  /** Kinds of relations. */
  relations?: { [name: string]: RelationDecl };
  /** Verbs, the actions participants can take. */
  verbs?: { [name: string]: VerbDecl };
  /** Kinds of events the space appends to its record. */
  events?: { [name: string]: EventDecl };
  /** Conditions that must hold before every commit. */
  constraints?: { [name: string]: ConstraintDecl };
  /** Observation forms. */
  forms?: { [name: string]: FormDecl };
  /** Explanations for models: a full page per namespace, in Markdown. */
  pages?: { [name: string]: string };
}

/** A namespace of a vocabulary and the package it comes from. */
export interface NamespaceInfo {
  /** The package's version, `major.minor.patch`. Within a major version a package only adds. */
  version: string;
  /** One line describing the namespace. */
  line?: string;
}

/** A kind of thing. */
export interface TypeDecl {
  /** At most one parent type. */
  parent?: string;
  /** One line describing the type. */
  line?: string;
  /** The properties of things of this type, as a JSON Schema object schema. */
  properties?: JSONSchemaObject;
}

/** A kind of relation. */
export interface RelationDecl {
  /** The type at the start. */
  from: string;
  /** The type at the end. */
  to: string;
  /** How many targets one thing may have. */
  many?: "one" | "many";
  /** One line describing the relation. */
  line?: string;
}

/**
 * The class of a verb's effect, from which a participant decides whether to ask its owner first.
 *
 * - `read`: reads only.
 * - `change`: changes this space.
 * - `send`: sends to others: a new recipient, forwarding, publishing.
 * - `spend`: spends money.
 * - `irreversible`: cannot be undone.
 */
export type EffectClass = "read" | "change" | "send" | "spend" | "irreversible";

/** A verb. */
export interface VerbDecl {
  /** One line describing the verb. */
  line?: string;
  /** The type of thing the verb acts on; absent when the verb takes no object. */
  object?: string;
  /** The parameters, as a JSON Schema. Media parameters name their media type with `contentMediaType`. */
  params?: JSONSchemaObject;
  /** The class of effect. */
  effect: EffectClass;
  /** The final outcomes the verb can have. */
  outcomes?: End[];
  /** The reason codes the verb can give. */
  reasons?: string[];
  /** The outcome when no specific law applies: done with nothing changed, or refused with a reason. */
  default: DefaultOutcome;
  /**
   * What happens when the action's `basis` is stale: `refuse` refuses with the reason `stale` if
   * any thing the action touches has changed since; `allow` goes ahead. Absent means `allow`.
   */
  stale?: "refuse" | "allow";
}

/** The default outcome of a verb. */
export interface DefaultOutcome {
  /** `done` (with nothing changed) or `refused`. */
  end: "done" | "refused";
  /** The reason, required when `end` is `refused`. */
  reason?: Reason;
}

/** A kind of event. */
export interface EventDecl {
  /** One line describing the event. */
  line?: string;
  /** The content of the event, as a JSON Schema. */
  data?: JSONSchemaObject;
  /** Who perceives it: everyone, or only those within range of the things involved. */
  perceived?: "all" | "range";
}

/** A constraint. */
export interface ConstraintDecl {
  /** One line saying what must hold. */
  line: string;
}

/** An observation form. */
export interface FormDecl {
  /** The media type of the form. */
  media: string;
  /** Whether it is continuous, subscribed to as a stream. */
  continuous?: boolean;
  /** One line describing the form. */
  line?: string;
}

/* ───────────────────────────── Presentation ───────────────────────────── */

/**
 * Presentation preferences a participant hands over on entering. The space decides whether to
 * use them as they are, convert them or use its own default.
 */
export interface Presentation {
  /** A name. */
  name?: string;
  /** An avatar image, by hash. */
  avatar?: Hash;
  /** A VRM model, by hash. */
  model?: Hash;
  /** One line describing the participant. */
  line?: string;
  [key: string]: unknown;
}

/** What the space did with each presentation preference. */
export type PresentationUse = "used" | "converted" | "default" | "ignored";

/* ───────────────────────────── Changes (edits) ───────────────────────────── */

/** Add a thing. */
export interface AddChange {
  op: "add";
  /** The new thing. */
  thing: Thing;
}

/** Set one property of a thing. */
export interface SetChange {
  op: "set";
  /** The thing to change. */
  thing: ThingId;
  /** The property to set. */
  property: string;
  /** The new value. */
  value: JSONValue;
}

/** Remove a thing. */
export interface RemoveChange {
  op: "remove";
  /** The thing to remove. */
  thing: ThingId;
}

/** Add a relation. */
export interface RelateChange {
  op: "relate";
  /** The relation to add. */
  relation: Relation;
}

/** Remove a relation. */
export interface UnrelateChange {
  op: "unrelate";
  /** The relation to remove. */
  relation: Relation;
}

/** One structured change of an edit. Namespaced kinds of change may be declared by a space. */
export type Change = AddChange | SetChange | RemoveChange | RelateChange | UnrelateChange;

/* ═════════════════════════════ Messages: core ═════════════════════════════ */

/**
 * The participant's half of the handshake, the first message on a connection.
 * The participant states the versions it supports for each part and, optionally, its identity.
 */
export interface ParticipantHello {
  type: "hello";
  /** The versions the participant supports for each part. */
  parts: SupportedParts;
  /** The participant's public key, if it has one. Proven with `proof` in `join`. */
  participant?: Identity;
  /** A local token, used instead of a key between processes on one computer. */
  token?: string;
  /** The participant's software, for logs. */
  client?: Software;
}

/**
 * The space's half of the handshake. It gives the negotiated version of each part, the capability
 * table, the hash of the vocabulary, the state of the record and a random value the participant
 * signs to prove its identity.
 */
export interface SpaceHello {
  type: "hello";
  /** The space's identifier: its key's identity, or an address-like name for a space without a key. */
  space: string;
  /** The version used for each part. Parts without a common version are left out. */
  parts: NegotiatedParts;
  /** The versions the space supports for each part. */
  supported?: SupportedParts;
  /** The capability table. */
  capabilities: Capabilities;
  /** The hash of the vocabulary. */
  vocabulary: Hash;
  /** The state of the record. */
  record: RecordInfo;
  /** A random value, at least 16 bytes in base64url, that a participant with a key signs in `join`. */
  nonce: string;
  /** The space's public key, which signs passes and saves. */
  key?: Identity;
  /** The space's software, for logs. */
  server?: Software;
}

/** A piece of software and its version. */
export interface Software {
  name: string;
  version?: string;
}

/**
 * Start a presence, or resume one after a disconnect. Answered with an `outcome` whose result is a
 * `JoinResult`.
 */
export interface Join {
  type: "join";
  id: RequestId;
  /** The role asked for. The space decides the role given. */
  role?: string;
  /** Presentation preferences. */
  presentation?: Presentation;
  /**
   * Proof of identity: the unpadded base64url Ed25519 signature, by the key named in `hello`, of
   * the UTF-8 bytes of `asp-v0 join <space> <nonce>`.
   */
  proof?: string;
  /** Resume a presence kept after a disconnect, with the token from its `JoinResult`. */
  resume?: string;
  /** A pass signed by another space, for a participant arriving through a door. */
  pass?: string;
}

/** The result of a successful `join`. */
export interface JoinResult {
  /** The ID of the presence. */
  presence: string;
  /** The role given. */
  role: string;
  /** The participant's identity as the space knows it. */
  participant?: Identity;
  /** The range of perception, when the space limits it. */
  range?: JSONValue;
  /** What was done with each presentation preference. */
  presentation?: { [key: string]: PresentationUse };
  /** A secret token to resume this presence within the grace period. */
  resume: string;
  /** Whether an existing presence was resumed. */
  resumed?: boolean;
  /** The latest record sequence number when the presence started. */
  head: Seq;
}

/** End a presence. Answered with an `outcome`. */
export interface Leave {
  type: "leave";
  id: RequestId;
  /** Whether actions under way are cancelled with it. Otherwise they run to their own outcomes. */
  cancel?: boolean;
}

/** Ask for one observation in the forms asked for. Answered with `observation`. */
export interface Observe {
  type: "observe";
  id: RequestId;
  /** The forms wanted, besides structure. Unknown or undeclared forms are refused. */
  forms?: string[];
}

/** One observation: a projection of the state for this presence. */
export interface Observation {
  type: "observation";
  id: RequestId;
  /** The record sequence number the observation is at. Observations at the same number have the same content. */
  seq: Seq;
  /** When an external state was last confirmed. */
  confirmed?: Time;
  /** The structure, always present. */
  structure: Structure;
  /** The other forms asked for, by name. */
  forms?: { [form: string]: FormContent };
  /** The values of derived observations placed by this presence, by name. */
  senses?: { [name: string]: JSONValue };
}

/**
 * Subscribe to the record from a sequence number on: every entry this presence may see is pushed
 * as an `event`, in order. A new `subscribe` replaces the previous one. Answered with `subscribed`.
 */
export interface Subscribe {
  type: "subscribe";
  id: RequestId;
  /** The first sequence number wanted; the next new entry when absent. */
  from?: Seq;
  /** Only these kinds of entry. All kinds when absent. */
  kinds?: string[];
}

/** The answer to `subscribe`. */
export interface Subscribed {
  type: "subscribed";
  id: RequestId;
  /** The first sequence number that will be pushed. */
  from: Seq;
  /** The latest sequence number at the time of subscribing. */
  head: Seq;
}

/**
 * An action. Answered by intermediate states and exactly one final `outcome`. Sending the same ID
 * again only returns the first outcome or the current intermediate state.
 */
export interface Act {
  type: "act";
  id: RequestId;
  /** The verb, named in the vocabulary. */
  verb: string;
  /** The thing acted on. */
  object?: ThingId;
  /** The parameters, as the verb's schema describes. */
  args?: { [name: string]: unknown };
  /** The record sequence number of the observation the action is based on. */
  basis?: Seq;
  /**
   * How long the action may take, in seconds from when the space receives it. When it passes
   * the space stops the action.
   *
   * @exclusiveMinimum 0
   */
  deadline?: number;
}

/** An edit: structured changes, or a sentence. Gets a final outcome like an action. */
export interface Edit {
  type: "edit";
  id: RequestId;
  /** Structured changes, committed atomically. */
  changes?: Change[];
  /** A sentence, translated by the space into structured changes. */
  sentence?: string;
  /** The observation the edit is based on. */
  basis?: Seq;
  /**
   * How long the edit may take, in seconds.
   *
   * @exclusiveMinimum 0
   */
  deadline?: number;
}

/**
 * Ask to cancel an action or edit of this participant. Cancelling is only a request: the action
 * still gets its own final outcome, `cancelled` if it stopped, `done` if it finished first, or
 * `unknown`. Has no ID and no answer of its own.
 */
export interface Cancel {
  type: "cancel";
  /** The ID of the action, edit or stream to cancel. */
  action: RequestId;
}

/** An action has been accepted and is under way. */
export interface Accepted {
  type: "accepted";
  id: RequestId;
  /** The sequence number of the action's own record entry. */
  seq?: Seq;
}

/** Progress of an action under way. May be sent any number of times. */
export interface Progress {
  type: "progress";
  id: RequestId;
  /**
   * How far along, from 0 to 1, when known.
   *
   * @minimum 0
   * @maximum 1
   */
  progress?: number;
  /** One sentence on what is happening. */
  text?: string;
}

/** An action waits for another participant to agree. */
export interface Waiting {
  type: "waiting";
  id: RequestId;
  /** Whose consent it waits for. */
  for: { role: string };
  /** The sequence number of the action's record entry, which consenting presences name. */
  act: Seq;
  /** When the waiting ends as `cancelled`. */
  until: Time;
}

/** The final outcome of an action, an edit or any other request. Exactly one per ID. */
export interface Outcome {
  type: "outcome";
  id: RequestId;
  /** The final outcome. */
  end: End;
  /** The sequence number of the outcome's record entry, when it is recorded. */
  seq?: Seq;
  /** Why, for every end except `done`, and optionally for `done`. */
  reason?: Reason;
  /** The result of `done`. */
  result?: JSONValue;
  /** The effects that did happen, for `failed`, `cancelled` and `unknown`. */
  effects?: Effect[];
  /** The sequence numbers of the events it caused. */
  events?: Seq[];
  /** For `unknown`: what is known. */
  known?: { [key: string]: JSONValue };
  /** For `unknown`: what is not confirmed. */
  unconfirmed?: string[];
}

/** A record entry pushed to a subscribed presence, or the closing event pushed to every connection. */
export interface EventMessage {
  type: "event";
  /** The entry. */
  entry: Entry;
}

/**
 * Fetch the record by sequence numbers or by time. Answered with `entries`, or with an `outcome`
 * `refused` with the reason `expired` when the range starts before the earliest entry kept.
 */
export interface RecordRequest {
  type: "record";
  id: RequestId;
  /** The first sequence number. */
  from?: Seq;
  /** The last sequence number. */
  to?: Seq;
  /** Entries appended at or after this time. */
  since?: Time;
  /** Entries appended before this time. */
  until?: Time;
  /**
   * The most entries to return.
   *
   * @TJS-type integer
   * @minimum 1
   */
  limit?: number;
}

/** Entries of the record, projected for this presence. */
export interface Entries {
  type: "entries";
  id: RequestId;
  /** The entries, in order. */
  entries: Entry[];
  /** The latest sequence number. */
  head: Seq;
  /** The earliest sequence number kept. */
  earliest: Seq;
  /** Whether more entries match than were returned. */
  more?: boolean;
}

/** Fetch the vocabulary. Answered with `vocabulary`. */
export interface VocabularyRequest {
  type: "vocabulary";
  id: RequestId;
  /** The hash wanted; the current vocabulary when absent. */
  hash?: Hash;
}

/** The vocabulary. */
export interface VocabularyMessage {
  type: "vocabulary";
  id: RequestId;
  /** Its hash. */
  hash: Hash;
  /** The vocabulary itself. */
  vocabulary: Vocabulary;
}

/** Fetch large content by hash. Answered with `blob`. */
export interface BlobRequest {
  type: "blob";
  id: RequestId;
  /** The hash of the content. */
  hash: Hash;
}

/** Large content. */
export interface BlobMessage {
  type: "blob";
  id: RequestId;
  /** The hash of the content. */
  hash: Hash;
  /** Its media type. */
  media: string;
  /** The content in base64. */
  data: string;
}

/**
 * A protocol error, only for messages without an ID (such as `hello` or `cancel`). A message
 * with an ID is always answered with an outcome instead.
 */
export interface ErrorMessage {
  type: "error";
  /** A protocol reason, or a namespaced code. */
  code: ProtocolReason | string;
  /** One sentence. */
  text?: string;
  /** The type of the message the error is about. */
  about?: string;
}

/* ═════════════════════════════ Messages: capabilities ═════════════════════════════ */

/**
 * Capability `forms`: subscribe to a continuous form such as video or sound. Answered with
 * `accepted`, then `frame` messages, and a final `outcome` when the stream ends (`cancel` ends it).
 */
export interface StreamRequest {
  type: "stream";
  id: RequestId;
  /** The continuous form, as declared in the vocabulary. */
  form: string;
  /**
   * Frames or samples a second.
   *
   * @exclusiveMinimum 0
   */
  rate?: number;
}

/** One frame of a stream. */
export interface Frame {
  type: "frame";
  /** The ID of the `stream` request. */
  stream: RequestId;
  /**
   * The frame's number in the stream, from 0.
   *
   * @TJS-type integer
   * @minimum 0
   */
  n: number;
  /** When the frame was taken. */
  time: Time;
  /** The content. */
  content: FormContent;
}

/** Capability `consent`: agree to or refuse a waiting action. Answered with an `outcome`. */
export interface ConsentMessage {
  type: "consent";
  id: RequestId;
  /** The sequence number of the waiting action's record entry. */
  act: Seq;
  /** Whether to agree. */
  agree: boolean;
}

/** Capability `snapshot`: save the state. The result of the outcome has the snapshot's hash. */
export interface SnapshotRequest {
  type: "snapshot";
  id: RequestId;
}

/** Capability `snapshot`: restore a saved state. */
export interface RestoreRequest {
  type: "restore";
  id: RequestId;
  /** The snapshot to restore. */
  snapshot: Hash;
}

/** Capability `episode`: start an episode from a task and a seed. */
export interface EpisodeRequest {
  type: "episode";
  id: RequestId;
  /** The task. */
  task?: string;
  /**
   * The seed.
   *
   * @TJS-type integer
   */
  seed?: number;
}

/** Capability `episode`: take the score of an episode. Only the evaluator role receives it. */
export interface ScoreRequest {
  type: "score";
  id: RequestId;
  /** The episode; the current one when absent. */
  episode?: string;
}

/** Capability `pause`: hold an action under way. */
export interface PauseRequest {
  type: "pause";
  id: RequestId;
  /** The ID of this participant's action. */
  action: RequestId;
}

/** Capability `pause`: continue a held action. */
export interface ResumeRequest {
  type: "resume";
  id: RequestId;
  /** The ID of this participant's action. */
  action: RequestId;
}

/** Capability `senses`: place, list or remove a derived observation. */
export interface SenseRequest {
  type: "sense";
  id: RequestId;
  /** What to do. */
  op: "place" | "list" | "remove";
  /** The name of the sense, for `place` and `remove`. */
  name?: string;
  /** The language the query is written in, one of those declared. */
  language?: string;
  /** The query or code, for `place`. */
  query?: string;
}

/** Capability `views`: list the space's own interfaces. The outcome's result is a `ViewsResult`. */
export interface ViewsRequest {
  type: "views";
  id: RequestId;
}

/** The interfaces a space brings. */
export interface ViewsResult {
  views: View[];
}

/** One interface of a space: a web bundle fetched by hash. The bridge is specified in ext-views. */
export interface View {
  /** The name of the interface. */
  name: string;
  /** One line describing it. */
  line?: string;
  /** The web bundle, by hash. */
  bundle: Hash;
  /** The bundle's media type. */
  media: string;
}

/**
 * Capability `doors`: hand a thing over to this space, or ask to pass through one of its doors.
 *
 * - With `thing`, the sender (another space, acting as a participant) offers the thing; the outcome
 *   is `done` once this space has taken it and recorded `asp.take`, with an `OfferResult`.
 * - With `door` and no `thing`, a participant asks to pass through the door; the outcome is `done`
 *   with a `PassResult`, and the presence ends here.
 */
export interface Offer {
  type: "offer";
  id: RequestId;
  /** The thing handed over, with the chain of its parent types. */
  thing?: OfferedThing;
  /** The door. */
  door?: ThingId;
}

/** A thing as handed over through a door. */
export interface OfferedThing extends Thing {
  /** Its parent types, nearest first, so the receiver can fall back to one it knows. */
  parents?: string[];
}

/** The result of a taken offer. */
export interface OfferResult {
  /** The ID the thing has in this space. */
  thing: ThingId;
  /** The type it is treated as, the nearest known one. */
  as: string;
  /** The sequence number of the `asp.take` entry. */
  take: Seq;
}

/** The result of passing through a door. */
export interface PassResult {
  /** The address of the space on the other side. */
  to: string;
  /** The pass, signed by this space, to give in `join` over there. */
  pass: string;
}

/**
 * Capability `doors`: ask whether this space took an offer. The giving side asks after a
 * disconnect midway; the receiving side's record decides. The outcome's result is a `TakeResult`.
 */
export interface Take {
  type: "take";
  id: RequestId;
  /** The ID of the `offer`. */
  offer: RequestId;
}

/** Whether an offer was taken. */
export interface TakeResult {
  /** Whether the offer was taken. */
  taken: boolean;
  /** The sequence number of the `asp.take` entry. */
  take?: Seq;
  /** The ID the thing has here. */
  thing?: ThingId;
}

/* ═════════════════════════════ Unions ═════════════════════════════ */

/** Every message a participant sends to a space. */
export type ParticipantMessage =
  | ParticipantHello
  | Join
  | Leave
  | Observe
  | Subscribe
  | Act
  | Edit
  | Cancel
  | RecordRequest
  | VocabularyRequest
  | BlobRequest
  | StreamRequest
  | ConsentMessage
  | SnapshotRequest
  | RestoreRequest
  | EpisodeRequest
  | ScoreRequest
  | PauseRequest
  | ResumeRequest
  | SenseRequest
  | ViewsRequest
  | Offer
  | Take;

/** Every message a space sends to a participant. */
export type SpaceMessage =
  | SpaceHello
  | Observation
  | Subscribed
  | Accepted
  | Progress
  | Waiting
  | Outcome
  | EventMessage
  | Entries
  | VocabularyMessage
  | BlobMessage
  | Frame
  | ErrorMessage;

/** Every ASP message. */
export type Message = ParticipantMessage | SpaceMessage;
