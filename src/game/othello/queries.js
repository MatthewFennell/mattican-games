/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import _ from 'lodash';

const potentialMultiplier = 100;
const mobilityMultiplier = 1000;
const cornerWeight = 75000;
const adjacentToCornerWeight = 25000;
const edgeWeight = 2000;
const internalWeight = 500;
const xSquareMultiplier = 20000;

export const convertBoard = board => [
    board.rowZero,
    board.rowOne,
    board.rowTwo,
    board.rowThree,
    board.rowFour,
    board.rowFive,
    board.rowSix,
    board.rowSeven
];

const unconvertBoard = board => ({
    rowZero: board[0],
    rowOne: board[1],
    rowTwo: board[2],
    rowThree: board[3],
    rowFour: board[4],
    rowFive: board[5],
    rowSix: board[6],
    rowSeven: board[7]
});

// When placing a disc at [row][column], how many discs flip above the clicked cell
const discsFlippedAbove = (board, row, column, playerNumber, flipping) => {
    let numberOfDiscsFlipped = 0;

    // If the cell is not empty
    if (board[row][column] !== 0) {
        return 0;
    }

    let foundDiscAbove = false;
    let gapAbove = false;
    let rowAbove = row;
    const boardCopy = _.cloneDeep(board);

    while (!foundDiscAbove && rowAbove > 0 && !gapAbove) {
        rowAbove -= 1;
        if (board[rowAbove][column] === playerNumber) {
            foundDiscAbove = true;
        } else if (board[rowAbove][column] === 0) {
            gapAbove = true;
        }
    }
    if (foundDiscAbove) {
        for (let x = rowAbove + 1; x < row; x += 1) {
            numberOfDiscsFlipped += 1;
            if (flipping) {
                boardCopy[x][column] = playerNumber;
            }
        }
    }
    if (flipping) {
        return boardCopy;
    }
    return numberOfDiscsFlipped;
};

// When placing a disc at [row][column], how many discs flip below the clicked cell
const discsFlippedBelow = (board, row, column, playerNumber, flipping) => {
    let numberOfDiscsFlipped = 0;

    // If the cell is not empty
    if (board[row][column] !== 0) {
        return 0;
    }

    let foundDiscBelow = false;
    let gapBelow = false;
    let rowBelow = row;
    const boardCopy = _.cloneDeep(board);

    while (!foundDiscBelow && rowBelow < 7 && !gapBelow) {
        rowBelow += 1;
        if (board[rowBelow][column] === playerNumber) {
            foundDiscBelow = true;
        } else if (board[rowBelow][column] === 0) {
            gapBelow = true;
        }
    }
    if (foundDiscBelow) {
        for (let x = row + 1; x < rowBelow; x += 1) {
            numberOfDiscsFlipped += 1;
            if (flipping) {
                boardCopy[x][column] = playerNumber;
            }
        }
    }
    if (flipping) {
        return boardCopy;
    }
    return numberOfDiscsFlipped;
};

// When placing a disc at [row][column], how many discs flip left of the clicked cell
const discsFlippedLeft = (board, row, column, playerNumber, flipping) => {
    let numberOfDiscsFlipped = 0;

    // If the cell is not empty
    if (board[row][column] !== 0) {
        return 0;
    }

    let foundDiscLeft = false;
    let gapLeft = false;
    let columnLeft = column;
    const boardCopy = _.cloneDeep(board);

    while (!foundDiscLeft && columnLeft > 0 && !gapLeft) {
        columnLeft -= 1;
        if (board[row][columnLeft] === playerNumber) {
            foundDiscLeft = true;
        } else if (board[row][columnLeft] === 0) {
            gapLeft = true;
        }
    }
    if (foundDiscLeft) {
        for (let x = columnLeft + 1; x < column; x += 1) {
            numberOfDiscsFlipped += 1;
            if (flipping) {
                boardCopy[row][x] = playerNumber;
            }
        }
    }
    if (flipping) {
        return boardCopy;
    }
    return numberOfDiscsFlipped;
};

