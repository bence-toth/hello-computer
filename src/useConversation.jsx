import { useState } from "react";

const useConversation = ({
  handleAppStateChange,
  speechRecognition,
  voice,
}) => {
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
    speechRecognition.start();
    speechRecognition.onresult = (event) => {
      setText(
        [...event.results].map((result) => result[0].transcript).join("")
      );
    };
  };

  const handleStopListening = () => {
    speechRecognition.stop();
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

  return { handleListen, handleStopListening };
};

export default useConversation;
