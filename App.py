import streamlit as st

# Initialize session state
if "current_expression" not in st.session_state:
    st.session_state.current_expression = "neutral"
if "sound_enabled" not in st.session_state:
    st.session_state.sound_enabled = True
if "confidence_threshold" not in st.session_state:
    st.session_state.confidence_threshold = 50
if "current_confidence" not in st.session_state:
    st.session_state.current_confidence = 0
if "show_settings" not in st.session_state:
    st.session_state.show_settings = False
if "detection_history" not in st.session_state:
    st.session_state.detection_history = []
if "successful_detections" not in st.session_state:
    st.session_state.successful_detections = 0
if "total_detections" not in st.session_state:
    st.session_state.total_detections = 0

# Placeholder for audio alert function
def play_alert_sound(expression: str):
    st.audio(f"sounds/{expression}.mp3")  # replace with your audio file paths

# Handle expression change
def handle_expression_change(expression: str, confidence: float = None):
    st.session_state.current_expression = expression
    if confidence is not None:
        st.session_state.current_confidence = confidence
        history = st.session_state.detection_history[-19:]  # keep last 20
        history.append(confidence)
        st.session_state.detection_history = history
        st.session_state.total_detections += 1
        if confidence >= st.session_state.confidence_threshold:
            st.session_state.successful_detections += 1
    if st.session_state.sound_enabled:
        play_alert_sound(expression)

# Example UI
st.title("Robot Expression Detection")

expression = st.selectbox(
    "Select Expression",
    ["neutral", "happy", "sad", "angry", "surprised"]
)
confidence = st.slider("Confidence", 0, 100, 50)

if st.button("Update Expression"):
    handle_expression_change(expression, confidence)

st.write(f"Current Expression: {st.session_state.current_expression}")
st.write(f"Current Confidence: {st.session_state.current_confidence}")
st.write(f"Detection History (last 20): {st.session_state.detection_history}")
st.write(f"Successful Detections: {st.session_state.successful_detections}")
st.write(f"Total Detections: {st.session_state.total_detections}")
