import '../index.css';
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ReactSortable } from "react-sortablejs";
import RealTimeTranscription from '../components/RealTimeTranscription';

const draggableList = [];

function AddQuestion() {
	const navigate = useNavigate();
	const [recording, setRecording] = useState(false);
	const [audioBlob, setAudioBlob] = useState(null);
	const mediaRecorderRef = useRef(null);
	const chunks = useRef([]);
	const [selectedIndex, setSelectedIndex] = useState(null);
	const [list, setList] = React.useState(draggableList);
	const [showInput, setShowInput] = React.useState(false);
	const [newItem, setNewItem] = React.useState("");
	const [editingIndex, setEditingIndex] = useState(null);
	const inputRef = useRef(null);
	
	const handleItemClick = (index) => {
		setSelectedIndex(index);
        if (!list[index].checked) {
            // Move the clicked item to the top of the list
            setList(prevList => {
                const item = prevList[index];
                const updatedList = [item, ...prevList.filter((_, i) => i !== index)];
                setSelectedIndex(0); // Optional: set the first item as selected
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
	};

	const handleAddClick = () => {
		setShowInput(true);
	};

	const handleItemDoubleClick = (index) => {
		setEditingIndex(index);
		setNewItem(list[index].name);
	};

	const handleEditItem = (index, value) => {
		if (value.trim()) {
			const updatedList = list.map((item, i) =>
				i === index ? { ...item, name: value } : item
			);
			setList(updatedList);
		} else {
			const updatedList = list.filter((_, i) => i !== index);
			setList(updatedList);
		}
		setEditingIndex(null);
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
					"Authorization": `Bearer 				`},
				body: formData
			});

			const data = await response.json();
			navigate("/after-interview", { state: { results: data } });
		} catch (error) {
			console.error("Error fetching data:", error);
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
							className={`my-2 pl-3 py-2 w-full inline-block overflow border rounded-sm flex items-center ${
								item.checked ? 'bg-blue-100 border-blue-500' : selectedIndex === index ? 'bg-yellow-100 border-yellow-500' : 'bg-white border-black'
							  }`}
							  onClick={() => handleItemClick(index)} 
							onDoubleClick={() => handleItemDoubleClick(index)}
						>
							<input
								type="checkbox"
								checked={item.checked}
								onChange={() => handleCheckboxChange(index)}
								className="mr-2"
							/>
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
									}}
								/>
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
								}}
							/>
						</div>
					)}
				</div>
				<button
					className="px-3 py-3 border rounded-lg text-gray-500"
					onClick={handleAddClick}
				>
					+ Click here to add new questions
				</button>
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

			<RealTimeTranscription/>
		</>
		
	);
}

export default AddQuestion;