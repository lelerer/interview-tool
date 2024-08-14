import { useLocation } from "react-router-dom";
import React, { useState } from "react";
import { analyzeQuestions } from '../api';

function AfterInterview() {
	const location = useLocation();
	const { results } = location.state;
	const [analysis, setAnalysis] = useState('');

	const prompts = [
		`Use one word for each to extract the key topics discussed during an interview from the transcript below.

		Use the format below quoted by double quotes:
		"
		The key points discussed during the interview are:
		1.
		2.
		"

		transcript:${results.text},
		Use the same language as the transcript's language.`
	];

	const handleAnalyze = async () => {
		try {
			const prompt = `${prompts}`;
			const result = await analyzeQuestions(prompt);
			setAnalysis(result);
		} catch (error) {
			console.error('Analysis failed', error);
			setAnalysis('An error occurred while analyzing the questions.');
		}
	};

	return (
		<div className="p-5">
			<div className="mt-4">
				<h3 className="text-lg font-bold mb-2">Results</h3>
				<pre className="whitespace-pre-wrap">{JSON.stringify(results.text, null, 2)}</pre>
			</div>

			<button
				onClick={handleAnalyze}
				className="bg-blue-500 text-white px-4 py-2 rounded"
			>
				Analyze
			</button>

			{analysis && (
				<div className="mt-4">
					<h3 className="text-lg font-bold mb-2">Analysis</h3>
					{/* Text container with improved styling */}
					<div className="bg-gray-100 p-4 border border-gray-300 rounded">
						<pre className="whitespace-pre-wrap">{JSON.stringify(analysis, null, 2)}</pre>
					</div>
				</div>
			)}
		</div>
	);
}

export default AfterInterview;
