# Building an Auto-Engineer Harness

**A build manual for standing up your own agentic engineering harness on Claude Code and Codex.**

---

## How to use this document

This is a knowledge document, not a product. Drop it into your Claude Code (or Codex) project as context — put it where your `CLAUDE.md` lives, or paste it into a planning session — and then **brainstorm with the agent**. It will read this manual and help you assemble a harness that fits *your* team, your stack, and your definition of "good."

The right way to use it:

1. Read Parts 1–2 yourself so you hold the mental model.
2. Open Claude Code in your repo and say something like: *"I want to build an auto-engineer harness for our team. Use the build manual in this doc. Interview me first, then propose the component set before you write anything."*
3. Answer its questions (Part 11 lists them). It builds the files. You review the skeleton, not every line.

Everything here is stack-agnostic. The examples happen to be TypeScript/Node/Mongo-flavored because that's a common shape, but every rule is a *pattern you translate to your own stack* — Python/Django, Go, Rails, whatever. Where you see a specific convention (snake_case, a `mg` accessor, Zod), read it as "pick the equivalent in your world and make it a rule."

> **One thing this manual deliberately leaves out:** cross-platform orchestration (driving Claude and Codex against each other from one session). That needs a CLI bridge you don't have yet. Everything here uses **native subagents** — the built-in `Agent`/subagent mechanism each platform ships. It's more than enough to build a world-class harness.

---

## Table of contents

- **Part 1 — The mental model:** what a harness is, the four-beat shape, the safety boundary
- **Part 2 — Anatomy:** the full file tree and what each piece does
- **Part 3 — The memory layer:** `CLAUDE.md` / `AGENTS.md`, domain cores, rules, progressive disclosure
- **Part 4 — The persona & posture layer:** giving the harness judgment
- **Part 5 — Engineering rules:** the coding contract (the generic rule set every harness should encode)
- **Part 6 — Modes:** plan / implement / review / autonomous
- **Part 7 — Agents (subagents):** lenses not job titles, Claude `.md` + Codex `.toml` twins
- **Part 8 — Slash commands:** thin recipes that orchestrate agents, on both platforms
- **Part 9 — Skills:** reusable how-to knowledge, progressively disclosed
- **Part 10 — Loops & verifiers:** where trust lives; programmatic checks + LLM-as-judge
- **Part 11 — Self-improvement:** the optimize loop and the learnings memory
- **Part 12 — The build process:** interview → decompose → build → verify
- **Appendix — Copy-paste templates** for every file type

---

# Part 1 — The mental model

## What a harness actually is

A harness is not a big prompt. It's an **AI worker for a domain** — a small, organized system of files that turns a general coding agent into a senior engineer who already knows your standards, your architecture, your review bar, and your definition of done.

The analogy: hiring. When a great engineer joins your team, they don't get productive from a single Slack message. They get an onboarding doc, a style guide, a "here's how we review PRs" walkthrough, a "here's who to ask about X" map, and a manager who breaks big work into phases. The harness is all of that, written down as files the agent reads at the right moment. You're not prompting a tool; you're onboarding a colleague who reads their onboarding packet fresh every session.

The payoff, and the whole reason to build one: **you review the skeleton, not the meat.** When the harness is good, a 1,000-line feature has a ~100-line human review surface — the orchestration logic — and the other 900 lines are trusted because they're tested and described. (Part 5 makes this concrete with the 90/10 rule.)

## The four-beat shape

Every knowledge-work function — engineering included — is the same shape. Don't invent a template; discover *your* version of these four beats:

```
gather context  →  produce the deliverable  →  verify it  →  hand off
                                                              (a human takes the irreversible step)
```

For engineering specifically:

- **Gather** — map what already exists so you don't reinvent it (recon), read the relevant rules, understand the data flow.
- **Produce** — write the plan, then the code, phase by phase.
- **Verify** — review against the plan and the standards; run the tests; catch what breaks, leaks, or won't scale.
- **Hand off** — a human approves the merge / the deploy / the push. **The harness never does the irreversible step on its own.**

Every component you build maps to one of these beats. If you can't say which beat a component serves, you probably don't need it.

## The one rule you never break — the safety boundary

Every domain has an action that's expensive or impossible to undo. In engineering it's usually: **push to a shared branch, merge to main, deploy to production, run a destructive migration, drop a collection, force-push.**

**The harness must never take that action autonomously.** It builds right up to the line — a committed-locally branch, a ready-to-merge PR, a migration script with a dry-run — and then *stops and hands off* to a human. This is hard-coded into the producing agents and into the autonomous command, in the same words, so it can't drift.

This single rule is the difference between a useful AI worker and a dangerous one. Everything else in this manual is craft; this is safety. Write it down first.

---

# Part 2 — Anatomy of a harness

Here's the full shape. You won't need every piece on day one (Part 12 is minimal-first), but this is the target.

```
your-repo/
├── CLAUDE.md                      # Root core (Claude): persona + domain router + always-loaded learnings
├── AGENTS.md                      # Root core (Codex): the twin of CLAUDE.md
│
├── engineering/                   # The engineering "domain" — its manual and detail files
│   ├── core.md                    # Domain core: the operating manual, read on demand
│   ├── rules/                     # The substantive rules, read on demand per task
│   │   ├── architecture.md        #   flow/helpers, the 90/10 split
│   │   ├── coding-standards.md    #   naming, types, validation, commits
│   │   ├── data-access.md         #   the DB access pattern, indexes, migrations
│   │   ├── security.md            #   auth, tenant scoping, secrets
│   │   ├── testing.md             #   the test layers and when to use which
│   │   ├── logging.md             #   structured logs, error handling
│   │   ├── anti-patterns.md       #   the "never do this" list
│   │   ├── definition-of-done.md  #   the checklist a task must pass
│   │   └── learnings.md           #   the discipline for recording lessons
│   ├── modes/                     # What each workflow stage requires
│   │   ├── planning.md
│   │   ├── implementation.md
│   │   ├── code-review.md
│   │   └── autonomous.md          #   the prompt-to-shipping mode
│   ├── templates/
│   │   └── architecture-doc.md    #   the template for per-feature docs
│   ├── project-memory.md          # Running log of project-specific gotchas & decisions
│   └── learnings/
│       ├── claude.md              # Always-loaded how-to-work lessons (Claude)
│       └── codex.md               # ... (Codex)
│
├── .claude/
│   ├── agents/                    # Subagents (Claude): one .md per lens
│   │   ├── recon.md
│   │   ├── plan-reviewer.md
│   │   ├── correctness-safety-reviewer.md
│   │   ├── craft-standards-reviewer.md
│   │   └── qc.md                  #   coordinator that fans out the two review lenses
│   └── commands/                  # Slash commands (Claude): one .md per sub-task
│       ├── plan.md
│       ├── code.md
│       ├── super-code.md
│       ├── ultra-code.md
│       ├── qc.md
│       └── learn.md
│
└── .codex/
    └── agents/                    # Subagent twins (Codex): one .toml per Claude .md
        ├── recon.toml
        ├── plan-reviewer.toml
        └── ...
```

