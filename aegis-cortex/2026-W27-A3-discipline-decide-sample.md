# A3 Weekly Discipline Decide

CORTEX_RUN_HEADER

Cortex: aegis-cortex

Host Repository: zero-entropy-lab

Task ID: A3

Cadence: Weekly

Loop Stage: Decide

Run Week: 2026-W27

Agent: Jules

Knowledge Source: A1 + A2 + External Web + aegis-cortex local files

Repository Inspection: NO

GitHub Actions Inspection: NO

Write Scope: aegis-cortex only

Boundary Violation: NO

INPUT_RECORD

Local Files Read:

* aegis-cortex/2026-07-01-A1-reliability-observe.md

* aegis-cortex/2026-07-01-A2-doctrine-orient.md

External Verification Topics:

* Jules scheduled tasks

* Microsoft Copilot Tasks human control framing

* Maps Grounding Lite verification principle

* OIN 2 opt-in and scope rule

Input Gap:

* Only first-day A1 and A2 exist

* This A3 is a bootstrap weekly decision file

WEEKLY_RISK_SYNTHESIS

Repeated Risk:

* Asynchronous agent sessions can lose state without explicit file-native handoff

Repeated Risk:

* Agent systems can drift into maintaining the host repository if scope is not repeated

New Risk:

* Public sources can be overused to support private claims

Downgraded Risk:

* Open-source governance is useful for discipline analogy, but should not dominate daily reliability work

DECISION_SET

Decision 1

Decision: Every Aegis file must begin with INPUT_RECORD before analysis

Evidence: Verification principle from MCP and LLM output guidance, plus recurring task handoff need

Risk Reduced: hallucination risk and unsupported-source risk

Expected Behavior Change: Future Jules must prove what it read before interpreting anything

Why Now: First week sets the reliability floor

Decision 2

Decision: Every Aegis file must explicitly state Repository Inspection: NO and GitHub Actions Inspection: NO

Evidence: Aegis is self-scoped and must not confuse itself with zero-entropy-lab maintenance

Risk Reduced: scope drift risk

Expected Behavior Change: Future Jules repeats the boundary every run

Why Now: First week must prevent host-repository leakage

Decision 3

Decision: Separate public-source claims from private-evidence claims

Evidence: Official product pages can support product facts, not personal status

Risk Reduced: overconfidence risk and claim hygiene failure

Expected Behavior Change: Future files classify evidence before making conclusions

Why Now: Aegis must protect language discipline early

DO_NOT_CHANGE

Do not change host repository files

Do not inspect source code

Do not inspect GitHub Actions

Do not create static policy files

Do not continue old Nexus reports

HANDOFF_TO_A4

A4 should convert these three decisions into an internal protocol action record

A4 must keep action inside the weekly A4 file only

A4 must not create non-periodic config files

BOUNDARY_CHECK

Repository Inspection: NO

GitHub Actions Inspection: NO

Files Outside aegis-cortex Written: NO

Boundary Violation: NO
