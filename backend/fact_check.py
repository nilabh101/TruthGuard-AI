import streamlit as st
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

@st.cache_resource
def load_resources():
    model = SentenceTransformer('all-MiniLM-L6-v2')

    facts = [
        "India's general elections are held every 5 years.",
        "WHO declared COVID-19 a pandemic in 2020.",
        "The Indian Constitution was adopted in 1949."
    ]

    embeddings = model.encode(facts)
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(np.array(embeddings))

    return model, facts, index

model, facts, index = load_resources()

def fact_check(query):
    query_vector = model.encode([query])
    D, I = index.search(np.array(query_vector), k=1)
    return facts[I[0][0]]
