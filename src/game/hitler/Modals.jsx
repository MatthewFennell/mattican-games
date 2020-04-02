/* eslint-disable react/no-array-index-key */
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
import * as constants from '../../constants';

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
            closeModal={() => props.closeLookAtTopThreeRequest(props.currentGameId)}
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
                        key={`card-${index}`}
                    >
                        {card === 1 ? 'L' : 'F'}
                    </div>
                ))}
            </div>
        </SuccessModal>
        <SuccessModal
            backdrop
            closeModal={() => props.closeLookAtInvestigationRequest(props.currentGameId, true)}
            error
            isOpen={props.currentGame.firstInvestigation.player
                === props.auth.uid && !props.haveClosedFirstInvestigation}
            headerMessage={`Identity of ${helpers.mapUserIdToName(props.users, props.currentGame.firstInvestigation.investigated)}`}
        >
            <div className={props.styles.showInvestigatedCardWrapper}>
                <div>
                    {`You looked at ${helpers.mapUserIdToName(props.users, props.currentGame.firstInvestigation.investigated)}s card`}
                </div>
                <div>
                    {`They are ${props.currentGame.firstInvestigation.role === constants.hitlerRoles.Liberal ? 'Liberal' : 'Fascist'}`}
                </div>
                <div
                    className={classNames({
                        [props.styles.liberal]: props.currentGame.firstInvestigation.role
                        === constants.hitlerRoles.Liberal,
                        [props.styles.fascist]: props.currentGame.firstInvestigation.role
                        !== constants.hitlerRoles.Liberal
                    })}
                >
                    {props.currentGame.firstInvestigation.role === constants.hitlerRoles.Liberal ? 'L' : 'F'}
                </div>
            </div>
        </SuccessModal>
        <SuccessModal
            backdrop
            closeModal={() => props.closeLookAtInvestigationRequest(props.currentGameId, false)}
            error
            isOpen={props.currentGame.secondInvestigation.player
                === props.auth.uid && !props.haveClosedSecondInvestigation}
            headerMessage={`Identity of ${helpers.mapUserIdToName(props.users, props.currentGame.secondInvestigation.investigated)}`}
        >
            <div className={props.styles.showInvestigatedCardWrapper}>
                <div>
                    {`You looked at ${helpers.mapUserIdToName(props.users, props.currentGame.secondInvestigation.investigated)}s card`}
                </div>
                <div>
                    {`They are ${props.currentGame.secondInvestigation.role === constants.hitlerRoles.Liberal ? 'Liberal' : 'Fascist'}`}
                </div>
                <div
                    className={classNames({
                        [props.styles.liberal]: props.currentGame.secondInvestigation.role
                        === constants.hitlerRoles.Liberal,
                        [props.styles.fascist]: props.currentGame.secondInvestigation.role
                        !== constants.hitlerRoles.Liberal
                    })}
                >
                    {props.currentGame.secondInvestigation.role === constants.hitlerRoles.Liberal ? 'L' : 'F'}
                </div>
            </div>
        </SuccessModal>
    </>
);

Modals.defaultProps = {
    auth: {
        uid: ''
    },
    approveLeaveMidgameRequest: noop,
    closeLookAtTopThreeRequest: noop,
    closeLookAtInvestigationRequest: noop,
    currentGame: {
        approveLeaveMidgame: [],
        firstInvestigation: {
            player: '',
            role: '',
            investigated: ''
        },
        secondInvestigation: {
            player: '',
            role: '',
            investigated: ''
        },
        rejectLeaveMidgame: [],
        peakingAtTopThree: {
            player: '',
            cards: []
        },
        requestToEndGame: ''
    },
    currentGameId: '',
    haveClosedPeekModal: false,
    haveClosedFirstInvestigation: false,
    haveClosedSecondInvestigation: false,
    styles: defaultStyles,
    users: {}
};

Modals.propTypes = {
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    approveLeaveMidgameRequest: PropTypes.func,
    closeLookAtTopThreeRequest: PropTypes.func,
    closeLookAtInvestigationRequest: PropTypes.func,
    currentGame: PropTypes.shape({
        approveLeaveMidgame: PropTypes.arrayOf(PropTypes.string),
        firstInvestigation: PropTypes.shape({
            player: PropTypes.string,
            role: PropTypes.string,
            investigated: PropTypes.string
        }),
        secondInvestigation: PropTypes.shape({
            player: PropTypes.string,
            role: PropTypes.string,
            investigated: PropTypes.string
        }),
        rejectLeaveMidgame: PropTypes.arrayOf(PropTypes.string),
        peakingAtTopThree: PropTypes.shape({
            player: PropTypes.string,
            cards: PropTypes.arrayOf(PropTypes.number)
        }),
        requestToEndGame: PropTypes.string
    }),
    currentGameId: PropTypes.string,
    haveClosedPeekModal: PropTypes.bool,
    haveClosedFirstInvestigation: PropTypes.bool,
    haveClosedSecondInvestigation: PropTypes.bool,
    styles: PropTypes.objectOf(PropTypes.string),
    users: PropTypes.shape({})
};

export default Modals;
