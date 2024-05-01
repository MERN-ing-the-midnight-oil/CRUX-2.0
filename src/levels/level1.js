// src/levels/level1.js
//ABCD;

import { createCluePaths } from "../utils/cluePathGenerator";
const baseUrl = process.env.REACT_APP_IMAGE_BASE_URL || ""; // Base URL for images
const levelId = "level1"; // Unique identifier for level 1
const title = "Don't count your cliches before they hatch."; // Title of the leve
// Define the visual representation of the grid
// prettier-ignore
const visualGrid = [
	[["##"], ["##"], ["##"], ["##"], ["##"],["##"]],
    [["##"], ["##"], ["00"], ["F_"], ["##"],["##"]],
    [["##"], ["##"], ["N_"], ["E_"], ["S_"],["T_"]],
	[["##"], ["##"], ["##"], ["A_"], ["01"],["01"]],
    [["##"], ["##"], ["##"], ["T_"], ["A_"],["R_"]],
	[["##"], ["##"], ["##"], ["H_"], ["02"],["02"]],
    [["##"], ["##"], ["##"], ["E_"], ["02"],["02"]],
    [["##"], ["B_"], ["I_"], ["R_"], ["D_"],["S_"]],
    [["##"], ["U_"], ["03"], ["03"], ["03"],["##"]],
	[["##"], ["S_"], ["03"], ["03"], ["##"],["##"]],
    [["##"], ["H_"], ["A_"], ["N_"], ["D_"],["04"]],
	[["##"], ["05"], ["05"], ["05"], ["O_"],["04"]],
    [["##"], ["##"], ["05"], ["05"], ["W_"],["04"]],
	[["##"], ["##"], ["W_"], ["I_"], ["N_"],["D_"]],
    [["##"], ["##"], ["H_"], ["06"], ["06"],["06"]],
	[["09"], ["09"], ["I_"], ["07"], ["06"],["06"]],
    [["09"], ["08"], ["S_"], ["T_"], ["O_"],["P_"]],
	[["W_"], ["E_"], ["T_"], ["##"], ["##"],["##"]],
    [["##"], ["##"], ["L_"], ["##"], ["##"],["##"]],
    [["C_"], ["L_"], ["E_"], ["A_"], ["N_"],["##"]],
    [["##"], ["##"], ["##"], ["10"], ["O_"],["N_"]],
	[["##"], ["##"], ["##"], ["##"], ["S_"],["##"]],
    [["##"], ["B_"], ["L_"], ["E_"], ["E_"],["D_"]],
	[["##"], ["##"], ["##"], ["D_"], ["##"],["R_"]],
    [["##"], ["##"], ["##"], ["G_"], ["##"],["Y_"]],
	[["##"], ["##"], ["##"], ["E_"], ["##"],["##"]],
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
			if (content.match(/^\d\d$/)) {
				// Matches two digits representing a clue
				return { clue: `clue${content}` };
			}
			if (content.endsWith("_")) {
				// Check if content ends with an underscore, indicating a letter
				return { letter: content[0] };
			}
			return { empty: true };
		});
	});
}

const numberOfClues = 99;
const level1 = {
	title: title,
	grid: createGridFromVisual(visualGrid),
	clues: createCluePaths(baseUrl, levelId, numberOfClues),
};

export default level1;
