const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export function createRecognizer(lang, onResult) {
  const recognition = new SpeechRecognition();
  recognition.lang = lang;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  return recognition;
}
