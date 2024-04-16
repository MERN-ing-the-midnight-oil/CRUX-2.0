import React, { useState, useEffect, useRef } from "react";
import level1 from "./levels/level1";
import level2 from "./levels/level2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Confetti from "react-confetti";

const GameBoard = () => {
	const [currentLevel, setCurrentLevel] = useState(level1);

	const [guesses, setGuesses] = useState({});
	const [selectedClues, setSelectedClues] = useState([]);

	const cellRefs = useRef({});
	const [activeWordStart, setActiveWordStart] = useState(null);
	const [levelComplete, setLevelComplete] = useState(false);

	const calculateGridSize = (words) => {
		let maxX = 0,
			maxY = 0;
		words.forEach(({ word, start, direction }) => {
			if (direction === "across") {
				maxX = Math.max(maxX, start.x + word.length);
				maxY = Math.max(maxY, start.y + 1);
			} else {
				// direction "down"
				maxX = Math.max(maxX, start.x + 1);
				maxY = Math.max(maxY, start.y + word.length);
			}
		});
		return { width: maxX, height: maxY };
	};

	useEffect(() => {
		const initialGuesses = {};
		currentLevel.words.forEach(({ word, start, direction }) => {
			let [x, y] = [start.x + 1, start.y + 1];
			for (let i = 0; i < word.length; i++) {
				const key = `${y}-${x}`;
				initialGuesses[key] = {
					letter: word[i].toUpperCase(),
					guess: "",
					direction,
				};
				cellRefs.current[key] = React.createRef();
				direction === "across" ? x++ : y++;
			}
		});
		setGuesses(initialGuesses);
	}, [currentLevel]);

	const handleInputChange = (e, currentKey) => {
		const newGuess = e.target.value.slice(-1).toUpperCase();

		// Update the guesses state
		setGuesses((prevGuesses) => ({
			...prevGuesses,
			[currentKey]: { ...prevGuesses[currentKey], guess: newGuess },
		}));

		const direction = guesses[currentKey]?.direction;
		const nextKey = getNextCellKey(currentKey, direction);

		// Only focus the next cell if it's part of the active word
		if (nextKey && isActiveWordKey(nextKey)) {
			cellRefs.current[nextKey]?.current?.focus();
		}
	};

	// useEffect to check level completion when guesses change
	useEffect(() => {
		checkLevelCompletion();
	}, [guesses]); // Dependency array includes guesses to ensure the effect runs on update

	// Function to check if the level is complete
	const checkLevelCompletion = () => {
		const allCorrect = Object.values(guesses).every(
			(cell) => cell.guess === cell.letter && cell.guess !== ""
		);
		console.log("Checking level completion: ", allCorrect, guesses);
		if (allCorrect) {
			setLevelComplete(true);
		} else {
			setLevelComplete(false); // Explicitly set to false if not all are correct
		}
	};

	// Add onFocus handler to set active word when user clicks into a cell
	const handleFocus = (key) => {
		if (!isActiveWordKey(key)) {
			setActiveWordStart(key);
		}
	};

	// Helper function to determine if a key is part of the active word
	const isActiveWordKey = (key) => {
		if (!activeWordStart) return false;
		const [startY, startX] = activeWordStart.split("-").map(Number);
		const [keyY, keyX] = key.split("-").map(Number);
		const activeWord = guesses[activeWordStart];

		if (
			activeWord.direction === "across" &&
			startY === keyY &&
			keyX >= startX
		) {
			return true;
		} else if (
			activeWord.direction === "down" &&
			startX === keyX &&
			keyY >= startY
		) {
			return true;
		}
		return false;
	};

	const getNextCellKey = (currentKey, direction) => {
		const [y, x] = currentKey.split("-").map(Number);

		if (direction === "across") {
			return `${y}-${x + 1}`;
		} else {
			// Assuming the only other direction is "down"
			return `${y + 1}-${x}`;
		}
	};

	const handleClueIconClick = (clues) => {
		console.log("Clues:", clues); // Check what clues are actually passed
		setSelectedClues(clues);
	};

	const renderGrid = () => {
		const { width, height } = calculateGridSize(currentLevel.words);
		const grid = [];
		for (let y = 1; y <= height; y++) {
			const row = [];
			for (let x = 1; x <= width; x++) {
				const key = `${y}-${x}`;
				const cell = guesses[key];
				// Dynamically check against currentLevel intersections
				const isIntersection = currentLevel.intersections.some(
					(intersection) =>
						intersection.position.x + 1 === x &&
						intersection.position.y + 1 === y
				);

				const isCorrectGuess = cell && cell.guess === cell.letter;

				row.push(
					<div
						key={key}
						className={`grid-cell ${isIntersection ? "intersection" : ""} ${
							isCorrectGuess ? "correct-guess" : ""
						}`}>
						{isIntersection && (
							<button
								className="clue-icon"
								onClick={() =>
									handleClueIconClick(
										currentLevel.intersections.find(
											(intersection) =>
												intersection.position.x + 1 === x &&
												intersection.position.y + 1 === y
										).clues
									)
								}
								style={{ position: "absolute", zIndex: 2 }}>
								<FontAwesomeIcon icon={faSearch} />
							</button>
						)}
						<input
							ref={cellRefs.current[key]}
							type="text"
							className={`input ${cell ? "" : "unused-cell"}`}
							value={cell?.guess || ""}
							onChange={(e) => handleInputChange(e, key)}
							onFocus={() => handleFocus(key)}
							maxLength="1"
							disabled={!cell}
							style={{ zIndex: 1 }}
						/>
					</div>
				);
			}
			grid.push(
				<div
					key={`row-${y}`}
					className="grid-row">
					{row}
				</div>
			);
		}
		return grid;
	};

	const completeLevel = () => {
		setLevelComplete(true);
		// You might want to stop the confetti after a certain time
		setTimeout(() => setLevelComplete(false), 3000); // stop after 3  seconds
	};
	return (
		<div>
			{levelComplete && <Confetti recycle={false} />}

			<div className="game-container">
				<div className="level-selection">
					<button onClick={() => setCurrentLevel(level1)}>
						Level 1- "Clones"
					</button>
					{/* <button onClick={() => setCurrentLevel(level2)}>
						Level 2- "SlapPals"
					</button> */}
				</div>
				<div className="game-board">{renderGrid()}</div>
				<div className="clue-display-area">
					{selectedClues.map((clue, index) => (
						<img
							key={index}
							src={clue}
							alt={`Clue ${index + 1}`}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default GameBoard;