// When placing a disc at [row][column], how many discs flip right if the clicked cell
const discsFlippedRight = (board, row, column, playerNumber, flipping) => {
    let numberOfDiscsFlipped = 0;

    // If the cell is not empty
    if (board[row][column] !== 0) {
        return 0;
    }

    let foundDiscRight = false;
    let gapRight = false;
    let columnRight = column;
    const boardCopy = _.cloneDeep(board);

    while (!foundDiscRight && columnRight < 7 && !gapRight) {
        columnRight += 1;
        if (board[row][columnRight] === playerNumber) {
            foundDiscRight = true;
        } else if (board[row][columnRight] === 0) {
            gapRight = true;
        }
    }
    if (foundDiscRight) {
        for (let x = column + 1; x < columnRight; x += 1) {
            numberOfDiscsFlipped += 1;
            if (flipping) {
                boardCopy[row][x] = playerNumber;
            }
        }
    }
    if (flipping) {
        return boardCopy;
    }
    return numberOfDiscsFlipped;
};

// When placing a disc at [row][column], how many discs flip leftUp of the clicked cell
const discsFlippedLeftUp = (board, row, column, playerNumber, flipping) => {
    let numberOfDiscsFlipped = 0;

    // If the cell is not empty
    if (board[row][column] !== 0) {
        return 0;
    }

    let foundDiscLeftUp = false;
    let gapLeftUp = false;
    let columnLeft = column;
    let rowAbove = row;
    const boardCopy = _.cloneDeep(board);

    while (!foundDiscLeftUp && columnLeft > 0 && !gapLeftUp && rowAbove > 0) {
        columnLeft -= 1;
        rowAbove -= 1;
        if (board[rowAbove][columnLeft] === playerNumber) {
            foundDiscLeftUp = true;
        } else if (board[rowAbove][columnLeft] === 0) {
            gapLeftUp = true;
        }
    }
    if (foundDiscLeftUp) {
        while (columnLeft < column - 1 && rowAbove < row - 1) {
            columnLeft += 1;
            rowAbove += 1;
            numberOfDiscsFlipped += 1;
            if (flipping) {
                boardCopy[rowAbove][columnLeft] = playerNumber;
            }
        }
    }
    if (flipping) {
        return boardCopy;
    }
    return numberOfDiscsFlipped;
};

// When placing a disc at [row][column], how many discs flip leftDown the clicked cell
const discsFlippedLeftDown = (board, row, column, playerNumber, flipping) => {
    let numberOfDiscsFlipped = 0;

    // If the cell is not empty
    if (board[row][column] !== 0) {
        return 0;
    }

    let foundDiscLeftDown = false;
    let gapLeftDown = false;
    let columnLeft = column;
    let rowBelow = row;
    const boardCopy = _.cloneDeep(board);

    while (!foundDiscLeftDown && columnLeft > 0 && !gapLeftDown && rowBelow < 7) {
        columnLeft -= 1;
        rowBelow += 1;
        if (board[rowBelow][columnLeft] === playerNumber) {
            foundDiscLeftDown = true;
        } else if (board[rowBelow][columnLeft] === 0) {
            gapLeftDown = true;
        }
    }
    if (foundDiscLeftDown) {
        while (columnLeft < column - 1 && rowBelow > row + 1) {
            columnLeft += 1;
            rowBelow -= 1;
            numberOfDiscsFlipped += 1;
            if (flipping) {
                boardCopy[rowBelow][columnLeft] = playerNumber;
            }
        }
    }
    if (flipping) {
        return boardCopy;
    }
    return numberOfDiscsFlipped;
};

// When placing a disc at [row][column], how many discs flip leftDown the clicked cell
const discsFlippedRightUp = (board, row, column, playerNumber, flipping) => {
    let numberOfDiscsFlipped = 0;

    // If the cell is not empty
    if (board[row][column] !== 0) {
        return 0;
    }

    let foundDiscRightUp = false;
    let gapRightUp = false;
    let columnRight = column;
    let rowAbove = row;
    const boardCopy = _.cloneDeep(board);

    while (!foundDiscRightUp && columnRight < 7 && !gapRightUp && rowAbove > 0) {
        columnRight += 1;
        rowAbove -= 1;
        if (board[rowAbove][columnRight] === playerNumber) {
            foundDiscRightUp = true;
        } else if (board[rowAbove][columnRight] === 0) {
            gapRightUp = true;
        }
    }
    if (foundDiscRightUp) {
        while (columnRight > column + 1 && rowAbove < row - 1) {
            columnRight -= 1;
            rowAbove += 1;
            numberOfDiscsFlipped += 1;
            if (flipping) {
                boardCopy[rowAbove][columnRight] = playerNumber;
            }
        }
    }
    if (flipping) {
        return boardCopy;
    }
    return numberOfDiscsFlipped;
};

