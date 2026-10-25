---
description: Recon and review a feature plan before implementation.
argument-hint: "<feature or task>"
---

Plan `$ARGUMENTS`. Read `engineering/modes/planning.md` and `engineering/templates/plan.md` first. For a product feature, read `docs/prd.md` and the relevant `docs/specs/<feature>.md`; if that spec does not exist, discuss and write it with the user before locking the plan. Batch any other user-only product, scope, or security decisions into one clarification round. Then ask `recon` to inspect existing code and patterns. Draft a phased plan that links to applicable PRD/spec requirements and covers affected files/layers, acceptance criteria, school-scope/security cases, verification cases, and ripple effects. Ask `plan-reviewer` for an adversarial review and fold in concrete blockers. Save the result under `plans/` and stop without implementing.
