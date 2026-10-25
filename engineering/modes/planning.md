# Planning Mode

Produce a plan that another engineer can implement without repeating basic recon.

1. For a product feature, read `docs/prd.md` and its matching `docs/specs/<feature>.md`. If the spec does not exist, collaborate with the user to create and agree on it before locking the implementation plan. Do not copy the whole PRD into the plan; link to relevant requirements.
2. Identify user-only choices about behavior, scope, data ownership, or access. Batch them into one concise question before dependent planning. Do not ask questions repository inspection can answer.
3. Inspect the relevant code, existing helpers, routes, components, schemas, and conventions. State what exists and what should be extended.
4. Describe the proposed design and affected files. Trace the user-visible flow through React, Express, and persistence where relevant.
5. List acceptance criteria and concrete verification cases, including failure and authorization cases. Use only test/lint commands that exist in the project.
6. Check ripple effects for related operations such as create, edit, list, archive/delete, export, and migration when relevant.
7. Break the work into coherent implementation phases, followed by review/verification and documentation or handoff.

Do not write implementation code while planning. Label unresolved decisions instead of silently choosing them.