// When placing a disc at [row][column], how many discs flip leftDown the clicked cell
const discsFlippedRightDown = (board, row, column, playerNumber, flipping) => {
    let numberOfDiscsFlipped = 0;

    // If the cell is not empty
    if (board[row][column] !== 0) {
        return 0;
    }

    let foundDiscRightDown = false;
    let gapRightDown = false;
    let columnRight = column;
    let rowBelow = row;
    const boardCopy = _.cloneDeep(board);

    while (!foundDiscRightDown && columnRight < 7 && !gapRightDown && rowBelow < 7) {
        columnRight += 1;
        rowBelow += 1;
        if (board[rowBelow][columnRight] === playerNumber) {
            foundDiscRightDown = true;
        } else if (board[rowBelow][columnRight] === 0) {
            gapRightDown = true;
        }
    }
    if (foundDiscRightDown) {
        while (columnRight > column + 1 && rowBelow > row + 1) {
            columnRight -= 1;
            rowBelow -= 1;
            numberOfDiscsFlipped += 1;
            if (flipping) {
                boardCopy[rowBelow][columnRight] = playerNumber;
            }
        }
    }
    if (flipping) {
        return boardCopy;
    }
    return numberOfDiscsFlipped;
};

// Returns true if playerNumber can place a disc in the row/column
const canPlaceDisc = (board, row, column, playerNumber) => {
    if (discsFlippedAbove(board, row, column, playerNumber, false)) {
        return true;
    }
    if (discsFlippedBelow(board, row, column, playerNumber, false)) {
        return true;
    }
    if (discsFlippedLeft(board, row, column, playerNumber, false)) {
        return true;
    }
    if (discsFlippedRight(board, row, column, playerNumber, false)) {
        return true;
    }
    if (discsFlippedLeftDown(board, row, column, playerNumber, false)) {
        return true;
    }
    if (discsFlippedLeftUp(board, row, column, playerNumber, false)) {
        return true;
    }
    if (discsFlippedRightDown(board, row, column, playerNumber, false)) {
        return true;
    }
    if (discsFlippedRightUp(board, row, column, playerNumber, false)) {
        return true;
    }
    return false;
};

// Takes a move from a player
// If that results in flips, returns the new board
// Otherwise returns the old board
export const placeDisc = (board, row, column, playerNumber) => {
    const transformedBoard = convertBoard(board);
    if (canPlaceDisc(transformedBoard, row, column, playerNumber)) {
        let updatedBoard = discsFlippedAbove(transformedBoard, row, column, playerNumber, true);
        updatedBoard = discsFlippedBelow(updatedBoard, row, column, playerNumber, true);
        updatedBoard = discsFlippedAbove(updatedBoard, row, column, playerNumber, true);
        updatedBoard = discsFlippedLeft(updatedBoard, row, column, playerNumber, true);
        updatedBoard = discsFlippedRight(updatedBoard, row, column, playerNumber, true);
        updatedBoard = discsFlippedLeftUp(updatedBoard, row, column, playerNumber, true);
        updatedBoard = discsFlippedLeftDown(updatedBoard, row, column, playerNumber, true);
        updatedBoard = discsFlippedRightUp(updatedBoard, row, column, playerNumber, true);
        updatedBoard = discsFlippedRightDown(updatedBoard, row, column, playerNumber, true);
        updatedBoard[row][column] = playerNumber;
        return unconvertBoard(updatedBoard);
    }
    return board;
};

/* Gets all available moves for a given player
        [
            [row, column], ...[row,column]
        ]
*/
export const getAvailableMoves = (board, activePlayer) => {
    const formattedBoard = convertBoard(board);
    const availableMoves = [];
    for (let row = 0; row <= 7; row += 1) {
        for (let column = 0; column <= 7; column += 1) {
            if (canPlaceDisc(formattedBoard, row, column, activePlayer)) {
                availableMoves.push([row, column]);
            }
        }
    }
    return availableMoves;
};

// Takes non converted board
export const getRandomMove = (board, activePlayer) => {
    const availableMoves = getAvailableMoves(board, activePlayer);
    const randomMove = _.sample(availableMoves);
    return {
        row: randomMove[0],
        column: randomMove[1]
    };
};

// Takes history of moves
// Returns the board after all of the moves have been applied
// Does not need to take transformed board
export const getBoardFromHistory = (board, history) => history.reduce((prev, cur) => placeDisc(prev,
    cur.row, cur.column, cur.player), _.cloneDeep(board));

