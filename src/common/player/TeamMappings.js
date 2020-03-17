import * as constants from '../../constants';

const playerPositionsObject = {
    England: {
        GOALKEEPER: 'ENGLAND_KEEPER',
        [constants.POSITIONS.OUTFIELD]: 'ENGLAND_OUTFIELD'
    },
    Italy: {
        GOALKEEPER: 'ITALY_KEEPER',
        [constants.POSITIONS.OUTFIELD]: 'ITALY_OUTFIELD'
    },
    Brazil: {
        GOALKEEPER: 'BRAZIL_KEEPER',
        [constants.POSITIONS.OUTFIELD]: 'BRAZIL_OUTFIELD'
    }
};

export default playerPositionsObject;
