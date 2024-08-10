import { useState } from "react";
import OpenAI from "openai";

import systemPrompt from "./systemPrompt";
import { openAiAPIKey, openAiOrganization } from "./config";

const openAi = new OpenAI({
  dangerouslyAllowBrowser: true,
  apiKey: openAiAPIKey,
  organization: openAiOrganization,
});

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
    let r = setInterval(() => {
      if (!speechSynthesis.speaking) {
        clearInterval(r);
      } else {
        speechSynthesis.pause();
        speechSynthesis.resume();
      }
    }, 1000);
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
      openAi.chat.completions
        .create({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: text.trim() },
          ],
          model: "gpt-4o-mini",
        })
        .then((completion) => {
          console.log(completion);
          handleResponse(completion.choices[0].message.content);
        });
    }
  };

  return { handleListen, handleStopListening };
};

export default useConversation;