const makeNode = (playerNumber, selectedMove, history, maximisingPlayerNumber, depth) => ({
    playerNumber,
    selectedMove,
    maximisingPlayerNumber,
    history,
    children: [],
    depth
});

export const alphaBeta = (root, depth, alpha, beta, maximisingPlayer) => {
    if (depth === 0) {
        const result = root.evaluatePosition();
        root.value = result;
        return result;
    }
    if (maximisingPlayer) {
        let v = Number.MAX_SAFE_INTEGER * -1;
        for (let x = 0; x < root.children.length; x += 1) {
            v = Math.max(v, alphaBeta(root.children[x], depth - 1, alpha, beta, false));
            alpha = Math.max(alpha, v);
            root.value = v;
            if (beta <= alpha) {
                break;
            }
        }
        return v;
    }
    let v = Number.MAX_SAFE_INTEGER;
    for (let x = 0; x < root.children.length; x += 1) {
        v = Math.min(v, alphaBeta(root.children[x], depth - 1, alpha, beta, true));
        beta = Math.min(beta, v);
        root.value = v;
        if (beta <= alpha) {
            break;
        }
    }
    return v;
};

const hasPlayerWon = (board, availableMovesBlack, availableMovesWhite) => {
    if (availableMovesBlack.length === 0 && availableMovesWhite.length === 0) {
        const flattenedBoard = _.flatten(board);
        const sum = flattenedBoard.reduce((acc, cur) => acc + cur, 0);

        // If the sum of the discs > 0, then playerWhite has more discs
        // Otherwise black
        if (sum > 0) {
            return 1;
        }
        // If less than 0, playerBlack has more
        if (sum < 0) {
            return -1;
        }
    }
    return 0;
};

const isHorizontallyStable = (board, row, column, stableDiscs) => {
    // If it is in either the far left or far right column, it it horizontally stable
    if (column === 0 || column === 7) {
        return true;
    }

    const emptyCellInRow = board[row].some(cell => cell === 0);

    // If the row is entirely full, then it is horizontally stable
    if (!emptyCellInRow) {
        return true;
    }

    // Check adjacent discs of same color
    if (stableDiscs[row][column - 1] && board[row][column - 1] === board[row][column]) {
        return true;
    }

    if (stableDiscs[row][column + 1] && board[row][column + 1] === board[row][column]) {
        return true;
    }

    return false;
};

const isVerticallyStable = (board, row, column, stableDiscs) => {
    // If it is in either the top or bottom row, it it vertically stable
    if (row === 0 || row === 7) {
        return true;
    }

    let emptyCellInRow = false;
    for (let x = 0; x < 8; x += 1) {
        if (board[x][column] === 0) {
            emptyCellInRow = true;
        }
    }

    // If the column is entirely full, then it is vertically stable
    if (!emptyCellInRow) {
        return true;
    }

    // Check adjacent discs of same color
    if (stableDiscs[row - 1][column] && board[row - 1][column] === board[row][column]) {
        return true;
    }

    if (stableDiscs[row + 1][column] && board[row + 1][column] === board[row][column]) {
        return true;
    }

    return false;
};

const isRightDownStable = (board, row, column, stableDiscs) => {
    // If it is either the top row, bottom row, left column, right column then it is right down stable
    if (row === 0 || row === 7 || column === 0 || column === 7) {
        return true;
    }

    // Extrapolate back to their earliest point, then loop as far as it can go without overflowing board
    // Don't need to start at the first one - that is covered above
    let currentRow = row - Math.min(row, column);
    let currentColumn = column - Math.min(row, column);
    let emptyCellRightDown = false;

    while (currentRow <= 7 && currentColumn <= 7) {
        if (board[currentRow][currentColumn] === 0) {
            emptyCellRightDown = true;
            break;
        }
        currentRow += 1;
        currentColumn += 1;
    }

    if (!emptyCellRightDown) {
        return true;
    }

    // If up and left is stable and same color
    if (stableDiscs[row - 1][column - 1] && board[row - 1][column - 1] === board[row][column]) {
        return true;
    }

    // If down and right is stable and same color
    if (stableDiscs[row + 1][column + 1] && board[row + 1][column + 1] === board[row][column]) {
        return true;
    }

    return false;
};

