import { Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import './index.css';
import AddQuestion from './pages/addQuestion';
import DisplayResults from './pages/displayResults';
import SortableQuestionList from './components/SortableQuestionList';

export default function App() {
	return (
		<>
			<Routes>
				<Route index path="/" element={<Navigate to="/add-question" />} />
				<Route path="/add-question" element={<AddQuestion />} />
				<Route path="/display-results" element={<DisplayResults />} />
			</Routes>
		</>
	);
}