import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import * as selectors from './selectors';
import GameNotStarted from './GameNotStarted';
import AvalonGameStarted from './avalon/GameStarted';
import ErrorModal from '../common/modal/ErrorModal';
import { closeGameError } from './actions';
import * as constants from '../constants';

const Game = props => {
    const generateGameThingToLoad = () => {
        if (!props.currentGame.hasStarted) {
            return (
                <GameNotStarted />
            );
        }
        if (props.currentGame.mode === constants.gameModes.Avalon) {
            return <AvalonGameStarted />;
        }

        return <div>Unknown game mode</div>;
    };


    return (
        <>
            {generateGameThingToLoad()}
            <ErrorModal
                closeModal={props.closeGameError}
                headerMessage={props.errorHeader}
                isOpen={props.errorMessage.length > 0}
                errorCode={props.errorCode}
                errorMessage={props.errorMessage}
            />
        </>
    );
};

Game.defaultProps = {
    currentGame: {
        hasStarted: false,
        mode: ''
    },
    errorHeader: '',
    errorMessage: '',
    errorCode: ''
};

Game.propTypes = {
    closeGameError: PropTypes.func.isRequired,
    currentGame: PropTypes.shape({
        hasStarted: PropTypes.bool,
        mode: PropTypes.string
    }),
    errorHeader: PropTypes.string,
    errorMessage: PropTypes.string,
    errorCode: PropTypes.string
};

const mapDispatchToProps = {
    closeGameError
};

const mapStateToProps = (state, props) => ({
    currentGame: selectors.getCurrentGame(state, props),
    errorHeader: state.avalon.errorHeader,
    errorMessage: state.avalon.errorMessage,
    errorCode: state.avalon.errorCode
});

export default withRouter(compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(() => [
        {
            collection: 'games'
        }
    ]),
)(Game));

export { Game as GameUnconnected };