const isRightUpStable = (board, row, column, stableDiscs) => {
    // If it is either the top row, bottom row, left column, right column then it is right down stable
    if (row === 0 || row === 7 || column === 0 || column === 7) {
        return true;
    }

    // Cool logic
    // Goes up and right up until the edge of the board
    // Don't need to start at the first one - that is covered above
    let currentRow = row - Math.min(row, 7 - column);
    let currentColumn = column + Math.min(row, 7 - column);
    let emptyCellRightUp = false;

    while (currentRow <= 7 && currentColumn >= 0) {
        if (board[currentRow][currentColumn] === 0) {
            emptyCellRightUp = true;
            break;
        }
        currentRow += 1;
        currentColumn -= 1;
    }

    if (!emptyCellRightUp) {
        return true;
    }

    // If up and right is stable and same color
    if (stableDiscs[row - 1][column + 1] && board[row - 1][column + 1] === board[row][column]) {
        return true;
    }

    // If down and left is stable and same color
    if (stableDiscs[row + 1][column - 1] && board[row + 1][column - 1] === board[row][column]) {
        return true;
    }

    return false;
};

const isDiscStable = (board, row, column, stableDiscs) => {
    if (board[row][column] === 0) {
        return false;
    }
    const horizontalStability = isHorizontallyStable(board, row, column, stableDiscs);
    const verticalStability = isVerticallyStable(board, row, column, stableDiscs);
    const rightUpStability = isRightUpStable(board, row, column, stableDiscs);
    const rightDownStability = isRightDownStable(board, row, column, stableDiscs);

    return horizontalStability && verticalStability && rightUpStability && rightDownStability;
};

export const findStableDiscs = board => {
    const stableDiscs = [];
    for (let x = 0; x < 8; x += 1) {
        stableDiscs.push([false, false, false, false, false, false, false, false]);
    }

    stableDiscs[0][0] = isDiscStable(board, 0, 0, stableDiscs);
    stableDiscs[0][7] = isDiscStable(board, 0, 7, stableDiscs);
    stableDiscs[7][0] = isDiscStable(board, 7, 0, stableDiscs);
    stableDiscs[7][7] = isDiscStable(board, 7, 7, stableDiscs);

    // Loop down the leftmost and rightmost column
    for (let row = 1; row < 7; row += 1) {
        if (isDiscStable(board, row, 0, stableDiscs)) {
            stableDiscs[row][0] = true;
        }
        if (isDiscStable(board, row, 7, stableDiscs)) {
            stableDiscs[row][7] = true;
        }
    }

    // Loop up the leftmost and rightmost column
    for (let row = 6; row > 0; row -= 1) {
        if (isDiscStable(board, row, 0, stableDiscs)) {
            stableDiscs[row][0] = true;
        }
        if (isDiscStable(board, row, 7, stableDiscs)) {
            stableDiscs[row][7] = true;
        }
    }

    // Loop right across the top and bottom column
    for (let column = 1; column < 7; column += 1) {
        if (isDiscStable(board, 0, column, stableDiscs)) {
            stableDiscs[0][column] = true;
        }
        if (isDiscStable(board, 7, column, stableDiscs)) {
            stableDiscs[7][column] = true;
        }
    }

    // Loop left across the top and bottom column
    for (let column = 6; column > 0; column -= 1) {
        if (isDiscStable(board, 0, column, stableDiscs)) {
            stableDiscs[0][column] = true;
        }
        if (isDiscStable(board, 7, column, stableDiscs)) {
            stableDiscs[7][column] = true;
        }
    }

    for (let row = 1; row < 7; row += 1) {
        for (let column = 1; column < 6; column += 1) {
            if (isDiscStable(board, row, column, stableDiscs)) {
                stableDiscs[row][column] = true;
            }
        }
    }

    return stableDiscs;
};

const checkCellDifferenceForApposingPlayerCell = (board, row, column, maxPlayer) => {
    if (board[row][column] === maxPlayer * -1) {
        return 1;
    }
    return 0;
};

