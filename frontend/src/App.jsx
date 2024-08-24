import { Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import './index.css';
import AddQuestion from './pages/addQuestion';
import AfterInterview from './pages/afterInterview';
import DuringInterview from './pages/duringInterview';

export default function App() {
	return (
		<>
			<Routes>
				<Route index path="/" element={<Navigate to="/add-question" />} />
				<Route path="/add-question" element={<AddQuestion />} />
				<Route path="/during-interview" element={<DuringInterview />} />	
				<Route path="/after-interview" element={<AfterInterview />} />
			</Routes>
		</>
	);
}