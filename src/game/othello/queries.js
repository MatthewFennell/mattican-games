import _ from 'lodash';

const convertBoard = board => [
    board.rowZero,
    board.rowOne,
    board.rowTwo,
    board.rowThree,
    board.rowFour,
    board.rowFive,
    board.rowSix,
    board.rowSeven
];

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
                boardCopy[row][x] = playerNumber;
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
                boardCopy[row][columnLeft] = playerNumber;
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

    while (!foundDiscRight && columnRight > 0 && !gapRight) {
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
            rowBelow += 1;
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
        return updatedBoard;
    }
    console.log('Cannot place disc there');
};


// eslint-disable-next-line import/prefer-default-export
export const getAvailableMoves = (board, activePlayer) => {
    const formattedBoard = convertBoard(board);
    const availableMoves = [];
    for (let row = 0; row < 7; row += 1) {
        for (let column = 0; column < 7; column += 1) {
            if (canPlaceDisc(formattedBoard, row, column, activePlayer)) {
                availableMoves.push([row, column]);
            }
        }
    }
    return availableMoves;
};
