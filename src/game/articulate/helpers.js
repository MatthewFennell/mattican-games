import * as constants from '../../constants';

// eslint-disable-next-line import/prefer-default-export
export const getCategory = (teamScore, scoreCap) => {
    if (teamScore === scoreCap) {
        return constants.articulateCategories.Spade;
    }
    if (teamScore % 7 === 0) {
        return constants.articulateCategories.Object;
    }
    if (teamScore % 7 === 1) {
        return constants.articulateCategories.Action;
    }
    if (teamScore % 7 === 2) {
        return constants.articulateCategories.Spade;
    }
    if (teamScore % 7 === 3) {
        return constants.articulateCategories.World;
    }
    if (teamScore % 7 === 4) {
        return constants.articulateCategories.Person;
    }
    if (teamScore % 7 === 5) {
        return constants.articulateCategories.Random;
    }
    if (teamScore % 7 === 6) {
        return constants.articulateCategories.Nature;
    }
    return 'ERROR';
};
