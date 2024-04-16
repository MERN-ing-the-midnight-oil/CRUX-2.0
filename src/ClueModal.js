import React, { useState, useRef } from "react";

const ClueModal = ({ isOpen, onClose, content }) => {
	const [isDragging, setIsDragging] = useState(false);
	const [position, setPosition] = useState({ x: 100, y: 100 });
	const modalRef = useRef();

	const startDrag = (e) => {
		setIsDragging(true);
		modalRef.current.offset = {
			x: e.clientX - modalRef.current.getBoundingClientRect().left,
			y: e.clientY - modalRef.current.getBoundingClientRect().top,
		};
	};

	const onDrag = (e) => {
		if (isDragging) {
			const newX = e.clientX - modalRef.current.offset.x;
			const newY = e.clientY - modalRef.current.offset.y;
			setPosition({ x: newX, y: newY });
		}
	};

	const stopDrag = () => {
		setIsDragging(false);
	};

	if (!isOpen) return null;

	return (
		<div
			ref={modalRef}
			onMouseDown={startDrag}
			onMouseMove={isDragging ? onDrag : null}
			onMouseUp={stopDrag}
			onMouseLeave={stopDrag}
			style={{
				position: "absolute",
				left: `${position.x}px`,
				top: `${position.y}px`,
				width: "900px", // Maintain square shape by setting width
				height: "900px", // Set height equal to the width
				border: "1px solid #ccc",
				padding: "20px",
				backgroundColor: "white",
				cursor: "move",
				zIndex: 1000, // Ensure it's on top of other elements
				boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
				overflow: "auto", // Adds scrolling if content is too large
			}}>
			{content}
			<button
				onClick={onClose}
				style={{ marginTop: "10px", display: "block", width: "100%" }}>
				Close
			</button>
		</div>
	);
};

export default ClueModal;