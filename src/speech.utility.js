const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const speechRecognition = new SpeechRecognition();
speechRecognition.continuous = true;
speechRecognition.lang = "en-US";
speechRecognition.interimResults = true;
speechRecognition.maxAlternatives = 1;

let voice;
new Promise((resolve) => {
  let synth = window.speechSynthesis;
  let id;

  id = setInterval(() => {
    if (synth.getVoices().length !== 0) {
      resolve(synth.getVoices());
      clearInterval(id);
    }
  }, 10);
}).then((voices) => {
  voice =
    voices.find((voice) => voice.voiceURI === "Google US English") ?? voices[0];
});

export { speechRecognition, voice };