Plus a couple of per-user (not per-repo) locations the platforms own:

- **Codex slash-command prompts** live at `~/.codex/prompts/<name>.md` (global to the machine).
- **Skills** live at `~/.claude/skills/<name>/` and `~/.codex/skills/<name>/` (or project-local at `.claude/skills/<name>/`).

### The three layers, in one sentence each

- **Memory layer** (`CLAUDE.md`, `engineering/`) — *what the agent knows*: standards, architecture, rules, past lessons. Read on demand.
- **Worker layer** (`.claude/agents/`, `.codex/agents/`) — *who does the focused jobs*: recon, reviewers, producers. One agent per failure-mode.
- **Orchestration layer** (`.claude/commands/`, `~/.codex/prompts/`) — *how work is choreographed*: thin recipes that call agents in sequence and stop at the safety boundary.

---

# Part 3 — The memory layer

This is where most of the leverage is. Get this right and the agent behaves like it's been on your team for a year.

## The governing principle: progressive disclosure

Context is a budget. If you paste every rule into every session, three bad things happen: you burn tokens, you bury the rule that matters under fifty that don't, and you make the agent skim. So the harness is built like a well-factored codebase — **a thin always-loaded core that routes to deep files read only when the task needs them.**

Think of it as the 90/10 rule applied to the harness's own knowledge:

- The **10%** always in context: the persona, the invariants you never violate, and a *router* — a table that says "for this kind of task, go read that file."
- The **90%** read on demand: the substantive rules, the mode contracts, the templates. Loaded only when the router sends the agent there.

This is the single most important structural decision. A flat 5,000-line `CLAUDE.md` is a worse harness than a 200-line core that routes to twenty focused files — even though they contain the same words.

## The root core — `CLAUDE.md` / `AGENTS.md`

These two files are the only always-loaded memory. They are **twins**: `CLAUDE.md` is for Claude Code, `AGENTS.md` is for Codex, and they say the same thing (mechanics differ in a few marked spots). Keep them tiny. They contain exactly four things:

1. **The persona** — who the agent is, how it talks, how it thinks (Part 4).
2. **The domain router** — if your team works across more than one domain (engineering, plus maybe marketing or data), a small table that says "classify the task, then read that domain's core in full before acting." If you only have one domain, this collapses to a single line: *"Read `engineering/core.md` in full before any engineering task."*
3. **The ground rules** — the handful of things true in *every* session regardless of task (e.g. "push back when you disagree," "confirm before anything irreversible," "stay in scope").
4. **The always-loaded learnings import** — a link/`@`-import to the tiny learnings file (Part 11), so past mistakes are in context from the first message.

**The domain gate is a hard rule, not a suggestion.** The core should say, in strong language: *"Before acting on any task, decide which domain it belongs to and read that domain's core file in full. A task handled without its core loaded will violate rules you never saw."* This is what forces the agent to actually load the standards instead of winging it from the thin core.

Example root-core skeleton (single-domain version):

```markdown
# <YourHarness> — Engineering

You are <name>, a senior engineer on <team>. <One paragraph of persona: how you
talk, how you think, the standard you hold. See Part 4.>

## The gate — read the core before you act
Before acting on ANY engineering task — code, bugs, plans, reviews, tests, deploys —
Read `engineering/core.md` IN FULL. This is a hard gate. A task handled without it
will break rules you never saw. If you catch yourself mid-task without it, stop and read it.

## Ground rules — every session
- Plain prose for humans: explain in behavior, not identifiers. File paths go in a `Where:` line.
- Push back when you disagree, with the reason. Silent compliance with a wrong ask is the worst outcome.
- Act, don't only suggest — but confirm before anything hard to reverse (push, prod, delete).
- Stay in scope, smallest blast radius. Flag unrelated finds; don't fold them in.
- Never delete or revert work you didn't create — other sessions may share this tree.

## Learnings — always loaded
@engineering/learnings/claude.md
```

## The domain core — `engineering/core.md`

This is the operating manual, loaded on demand by the gate. It's still lean, but it's the real contract. It carries:

- **Role / Goal / Success / Stop** — four lines that frame every session. *Role:* who you are. *Goal:* the north star (e.g. "a human can read this codebase like a book"). *Success:* every applicable Definition-of-Done box checked. *Stop:* when the task is correct — not when more could be added.
- **The mode router** — a table mapping the shape of the user's opening message to a mode file (Part 6): *"'plan this' → read `modes/planning.md`."*
- **The rules router** — a table mapping what the task touches to a rule file: *"any DB query → read `rules/data-access.md`."*
- **The invariants** — the 5–10 things never violated in any mode, each a one-line summary pointing at its full rule file.
- **The posture** — the detailed version of how the agent works (this can live here rather than the root core, since it applies to every engineering task).

The core's job is to be the *map*, not the territory. It should never restate a rule in full — it summarizes the invariant and points at the file. **Single-source everything:** each rule lives in exactly one place, or the copies drift.

## The rules files — `engineering/rules/*.md`

The territory. Each file is one topic, read only when the router sends the agent there. Part 5 covers what goes in them. The key discipline: **one rule, one file, no duplication.**

## Project memory — `engineering/project-memory.md`

A running, dated log of project-specific gotchas that aren't derivable from the code: *"2026-03 — the billing reconciliation runs in the research repo, not the backend, because X."* This is different from rules (which are timeless standards) and from learnings (which are how-to-work lessons). Project memory is *facts about this codebase and its history.* The agent appends a dated bullet when it learns something non-obvious; it reads the file when a task touches one of its topics.

## Why this split beats a monolith

Because the agent's attention is the scarce resource. A focused agent that read exactly the security rules, the data-access rules, and the planning mode for a task involving an authenticated endpoint will out-perform an agent that had all forty rule files in context and half-skimmed them. **Load only what the task needs** — that's the entire game.

---

# Part 4 — The persona & posture layer

A harness with rules but no personality produces correct, lifeless work and never pushes back. The persona is what turns "a tool that does what it's told" into "a colleague with judgment." This lives in the root core and is short, but it does real work.

Three things to encode:

**1. Identity and voice.** Who is this agent, and how does it talk? Give it a name and a relationship to the user. Decide the register: terse and direct, or warm and collaborative? The point isn't flavor — it's that a defined voice makes the agent *consistent*, and a defined relationship ("you're my engineering partner, I trust you to get it right and I don't read every line") sets the accountability. The strongest framing we've found: *"The user doesn't read the code you write. That trust flips a switch — you carry full accountability for what ships. 'It should work' is never enough; you run it, you test the edges, you say plainly when something's shaky."*

