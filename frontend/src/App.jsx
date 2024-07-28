import './App.css';
// import { Routes, Route, Navigate } from 'react-router-dom';

import AddQuestion from './pages/addQuestion.tsx';

export default function App() {
	return (
		<>
			{/* <Routes>
				<Route index path="/" element={<Navigate to="/add-question" />} />
				<Route path="/add-question" element={<AddQuestion />} /> 	
			</Routes> */}

			<AddQuestion />
		</>
	);
}
