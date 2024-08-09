import React, { useState, useRef } from "react";
import '../index.css';
import { useNavigate } from "react-router-dom";
import SortableQuestionList from "../components/SortableQuestionList";

function AddQuestion() {
	const navigate = useNavigate();
	const [recording, setRecording] = useState(false);
	const [recentResults, setRecentResults] = useState(null);
	const mediaRecorderRef = useRef(null);
	const chunks = useRef([]);
	const recentChunks = useRef([]);

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaRecorderRef.current = new MediaRecorder(stream);

			mediaRecorderRef.current.ondataavailable = (event) => {
				chunks.current.push(event.data);
				recentChunks.current.push(event.data);

				// Limit recentChunks to the last 30 seconds
				const maxChunks = 30; // Adjust if the chunk duration changes
				if (recentChunks.current.length > maxChunks) {
					recentChunks.current.shift();
				}
			};

			mediaRecorderRef.current.onstop = async () => {
				const blob = new Blob(chunks.current, { type: "audio/wav" });
				chunks.current = []; // Clear chunks after recording stops
				await handleUploadAndTranscribe(blob, true); // Flag to indicate full recording
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

	const handleUploadAndTranscribe = async (blob, isFullRecording) => {
		if (!blob) {
			alert("No audio recorded.");
			return;
		}

		const formData = new FormData();
		formData.append("file", blob, "recording.wav");
		formData.append("model", "whisper-1");

		try {
			const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
				method: "POST",
				headers: {
					"Authorization": `Bearer API`
				},
				body: formData
			});

			const data = await response.json();
			if (isFullRecording) {
				navigate("/after-interview", { state: { results: data } });
			} else {
				setRecentResults(JSON.stringify(data.text, null, 2)); // Display result for recent 30s
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const handleAnalyzeRecent30s = async () => {
		if (recentChunks.current.length === 0) {
			alert("No recent audio available.");
			return;
		}

		const blob = new Blob(recentChunks.current, { type: "audio/wav" });
		recentChunks.current = []; // Clear recent chunks after processing

		await handleUploadAndTranscribe(blob, false); // Flag to indicate recent 30s recording
	};

	return (
		<>
			<SortableQuestionList />

			<div className="flex flex-col items-end px-5 pr-10 space-y-2">
				{!recording ? (
					<button onClick={handleStartClick} className="bg-blue-500 hover:bg-sky-700 text-white px-5 py-3 rounded-lg">
						Start
					</button>
				) : (
					<button onClick={handleStopClick} className="bg-red-500 hover:bg-red-700 text-white px-5 py-3 rounded-lg">
						Stop
					</button>
				)}

				<button
					onClick={handleAnalyzeRecent30s}
					className="bg-yellow-500 hover:bg-yellow-700 text-white px-5 py-3 rounded-lg"
				>
					Analyze Recent 30s
				</button>


				{recentResults && (
					<div className="mt-4 p-5 border rounded-lg bg-gray-100">
						<h3 className="text-lg font-semibold">Recent 30s Analysis Result:</h3>
						<pre className="w-full whitespace-normal break-words">{recentResults}</pre>
					</div>
				)}

			</div>
		</>
	);
}

export default AddQuestion;
