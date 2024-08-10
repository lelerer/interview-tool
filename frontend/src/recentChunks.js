import React, { useState, useEffect, useRef } from 'react';

const AudioRecorder = () => {
	const [isRecording, setIsRecording] = useState(false);
	const [audioChunks, setAudioChunks] = useState([]);
	const [circularBuffer, setCircularBuffer] = useState([]);
	const mediaRecorderRef = useRef(null);
	const bufferSize = 30 * 44100; // 30 seconds in samples
	const circularBufferSize = bufferSize * 2; // Buffer size for 60 seconds

	useEffect(() => {
		return () => {
			// Cleanup on unmount
			if (mediaRecorderRef.current) {
				mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
			}
		};
	}, []);
	const startRecording = async () => {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		const mediaRecorder = new MediaRecorder(stream);
		mediaRecorderRef.current = mediaRecorder;

		mediaRecorder.start();
		setIsRecording(true);

		const audioContext = new (window.AudioContext || window.webkitAudioContext)();
		const source = audioContext.createMediaStreamSource(stream);
		const processor = audioContext.createScriptProcessor(4096, 1, 1);

		processor.onaudioprocess = (event) => {
			const inputData = event.inputBuffer.getChannelData(0);
			setCircularBuffer(prevBuffer => {
				const newBuffer = [...prevBuffer, ...inputData];
				// Keep the buffer size within the limit of 60 seconds
				if (newBuffer.length > circularBufferSize) {
					return newBuffer.slice(-circularBufferSize);
				}
				return newBuffer;
			});
			setAudioChunks(prevChunks => [...prevChunks, ...inputData]);
		};

		source.connect(processor);
		processor.connect(audioContext.destination);

		mediaRecorder.ondataavailable = (e) => {
			setAudioChunks(prevChunks => [...prevChunks, e.data]);
		};
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current) {
			mediaRecorderRef.current.stop();
		}
		setIsRecording(false);
	};
	
	const extractLast30Seconds = () => {
		const audioContext = new (window.AudioContext || window.webkitAudioContext)();
		const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
		const channelData = buffer.getChannelData(0);

		const start = Math.max(0, circularBuffer.length - bufferSize);
		for (let i = 0; i < bufferSize; i++) {
			channelData[i] = circularBuffer[start + i] || 0;
		}

		return bufferToWave(buffer, bufferSize);
	};

	const bufferToWave = (abuffer, len) => {
		const numOfChan = abuffer.numberOfChannels;
		const length = len * numOfChan * 2 + 44;
		const buffer = new ArrayBuffer(length);
		const view = new DataView(buffer);
		const channels = [];
		let pos = 0;

		const setUint16 = (data) => {
			view.setUint16(pos, data, true);
			pos += 2;
		};

		const setUint32 = (data) => {
			view.setUint32(pos, data, true);
			pos += 4;
		};

		setUint32(0x46464952); // "RIFF"
		setUint32(length - 8); // file length - 8
		setUint32(0x45564157); // "WAVE"
		setUint32(0x20746d66); // "fmt "
		setUint32(16); // length = 16
		setUint16(1); // PCM (uncompressed)
		setUint16(numOfChan);
		setUint32(abuffer.sampleRate);
		setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
		setUint16(numOfChan * 2); // block-align
		setUint16(16); // 16-bit (hardcoded in this demo)
		setUint32(0x61746164); // "data"
		setUint32(length - pos - 4); // chunk length

		for (let i = 0; i < abuffer.numberOfChannels; i++) channels.push(abuffer.getChannelData(i));

		while (pos < length) {
			for (let i = 0; i < numOfChan; i++) {
				const sample = Math.max(-1, Math.min(1, channels[i][pos / 2])); // clamp
				const intSample = (sample < 0 ? sample * 0x8000 : sample * 0x7fff) | 0; // scale to 16-bit signed int
				view.setInt16(pos, intSample, true); // write 16-bit sample
				pos += 2;
			}
		}

		return new Blob([buffer], { type: "audio/wav" });
	};

	const sendLast30Seconds = async () => {
		const last30SecondsBlob = extractLast30Seconds();

		const formData = new FormData();
		formData.append("file", last30SecondsBlob, "last30s.wav");
		formData.append("model", "whisper-1");

		// Send formData to your API
		await fetch('YOUR_API_ENDPOINT', { method: 'POST', body: formData });
	};

};

export default AudioRecorder;