**2. How it thinks.** Encode the *method*, not just the manners:
- *Think before you type* — if you can't describe the change in three sentences, you're not ready.
- *Decompose like an architect* — units of work, what exists, the data flow, the failure modes, before any code.
- *Reuse before you write* — search for an existing helper before adding one; a duplicate splits trust between two implementations that drift.
- *Push back* — disagreement stated plainly, with a reason and a counter-proposal, beats polite compliance. "No, that's wrong, here's why" is more useful than a yes-man.
- *Ask when you don't know* — "I'm not sure" beats confident guessing.

**3. How it reports.** This is subtle and high-value. Decide the *altitude* of the agent's explanations. If your engineers work at the architecture level and don't want line-by-line diffs, tell the agent to explain at *their* altitude: what was the problem, what logical change fixes it, what does that mean for behavior — skip which string it edited. Example of the target register:

> Not *"I added a guard on the response parser,"* but *"the agent was crashing when a search came back empty because we assumed it always returned results. Now an empty result just gets handled and the run keeps going."*

**The posture rules that matter most** (put these in the core, they prevent the most damage):

- **Decide the small stuff; ask on the big stuff.** Names, file splits, which of two equally-correct approaches — decide and move on. Anything that changes *what the product does or how the system is built* — a data-model shape, an API contract, who-can-see-what, a business rule — stop and ask. A wrong guess there silently reshapes the product. This holds even in autonomous mode: "don't pester me with what you can answer yourself" never means "guess at the architecture."
- **Simplicity is a design requirement.** When two designs reach the same outcome, the one that touches less of the system wins — even if the other looks more thorough. Before committing to a design, ask: how many files does it touch, how many existing behaviors does it change, what breaks if it's half-wrong? When a design starts rippling through paths unrelated to the ask, that ripple is the signal to find a smaller shape.
- **Done means done.** No TODOs, no "I'll add the test in a follow-up," no half-implemented edges. Half-done work poisons a trust-based system.
- **Verify by running, not by reasoning.** Don't claim it works — watch it work. Run the tests. Report what you ran and the result at the outcome level ("ran the touched tests, all green; the empty-search case now passes"), not a wall of logs.

---

# Part 5 — Engineering rules (the coding contract)

This is the heart of what your harness "knows." These are the rules that make the output *yours* — built to your bar, in your patterns. Below is a generic, battle-tested rule set. Translate each to your stack, drop what doesn't apply, add what's specific to you. Each becomes a file under `engineering/rules/`.

## 5.1 — Architecture: the 90/10 flow/helpers split

This is the load-bearing rule; the whole "review the skeleton, not the meat" payoff rests on it. Every feature splits into two layers:

| Layer | What it is | Share | Read by |
|---|---|---|---|
| **Flow (the 10%)** | Orchestration files. A linear sequence of named function calls with branching and error handling. | ~10% | **Humans** |
| **Helpers (the 90%)** | Deterministic functions that do one thing — a DB write, an API call, a transform, a validation. Each has a top-of-file comment + tests. | ~90% | **Tests only** |

The contract:

- **Helpers are trusted because their tests pass and their top comment describes them.** A human never reads a helper's body; it's a black box defined by its name, signature, and comment.
- **Flow files are reviewed because they can't be tested into correctness.** The *order* of steps, the branches, the error handling — a human verifies those by eye.

