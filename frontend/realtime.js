const { AssemblyAI } = require('assemblyai');
const recorder = require('node-record-lpcm16');

const client = new AssemblyAI({
  apiKey: 'ee1a4a387a2c4df6b57325a41edd79b4',
});

const transcriber = client.realtime.transcriber({
  sampleRate: 16000,
});

// Buffer to accumulate text
let textBuffer = '';

// Timer interval (in milliseconds)
const interval = 100; // 1 second

const run = async () => {
  transcriber.on('open', ({ sessionId }) => {
    console.log(`Session opened with ID: ${sessionId}`);
  });

  transcriber.on('error', (error) => {
    console.error('Error:', error);
  });

  transcriber.on('close', (code, reason) => {
    console.log('Session closed:', code, reason);
  });

  // Function to process and output the accumulated text
  const processTextBuffer = () => {
    if (textBuffer.trim()) {
      console.log(textBuffer.trim());
      // Clear the buffer after processing
      textBuffer = '';
    }
  };

  // Set up a timer to process the buffer every interval
  setInterval(processTextBuffer, interval);

  transcriber.on('transcript', (transcript) => {
    if (!transcript.text) return;

    if (transcript.message_type === 'FinalTranscript') {
      // Update textBuffer with final transcript text
      textBuffer += transcript.text + ' ';
    }
  });

  console.log('Connecting to real-time transcript service');
  await transcriber.connect();

  console.log('Starting recording');
  console.log('If you want to stop recording, press Ctrl/CMD+C');

  const recording = recorder.record({
    channels: 1,
    sampleRate: 16000,
    audioType: 'wav', // Linear PCM
  });

  recording.stream().on('data', (buffer) => {
    transcriber.sendAudio(buffer);
  });

  process.on('SIGINT', async () => {
    console.log();
    console.log('Stopping recording');
    recording.stop();

    console.log('Closing real-time transcript connection');
    await transcriber.close();

    // Process any remaining text in the buffer
    processTextBuffer();

    process.exit();
  });
};

run();
