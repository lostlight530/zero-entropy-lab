# A5 Monthly Drift Reflect Template

CORTEX_RUN_HEADER
Cortex: aegis-cortex
Host Repository: zero-entropy-lab
Task ID: A5
Cadence: Monthly
Loop Stage: Reflect
Run Month: YYYY-MM
Month Closure Status: OPEN
Execution Time Asia/Shanghai: ACTUAL_ISO_TIMESTAMP_WITH_08_OFFSET
Agent: ACTUAL_AGENT
Record Provenance: JULES_NATIVE_OR_AUTHORIZED_SUBSTITUTE
Original Execution Status: ACTUAL_EXECUTION_STATE
Current Path Status: CURRENT_DELIVERY_STATE
Network Status: ACTUAL_NETWORK_STATE
Write Scope: aegis-cortex only
Boundary Violation: NO

INPUT_RECORD

## Daily Coverage Matrix

List every calendar date and A1/A2 state without manufacturing missing inputs.

## Weekly Coverage Matrix

List every intersecting ISO week and A3/A4 historical execution state.

## Inherited Evidence

Separate repeated lineage from independent evidence.

## Independent Evidence Added

Use `NONE` when monthly review adds no independent source.

## Missing Inputs Preserved

Keep blocked,reconstructed,and unresolved states visible.

## External Risk State

Record supported external risk classes without converting them into local incidents.

## Local Incident State

Use `NO_LOCAL_INCIDENT_EVIDENCE` unless repository evidence establishes an incident.

## Proof Boundary Calibration

Separate structural,storage,runtime,semantic,and authoritative-effect evidence.

RELIABILITY_REVIEW

DRIFT_AND_FAILURE_LOG

CORRECTION_NOTES

HANDOFF_TO_A6

BOUNDARY_CHECK
Boundary Violation: NO

## Monthly maintenance ledger

Monthly Maintenance Status: NOT_RUN
Maintenance Coverage: TODO
Maintenance Change Log: TODO
Maintenance Validation: NOT_RUN
Maintenance Unresolved: Full monthly maintenance has not run.

List every scoped daily, weekly, monthly and referenced special/audit path with its actual disposition. Distinguish delivery, original execution and current quality. Correct supported defects in place, preserve execution facts, and propagate changed interpretations to dependent summaries and indexes.

| File and original commit | Original claim | Correction and source | Downstream impact | Check result |
| --- | --- | --- | --- | --- |

Use the real correction time and reviewer identity. An unchanged file can be marked REVIEWED_NO_CHANGE only after its content was reviewed. Do not mark the entire month completed while entries are unresolved. A summary or checker pass alone does not complete maintenance.

