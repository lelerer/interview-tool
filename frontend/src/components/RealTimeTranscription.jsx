// import React, { useState, useEffect, useRef } from 'react';

// const RealTimeTranscription = () => {
// 	const [transcription, setTranscription] = useState('');
// 	const containerRef = useRef(null);

// 	useEffect(() => {
// 		const ws = new WebSocket('ws://localhost:8080');

// 		ws.onopen = () => {
// 			console.log('Connected to WebSocket');
// 			ws.send('start');
// 		};

// 		ws.onmessage = (event) => {
// 			setTranscription((prev) => prev + event.data + '\n');
// 		};

// 		return () => {
// 			ws.close();
// 		};
// 	}, []);

// 	const getRecent = (text) => {
// 		const lines = text.split('\n').filter(line => line.trim() !== '');
// 		return lines.slice(-3).join('\n');
// 	};

// 	return (
// 		<div>
// 			{/* <div className='px-3'>Real-Time Transcription</div> */}
// 			<div className="relative overflow-y-auto p-2" ref={containerRef}>
// 				<div
// 					className='border'
// 				>{getRecent(transcription)}</div>
// 			</div>
// 		</div>
// 	);
// };

// export default RealTimeTranscription 


import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';

const RealTimeTranscription = forwardRef((props, ref) => {
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

	useImperativeHandle(ref, () => ({
		getTranscriptionContent: () => transcription,
	}));

	const getRecent = (text) => {
		const lines = text.split('\n').filter(line => line.trim() !== '');
		return lines.slice(-10).join('\n');
		// return lines.join('\n');
	};

	return (
		<div>
			<div className="relative overflow-y-auto p-2" ref={containerRef}>
				<div className='border'>{getRecent(transcription)}</div>
			</div>
		</div>
	);
});

export default RealTimeTranscription;
