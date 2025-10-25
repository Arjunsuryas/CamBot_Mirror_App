import numpy as np
import simpleaudio as sa

# Mapping expressions to frequencies (Hz)
FREQUENCIES = {
    "happy": 523.25,      # C5
    "sad": 293.66,        # D4
    "surprised": 783.99,  # G5
    "angry": 220.00,      # A3
    "excited": 659.25,    # E5
    "neutral": 440.00     # A4
}

def play_alert_sound(expression: str, duration: float = 0.5, volume: float = 0.3):
    """
    Play a simple alert tone for a given expression.
    :param expression: The expression string
    :param duration: Duration of the tone in seconds
    :param volume: Volume (0.0 to 1.0)
    """
    freq = FREQUENCIES.get(expression, 440.0)
    fs = 44100  # Sampling rate
    t = np.linspace(0, duration, int(fs * duration), False)
    tone = np.sin(freq * 2 * np.pi * t) * volume

    # Convert to 16-bit PCM
    audio = (tone * 32767).astype(np.int16)

    # Play audio
    play_obj = sa.play_buffer(audio, 1, 2, fs)
    play_obj.wait_done()

# Example usage
if __name__ == "__main__":
    play_alert_sound("happy")
    play_alert_sound("sad")
