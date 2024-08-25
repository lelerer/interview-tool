import '../index.css';
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ReactSortable } from "react-sortablejs";
import { analyzeFullScript, simulateAnswer, suggestFollowUpQuestions } from '../api';
import RealTimeTranscription from '../components/RealTimeTranscription';
import NestedSortable from '../components/NestedSortable';

const draggableList = [];
const followupQuestions = [];

function AddQuestion() {
	const navigate = useNavigate();
	const [recording, setRecording] = useState(false);
	const [audioBlob, setAudioBlob] = useState(null);
	const mediaRecorderRef = useRef(null);
	const chunks = useRef([]);
	const [selectedIndex, setSelectedIndex] = useState(null);
	const [list, setList] = React.useState(draggableList);
	const [followUpList, setfollowUpList] = React.useState(followupQuestions);
	const [showInput, setShowInput] = React.useState(false);
	const [showFollowUp, setshowFollowUp] = React.useState(false);
	const [newItem, setNewItem] = React.useState("");
	const [editingIndex, setEditingIndex] = useState(null);
	const inputRef = useRef(null);
	const state = useLocation();
	const results = state ? state.results : null;
	const [analysis, setAnalysis] = useState([]);
	const [simulation, setSimulation] = useState([]);
	const [suggestion, setSuggestion] = useState([]);
	const realTimeTranscriptionRef = useRef(null);
	const [questions, setQuestions] = useState([]); //List for follow-up questions
	const [newQuestion, setNewQuestion] = useState('');


	const handleItemClick = (index) => {
		setSelectedIndex(index);
		if (!list[index].checked) {
			setList(prevList => {
				const item = prevList[index];
				const updatedList = [item, ...prevList.filter((_, i) => i !== index)];
				setSelectedIndex(0);
				return updatedList;
			});
		}
	};

	const handleInputChange = (e) => {
		setNewItem(e.target.value);
	};

	const handleCheckboxChange = (index) => {
		const updatedList = [...list];
		updatedList[index].checked = !updatedList[index].checked;
		setList(updatedList);
	};

	const handleAddItem = () => {
		if (newItem.trim()) {
			setList([...list, { name: newItem, checked: false }]);
			setNewItem('');
		}
		setShowInput(false);
	}

	const handleAddClick = () => {
		setShowInput(true);
	};

	const handleItemDoubleClick = (index) => {
		setEditingIndex(index);
		setNewItem(list[index].text);
	};

	const handleEditItem = (index, value) => {
		if (value.trim()) {
			const updatedList = list.map((item, i) =>
				i === index ? { ...item, text: value } : item
			);
			setList(updatedList);
		} else {
			const updatedList = list.filter((_, i) => i !== index);
			setList(updatedList);
		}
		setEditingIndex(null);
	};

	const handleSimulateAnswer = async () => {
		try {
			// Iterate through each question in the list
			const results = await Promise.all(list.map(async (item) => {
				const prompt = `
					You are given a question:${item.name}, and your task is to simulate users' answers to that. 
					Give multiple answers and output the result in templates like below:
					1........
					2........
					3........
				`;
				const result = await simulateAnswer(prompt);
				return result;
			}));
			const flattenedResults = results.flat();
			console.log('Simulating results:', flattenedResults);
			setSimulation(results);
		} catch (error) {
			console.error('Simulating failed', error);
			setSimulation(['An error occurred while simulating the answers']);
		}
	};

	const handleSuggestFollowUpQuestions = async () => {
		try {
			const results = await Promise.all(list.map(async (item) => {
				const prompt = `
			
					You are given some simulated answers to a question, both of them are quoted """ 
					Your task is to suggest follow-up questions based on the simulated answers
					Output the results following the template below:

					Question1 follow-up questions:
					1.....
					2.....
					3.....

					Question2 follow-up questions:
					1.....
					2.....
					3.....
					
					
					"""
					Question: ${item.name}
					Simulated Answers: ${simulation.join('\n')}
					""";
					}
				`;
				const result = await suggestFollowUpQuestions(prompt);
				return result;
			}));
			const flattenedResults = results.flat();
			console.log('Suggestions:', flattenedResults);
			setSuggestion(flattenedResults);
		} catch (error) {
			console.error('Suggesting follow up questions failed', error);
			setSuggestion(['An error occurred while suggesting follow up questions']);
		}
	};

	const handleMark = async () => {
		try {
			const transcriptionContent = realTimeTranscriptionRef.current.getTranscriptionContent();

			const prompt = `Use one word to summarize the main idea of the sentence below:\n\nSentence: ${transcriptionContent},\nUse the same language as the transcript's language.`;
			const result = await analyzeFullScript(prompt);

			console.log('Marking results:', result);

			const results = Array.isArray(result) ? result : [result];
			setAnalysis(results);
		} catch (error) {
			console.error('Marking failed', error);
			setAnalysis(['An error occurred while marking the key points']);
		}
	};

	useEffect(() => {
		if (editingIndex !== null) {
			inputRef.current.focus();
		}
	}, [editingIndex]);

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaRecorderRef.current = new MediaRecorder(stream);

			mediaRecorderRef.current.ondataavailable = (event) => {
				chunks.current.push(event.data);
			};

			mediaRecorderRef.current.onstop = async () => {
				const blob = new Blob(chunks.current, { type: "audio/wav" });
				setAudioBlob(blob);
				chunks.current = [];
				await handleUploadAndTranscribe(blob);
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

	const handleUploadAndTranscribe = async (blob) => {
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
				prompt: "Return the results in bullet points",
				headers: {
					"Authorization": `Bearer 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`
				},
				body: formData
			});

			const data = await response.json();
			navigate("/after-interview", { state: { results: data } });
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const handleAddFollowUpQuestion = () => {
		if (newQuestion.trim()) {
			setQuestions([...questions, newQuestion.trim()]);
			setNewQuestion(''); // Clear the input field after adding
		}
	};

	return (
		<>
			<div className="mx-10 mt-10">
				<div className="text-lg font-bold">Question List</div>
				<ReactSortable
					filter=".addImageButtonContainer"
					dragClass="sortableDrag"
					list={list}
					setList={setList}
					animation="100"
					easing="ease-out"
				>
					{list.map((item, index) => (
						<div
							key={index}
							className={`my-2 pl-3 py-2 w-full inline-block overflow border rounded-sm flex items-center ${item.checked ? 'bg-blue-100 border-blue-500' : selectedIndex === index ? 'bg-yellow-100 border-yellow-500' : 'bg-white border-black'}`}
							onClick={() => handleItemClick(index)}
							onDoubleClick={() => handleItemDoubleClick(index)}
						>
							<input
								type="checkbox"
								checked={item.checked}
								onChange={() => handleCheckboxChange(index)}
								className="mr-2" />
							{editingIndex === index ? (
								<textarea
									ref={inputRef}
									className="border pl-2 py-2"
									value={newItem}
									onChange={handleInputChange}
									onBlur={() => handleEditItem(index, newItem)}
									style={{
										width: "100%",
										resize: "none",
										overflow: "hidden"
									}} />
							) : (
								<span>
									<span className="font-bold mr-2">{index + 1}.</span> {item.name}
								</span>
							)}
						</div>
					))}
				</ReactSortable>
				<div>
					{showInput && (
						<div>
							<textarea
								className="border pl-2 py-2"
								value={newItem}
								onChange={handleInputChange}
								onBlur={handleAddItem}
								placeholder="Type your question here"
								style={{
									width: "100%",
									resize: "none",
									overflow: "hidden"
								}} />
						</div>
					)}
				</div>
				<button
					className="px-3 py-3 border rounded-lg text-gray-500"
					onClick={handleAddClick}
				>
					+ Click here to add new questions
				</button>

				{!recording && (
					<div className="p-4 bg-white rounded-lg">
						<div className="text-lg font-bold mt-10">Follow-up question List</div>
						<div className="mb-4">
							<input
								type="text"
								value={newQuestion}
								onChange={(e) => setNewQuestion(e.target.value)}
								className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
								placeholder="Enter a new question"
							/>
							<button
								onClick={handleAddFollowUpQuestion}
								className="mt-2 w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300"
							>
								Add follow-up question
							</button>
						</div>
						<ul className="space-y-2">
							{questions.map((question, index) => (
								<li
									key={index}
									className="p-2 bg-gray-100 border border-gray-300 rounded-lg"
								>
									{question}
								</li>
							))}
						</ul>
					</div>
				)}
			</div>


			<div className="flex justify-end px-5 pr-10">
				{!recording ? (
					<button onClick={handleStartClick} className="bg-blue-500 hover:bg-sky-700 text-white px-5 py-3 rounded-lg">
						Start
					</button>
				) : (
					<button onClick={handleStopClick} className="bg-red-500 hover:bg-red-700 text-white px-5 py-3 rounded-lg">
						Stop
					</button>
				)}
			</div>

			{!recording && (
				<>
					<div className="flex pt-5 justify-end px-5 pr-10">
						<button onClick={handleSimulateAnswer} className="bg-yellow-500 hover:bg-yellow-700 text-white px-5 py-3 rounded-lg">
							Simulate
						</button>
					</div><div className="flex pt-5 justify-end px-5 pr-10">
						<button onClick={handleSuggestFollowUpQuestions} className="bg-pink-500 hover:bg-pink-700 text-white px-5 py-3 rounded-lg">
							Follow-up questions
						</button>
					</div>
				</>
			)}

			<div className='px-10 mt-5 text-lg board font-bold'>Real Time Transcription</div>
			<RealTimeTranscription ref={realTimeTranscriptionRef} />

			{Array.isArray(analysis) && analysis.length > 0 && (
				<div className="px-10 mt-5">
					<h2 className="text-lg font-bold">Analysis Results</h2>
					<ul>
						{analysis.map((item, index) => (
							<li key={index} className="mb-2 p-2 border rounded-md">
								{item}
							</li>
						))}
					</ul>
				</div>
			)}

			<div
				onClick={handleMark}
				className="ml-5 w-10 h-90 bg-slate-700 hover:bg-slate-900 text-white px-1 py-2 rounded-lg text-sm"
			>Mark
			</div>


			{simulation.length > 0 && !recording && (
				<div className="board px-10 mt-5">
					<div className="text-lg font-bold">Simulated Answers</div>
					<div>
						{simulation.map((answer, index) => (
							<div key={index} className="mb-2 p-2 border rounded-md">
								{answer}
							</div>
						))}
					</div>
				</div>
			)}

			{suggestion.length > 0 && !recording && (
				<div className="board px-10 mt-5">
					<div className="text-lg font-bold">Follow-up question suggestions</div>
					<div>
						{suggestion.map((answer, index) => (
							<div key={index} className="mb-2 p-2 border rounded-md">
								{answer}
							</div>
						))}
					</div>
				</div>
			)}
	

		</>
	);
}

export default AddQuestion;