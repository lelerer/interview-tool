import React from 'react';
export default function StartInterview(){
    // const openMicrophone = async () => {
    //     let stream;
    //     let audioContext;
    //     let audioWorkletNode;
    //     let source;
    //     let audioBufferQueue = new Int16Array(0);
    //     return {
    //         async requestPermission() {
    //             stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    //         },
    //         async startRecording(onAudioCallback) {
    //             if (!stream) stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    //             audioContext = new AudioContext({
    //                 sampleRate: 16_000,
    //                 latencyHint: 'balanced'
    //             });
    //             source = audioContext.createMediaStreamSource(stream);
    //
    //             await audioContext.audioWorklet.addModule('../audio-processor.js');
    //             audioWorkletNode = new AudioWorkletNode(audioContext, 'audio-processor');
    //
    //             source.connect(audioWorkletNode);
    //             audioWorkletNode.connect(audioContext.destination);
    //             audioWorkletNode.port.onmessage = (event) => {
    //                 const currentBuffer = new Int16Array(event.data.audio_data);
    //                 audioBufferQueue = mergeBuffers(
    //                     audioBufferQueue,
    //                     currentBuffer
    //                 );
    //
    //                 const bufferDuration =
    //                     (audioBufferQueue.length / audioContext.sampleRate) * 1000;
    //                 // wait until we have 100ms of audio data
    //                 if (bufferDuration >= 100) {
    //                     const totalSamples = Math.floor(audioContext.sampleRate * 0.1);
    //
    //                     const finalBuffer = new Uint8Array(
    //                         audioBufferQueue.subarray(0, totalSamples).buffer
    //                     );
    //
    //                     audioBufferQueue = audioBufferQueue.subarray(totalSamples)
    //                     if (onAudioCallback) onAudioCallback(finalBuffer);
    //                 }
    //             }
    //         },
    //         stopRecording() {
    //             stream?.getTracks().forEach((track) => track.stop());
    //             audioContext?.close();
    //             audioBufferQueue = new Int16Array(0);
    //         }
    //     }
    // };
    // function mergeBuffers(lhs, rhs) {
    //     const mergedBuffer = new Int16Array(lhs.length + rhs.length)
    //     mergedBuffer.set(lhs, 0)
    //     mergedBuffer.set(rhs, lhs.length)
    //     return mergedBuffer
    // }
    return (
        <div>
            <button className="bg-gray-700 text-white font-bold rounded py-2 px-4 shadow-md hover:bg-gray-800 focus:outline-none focus:ring focus:ring-gray-400" style={{ position: 'absolute',right:'8%',top:'2%'}}>Start Interview</button>
        </div>
    );
}