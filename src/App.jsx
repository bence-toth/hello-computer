import classNames from "classnames";

import { speechRecognition, voice } from "./speech.utility";
import useConversation from "./useConversation";
import useAppState, {
  appStateToNameMap,
  nameToAppStateMap,
} from "./useAppState";

import "./App.css";

const App = () => {
  const { appState, handleAppStateChange } = useAppState();

  const { handleListen, handleStopListening } = useConversation({
    handleAppStateChange,
    speechRecognition,
    voice,
  });

  return (
    <div className="app">
      {appState === nameToAppStateMap["idle"] && (
        <button className="action-button" onClick={handleListen} />
      )}
      {appState === nameToAppStateMap["listening"] && (
        <button className="action-button" onClick={handleStopListening} />
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
