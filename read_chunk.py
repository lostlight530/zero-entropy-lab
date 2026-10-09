import sys

def read_chunk(filepath, start, end):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    print(content[start:end])

if __name__ == "__main__":
    read_chunk(sys.argv[1], int(sys.argv[2]), int(sys.argv[3]))
