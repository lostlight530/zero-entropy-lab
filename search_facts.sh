urls=(
  "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=AI+agent+reliability&utf8=&format=json"
  "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=LLM+hallucination&utf8=&format=json"
  "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=AI+systems+drift&utf8=&format=json"
  "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=AI+alignment&utf8=&format=json"
  "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=Prompt+injection&utf8=&format=json"
)
for url in "${urls[@]}"; do
  echo "URL: $url"
  curl -s "$url" | grep -o '"title":"[^"]*","snippet":"[^"]*"' | head -n 2
  echo "---"
done
