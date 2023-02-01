import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import axios from "axios";
import { useSpeechSynthesis } from "react-speech-kit";

const Dictaphone = () => {
  const [currentTranscript, setCurrentTranscript] = useState("");
  const { speak } = useSpeechSynthesis();
  const [result, setResult] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true });
    // resetTranscript();
  };

  useEffect(() => {
    console.log(transcript);
    setCurrentTranscript(transcript);
  }, [transcript]);

  //   useEffect(() => {
  //     if (!listening && currentTranscript?.length > 0) askQuestion();
  //   }, [currentTranscript]);

  useEffect(() => {
    if (result?.length > 0) {
      speak({ text: result });
    }
  }, [result]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const askQuestion = async (text) => {
    setLoading(true);
    axios
      .post(
        "http://localhost:4000/ask",
        {
          question: text,
          model: "text-davinci-002",
          temperature: 0.5,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setLoading(false);
        setResult(response.data.text.text.replace(/\n/g, ""));
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    askQuestion(input);
  };

  return (
    <div>
      <p>Microphone: {listening ? "on" : "off"}</p>
      <button
        style={{
          height: "100px",
          width: "100px",
          borderRadius: "50%",
          cursor: "pointer",
        }}
        onTouchStart={startListening}
        onMouseDown={startListening}
        onTouchEnd={() => {
          SpeechRecognition.stopListening();
          if (transcript?.length > 0) {
            setCurrentTranscript(transcript);
            askQuestion(transcript);
          }
        }}
        onMouseUp={() => {
          SpeechRecognition.stopListening();
          if (transcript?.length > 0) {
            setCurrentTranscript(transcript);
            askQuestion(transcript);
          }
        }}
      >
        <img src="../microphone-342.png" height={70} width={70} />
      </button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button
        onClick={() => {
          resetTranscript();
          setResult("");
        }}
      >
        Reset
      </button>
      <button onClick={() => speak({ text: result })}>Repeat</button>
      {loading ? "Loading..................." : <p>{result}</p>}
      <p>{transcript}</p>

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: "50px",
        }}
      >
        <form onSubmit={onSubmit}>
          <input
            type="text"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            style={{ width: "500px", height: "30px", borderRadius: "10px" }}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};
export default Dictaphone;
