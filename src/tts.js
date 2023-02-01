import React from "react";
import { useSpeechSynthesis } from "react-speech-kit";
const Speech = () => {
  const [value, setValue] = React.useState("");
  const { speak } = useSpeechSynthesis();
  return (
    <div className="speech">
      <div className="group">
        <button onClick={() => speak({ text: value })}>Speech</button>
      </div>
    </div>
  );
};
export default Speech;
