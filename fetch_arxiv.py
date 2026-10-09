import urllib.request
from html.parser import HTMLParser
import ssl
import sys

class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []
        self.record = False

    def handle_starttag(self, tag, attrs):
        if tag in ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span', 'li']:
            self.record = True

    def handle_endtag(self, tag):
        if tag in ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span', 'li']:
            self.record = False
            self.text.append('\n')

    def handle_data(self, data):
        if self.record:
            self.text.append(data)

def fetch_and_save(url, output_file):
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    req = urllib.request.Request(
        url,
        headers={'User-Agent': 'Mozilla/5.0'}
    )

    try:
        with urllib.request.urlopen(req, context=ctx) as response:
            html = response.read().decode('utf-8')

        parser = TextExtractor()
        parser.feed(html)
        text = ''.join(parser.text)

        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(text)

        print(f"Successfully saved to {output_file}. Length: {len(text)}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fetch_and_save(sys.argv[1], sys.argv[2])
