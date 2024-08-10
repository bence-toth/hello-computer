import { useState } from "react";
import { flushSync } from "react-dom";

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

const useAppState = () => {
  const [appState, setAppState] = useState(nameToAppStateMap["idle"]);

  const handleAppStateChange = (newState) => {
    document.startViewTransition(() => {
      flushSync(() => {
        setAppState(nameToAppStateMap[newState]);
      });
    });
  };

  return {
    appState,
    handleAppStateChange,
  };
};

export default useAppState;

export { nameToAppStateMap, appStateToNameMap };
