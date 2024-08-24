const { AssemblyAI } = require('assemblyai');
const recorder = require('node-record-lpcm16');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('Client connected');

    const client = new AssemblyAI({
        apiKey: 'ee1a4a387a2c4df6b57325a41edd79b4',
    });

    const transcriber = client.realtime.transcriber({
        sampleRate: 16000,
    });

    transcriber.on('open', ({ sessionId }) => {
        console.log(`Session opened with ID: ${sessionId}`);
    });

    transcriber.on('error', (error) => {
        console.error('Error:', error);
    });

    transcriber.on('close', (code, reason) => {
        console.log('Session closed:', code, reason);
    });

    transcriber.on('transcript', (transcript) => {
        if (transcript.text) {
            if (transcript.message_type === 'FinalTranscript') {
                // Send only final transcript
                ws.send(transcript.text);
            }
        }
    });
	
    ws.on('message', (message) => {
        if (message === 'start') {
            console.log('Starting recording');
            transcriber.connect().then(() => {
                const recording = recorder.record({
                    channels: 1,
                    sampleRate: 16000,
                    audioType: 'wav',
                });

                recording.stream().on('data', (buffer) => {
                    transcriber.sendAudio(buffer);
                });

                ws.on('close', async () => {
                    console.log('Stopping recording');
                    recording.stop();
                    await transcriber.close();
                });
            });
        }
    });
});

console.log('WebSocket server started on ws://localhost:8080');