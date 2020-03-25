import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import * as selectors from './selectors';
import GameNotStarted from './GameNotStarted';
import GameStarted from './GameStarted';
import ErrorModal from '../common/modal/ErrorModal';
import { closeGameError } from './actions';

const Game = props => {
    const generateGameThingToLoad = () => {
        if (!props.currentGame.hasStarted) {
            return (
                <GameNotStarted />
            );
        }
        return <GameStarted />;
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
        hasStarted: false
    },
    errorHeader: '',
    errorMessage: '',
    errorCode: ''
};

Game.propTypes = {
    closeGameError: PropTypes.func.isRequired,
    currentGame: PropTypes.shape({
        hasStarted: PropTypes.bool
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
