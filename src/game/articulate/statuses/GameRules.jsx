import React from 'react';
import PropTypes from 'prop-types';
import defaultStyles from './GameRules.module.scss';

const GameRules = props => {
    const generateOption = (number, category) => (
        <div className={props.styles.option}>
            <div className={props.styles.number}>
                {`${number} - `}
            </div>
            <div className={props.styles.categoryModulus}>
                {category}
            </div>
        </div>
    );

    return (
        <div className={props.styles.gameRulesWrapper}>
            <div className={props.styles.rules}>
                <ul className={props.styles.bulletPoints}>
                    <li>
                        Once team reaches score cap,
                        to win that team must correctly answer an all play question on their turn
                    </li>
                    <li>
                        Everybody plays on Spade rounds.
                        Whichever team wins the Spade round gets a bonus go
                    </li>
                    <li>
                        Spade rounds have no time limit
                    </li>
                </ul>
            </div>

            <div className={props.styles.modulusExplanation}>
                Take your score and divide by 7.
                The remainder dictates what category you will get next
            </div>

            <div className={props.styles.modulusResults}>
                {generateOption(0, 'Object')}
                {generateOption(1, 'Action')}
                {generateOption(2, 'Spade')}
                {generateOption(3, 'World')}
                {generateOption(4, 'Person')}
                {generateOption(5, 'Random')}
                {generateOption(6, 'Nature')}
            </div>
        </div>
    );
};

GameRules.defaultProps = {
    currentGame: {
    },
    styles: defaultStyles,
    users: {}
};

GameRules.propTypes = {
    currentGame: PropTypes.shape({
    }),
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

export default GameRules;
