---
description: Recon and review a feature plan before implementation.
argument-hint: "<feature or task>"
---

Plan `$ARGUMENTS`. Read `engineering/modes/planning.md` and `engineering/templates/plan.md` first. Batch any user-only product, scope, or security decisions into one clarification round. Then ask the `recon` agent to inspect existing code and patterns. Draft a phased plan with affected files and layers, acceptance criteria, school-scope/security cases, verification cases, and ripple effects. Ask `plan-reviewer` for an adversarial review and fold in concrete blockers. Save the result under `plans/` and stop without implementing.