const getPotentialMobilityForSquare = (board, row, column, maxPlayer) => {
    let potentialMobility = 0;

    if (board[row][column] !== 0) {
        return 0;
    }

    // Above - not on top row
    // Below - not on bottom row
    // Right - not on right column
    // Left - not on left column

    // Right up - not on right column or top row
    // Right down - not on right column or bottom row
    // Left up - not on left column or top row
    // Left down - not on left column or bottom row

    // Check above
    if (row !== 0) {
        potentialMobility += checkCellDifferenceForApposingPlayerCell(board, row - 1, column, maxPlayer);
    }

    // Check below
    if (row !== 7) {
        potentialMobility += checkCellDifferenceForApposingPlayerCell(board, row + 1, column, maxPlayer);
    }

    // Check left
    if (column !== 0) {
        potentialMobility += checkCellDifferenceForApposingPlayerCell(board, row, column - 1, maxPlayer);
    }

    // Check right
    if (column !== 7) {
        potentialMobility += checkCellDifferenceForApposingPlayerCell(board, row, column + 1, maxPlayer);
    }

    // Check right up
    if (row !== 0 && column !== 7) {
        potentialMobility += checkCellDifferenceForApposingPlayerCell(board, row - 1, column + 1, maxPlayer);
    }

    // Check right down
    if (row !== 7 && column !== 7) {
        potentialMobility += checkCellDifferenceForApposingPlayerCell(board, row + 1, column + 1, maxPlayer);
    }

    // Check left up
    if (row !== 0 && column !== 0) {
        potentialMobility += checkCellDifferenceForApposingPlayerCell(board, row - 1, column - 1, maxPlayer);
    }

    // Check left down
    if (row !== 7 && column !== 0) {
        potentialMobility += checkCellDifferenceForApposingPlayerCell(board, row + 1, column - 1, maxPlayer);
    }
    return potentialMobility;
};

export const calculatePotentialMobility = (board, maximisingPlayer) => {
    let potentialMobility = 0;
    for (let row = 0; row < 8; row += 1) {
        for (let column = 0; column < 8; column += 1) {
            potentialMobility += getPotentialMobilityForSquare(board, row, column, maximisingPlayer);
            potentialMobility -= getPotentialMobilityForSquare(board, row, column, maximisingPlayer * -1);
        }
    }
    return potentialMobility * potentialMultiplier;
};

const isCorner = (row, column) => (row === 0 && column === 0) || (row === 0 && column === 7) || (row === 7 && column === 0) || (row === 7 && column === 7);

const isAdjacentToCorner = (row, column) => (row === 0 && column === 1)
                                         || (row === 1 && column === 0)
                                         || (row === 0 && column === 6)
                                         || (row === 1 && column === 7)
                                         || (row === 6 && column === 0)
                                         || (row === 7 && column === 1)
                                         || (row === 7 && column === 6)
                                         || (row === 6 && column === 7);

const isEdgeCell = (row, column) => {
    if (isCorner(row, column) || isAdjacentToCorner(row, column)) {
        return false;
    }
    return (row === 0 || row === 7 || column === 0 || column === 7);
};

const isCenterSquare = (row, column) => {
    if (isCorner(row, column) || isAdjacentToCorner(row, column) || isEdgeCell(row, column)) {
        return false;
    }
    return true;
};

const getStableDiscValue = (board, row, column, maximisingPlayer) => {
    // if corner
    // if adjacent to corner
    // if edge row
    // if center square

    if (isCorner(row, column)) {
        return board[row][column] === maximisingPlayer ? cornerWeight : cornerWeight * -1;
    }
    if (isAdjacentToCorner(row, column)) {
        return board[row][column] === maximisingPlayer ? adjacentToCornerWeight : adjacentToCornerWeight * -1;
    }
    if (isEdgeCell(row, column)) {
        return board[row][column] === maximisingPlayer ? edgeWeight : edgeWeight * -1;
    }
    return board[row][column] === maximisingPlayer ? internalWeight : internalWeight * -1;
};

const getStableDiscsScore = (board, stableDiscs, maximisingPlayer) => {
    let score = 0;
    for (let row = 0; row < 8; row += 1) {
        for (let column = 0; column < 8; column += 1) {
            if (stableDiscs[row][column]) {
                score += getStableDiscValue(board, row, column, maximisingPlayer);
            }
        }
    }
    return score;
};

const getMobilityDifference = (movesBlack, movesWhite, maxPlayer) => {
    if (maxPlayer === 1) {
        return (movesWhite.length - movesBlack.length) * mobilityMultiplier;
    }
    return (movesBlack.length - movesWhite.length) * mobilityMultiplier;
};

