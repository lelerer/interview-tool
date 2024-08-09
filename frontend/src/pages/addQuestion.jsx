import React, { useState, useRef } from "react";
import '../index.css';
import { useNavigate } from "react-router-dom";
import SortableQuestionList from "../components/SortableQuestionList";

function AddQuestion() {
  const navigate = useNavigate();
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/wav" });
        setAudioBlob(blob);
        chunks.current = [];
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleStartClick = async () => {
    await startRecording();
  };

  const handleStopClick = async () => {
    stopRecording();
  };

  const handleUploadAndTranscribe = async () => {
    if (!audioBlob) {
      alert("No audio recorded.");
      return;
    }

    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");
    formData.append("model", "whisper-1");

    try {
      const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer API_KEY`
        },
        body: formData
      });

      const data = await response.json();
      navigate("/display-results", { state: { results: data } });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <SortableQuestionList />

      <div className="flex justify-end px-5 pr-10">
        {!recording ? (
          <button onClick={handleStartClick} className="bg-blue-500 text-white px-5 py-3 rounded-lg">
            Start Recording
          </button>
        ) : (
          <button onClick={handleStopClick} className="bg-red-500 text-white px-5 py-3 rounded-lg">
            Stop Recording
          </button>
        )}
        <button
          onClick={handleUploadAndTranscribe}
          className="bg-green-500 text-white px-5 py-3 rounded-lg ml-2"
          disabled={!audioBlob}
        >
          Upload & Transcribe
        </button>
      </div>
    </>
  );
}

export default AddQuestion;
