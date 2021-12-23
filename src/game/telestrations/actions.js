const pre = "TELESTRATION/";

export const ADD_WORD_REQUEST = `${pre}ADD_WORD_REQUEST`;
export const START_GAME_REQUEST = `${pre}START_GAME_REQUEST`;

export const CANCEL_ADDING_WORD = `${pre}CANCEL_ADDING_WORD`;
export const EDIT_NUMBER_OF_SPIES = `${pre}EDIT_NUMBER_OF_SPIES`;
export const CANCEL_EDITING_SPIES = `${pre}CANCEL_EDITING_SPIES`;

export const addWordRequest = (gameId, word) => ({
  type: ADD_WORD_REQUEST,
  gameId,
  word,
});

export const startGameRequest = (gameId) => ({
  type: START_GAME_REQUEST,
  gameId,
});

export const cancelAddingWord = () => ({
  type: CANCEL_ADDING_WORD,
});

export const editNumberOfSpies = (gameId, numberOfSpies) => ({
  type: EDIT_NUMBER_OF_SPIES,
  gameId,
  numberOfSpies,
});

export const cancelEditingSpies = () => ({
  type: CANCEL_EDITING_SPIES,
});