const getXSquares = (board, maxPlayer, stableDiscs) => {
    let score = 0;
    if (!stableDiscs[1][1] && board[0][0] === 0) {
        if (board[1][1] === maxPlayer) {
            score -= 1;
        }
        if (board[1][1] === maxPlayer * -1) {
            score += 1;
        }
    }

    if (!stableDiscs[1][6] && board[0][7] === 0) {
        if (board[1][6] === maxPlayer) {
            score -= 1;
        }
        if (board[1][6] === maxPlayer * -1) {
            score += 1;
        }
    }

    if (!stableDiscs[6][1] && board[7][0] === 0) {
        if (board[6][1] === maxPlayer) {
            score -= 1;
        }
        if (board[6][1] === maxPlayer * -1) {
            score += 1;
        }
    }

    if (!stableDiscs[6][6] && board[7][7] === 0) {
        if (board[6][6] === maxPlayer) {
            score -= 1;
        }
        if (board[6][6] === maxPlayer * -1) {
            score += 1;
        }
    }
    return score * xSquareMultiplier;
};

export const getCenterScore = (board, maximisingPlayer, stableDiscs) => {
    let score = 0;
    for (let row = 0; row < 8; row += 1) {
        for (let column = 0; column < 8; column += 1) {
            if (stableDiscs[row][column] && isCenterSquare(row, column)) {
                score += getStableDiscValue(board, row, column, maximisingPlayer);
            }
        }
    }
    return score;
};

export const getEdgeScore = (board, maximisingPlayer, stableDiscs) => {
    let score = 0;
    for (let row = 0; row < 8; row += 1) {
        for (let column = 0; column < 8; column += 1) {
            if (stableDiscs[row][column] && isEdgeCell(row, column)) {
                score += getStableDiscValue(board, row, column, maximisingPlayer);
            }
        }
    }
    return score;
};

export const getAdjacentToCornerScore = (board, maximisingPlayer, stableDiscs) => {
    let score = 0;
    for (let row = 0; row < 8; row += 1) {
        for (let column = 0; column < 8; column += 1) {
            if (stableDiscs[row][column] && isAdjacentToCorner(row, column)) {
                score += getStableDiscValue(board, row, column, maximisingPlayer);
            }
        }
    }
    return score;
};

export const getCornerScore = (board, maximisingPlayer, stableDiscs) => {
    let score = 0;
    if (stableDiscs[0][0]) {
        score += getStableDiscValue(board, 0, 0, maximisingPlayer);
    }
    if (stableDiscs[7][0]) {
        score += getStableDiscValue(board, 7, 0, maximisingPlayer);
    }
    if (stableDiscs[0][7]) {
        score += getStableDiscValue(board, 0, 7, maximisingPlayer);
    }
    if (stableDiscs[7][7]) {
        score += getStableDiscValue(board, 7, 7, maximisingPlayer);
    }
    return score;
};

export const getHeuristicBreakdown = (board, maximisingPlayer) => {
    const convertedBoard = convertBoard(board);
    const stableDiscs = findStableDiscs(convertedBoard);
    const cornerScore = getCornerScore(convertedBoard, maximisingPlayer, stableDiscs);
    const adjacentToCornerScore = getAdjacentToCornerScore(convertedBoard, maximisingPlayer, stableDiscs);
    const edgeScore = getEdgeScore(convertedBoard, maximisingPlayer, stableDiscs);
    const centerScore = getCenterScore(convertedBoard, maximisingPlayer, stableDiscs);

    const availableMovesWhite = getAvailableMoves(board, 1);
    const availableMovesBlack = getAvailableMoves(board, -1);
    const differenceInMobility = getMobilityDifference(availableMovesBlack, availableMovesWhite, maximisingPlayer);
    const potentialMobility = calculatePotentialMobility(convertedBoard, maximisingPlayer);
    const xSquareScore = getXSquares(convertedBoard, maximisingPlayer, stableDiscs);

    return {
        corners: cornerScore,
        adjacent: adjacentToCornerScore,
        edges: edgeScore,
        center: centerScore,
        immediateMobility: differenceInMobility,
        potentialMobility,
        xSquare: xSquareScore
    };
};

