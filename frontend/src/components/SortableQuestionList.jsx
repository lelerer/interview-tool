import React from "react";
import { ReactSortable } from "react-sortablejs";

const draggableList = [

];

export default function SortableQuestionList() {
	const [list, setList] = React.useState(draggableList);
	const [showInput, setShowInput] = React.useState(false);
	const [newItem, setNewItem] = React.useState("");

	const handleAddClick = () => {
		setShowInput(true);
	};

	const handleInputChange = (e) => {
		setNewItem(e.target.value);
	};

	const handleAddItem = () => {
		if (newItem.trim()) {
			setList([...list, { name: newItem }]);
			setNewItem("");
			setShowInput(false);
		}
	};

	return (
		<div>
			<div className="text-lg font-bold">Question List</div>
			
			<ReactSortable
				filter=".addImageButtonContainer"
				dragClass="sortableDrag"
				list={list}
				setList={setList}
				animation="200"
				easing="ease-out"
			>
				{list.map((item, index) => (
					<div key={index} className="my-2 pl-3 py-2 w-full inline-block overflow border rounded-sm border-black">
						<span className="font-bold mr-2">{index + 1}.</span> {item.name}
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
							placeholder="Type your question here"
							style={{
								width: "100%",
								resize: "none",
								overflow: "hidden"
							}}
						/>
						<button onClick={handleAddItem}>Submit</button>
					</div>
				)}
			</div>
			<button className="px-3 py-3 border rounded-lg text-gray-500" onClick={handleAddClick}> + Click here to add new questions</button>
		</div>
	);
}
