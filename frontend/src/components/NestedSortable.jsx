import React from "react";
import { ReactSortable } from "react-sortablejs";

const NestedSortable = ({ data }) => {
  return null;
};

export default NestedSortable;


// import React from "react";
// import { ReactSortable } from "react-sortablejs";


// const draggableList = [];

// const NestedSortable = () => {

// 	const [list, setList] = React.useState(draggableList);

// 	return (
// 		<ReactSortable
// 			list={items}
// 			setList={setItems}
// 			animation={150}
// 			group={{ name: "nested", pull: "clone", put: true }}
// 		>
// 			{items.map((item, index) => (
// 				<div
// 					key={item.id}
// 					className={`p-4 border rounded shadow-sm ${level === 0 ? 'bg-gray-200' : 'bg-gray-100'} ${level > 0 ? 'pl-4' : ''}`}
// 				>
// 					<div className="font-semibold text-gray-800">
// 						{item.name}
// 					</div>
// 					{item.children && item.children.length > 0 && (
// 						<div className="mt-2">
// 							<NestedSortable
// 								items={item.children}
// 								setItems={(newChildren) => {
// 									const updatedItems = [...items];
// 									updatedItems[index].children = newChildren;
// 									setItems(updatedItems);
// 								}}
// 								level={level + 1}
// 							/>
// 						</div>
// 					)}
// 				</div>
// 			)
// 			)}
// 		</ReactSortable>
// 	);
// };

// export default NestedSortable;
