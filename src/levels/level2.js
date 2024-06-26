// src/levels/level2.js
import { createCluePaths } from "../utils/cluePathGenerator";

const levelId = "level2"; // Unique identifier for each level
const title = `Level 2 is Coming Soon: "Pals and partial pals"`; // Title of the level

const baseUrl = process.env.REACT_APP_IMAGE_BASE_URL || ""; // Base URL for images

// Define the visual representation of the grid
// prettier-ignore
const visualGrid = [
    [["##"], ["##"], ["##"], ["##"], ["##"], ["##"], ["##"], ["##"]],
    [["##"], ["##"], ["##"], ["##"], ["##"], ["##"], ["##"], ["##"]],
    [["##"], ["##"], ["##"], ["##"], ["##"], ["##"], ["##"], ["##"]],
    [["##"], ["##"], ["##"], ["##"], ["##"], ["##"], ["##"], ["##"]],
    [["##"], ["##"], ["##"], ["##"], ["##"], ["##"], ["##"], ["##"]],
    [["##"], ["##"], ["##"], ["##"], ["##"], ["##"], ["##"], ["##"]],
];

function createGridFromVisual(visualGrid) {
	return visualGrid.map((row) => {
		if (row.length === 0) {
			return [];
		}
		return row.map((cell) => {
			const content = cell[0];
			if (content === "##") {
				return { empty: true };
			}
			return { empty: true }; // Default case for now as all cells are empty
		});
	});
}

const numberOfClues = 0; // Currently no clues
const level2 = {
	title: title,
	grid: createGridFromVisual(visualGrid),
	clues: createCluePaths(baseUrl, levelId, numberOfClues),
};

export default level2;
