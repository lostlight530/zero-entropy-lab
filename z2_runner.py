import subprocess
import os
import re
import datetime

def clean_value(v):
    # Ensure all caps
    v = v.upper()
    # Replace . with _
    v = v.replace('.', '_')
    # Replace / with _
    v = v.replace('/', '_')
    # Replace - with _
    v = v.replace('-', '_')
    return v

def main():
    # Run nexus.py clean
    print("Running nexus.py clean...")
    subprocess.run(["python", "src/kernel/protocol/nexus.py", "clean"], check=True)

    # Get today's date
    date_str = datetime.datetime.now().strftime("%Y%m%d")
    report_path = f"data/memories/{date_str}-graph-validation.md"

    if not os.path.exists(report_path):
        print(f"Report file {report_path} not found_")
        return

    with open(report_path, 'r') as f:
        content = f.read()

    data = {}

    for line in content.strip().split('\n'):
        if line.startswith('STATS:'):
            match = re.search(r'ENTITIES=(\d+)\s+RELATIONS=(\d+)', line)
            if match:
                data['ENTITIES'] = match.group(1)
                data['RELATIONS'] = match.group(2)
        elif line.startswith('CRYPTOGRAPHIC_INTEGRITY:'):
            match = re.search(r'VERIFIED_NODES=(\d+)\s+TAMPER_DETECTED=(.*)', line)
            if match:
                data['VERIFIED_NODES'] = match.group(1)
                data['TAMPER_DETECTED'] = clean_value(match.group(2))
        elif line.startswith('INTEGRITY:'):
            match = re.search(r'LINKED=([\d/]+)\s+ORPHANS=(\d+)\s+DANGLING=(\d+)\s+DUPLICATES=(\d+)', line)
            if match:
                data['LINKED_RATIO'] = clean_value(match.group(1))
                data['ORPHANS'] = match.group(2)
                data['DANGLING'] = match.group(3)
                data['DUPLICATES'] = match.group(4)
        elif line.startswith('CLEANING:'):
            match = re.search(r'ORPHANS_AUTO_CONNECTED=(\d+)\s+DANGLING_REMOVED=(\d+)\s+DUPLICATES_MERGED=(\d+)\s+NEEDS_HUMAN=(.*)', line)
            if match:
                data['ORPHANS_AUTO_CONNECTED'] = match.group(1)
                data['DANGLING_REMOVED'] = match.group(2)
                data['DUPLICATES_MERGED'] = match.group(3)
                data['NEEDS_HUMAN'] = clean_value(match.group(4))
        elif line.startswith('PAGERANK:'):
            match = re.search(r'TOP5\+(.*)\s+BOTTOM5\+(.*)', line)
            if match:
                data['TOP5'] = clean_value(match.group(1))
                data['BOTTOM5'] = clean_value(match.group(2))

    report = f"""# 每日图谱验证 (Graph Validation)

## 核心统计 (Core Stats)
ENTITIES: {data.get('ENTITIES', '0')}
RELATIONS: {data.get('RELATIONS', '0')}

## 密码学完整性 (Cryptographic Integrity)
VERIFIED_NODES: {data.get('VERIFIED_NODES', '0')}
TAMPER_DETECTED: {data.get('TAMPER_DETECTED', 'NONE')}

## 连通性状态 (Integrity Status)
LINKED_RATIO: {data.get('LINKED_RATIO', '0_0')}
ORPHANS: {data.get('ORPHANS', '0')}
DANGLING: {data.get('DANGLING', '0')}
DUPLICATES: {data.get('DUPLICATES', '0')}

## 清理建议 (Cleaning Actions)
ORPHANS_AUTO_CONNECTED: {data.get('ORPHANS_AUTO_CONNECTED', '0')}
DANGLING_REMOVED: {data.get('DANGLING_REMOVED', '0')}
DUPLICATES_MERGED: {data.get('DUPLICATES_MERGED', '0')}
NEEDS_HUMAN: {data.get('NEEDS_HUMAN', 'NONE')}

## 权重排行 (PageRank)
TOP5: {data.get('TOP5', 'NONE')}
BOTTOM5: {data.get('BOTTOM5', 'NONE')}
"""

    with open(report_path, 'w') as f:
        f.write(report)
    print(f"Formatted report written to {report_path}")

if __name__ == "__main__":
    main()
