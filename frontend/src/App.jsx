// import { Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import AddQuestion from './pages/addQuestion';
import StartInterview from "./pages/StartInterview";

export default function App() {
	return (
		<>
			{/* <Routes>
				<Route index path="/" element={<Navigate to="/add-question" />} />
				<Route path="/add-question" element={<AddQuestion />} /> 	
			</Routes> */}

			<div className='px-10 pt-10'>
				<AddQuestion />
			</div>
			
			<div class="flex justify-end px-5 pr-10">
				<button class="bg-blue-500 text-white px-5 py-3 rounded-lg">start</button>
			</div>
		</>
	);
}