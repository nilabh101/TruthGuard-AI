from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")

FACTS = [
    "The Indian Constitution was adopted in 1949.",
    "General elections in India are held every five years.",
    "WHO declared COVID-19 a pandemic in 2020."
]

embeddings = model.encode(FACTS)
index = faiss.IndexFlatL2(embeddings.shape[1])
index.add(np.array(embeddings))

def retrieve_evidence(query: str):
    query_vec = model.encode([query])
    _, idx = index.search(np.array(query_vec), k=1)
    return FACTS[idx[0][0]]
