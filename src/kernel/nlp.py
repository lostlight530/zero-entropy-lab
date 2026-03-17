import math
from collections import Counter
from typing import List, Dict

class CognitiveReranker:
    """
    Zero-Entropy 2-Stage Retrieval Reranker.
    Pure Python standard library implementation of TF-IDF and Cosine Similarity.
    """

    @staticmethod
    def cosine_similarity(query: str, document: str) -> float:
        """
        Calculates cosine similarity between two strings using Counter.
        Fast enough for small candidate pools (<100 documents).
        """
        if not query or not document:
            return 0.0

        c_query = Counter(query.lower().split())
        c_doc = Counter(document.lower().split())

        intersection = set(c_query.keys()) & set(c_doc.keys())
        if not intersection:
            return 0.0

        numerator = sum([c_query[x] * c_doc[x] for x in intersection])

        sum_query = sum([c_query[x]**2 for x in c_query.keys()])
        sum_doc = sum([c_doc[x]**2 for x in c_doc.keys()])
        denominator = math.sqrt(sum_query) * math.sqrt(sum_doc)

        return float(numerator) / denominator if denominator else 0.0

    @staticmethod
    def rerank_and_fuse(query: str, candidates: List[Dict]) -> List[Dict]:
        """
        Fuses FTS5 BM25 score, biological weight, and Cosine Similarity.
        """
        if not candidates:
            return []

        # 1. Normalize FTS scores (BM25 is negative, closer to negative infinity is better, but usually bounded).
        # We need to invert it so higher is better for fusion.
        fts_scores = [c.get('fts_score', 0.0) for c in candidates]
        min_fts = min(fts_scores) if fts_scores else 0.0

        for c in candidates:
            # FTS5 returns negative values for matches. 0.0 means it came from Graph 1-hop, not FTS.
            raw_fts = c.get('fts_score', 0.0)

            # Normalize FTS: if min_fts is negative, we shift it to positive.
            # We want smaller negative numbers (larger absolute value) to be higher scores.
            norm_fts = 0.0
            if raw_fts < 0:
                # E.g., raw is -10, min is -20. absolute value of raw is 10.
                norm_fts = abs(raw_fts) / abs(min_fts) if min_fts < 0 else 0.0

            c['norm_fts'] = norm_fts

            # 2. Calculate Semantic Resonance (Cosine Similarity)
            # We combine name and desc to represent the document
            doc_text = f"{c.get('name', '')} {c.get('desc', '')}"
            c['resonance'] = CognitiveReranker.cosine_similarity(query, doc_text)

            # 3. Fuse Scores
            # Formula: 40% FTS + 30% Biological Weight + 30% Resonance
            # We add a slight bump for Graph nodes (distance == 1) if they have high weight, but FTS should dominate.
            weight_factor = min(c.get('weight', 1.0) / 10.0, 1.0) # Cap weight influence

            c['final_score'] = (c['norm_fts'] * 0.4) + (weight_factor * 0.3) + (c['resonance'] * 0.3)

        # Sort descending by the final composite score
        reranked = sorted(candidates, key=lambda x: x['final_score'], reverse=True)
        return reranked
