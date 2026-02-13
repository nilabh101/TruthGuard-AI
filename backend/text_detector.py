from transformers import pipeline
import streamlit as st

@st.cache_resource
def load_model():
    return pipeline(
        "text-classification",
        model="distilbert-base-uncased-finetuned-sst-2-english"
    )

classifier = load_model()

def detect_fake_news(text):
    if not text.strip():
        return "No input provided", 0.0

    result = classifier(text)[0]

    label = result["label"]
    score = result["score"]

    if label == "NEGATIVE":
        verdict = "⚠ Potentially Misleading"
    else:
        verdict = "✅ Likely Legitimate"

    return verdict, round(score, 3)
