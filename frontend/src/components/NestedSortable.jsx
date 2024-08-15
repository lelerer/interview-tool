// // NestedSortable.js

// import React from "react";
// import { ReactSortable } from "react-sortablejs";

// const NestedSortable = ({ items, setItems, level = 0 }) => (
//   <ReactSortable list={items} setList={setItems} animation={150}>
//     <div className={`flex ${level === 0 ? 'flex-col' : 'flex-row'} ${level > 0 ? 'space-x-2' : 'space-y-2'}`}>
//       {items.map((item, index) => (
//         <div
//           key={index}
//           className={`sortable-item ${level === 0 ? 'bg-gray-100' : 'bg-gray-200'} p-2 border border-gray-300 rounded-sm ${level > 0 ? 'flex-1' : ''}`}
//         >
//           <div
//             className={`w-full inline-block overflow ${level === 0 ? 'font-bold text-gray-800' : 'font-normal text-gray-600'} ${level > 0 ? `pl-${level * 4}` : ''}`}
//           >
//             {item.name}
//           </div>

//           {item.children && item.children.length > 0 && (
//             <div className="flex flex-row space-x-2">
//               <NestedSortable
//                 items={item.children}
//                 setItems={(newSubList) => {
//                   const updatedList = [...items];
//                   updatedList[index].children = newSubList;
//                   setItems(updatedList);
//                 }}
//                 level={level + 1}
//               />
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   </ReactSortable>
// );

// export default NestedSortable;


// NestedSortable.js

// import React from "react";
// import { ReactSortable } from "react-sortablejs";

// const NestedSortable = ({ items, setItems, level = 0 }) => (
//   <ReactSortable
//     list={items}
//     setList={setItems}
//     animation={150}
//     group="nested"
//     // Add other necessary options if needed
//   >
//     <div className={`flex ${level === 0 ? 'flex-col' : 'flex-row'} ${level > 0 ? 'space-x-2' : 'space-y-2'}`}>
//       {items.map((item, index) => (
//         <div
//           key={index}
//           className={`sortable-item ${level === 0 ? 'bg-gray-100' : 'bg-gray-200'} p-2 border border-gray-300 rounded-sm ${level > 0 ? 'flex-1' : ''}`}
//         >
//           <div
//             className={`w-full inline-block overflow ${level === 0 ? 'font-bold text-gray-800' : 'font-normal text-gray-600'} ${level > 0 ? `pl-${level * 4}` : ''}`}
//           >
//             {item.name}
//           </div>

//           {item.children && item.children.length > 0 && (
//             <NestedSortable
//               items={item.children}
//               setItems={(newSubList) => {
//                 const updatedList = [...items];
//                 updatedList[index].children = newSubList;
//                 setItems(updatedList);
//               }}
//               level={level + 1}
//             />
//           )}
//         </div>
//       ))}
//     </div>
//   </ReactSortable>
// );

// export default NestedSortable;


// src/components/NestedSortable.jsx

import React from "react";
import { ReactSortable } from "react-sortablejs";

const NestedSortable = ({ items, setItems, level = 0 }) => {
  // Function to handle the drag-and-drop logic
  const handleDragEnd = (newItems) => {
    setItems(newItems);
  };

  return (
    <ReactSortable
      list={items}
      setList={handleDragEnd}
      animation={150}
      // Configure the sortable list to only sort top-level items
      sort={level === 0}
      // Restrict drag and drop between different levels
      group={{
        name: 'nested',
        pull: 'clone',  // Prevent dragging children around
        put: false      // Prevent putting items between parent and child
      }}
      filter=".not-draggable" // Prevent children from being dragged
      dragClass="sortableDrag"
      easing="ease-out"
    >
      <div className={`flex ${level === 0 ? 'flex-col' : 'flex-row'} ${level > 0 ? 'space-x-2' : 'space-y-2'}`}>
        {items.map((item, index) => (
          <div
            key={index}
            className={`sortable-item ${level === 0 ? 'bg-gray-100' : 'bg-gray-200'} p-2 border border-gray-300 rounded-sm ${level > 0 ? 'flex-1 not-draggable' : ''}`}
          >
            <div
              className={`w-full inline-block overflow ${level === 0 ? 'font-bold text-gray-800' : 'font-normal text-gray-600'} ${level > 0 ? `pl-${level * 4}` : ''}`}
            >
              {item.name}
            </div>

            {item.children && item.children.length > 0 && (
              <div className="flex flex-row space-x-2">
                <NestedSortable
                  items={item.children}
                  setItems={(newSubList) => {
                    const updatedList = [...items];
                    updatedList[index].children = newSubList;
                    setItems(updatedList);
                  }}
                  level={level + 1}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </ReactSortable>
  );
};

export default NestedSortable;
