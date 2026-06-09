import json
import hmac
import hashlib
from pathlib import Path
import os

verified = 0
tampered = []
entities_path = Path('data/knowledge/entities')
secret_key = os.environ.get("NEXUS_SECRET_KEY", "absolute-zero-entropy-override").encode('utf-8')

for f in entities_path.glob('*.jsonl'):
    prev_hash = "NEXUS_GENESIS_0000"
    with open(f, 'r') as file:
        for line in file:
            data = json.loads(line)
            eid = data.get('id')
            stored_hash = data.get('hash')
            if stored_hash:
                item = data.copy()
                item.pop('hash', None)
                payload = json.dumps(item, sort_keys=True).encode('utf-8')
                new_hash = hmac.new(secret_key, payload, hashlib.sha256).hexdigest()
                if new_hash == stored_hash:
                    verified += 1
                else:
                    tampered.append(eid)
            # The ledger is a Merkle chain: next line's prev_hash should be this line's stored_hash
            prev_hash = stored_hash

print(f"Entities Verified: {verified}, Tampered: {tampered[:5]}")
