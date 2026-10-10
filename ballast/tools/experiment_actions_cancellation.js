// Ballast 2026-10-11 synthetic fixture. No external effects.
const fs = require("fs");
const doc = JSON.parse(fs.readFileSync("ballast/evidence/2026-10-11-scenarios.json","utf8"));
function full(s) {
  if (!s.target_ok) return "target-incarnation-mismatch";
  if (!s.membership_ok) return "membership-unverified";
  if (!s.binding_ok) return "effect-identity-mismatch";
  if (s.prior === "unknown" || (s.prior === "miss" && !s.coverage)) return "safe-stop-unknown";
  if (new Set(s.receipts).size !== s.receipts.length) return "duplicate-effect";
  if (s.receipts.some(x => !doc.required.includes(x))) return "unexpected-effect";
  if (s.receipts.length && !s.historical_auth) return "historically-unauthorized";
  if (s.receipts.length && !s.temporal_ok) return "temporal-unverified";
  if (doc.required.some(x => !s.receipts.includes(x))) return s.current_permission ? "incomplete-effect-set" : "permission-stop";
  return s.postcondition ? "verified" : "current-postcondition-failed";
}
let rows=["scenario,path,decision,expected,agreement"];
for (const c of doc.cases) {
  const s={...doc.base,...c.overrides};
  const paths={
    "cancellation-only":s.old_status==="cancelled"?"incomplete-effect-set":"verified",
    "attempt-advanced-only":s.new_attempt>s.old_attempt?"verified":"incomplete-effect-set",
    "receipt-count-only":s.receipts.length===doc.required.length?"verified":"incomplete-effect-set",
    "full-integrity":full(s)
  };
  if (paths["full-integrity"]!==c.expected) throw Error("reference mismatch: "+c.id);
  for (const [path,decision] of Object.entries(paths)) rows.push([c.id,path,decision,c.expected,decision===c.expected].join(","));
}
process.stdout.write(rows.join("\n")+"\n");
