/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import classNames from 'classnames';
import * as helpers from '../helpers';
import defaultStyles from './Modals.module.scss';
import SuccessModal from '../../common/modal/SuccessModal';
import StyledButton from '../../common/StyledButton/StyledButton';

const Modals = props => (
    <>
        <SuccessModal
            backdrop
            closeModal={noop}
            error
            isOpen={Boolean(props.currentGame.requestToEndGame)}
            headerMessage={`${helpers.mapUserIdToName(props.users, props.currentGame.requestToEndGame)} wants to end the game`}
        >
            <div className={props.styles.endGameWrapper}>
                <div className={props.styles.numVotes}>3 Votes are required</div>
                <div className={props.styles.endGameVotes}>
                    {props.currentGame.approveLeaveMidgame.map(id => (
                        <div
                            className={props.styles.approval}
                            key={id}
                        >
                            <FiberManualRecordIcon fontSize="small" />
                        </div>
                    ))}
                    {props.currentGame.rejectLeaveMidgame.map(id => (
                        <div
                            className={props.styles.rejection}
                            key={id}
                        >
                            <FiberManualRecordIcon fontSize="small" />
                        </div>
                    ))}
                </div>

                <div className={props.styles.endGameButtons}>

                    <StyledButton
                        text="Approve"
                        onClick={() => props.approveLeaveMidgameRequest(
                            props.currentGameId, true
                        )}
                        disabled={props.currentGame.approveLeaveMidgame.includes(props.auth.uid)
                                || props.currentGame.rejectLeaveMidgame.includes(props.auth.uid)}
                    />
                    <StyledButton
                        text="Reject"
                        color="secondary"
                        onClick={() => props.approveLeaveMidgameRequest(
                            props.currentGameId, false
                        )}
                        disabled={props.currentGame.approveLeaveMidgame.includes(props.auth.uid)
                                || props.currentGame.rejectLeaveMidgame.includes(props.auth.uid)}
                    />
                </div>
            </div>
        </SuccessModal>

        <SuccessModal
            backdrop
            closeModal={() => props.closeLookAtTopThree(props.currentGameId)}
            error
            isOpen={props.currentGame.peakingAtTopThree.player
                === props.auth.uid && !props.haveClosedPeekModal}
            headerMessage="These are the top 3 cards"
        >
            <div className={props.styles.threeCardsWrapper}>

                {props.currentGame.peakingAtTopThree.cards.map((card, index) => (
                    <div
                        className={classNames({
                            [props.styles.liberal]: card === 1,
                            [props.styles.fascist]: card === -1
                        })}
                        index={`card-${index}`}
                    >
                        {card === 1 ? 'L' : 'F'}
                    </div>
                ))}
            </div>
        </SuccessModal>
    </>
);

Modals.defaultProps = {
    auth: {
        uid: ''
    },
    approveLeaveMidgameRequest: noop,
    closeLookAtTopThree: noop,
    currentGame: {
        approveLeaveMidgame: [],
        rejectLeaveMidgame: [],
        peakingAtTopThree: {
            player: '',
            cards: []
        },
        requestToEndGame: ''
    },
    currentGameId: '',
    haveClosedPeekModal: false,
    styles: defaultStyles,
    users: {}
};

Modals.propTypes = {
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    approveLeaveMidgameRequest: PropTypes.func,
    closeLookAtTopThree: PropTypes.func,
    currentGame: PropTypes.shape({
        approveLeaveMidgame: PropTypes.arrayOf(PropTypes.string),
        rejectLeaveMidgame: PropTypes.arrayOf(PropTypes.string),
        peakingAtTopThree: PropTypes.shape({
            player: PropTypes.string,
            cards: PropTypes.arrayOf(PropTypes.number)
        }),
        requestToEndGame: PropTypes.string
    }),
    currentGameId: PropTypes.string,
    haveClosedPeekModal: PropTypes.bool,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

export default Modals;
