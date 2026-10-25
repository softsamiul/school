# Planning Mode

Produce a plan that another engineer can implement without repeating basic recon.

1. Identify user-only choices about behavior, scope, data ownership, or access. Batch them into one concise question before dependent planning. Do not ask questions repository inspection can answer.
2. Inspect the relevant code, existing helpers, routes, components, schemas, and conventions. State what exists and what should be extended.
3. Describe the proposed design and affected files. Trace the user-visible flow through React, Express, and persistence where relevant.
4. List acceptance criteria and concrete verification cases, including failure and authorization cases. Use only test/lint commands that exist in the project.
5. Check ripple effects for related operations such as create, edit, list, archive/delete, export, and migration when relevant.
6. Break the work into coherent implementation phases, followed by review/verification and documentation or handoff.

Do not write implementation code while planning. Label unresolved decisions instead of silently choosing them.
