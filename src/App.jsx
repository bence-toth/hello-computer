import { useState } from "react";

import "./App.css";
import { flushSync } from "react-dom";
import classNames from "classnames";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = "en-US";
recognition.interimResults = true;
recognition.maxAlternatives = 1;

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

const appStateToNameMap = {
  1: "idle",
  2: "listening",
  3: "thinking",
  4: "speaking",
};

const nameToAppStateMap = {
  idle: 1,
  listening: 2,
  thinking: 3,
  speaking: 4,
};

const App = () => {
  const [appState, setAppState] = useState(nameToAppStateMap["idle"]);

  const handleAppStateChange = (newState) => {
    document.startViewTransition(() => {
      flushSync(() => {
        setAppState(nameToAppStateMap[newState]);
      });
    });
  };

  const [text, setText] = useState("");

  const handleDone = () => {
    setText("");
    handleAppStateChange("idle");
  };

  const handleResponse = (text) => {
    handleAppStateChange("speaking");
    const message = new SpeechSynthesisUtterance();
    message.text = text;
    message.voice = voice;
    window.speechSynthesis.speak(message);
    message.onend = handleDone;
  };

  const handleListen = () => {
    handleAppStateChange("listening");
    setText("");
    recognition.start();
    recognition.onresult = (event) => {
      setText(
        [...event.results].map((result) => result[0].transcript).join("")
      );
    };
  };

  const handleStop = () => {
    recognition.stop();
    if (text.trim() === "") {
      setText("");
      handleAppStateChange("idle");
    } else {
      handleAppStateChange("thinking");
      console.log(text);
      // Call openAI API here
      setTimeout(() => {
        handleResponse("Sure! Elephants are the largest land animals.");
      }, 3000);
    }
  };

  return (
    <div className="app">
      {appState === 1 && (
        <button className="action-button" onClick={handleListen} />
      )}
      {appState === 2 && (
        <button className="action-button" onClick={handleStop} />
      )}
      <div className="interface">
        <div className={classNames("state", appStateToNameMap[appState])}>
          <div className="dot dot-1"></div>
          <div className="dot dot-2"></div>
          <div className="dot dot-3"></div>
          <div className="dot dot-4"></div>
          <div className="dot dot-5"></div>
        </div>
      </div>
    </div>
  );
};

export default App;
