
import React, { useState, useEffect, useRef } from "react";
import { ReactSortable } from "react-sortablejs";

const draggableList = [

];

export default function SortableQuestionList() {
	const [list, setList] = React.useState(draggableList);
	const [showInput, setShowInput] = React.useState(false);
	const [newItem, setNewItem] = React.useState("");
	const [editingIndex, setEditingIndex] = useState(null);
	const inputRef = useRef(null);

	const handleAddClick = () => {
		setShowInput(true);
	};

	const handleInputChange = (e) => {
		setNewItem(e.target.value);
	};

	const handleAddItem = () => {
		if (newItem.trim()) {
			setList([...list, { name: newItem }]);
		}
			setNewItem("");
			setShowInput(false);	
	};

	const handleItemDoubleClick = (index) => {
		setEditingIndex(index);
		setNewItem(list[index].name);
	};

	const handleEditItem = (index, value) => {
		if (value.trim()) {
			const updatedList = list.map((item, i) =>
				i === index ? { ...item, name: value } : item
			);
			setList(updatedList);
		} else {
			// Remove the item if the value is empty
			const updatedList = list.filter((_, i) => i !== index);
			setList(updatedList);
		}
		setEditingIndex(null);
	};


	useEffect(() => {
		if (editingIndex !== null) {
			inputRef.current.focus();
		}
	}, [editingIndex]);

	return (
		<div>
			<div className="text-lg font-bold">Question List</div>
			<ReactSortable
				filter=".addImageButtonContainer"
				dragClass="sortableDrag"
				list={list}
				setList={setList}
				animation="100"
				easing="ease-out"
			>

				{list.map((item, index) => (
					<div
						key={index}
						className="my-2 pl-3 py-2 w-full inline-block overflow border rounded-sm border-black"
						onDoubleClick={() => handleItemDoubleClick(index)}
					>
						{editingIndex === index ? (
							<textarea
								ref={inputRef}
								className="border pl-2 py-2"
								value={newItem}
								onChange={handleInputChange}
								onBlur={() => handleEditItem(index, newItem)}
								style={{
									width: "100%",
									resize: "none",
									overflow: "hidden"
								}}
							/>
						) : (
							<span>
								<span className="font-bold mr-2">{index + 1}.</span> {item.name}
							</span>
						)}
					</div>
				))}
			</ReactSortable>


			<div>
				{showInput && (
					<div>
						<textarea
							className="border pl-2 py-2"
							value={newItem}
							onChange={handleInputChange}
							onBlur={handleAddItem}
							placeholder="Type your question here"
							style={{
								width: "100%",
								resize: "none",
								overflow: "hidden"
							}}
						/>
					</div>
				)}
			</div>
			<button className="px-3 py-3 border rounded-lg text-gray-500" onClick={handleAddClick}> + Click here to add new questions</button>
		</div>
	);
}
