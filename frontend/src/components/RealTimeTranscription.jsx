import React, { useState, useEffect } from 'react';

const RealTimeTranscription = () => {
    const [transcription, setTranscription] = useState('');

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

    return (
        <div>
            <h1>Real-Time Transcription</h1>
            <pre>{transcription}</pre>
        </div>
    );
};

export default RealTimeTranscription;