A flow file **may** contain: imports of helpers, a top-level try/catch, sequential helper calls, conditional branching on helper outputs, composition (one helper's output feeding the next), a final return. It **must not** contain: DB calls, external API calls, file/network I/O, non-trivial transformations, validation logic, or inline business rules. Anything that encodes *what the product does* goes in a helper.

The test you apply to every file:

> "If a human opens this file, will they read it like a paragraph of a book — start to finish, no jumping into other files — and know what it does?"
> — A **flow file:** yes, by reading the code itself. — A **helper:** yes, by reading its top-of-file comment alone.

What a flow file should look like (stack-agnostic):

```
// index_pdf: turn one uploaded PDF into searchable text.
// 1. fetch the file  2. pages→images  3. extract text  4. embed  5. save  6. mark done.
// On any failure: mark failed and return a structured error.
async function index_pdf(file_id):
    try:
        buffer   = get_file_buffer(file_id)         # fetch the stored file
        images   = pdf_to_images(buffer)            # one image per page
        pages    = extract_text_from_pages(images)  # OCR each page
        embedded = attach_embeddings(pages)         # vector per page
        save_search_documents(file_id, embedded)    # persist
        mark_status(file_id, 'done')
        return { ok: true }
    catch error:
        mark_status(file_id, 'failed')
        log_error({ step: 'index_pdf', file_id, error })
        return { ok: false, error: safe_message(error) }
```

~15 lines. A reviewer reads it in 30 seconds and never opens `extract_text_from_pages` — it has tests and a comment. That's the whole idea.

**The helper contract.** Every helper file *starts* with a top-of-file comment that describes, in plain English, what it does, its inputs, its outputs, its errors, and its side effects — enough that a human understands it fully without reading the body. That comment is the API contract. It's mandatory; without it, a helper can't be trusted from a flow file without opening it, which defeats the entire model. A helper does one thing (if you describe it with "and," split it), has a descriptive name, validates its inputs at trust boundaries, and has tests.

**A three-tier hierarchy** keeps helpers findable:
- **Tier 1 — universal helpers** (a shared/ folder): reusable everywhere, no knowledge of any feature (`upload_to_storage`, `generate_embeddings`, `assert_tenant_scope`).
- **Tier 2 — scoped helpers** (next to the feature's flow): compose Tier 1 and add domain meaning (`get_file_buffer_from_drive`).
- **Tier 3 — flow files**: orchestrate Tiers 1 and 2. Kept under a hard line (e.g. 300 lines); past that, decompose into nested sub-flows.

**Always search before you write a helper.** Most of what a task needs already exists. A new helper that's 90% the same as an existing one is one of the most damaging things in the codebase — it splits trust between two implementations that drift. Make "search the shared/ folder and the relevant helpers first" a rule, not a suggestion.

## 5.2 — Naming, types, and file conventions

Pick conventions and make them rules, so the codebase reads as one hand wrote it. A concrete set (adapt to your language):

- **Names read like prose.** `get_file_buffer_from_drive` over `process_file`. A reader knows what it does without opening it. No cryptic abbreviations.
- **A convention per context** — e.g. backend `snake_case`, frontend `camelCase`, files `hyphen-case`, types prefixed (`TUser`), components `PascalCase`, hooks `useVerbNoun`. The specific choice matters less than *having* one and enforcing it.
- **Types over ad-hoc shapes**, stored in a dedicated `types/` tree, subdivided (models / API / services / common).
- **Constants, not magic values.** If you type a literal twice, it's a constant.

## 5.3 — Validation at trust boundaries

Anywhere untrusted data crosses into your system — HTTP requests, queue messages, webhook payloads, external-API responses, file uploads — **validate the shape with a schema** (Zod, Pydantic, whatever your stack uses) and let it throw. A global error handler turns validation failures into clean 400s. The rule: no handler trusts its input; it parses it first.

## 5.4 — The data-access pattern

Two rules that pay off enormously:

- **All DB access goes through one central accessor**, never a direct model import. A single object (call it `mg`, `db`, `models` — whatever) exports every model; code reaches the database only through it. This makes mocking trivial, keeps a registry of every collection in one place, and means a schema that isn't registered "doesn't exist." Registering a new schema is a fixed checklist (create the schema, create the type, add both to the accessor).
- **Indexes are part of the implementation, not an afterthought.** Every new query pattern declares its index. Compound indexes match query order (equality fields, then sort, then range). Project only the fields you need. Paginate every list endpoint (a default page size, never unbounded). Don't rename or migrate existing keys unless truly required — existing keys are a contract, and every migration must be safe at your real data scale.

## 5.5 — Security: tenant scoping is a default, not a layer

If your product is multi-tenant (multiple orgs/customers in one database), this is the rule that prevents the worst class of bug — one customer seeing another's data. Encode it as a reflex:

- **Resolve the tenant (and user) first,** in middleware, before any handler logic.
- **Every single query is tenant-scoped** — every read, write, update, delete includes the `organization_id` (and `user_id` for user-owned resources). No exceptions.
- **Centralize the access checks** in shared helpers (`assert_user_owns_x`), never reimplement scoping inline per route.
- **The verification question** you must be able to answer for every endpoint: *"What happens if a user from a different org sends this exact request?"* The only acceptable answer is a clean, logged denial (403, or 404 where you hide existence). If you can't prove that without reading helper bodies, your access helper isn't centralized enough.
- **Never log secrets, tokens, or full PII.**

## 5.6 — Testing: layers, and picking the right one

The 90/10 rule depends entirely on tests — they're how the 90% of helpers earn the trust that lets humans not read them. But the *strategy* depends on what the code does. Picking wrong silently invalidates the model. A generic layering:

| What you're testing | Approach |
|---|---|
| A helper that touches the DB | A **real** (in-memory / disposable) database + the real accessor. Never mock the DB here. |
| A helper with no DB (an API call, a transform) | **Mock** the external dependency; assert behavior. |
| A flow file (orchestration) | **Mock the helpers themselves**; assert call order, arguments, and error handling. |
| End-to-end (request → response) | Real in-memory DB + mocked external APIs; catches wiring bugs (auth not applied, route not registered). |

The one that surprises people: **never mock the database in a DB-helper test.** The whole reason a DB helper exists is to read/write the right shape from the right collection — a mock returns whatever you told it to, even when your query has a typo. A real in-memory database runs the actual query against the actual schema and tells you if you got it right. Conversely, **don't use a real DB in a flow test** — flow tests are about call order, not data; a real DB makes them slow and hides the orchestration assertions.

Determinism rules that apply to every layer: no real network / LLM / cloud calls (mock with realistic fixtures), no reliance on wall-clock time or randomness in code under test (inject them), no test-order dependence, test names that read as specifications (*"returns 403 when the user is in a different org"*).

## 5.7 — Logging & observability

- **Structured logs only** — never a bare print/console.log in committed code. Every log line carries the same required fields (timestamp, request id, user/tenant id, feature, action, outcome, duration).
- **Log the boundaries:** every request in (sanitized), every external call out, every error caught, every state transition.
- **No silent catches.** `try {} catch {}` that swallows is forbidden. Catch broad → log → decide whether to rethrow. Catch-and-ignore is never allowed.

## 5.8 — Anti-patterns (the "never do this" file)

A short, sharp list the agent scans before finishing. Each entry breaks one of the rules above; naming them explicitly makes them easy to reject in review. Examples: business logic in a flow file; a DB call outside a helper; a direct model import bypassing the accessor; mocking the DB in a DB-helper test; skipping the "search for an existing helper" step; a helper with no top-of-file comment; a silent catch; speculative parameters for a use case that doesn't exist yet; three features half-built instead of one shipped whole.

## 5.9 — The Definition of Done

The checklist a task must pass before it's "done." Make it a real file the agent reads before claiming completion and before committing. A generic version:

- [ ] Every flow file is under the line limit and contains no DB/API/transform/validation logic.
- [ ] Every helper opens with a top-of-file comment describing it in plain English.
- [ ] Every DB-touching helper has a test against a real in-memory DB; every non-DB helper mocks its externals; every flow has a flow test; every authenticated endpoint has a cross-tenant denial test.
- [ ] Every DB query is tenant-scoped and goes through the accessor.
- [ ] Every new query pattern has a declared index.
- [ ] Logs cover request boundaries and errors, structured.
- [ ] The lint / typecheck / format / test commands all pass clean.
- [ ] You read your own diff as a hostile reviewer and approved it.
- [ ] The architecture doc for the feature exists/updated.
- [ ] Nothing irreversible was done without a human (the safety boundary held).

If any box is unchecked, it's not done. This checklist is also what your review agents (Part 7) verify against.

## 5.10 — Architecture docs, co-located

Documentation lives *next to the code it describes*, not in a central dump. Every feature has an `architecture.md` in its folder, beside the flow file. The rule: before reading or editing a feature's flow, read its sibling `architecture.md` first — it's the feature's knowledge base, so the agent reads it instead of re-deriving the feature from code. When the feature changes, the doc updates. A template (`engineering/templates/architecture-doc.md`) fixes the required sections so every doc is complete enough that a future session doesn't need to reread the code.

---

# Part 6 — Modes

A **mode** is the workflow stage the session is in. The same codebase, the same rules — but "plan this feature" and "review this diff" want completely different behavior. Modes make the agent do the right *kind* of work.

The mechanism: the domain core carries a **mode router** — a table matching the user's opening message to a mode file. The agent identifies the mode from the first message and reads that mode file before acting.

```
| The opening sounds like…                              | Mode          | Read first                    |
|-------------------------------------------------------|---------------|-------------------------------|
| "plan this" / "how would you build X"                 | Planning      | engineering/modes/planning.md      |
| "here's another plan, update/QC yours"                | Plan-review   | engineering/modes/planning.md      |
| "implement this plan" / "build feature X"             | Implementation| engineering/modes/implementation.md|
| "QC the code" / "is this ready to ship?"              | Code-review   | engineering/modes/code-review.md   |
| "build this end-to-end, don't involve me"             | Autonomous    | engineering/modes/autonomous.md    |
| anything else — debugging, exploration, a question    | Default       | engineering/modes/implementation.md|
```

If the opening is ambiguous, the agent asks which mode — it doesn't guess between planning and implementing. Crucially: **none of the substantive rules soften in any mode.** The 90/10 split, the test layers, the security scoping hold everywhere. Modes change the *process*, not the *bar*.

The four modes that carry an engineering harness:

### Planning
Output is a single plan detailed enough that another agent (or a fresh session) can implement it without rereading the codebase. The planning contract:
- **First, a clarification gate:** scan the task for things only the user can resolve (a product choice, a scope boundary, a decision no code can settle) and batch-ask them in *one* round. Don't ask what recon can answer.
- **Recon what exists** — search for overlapping helpers and prior art so the plan doesn't reinvent code. Naming a helper that already exists is one of the worst planning mistakes.
- **Cover every required section:** which module(s), what exists already, extend-vs-duplicate decisions, the full file layout, all test cases across every layer, indexes and query shapes, a detailed item-by-item QC checklist, and a **ripple check** (if the change adds a field or behavior to an entity, which *other* operations — clone, delete, export, migrate, list — must change too? These siblings are what get missed).
- **Phased breakdown, always** — even a one-file change. Minimum three phases: implementation phase(s), a QC phase, a documentation phase. Phasing is what makes incremental build and per-phase review possible.

### Implementation
Build the locked plan, phase by phase. The plan is the contract. Each phase is a coherent slice finished and tested before the next. Start every implementation in an isolated working branch (a per-feature branch/worktree). Write tests first for each helper, implement the helper, make its tests pass; then the flow, then the flow test. Self-review the diff as a hostile reviewer before finishing. Run the touched tests (not the full suite — that's a merge-time human step). **Don't launch a browser / take screenshots on your own** — for UI work, write the visual checklist into the doc and let the human open the browser when they want to.

### Code-review
Verify every plan item was implemented and nothing production-blocking, slow, or insecure slipped in. This is where the review *agents* (Part 7) do the work. The output is a ranked, two-tier punch list: blockers (security, correctness, data-loss, scale, an unmet plan item) versus optional nits. Findings are **advice, not orders** — the main session reads them with full context, fixes genuine blockers, dismisses trivia with a one-line reason, and makes the ship call. The discipline that keeps review useful: **real bugs only.** If you can't describe a realistic user, request, and data shape that triggers it, it's not a bug — drop it.

### Autonomous (prompt-to-shipping)
The whole pipeline in one command: plan → per-phase implement + review → final review → stop at the safety boundary (a committed local branch / ready PR, never a merge or push). This mode leans hardest on the "decide small, ask big" rule — it means "don't pester me with what you can answer," never "guess at the architecture." And it *always* stops at the hard line. (Part 8 shows the command that drives it.)

---

# Part 7 — Agents (subagents)

An **agent** (subagent) is a focused worker with its own system prompt, its own tools, and one job. The main session spawns them with the native `Agent` tool; each runs in its own context and returns a result. They're how you get *independent perspectives* and *parallelism* — and how you keep the main session's context clean (a reviewer reads 40 files; you get back its 10-finding list, not the 40 files).

## The core design rule: one agent per failure mode, not per job title

The instinct is to create agents like org-chart roles: "a backend agent," "a frontend agent," "a database agent." **Don't.** Create an agent per *distinct lens or failure mode* — per *way the work can be wrong.* Because that's what makes an agent's judgment sharp: it's hunting one class of problem with one bar.

The canonical review split that works:

- **A correctness-safety reviewer** — the "will it break, leak, or fall over" lens. Owns logic bugs, cross-tenant security holes, and performance-at-scale. One reading surface (the actual data and logic flow), three concerns.
- **A craft-standards reviewer** — the "is it built to our bar" lens. Owns the architecture split, test coverage across the layers, docs, conventions, and plan-compliance.

Two agents, two bars, no overlap. That beats five agents split by file type, every time. Merge roles when the work is simple; split only when the failure mode, the tools, or read-vs-write genuinely differ. A typical small roster: a **gatherer** (read-only recon), a **producer** (writes the draft/code), and **one or two reviewers** (read-only). Don't pre-create agents nobody will call.

## Read-only reviewers vs. producers

The most important distinction. It's enforced by the **tools** you grant:

- **A read-only reviewer** gets read/search tools only (Read, Grep, Glob, and Bash if it needs to run read-only git commands). Its prompt ends with a hard line: *"Read-only. Never edit, write externally, or commit."* It reads and reasons; it returns findings.
- **A producer** additionally gets Write/Edit. Its prompt states its exact write scope *and* the safety boundary: *"You may write files under X. You never take the irreversible action — you draft up to that line and hand off."*

This is where the safety boundary from Part 1 becomes concrete code: the reviewers *can't* act (no write tools), and the producers are told in their own prompt never to cross the line.

## Claude format — `.claude/agents/<name>.md`

Markdown with YAML frontmatter:

```markdown
---
name: correctness-safety-reviewer
description: Reviews a code diff for what actually hurts production — real logic bugs,
  cross-tenant security holes, and DB performance at scale. Read-only. The "will it
  break, leak, or fall over" lens.
tools: Read, Grep, Glob, Bash
model: <the model you chose for this agent>
effort: <low | medium | high | xhigh>
---

You are one of two QC reviewers. Your lens: will this code break, leak, or fall over
in production? You own three concerns on one reading surface — correctness (does the
logic do the right thing), security (is every tenant boundary held), performance at
scale (will the queries survive real data). The other reviewer owns craft, tests, docs.

## First, load
1. Read engineering/modes/code-review.md — the review discipline and the bug-report format.
2. Read engineering/rules/security.md and engineering/rules/data-access.md for the bars.

## Scope
Review the current branch diff (git diff main...HEAD, or the range given). Review only
changed code; read surrounding code to understand contracts. Read-only — no edits, no
test suite, no browser.

## Correctness — <the specific things to hunt: wrong argument, inverted branch,
broken data flow, ripple gaps where a sibling operation didn't get the change…>

## Security — for every endpoint and query: "what if a user from another org sends
this exact request?" The only acceptable answer is a clean denial…

## Performance at scale — will it survive real data volume? Every new query pattern
has a declared index; pagination on every list; explicit projection…

## Discipline
Real bugs only. If you can't describe a realistic user, request, and data shape that
triggers it, it's not a bug — drop it.

## Output
Per the bug-report format in the code-review mode. Every finding carries a plain-English
scenario — a real person, a real action, the bad outcome — with file:line in a `Where:`
line, not in the prose. Lead with findings; if a lens is clean, say so in one line.
Read-only. Never edit, write externally, or commit.
```

Note what the agent's prompt does: it **loads its own rules** (the mode file, the relevant rule files), states its **single lens**, gives **specific things to hunt**, enforces **discipline** (no hypothetical bugs), and fixes the **output format**. That's the anatomy of every good agent prompt.

## Codex twin — `.codex/agents/<name>.toml`

Codex uses TOML with the *same body*. Keep them in lock-step — a change to one usually needs the other:

```toml
name = "correctness_safety_reviewer"          # snake_case
description = "Reviews a code diff for real logic bugs, cross-tenant security holes, and DB performance at scale. Read-only."
model = "<the model you chose>"
model_reasoning_effort = "<low | medium | high | xhigh>"
sandbox_mode = "read-only"                     # "workspace-write" for a producer

developer_instructions = """
<the SAME body as the .md twin>

Do not edit files. Do not run the test suite. Do not launch a browser. Do not commit.
"""
```

## A coordinator pattern

You'll often want one agent that *fans out* others. A **QC coordinator** spawns the two review lenses in parallel over the same diff, merges and de-dupes their findings, and returns one ranked two-tier list. It gathers and classifies; it does **not** fix code or make the ship call — the main session judges and acts. This keeps the main context clean (it gets one merged list, not two raw dumps) and lets the two lenses run concurrently.

> **Models come from you, not from the agent.** When you (or your Claude Code) create an agent, set its `model` and `effort` to what *you* chose for that job — a cheaper/faster model for mechanical recon, a top-tier model with high reasoning effort for adversarial review. Don't let the harness invent model tiers. If it's unsure which model fits a component, it should ask you.

---

# Part 8 — Slash commands

A **slash command** is the choreography layer — a thin, prose recipe that runs a sequence of steps (usually: spawn these agents, in this order, producing these artifacts, stopping here). The command holds *no logic*. It reads like a paragraph a new teammate could follow: "do this, then this, then that agent does the review, then stop."

The mapping: **one command per standalone sub-task, plus one autonomous command** that runs the whole produce→verify loop end to end and stops at the safety boundary. For an engineering harness that's typically:

- `/plan` — run the planning mode: clarify → recon → draft → review → locked plan.
- `/code` — implement a locked plan, one final QC.
- `/super-code` — implement with a QC pass after *each* phase.
- `/ultra-code` — the autonomous one: plan → per-phase implement+QC → final QC → stop.
- `/qc` — just the review: fan out the two lenses over the current diff.
- `/learn` — capture a learning on the spot (Part 11).

## Claude format — `.claude/commands/<name>.md`

Markdown with light frontmatter and a prose body. Invoked as `/<name>`; `$ARGUMENTS` is what the user typed after it.

```markdown
---
description: Solo plan — recon + two divergent planners + merge + adversarial review → locked plan.
argument-hint: "<feature/task to plan>"
---

Run planning for `$ARGUMENTS` using native subagents. Read `engineering/modes/planning.md`
(the contract) and `engineering/templates/architecture-doc.md` first.

First run the clarification gate per planning.md — batch-ask any user-only ambiguities
before recon, or skip if none. Then spawn `recon` for prior art. Then spawn two planners
in parallel with different lenses (one reuse-first, one test-coverage-first). Merge them
yourself and run the full planning checklist. Then spawn `plan-reviewer` for an adversarial
pass and fold its blockers. Write the locked plan to `plans/<feature>.md`. Don't write code.
```

That's a complete command. Notice: it names the mode file to read, names the agents to spawn (which must exist), says what each produces, and states the stop condition ("don't write code"). No logic, no business rules — just the recipe.

The autonomous command is the same shape, longer, and it *always* ends at the boundary:

```markdown
---
description: Autonomous — prompt to shipping. Plan → per-phase implement+QC → final QC → stop.
argument-hint: "<the feature to build end-to-end>"
---

Build `$ARGUMENTS` end to end. Read `engineering/modes/autonomous.md` first.

1. Run the clarification gate — ask only what you cannot answer yourself; then proceed
   without further check-ins (decide the small stuff, never the big stuff).
2. Plan it (the /plan recipe), lock the plan.
3. For each phase: implement it, then spawn the QC coordinator over that phase's diff;
   fix genuine blockers; move on when clean.
4. Final QC over the whole diff.
5. STOP at the safety boundary: commit locally to the feature branch and hand off a
   summary. NEVER merge, push, or deploy. That step is the human's.
```

## Codex format — `~/.codex/prompts/<name>.md`

Codex reads slash-command prompts from a per-user directory. Same recipe, same body — keep it in lock-step with the Claude twin. (Codex also supports skills as an alternative packaging; either works. The prompt file is the simplest.)

The rule for both platforms: **the command names agents that actually exist** on that platform (a Claude command → Claude `.md` agents; a Codex command → Codex `.toml` agents). A command that spawns an agent you never created is the most common broken-harness bug.

---

# Part 9 — Skills

A **skill** is a folder of reusable how-to knowledge that loads on demand — either when the user invokes it or when its description matches the task. Use a skill when a body of *knowledge* (not a workflow) should be reusable and progressively disclosed. This very document is the kind of thing that becomes a skill.

When to reach for a skill vs. the other components:
- **Rules/modes** (Part 3, 6) — knowledge *this harness* always uses. Lives in the domain tree.
- **A command** (Part 8) — a *workflow* to run.
- **A skill** — *portable* knowledge, often used across projects, that you want the platform to auto-load by description ("whenever the user wants to build a slide deck, use this").

Structure — a folder with a `SKILL.md` plus optional `references/`, `scripts/`, `assets/`:

```markdown
---
name: <skill-name>
description: >-
  <what it does + trigger language: "use this whenever the user wants to …">.
  The description is how the platform decides to load it — make it specific.
---

# <Skill> — <one-line identity>

<Short body: what it is, the workflow, then a "References — read on demand" list
pointing at references/ files the model opens only when it needs that depth.>
```

The discipline is the same progressive-disclosure principle as Part 3: **`SKILL.md` is the 10% always loaded once the skill triggers; the `references/` are the 90% read only when needed.** Keep `SKILL.md` short; push detail into references.

Install: it's just a folder — drop it into `~/.claude/skills/<name>/` (Claude) and `~/.codex/skills/<name>/` (Codex), or project-local at `.claude/skills/<name>/`. Restart the app once after adding it.

---

# Part 10 — Loops & verifiers

Here's the line that matters: **a harness without verifiers is just an automation prompt; a harness with a *lying* verifier is worse — it ships confident garbage.** This is where trust lives. For an engineering harness the primary verifier is usually the test suite plus the review agents, but the discipline below applies to any check you build.

## What a loop is

A loop repeats **produce → verify → fix** until the work passes or a stop condition trips:

```
each round: produce/revise → run the verifier(s) → log the result
STOP on: SUCCESS (verifier clean, judge ≥ bar) · MAX_ITERS · PLATEAU (no improvement N rounds)
         · BUDGET (time ceiling) · NO_PROGRESS (the failure count didn't strictly drop)
```

No single condition can be the only thing between the loop and infinity — always include a hard backstop (max iters + budget). Log every round so a human can see *why* it stopped.

## Two kinds of verifier

```
Can the check be a pure function returning pass/fail with NO model call?
 ├─ yes → PROGRAMMATIC  (default — fast, repeatable, can't be talked into a wrong answer)
 └─ no, it's irreducibly semantic (well-reasoned, on-brand, matches intent)
        → LLM-AS-JUDGE, behind deterministic pre-checks.
```

**If you can compute it without a model, you must.** Every check you move from judge to mechanical removes one way to lie. For engineering, most checks *are* mechanical: does it compile, do the tests pass, does the linter pass, is every query tenant-scoped (greppable), is every flow file under the line limit (countable). Push everything you can into programmatic checks; reserve the judge for the genuinely semantic ("is this the simplest design," "does this read like prose").

## Programmatic verifier — and its honesty self-test

A small, dependency-free script that scans the produced artifacts and reports `{ summary, findings }`, exiting non-zero when there are findings (the exit code is what the loop reads as pass/fail). The rules:

- **Fail if it inspected nothing.** A verifier that checked zero files must *not* report clean — that's the classic silent liar (a wrong path, a dead filter). Exit non-zero on an empty run.
- **Self-derive the checklist** from the artifacts — never trust a stale hand-maintained list.
- **Classify conservatively** — hard-fail only what's certain; park ambiguous cases in a "review" bucket for a human.
- **Tune false positives in an allowlist file, never by weakening the check.**

And the non-negotiable: **ship every programmatic verifier with a self-test that proves it can fail.** The self-test plants a known-bad artifact the verifier *must* flag, and a known-good one it *must* pass. A verifier that passes its planted-bad is a liar — reject it before it guards anything. *A verifier that can't prove it can fail is worthless.*

## LLM-as-judge — and its trap item

For the semantic call a script can't make, score against a **written 1–5 rubric with concrete anchors** — never a freeform vibe. Two rules:

- **Deterministic pre-checks first** — the judge is never the first line of defense.
- **Plant a trap item:** a deliberately bad artifact the judge *must* score low. If it scores the trap high, the judge is miscalibrated — that run is void, not averaged in. This is the judge's honesty test, mirroring the verifier self-test.

## Auto-fix vs. human triage

Inside an autonomous loop, the producer may auto-revise against the verifier's *mechanical* findings and re-run until clean — the output is a reversible draft, so that's safe and is the whole point of the loop. **Human triage is for two things:** the ambiguous "review-bucket" findings (never auto-resolve those), and the final step before the irreversible action (a human signs off before anything merges/ships).

---

# Part 11 — Self-improvement

Two timescales, kept separate: **optimizing** a component's prompt against an objective, and the harness **learning** from feedback as it runs.

## Optimizing a prompt (measured, not vibes)

Turn "make this reviewer better" into a loop with a scoreboard:

1. **Define the objective** — what the component is for, what an ideal output looks like (a real example), and the failure modes. The failure modes become the metrics.
2. **Build the eval** — a metric table: each metric, how it's scored (mechanical scorer where possible, judge rubric where not), its weight, its target. The more mechanical the score, the less the optimizer can game its own grader.
3. **Baseline** — run the current prompt over your data; record the score.
4. **Loop** — read the lowest metrics and the actual failing outputs → edit the prompt (never the scorer) → re-run → re-score → keep the change only if it improved, else revert.
5. **Stop** at max iterations or a plateau.

**The anti-overfit rule:** split your examples into a *train* set and a *held-out eval* set. Tune the prompt against train, but **only keep a change if it also improves the held-out eval.** A change that helps train but not eval memorized the examples — reject it. The eval set never tunes the prompt.

## The learnings memory — how the harness gets better over time

Give the harness a tiny, **always-loaded** learnings file (one per platform if you target both). It holds one-line, *generalized* lessons — things it got wrong before, each with a rule to not repeat it:

```
- [short-slug] When <trigger>, <the habit that prevents the miss>. — ×N, last YYYY-MM-DD
```

The discipline that keeps it useful (and small enough to always load):

- **Record on correcting feedback only** — when the user, or a check, catches a *real* mistake the harness accepted and fixed. A clean run writes nothing.
- **Generalize** — strip the domain-specific names. If nothing transferable is left, it's a project fact (goes in `project-memory.md`), not a lesson.
- **Merge, don't append** — if a near-duplicate exists, bump its `×N` and date instead of adding a line.
- **Cap it** — keep it tiny; merge or retire before it grows; drop stale entries.

Wire "did you record a learning if you were corrected?" into the Definition of Done, and give the harness a small `/learn` command to capture one on the spot. That loop — *mistake → generalized lesson → always loaded next time* — is what makes the harness improve instead of repeating itself. It's the single highest-leverage thing in the whole system: a harness that learns is worth ten that don't.

---

# Part 12 — The build process

Here's how you (with your Claude Code) actually go from nothing to a working harness.

## Step 1 — The interview

Before building anything, the harness-builder should play these questions back to you in plain English. Answer them and you've specified the harness:

1. **The deliverables.** What concrete things should the harness produce? (A locked plan, a phased implementation, a reviewed diff, a ready PR.)
2. **The definition of good.** How would *you* tell a good deliverable from a bad one? This is the single most important answer — it becomes your verifiers and your review agents' bars.
3. **The stack and conventions.** What language, framework, database, test runner? What naming/type/validation conventions do you already use (or want)?
4. **The architecture standard.** What's your version of the 90/10 split? How thin should the human-reviewed surface be? What are your non-negotiable invariants (tenant scoping, the data-access pattern, the test layers)?
5. **The tools.** What external systems does the work touch (a database, a cloud store, CI, an issue tracker)? These become MCP servers or CLI tools the agents get — with credentials in env vars / connectors, **never hard-coded in a file**.
6. **The hard line.** The one action that must never happen without a human. (Merge? Push? Deploy? A destructive migration?)
7. **Which models.** Which model and reasoning level for each component — a cheaper one for mechanical recon, a top-tier one for adversarial review. *You* decide this; the harness doesn't guess.

## Step 2 — Decompose into components

From your answers, the builder derives the component set:

- **Agents** from failure modes (Part 7) — a gatherer, a producer, one or two reviewers. Merge when simple; split only when the failure mode/tools/read-vs-write differ.
- **Commands** — one per sub-task, plus one autonomous.
- **Verifiers** — mechanical where a mechanical signal exists (compile, tests, lint, greppable invariants), judge where the call is semantic.
- **A loop** only where a failed check is *repairable* (never around the irreversible action).
- **The memory layer** — the root core, the domain core, the rules files, the learnings file.

**Minimal-first.** Build the smallest set your deliverables justify. A thin harness you trust beats a sprawling one you can't hold in your head. Grow it when a real need appears — don't pre-create agents nobody will call.

## Step 3 — Build, for real

The builder writes real file bodies (not skeletons), installs them in the right places (project root for agents/commands, per-user dirs for Codex prompts and skills), and keeps Claude/Codex twins in lock-step. Every programmatic verifier ships with its passing self-test.

## Step 4 — Verify with the done-checklist

Before handing off, run the checklist:

- [ ] Components installed in the right places — **no machine-specific absolute path baked into any file** (relative paths only, so the harness is portable).
- [ ] Every command names agents that **exist** on each platform you targeted.
- [ ] No unfilled placeholders anywhere.
- [ ] Every programmatic verifier has a **passing self-test** (planted-bad fails, planted-good passes, empty-input refused).
- [ ] Every judge check has a **trap item** and a 1–5 rubric.
- [ ] The learnings file exists and the Definition of Done requires recording a lesson when corrected.
- [ ] **No secret values** in any file — env-var names / connector ids only.
- [ ] The **irreversible action is never taken autonomously** — the boundary is in the producing agents *and* the autonomous command.
- [ ] A short hand-off note: what was built, how to run it, what to validate first.

If a box is unchecked, it's not done.

## What to build first (a suggested order)

Don't try to land everything at once. A sane sequence:

1. **The root core + domain core + one rules file** (your architecture standard). Now the agent knows your bar. Test it by asking it to review some existing code — does it flag the right things?
2. **The two review agents + a `/qc` command.** Now you have automated review. This alone is a huge win.
3. **The planning mode + `/plan`.** Now the agent plans to your standard.
4. **The implementation mode + `/code`.** Now it builds to your standard.
5. **The learnings file + `/learn`.** Now it improves.
6. **`/super-code` and `/ultra-code`** — compose the above into per-phase and autonomous pipelines.
7. **Verifiers and loops** where a mechanical signal exists.

Each step is independently useful. Ship one whole before starting the next — the same rule the harness enforces on features applies to building the harness itself.

---

# Appendix — Copy-paste templates

Fill the `<…>` placeholders. All paths relative to your project root.

### A. Root core — `CLAUDE.md` (and twin `AGENTS.md`)

```markdown
# <Harness name> — Engineering

You are <name>, a senior engineer on <team>. <Persona: voice, relationship, the
accountability framing — see Part 4.>

## The gate
Before acting on ANY engineering task, Read `engineering/core.md` IN FULL. Hard gate.

## Ground rules — every session
- Plain prose for humans; identifiers go in a `Where:` line, not the sentence.
- Push back when you disagree, with the reason.
- Act, don't only suggest — but confirm before anything hard to reverse.
- Smallest blast radius; flag unrelated finds, don't fold them in.
- Never delete or revert work you didn't create.

## Learnings — always loaded
@engineering/learnings/claude.md
```

### B. Domain core — `engineering/core.md`

```markdown
# Engineering Operating Manual — Core

Read in full before any engineering task. Small on purpose: invariants + routers.

**Role.** <who you are and the stack.>
**Goal.** <the north star — e.g. "a human reads this codebase like a book.">
**Success.** Every applicable Definition-of-Done box checked.
**Stop.** When the task is correct — not when more could be added.

## Mode router — identify the session first
| Opening sounds like…            | Mode          | Read first                        |
|---------------------------------|---------------|-----------------------------------|
| "plan this"                     | Planning      | engineering/modes/planning.md          |
| "implement this plan"           | Implementation| engineering/modes/implementation.md    |
| "QC the code"                   | Code-review   | engineering/modes/code-review.md       |
| "build this end-to-end"         | Autonomous    | engineering/modes/autonomous.md        |
| anything else                   | Default       | engineering/modes/implementation.md    |

## Rules router — read what the task touches
| Task involves…                  | Read                                  |
|---------------------------------|---------------------------------------|
| flow/helper decomposition       | engineering/rules/architecture.md          |
| any DB query/schema/index       | engineering/rules/data-access.md           |
| naming, types, validation       | engineering/rules/coding-standards.md      |
| auth, tenant scoping, secrets   | engineering/rules/security.md              |
| writing tests                   | engineering/rules/testing.md               |
| logging / error handling        | engineering/rules/logging.md               |
| before calling a task done      | engineering/rules/definition-of-done.md    |

## Invariants — never violated, any mode
- <e.g. all DB access through the central accessor.>
- <e.g. every query tenant-scoped; cross-tenant request gets a clean denial.>
- <e.g. flow files read like prose — no I/O/logic inside.>
- <e.g. structured logger only; no silent catches.>

## Posture
<The detailed how-you-work rules from Part 4.>
```

### C. Agent — Claude `.claude/agents/<name>.md`

```markdown
---
name: <name>
description: <one line — what it is + when to use it>
tools: Read, Grep, Glob, Bash        # add Write, Edit for a producer
model: <the model you chose>
effort: <low | medium | high | xhigh>
---

You are the <name> agent — <one sentence: the single job, and what you never do>.

## First, load
<the mode file and rule files this agent needs.>

## What you do
<the specific things to hunt / produce, in detail.>

## Discipline
<the bar: real findings only; if you can't describe a concrete failure, drop it.>

## Output
<the exact format.>

<Reviewer ends: "Read-only. Never edit, write externally, or commit.">
<Producer ends: "You may write under <scope>. You never <the irreversible action> —
 draft and hand off.">
```

### D. Agent — Codex twin `.codex/agents/<name>.toml`

```toml
name = "<name_snake_case>"
description = "<one line>"
model = "<the model you chose>"
model_reasoning_effort = "<low | medium | high | xhigh>"
sandbox_mode = "read-only"            # or "workspace-write" for a producer

developer_instructions = """
<the SAME body as the .md twin>
"""
```

### E. Slash command — Claude `.claude/commands/<name>.md`

```markdown
---
description: <one line — what the command does>
argument-hint: "<what the user passes>"
---

<A tight prose recipe for `$ARGUMENTS`: read the mode file first, then the numbered
steps — which agent does each, what each produces, and the stop condition. Reads like
a paragraph. No logic in the body. End at the safety boundary if it's a producing command.>
```

(Codex twin: same body at `~/.codex/prompts/<name>.md`.)

### F. Learnings file — `engineering/learnings/claude.md`

```markdown
# <Harness> — Learnings

_Always-loaded. One-line generalized lessons, each a mistake already made once.
Record only on correcting feedback. Merge near-duplicates (bump ×N). Cap tiny._

## <category>
- [slug] When <trigger>, <the habit that prevents the miss>. — ×1, last <date>
```

---

*Build the smallest version first. Onboard it like a colleague. Let it learn. That's the whole game.*
