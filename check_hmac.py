import json
import hmac
import hashlib
from pathlib import Path
import os

verified_nodes = 0
tamper_detected = []
secret_key = os.environ.get("NEXUS_SECRET_KEY", "absolute-zero-entropy-override").encode('utf-8')

for f in Path('data/knowledge/entities').glob('*.jsonl'):
    expected_prev = "NEXUS_GENESIS_0000"
    with open(f, 'r') as file:
        for line in file:
            data = json.loads(line)
            eid = data.get('id')
            stored_hash = data.get('hash')

            # verify prev_hash
            if data.get('prev_hash') != expected_prev:
                tamper_detected.append(eid)
                expected_prev = stored_hash
                continue

            item = data.copy()
            item.pop('hash', None)

            payload = json.dumps(item, sort_keys=True).encode('utf-8')
            new_hash = hmac.new(secret_key, payload, hashlib.sha256).hexdigest()
            if new_hash == stored_hash:
                verified_nodes += 1
            else:
                tamper_detected.append(eid)
            expected_prev = stored_hash

for f in Path('data/knowledge/relations').glob('*.jsonl'):
    expected_prev = "NEXUS_GENESIS_0000"
    with open(f, 'r') as file:
        for i, line in enumerate(file):
            data = json.loads(line)
            stored_hash = data.get('hash')

            if data.get('prev_hash') != expected_prev:
                tamper_detected.append(f"relation_{i}")
                expected_prev = stored_hash
                continue

            item = data.copy()
            item.pop('hash', None)

            payload = json.dumps(item, sort_keys=True).encode('utf-8')
            new_hash = hmac.new(secret_key, payload, hashlib.sha256).hexdigest()
            if new_hash == stored_hash:
                verified_nodes += 1
            else:
                tamper_detected.append(f"relation_{i}")
            expected_prev = stored_hash

print(f"Verified: {verified_nodes}, Tampered: {tamper_detected[:5]} (Total tampered: {len(tamper_detected)})")
