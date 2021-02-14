import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { deleteGameRequest } from '../../game/actions';
import StyledButton from '../StyledButton/StyledButton';
import ConfirmModal from '../modal/ConfirmModal';

const DeleteGame = props => {
    const [isDeleting, setIsDeleting] = useState(false);
    return (
        <>
            <StyledButton
                text="Delete Game"
                onClick={() => setIsDeleting(true)}
                color="secondary"
            />
            <ConfirmModal
                closeModal={() => setIsDeleting(false)}
                isOpen={isDeleting}
                isDisabled={props.isDeletingGame}
                isLoading={props.isDeletingGame}
                submit={() => props.deleteGameRequest(props.gameId, props.gameMode)}
            />
        </>
    );
};

DeleteGame.defaultProps = {
    deleteGameRequest: noop,
    gameId: '',
    gameMode: '',
    isDeletingGame: false
};

DeleteGame.propTypes = {
    deleteGameRequest: PropTypes.func,
    gameId: PropTypes.string,
    gameMode: PropTypes.string,
    isDeletingGame: PropTypes.bool
};

const mapDispatchToProps = {
    deleteGameRequest
};

const mapStateToProps = state => ({
    isDeletingGame: state.game.isDeletingGame
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteGame);