export const evaluatePosition = (board, history, maximisingPlayerNumber) => {
    const transformedBoard = getBoardFromHistory(board, history);
    const convertedBoard = convertBoard(transformedBoard);

    const availableMovesWhite = getAvailableMoves(transformedBoard, 1);
    const availableMovesBlack = getAvailableMoves(transformedBoard, -1);
    const stableDiscs = findStableDiscs(convertedBoard);

    const winner = hasPlayerWon(transformedBoard, availableMovesBlack, availableMovesWhite);
    const differenceInMobility = getMobilityDifference(availableMovesBlack, availableMovesWhite, maximisingPlayerNumber);

    const potentialMobility = calculatePotentialMobility(convertedBoard, maximisingPlayerNumber);
    const stableScore = getStableDiscsScore(convertedBoard, stableDiscs, maximisingPlayerNumber);

    const xSquareScore = getXSquares(convertedBoard, maximisingPlayerNumber, stableDiscs);

    if (winner === maximisingPlayerNumber) {
        return Number.MAX_SAFE_INTEGER;
    }
    if (winner === maximisingPlayerNumber * -1) {
        return Number.MAX_SAFE_INTEGER * -1;
    }

    const evaluation = differenceInMobility + potentialMobility + stableScore + xSquareScore;
    return evaluation;
};

// This takes a node and generates all of the child moves for it
// It takes the current player - tries all of their available moves first
// If they have no moves available, then it will try it for the other player
const expandNode = (node, moveHistory, currentPlayer, originalBoard, maximisingPlayerNumber, depth) => {
    const newBoard = getBoardFromHistory(originalBoard, moveHistory);
    const availableMoves = getAvailableMoves(newBoard, currentPlayer);
    if (availableMoves.length) {
        node.children = [];
        availableMoves.forEach((move, index) => {
            node.children[index] = makeNode(
                currentPlayer * -1,
                move,
                [...moveHistory, { row: move[0], column: move[1], player: currentPlayer }],
                maximisingPlayerNumber,
                depth + 1
            );
            // node.evaluatePosition = () => evaluatePosition(newBoard, node.history, maximisingPlayerNumber);
        });
        // In this case, they will get to play two turns in a row
    } else {
        const availableMovesOtherPlayer = getAvailableMoves(newBoard, currentPlayer * -1);
        if (availableMovesOtherPlayer.length) {
            node.playerNumber *= -1;
            node.children = [];
            availableMovesOtherPlayer.forEach((move, index) => {
                node.children[index] = makeNode(
                    currentPlayer,
                    move,
                    [...moveHistory, { row: move[0], column: move[1], player: currentPlayer * -1 }],
                    maximisingPlayerNumber,
                    depth + 1
                );
            });
        } else {
            // If no moves for either player, must be a leaf node - needs evaluation function
            node.evaluatePosition = () => evaluatePosition(newBoard, node.history, maximisingPlayerNumber);
        }
    }
};

// When you expand yourself, the first thing you do is EXPAND_NODE
const expandSelf = (nodeToExpand, playerNumber, depth, maxDepth, originalBoard, history, maximisingPlayerNumber) => {
    if (depth < maxDepth) {
        expandNode(nodeToExpand, history, playerNumber, originalBoard, maximisingPlayerNumber, depth);

        // After expanding the node, if they have any child nodes, expand them
        // The child nodes know which player they belong to
        // The maximising player number always stays the same
        if (nodeToExpand.children.length) {
            nodeToExpand.children.forEach(child => {
                expandSelf(child, child.playerNumber, depth + 1, maxDepth, originalBoard, child.history, maximisingPlayerNumber);
            });
        }

        // If we reach the max depth, the node needs to know its evaluation function
        // It needs the original board and history of moves to know the current board state
    } else if (depth === maxDepth) {
        nodeToExpand.evaluatePosition = () => evaluatePosition(originalBoard, nodeToExpand.history, maximisingPlayerNumber);
    }
};

// May not guarantee max depth, but it's good enough for speed
const findRoughMaxDepthOfTree = (node, depth) => {
    if (node.children.length === 0) {
        return node.depth;
    }
    return findRoughMaxDepthOfTree(node.children[0], depth + 1);
};

export const getMinimaxMove = (board, currentPlayer, maxDepth) => {
    const rootNode = makeNode(currentPlayer, null, [], currentPlayer, 0);

    expandSelf(rootNode, currentPlayer, 0, maxDepth, board, [], currentPlayer);

    const maxDepthOfTree = findRoughMaxDepthOfTree(rootNode, 0);

    // The max depth must not be larger than the depth of the tree
    const result = alphaBeta(rootNode, Math.min(maxDepth, maxDepthOfTree), Number.MAX_SAFE_INTEGER * -1, Number.MAX_SAFE_INTEGER, true);

    let move = null;

    rootNode.children.forEach(child => {
        if (child.value === result) {
            move = child.selectedMove;
        }
    });

    return {
        row: move[0],
        column: move[1]
    };
};
