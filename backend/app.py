import streamlit as st
from text_detector import detect_fake_news
from fact_check import fact_check

st.set_page_config(page_title="TruthGuard AI", layout="wide")

st.title("🛡 TruthGuard AI")
st.markdown("### AI-Powered Fake News Detection System")

st.divider()

user_text = st.text_area("Paste News Content Here")

if st.button("Analyze"):
    verdict, score = detect_fake_news(user_text)
    evidence = fact_check(user_text)

    st.subheader("🔎 Analysis Result")
    st.write("**Verdict:**", verdict)
    st.write("**Confidence Score:**", score)
    st.write("**Closest Verified Fact:**", evidence)
