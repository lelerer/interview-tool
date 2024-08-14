import React, { useState, useEffect,useRef } from 'react';

const RealTimeTranscription = () => {
	const [transcription, setTranscription] = useState('');
	const containerRef = useRef(null);

	useEffect(() => {
		const ws = new WebSocket('ws://localhost:8080');

		ws.onopen = () => {
			console.log('Connected to WebSocket');
			ws.send('start');
		};

		ws.onmessage = (event) => {
			setTranscription((prev) => prev + event.data + '\n');
		};

		return () => {
			ws.close();
		};
	}, []);


	// Function to get the last three lines
	const getRecent = (text) => {
		const lines = text.split('\n').filter(line => line.trim() !== '');
		return lines.slice(-8).join('\n');
	};


	return (
		<div>
			{/* <div className='px-3'>Real-Time Transcription</div> */}
			<div className="relative overflow-y-auto p-2" ref={containerRef}>
				<div>{getRecent(transcription)}</div>
			</div>
		</div>
	);
};

export default RealTimeTranscription;
