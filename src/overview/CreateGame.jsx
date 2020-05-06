import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import defaultStyles from './CreateGame.module.scss';
import StyledButton from '../common/StyledButton/StyledButton';
import SuccessModal from '../common/modal/SuccessModal';
import Dropdown from '../common/dropdown/Dropdown';
import TextInput from '../common/TextInput/TextInput';
import Fade from '../common/Fade/Fade';
import Switch from '../common/Switch/Switch';
import * as constants from '../constants';
import Spinner from '../common/spinner/Spinner';
import { gameHasSetNumberOfPlayers } from '../game/helpers';

export const shouldBeDisabled = (numberOfPlayers, activeAvalonRoles, role) => {
    if (numberOfPlayers > 6) {
        return false;
    }

    if (activeAvalonRoles.includes(role)) {
        return false;
    }

    const numberOfCurrentBadGuys = Object.values(constants.avalonRoles)
        .filter(x => !x.isGood)
        .reduce((acc, cur) => acc + activeAvalonRoles.includes(cur.name), 0);

    return numberOfCurrentBadGuys >= 2;
};

const CreateGame = props => (
    <>
        <div className={props.styles.createGameWrapper}>
            <StyledButton text="Create Game" onClick={() => props.setMakingGame(true)} />
        </div>
        <SuccessModal
            closeModal={() => props.setMakingGame(false)}
            isOpen={props.makingGame}
            headerMessage="Creating game"
        >
            <div className={props.styles.createGameModalWrapper}>
                <Dropdown
                    options={Object.values(constants.gameModes).map(mode => ({
                        id: mode,
                        value: mode,
                        text: mode
                    }))}
                    value={props.gameMode}
                    onChange={props.setGameMode}
                    title="Choose a game"
                />
            </div>
            {gameHasSetNumberOfPlayers(props.gameMode)
            && (
                <TextInput
                    onChange={props.changeNumberOfPlayers}
                    value={props.numberOfPlayers}
                    type="number"
                    label="Number of players (5-10)"
                />
            )}
            <TextInput
                onChange={props.setGameName}
                value={props.gameName}
                label="Game Name"
            />

            <Fade checked={props.gameMode === constants.gameModes.WhosInTheHat} label="WhosInHat">
                <div className={props.styles.skippingRules}>
                    <div>
                        <Dropdown
                            options={Object.keys(constants.whoInHatSkipping).map(mode => ({
                                id: mode,
                                value: mode,
                                text: constants.whoInHatSkipping[mode]
                            }))}
                            value={props.skippingRule}
                            onChange={props.setSkippingRule}
                            title="Skipping"
                        />
                    </div>
                    <div>
                        <div>
                            Custom Names
                        </div>
                        <Switch
                            checked={props.isCustomNames}
                            onChange={props.toggleCustomNames}
                            color="primary"
                        />
                    </div>

                </div>
                {!props.isCustomNames
                && (
                    <div className={props.styles.scoreCap}>
                        <TextInput
                            type="number"
                            value={props.scoreCap}
                            onChange={props.setScoreCap}
                            label="Score cap"
                        />
                    </div>
                )}

                <div className={props.styles.timePerRound}>
                    <TextInput
                        type="number"
                        value={props.timePerRound}
                        onChange={props.setTimePerRound}
                        label="Time to guess (seconds)"
                    />
                </div>
            </Fade>

            <Fade checked={props.gameMode === constants.gameModes.Articulate} label="Articulate">
                <div className={props.styles.skippingRules}>
                    <Dropdown
                        options={Object.keys(constants.articulateSkipping).map(mode => ({
                            id: mode,
                            value: mode,
                            text: constants.articulateSkipping[mode]
                        }))}
                        value={props.skippingRule}
                        onChange={props.setSkippingRule}
                        title="Skipping"
                    />
                </div>
                <div className={props.styles.timePerRound}>
                    <TextInput
                        type="number"
                        value={props.timePerRound}
                        onChange={props.setTimePerRound}
                        label="Time to guess (seconds)"
                    />
                </div>
            </Fade>

            <Fade checked={props.gameMode === constants.gameModes.Avalon} label="Test">
                <div>
                    <div className={props.styles.avalonRolesMessage}>
                Roles
                    </div>
                    <div className={props.styles.goodGuyRoles}>
                        {Object.values(constants.avalonRoles)
                            .filter(role => role.isGood).filter(role => role.isSpecial)
                            .map(role => (
                                <div className={props.styles.roleWrapper} key={role.name}>
                                    <div className={props.styles.avalonGoodRoleName}>
                                        {role.name}
                                    </div>
                                    <Switch
                                        checked={props.activeAvalonRoles.includes(role.name)}
                                        onChange={() => props.toggleRole(role.name)}
                                        color="primary"
                                    />
                                </div>
                            ))}
                    </div>

                    <div className={props.styles.badGuyRoles}>
                        {Object.values(constants.avalonRoles)
                            .filter(role => !role.isGood).filter(role => role.isSpecial)
                            .map(role => (
                                <div className={props.styles.roleWrapper} key={role.name}>
                                    <div className={props.styles.avalonBadRoleName}>
                                        {role.name}
                                    </div>
                                    <Switch
                                        checked={props.activeAvalonRoles.includes(role.name)}
                                        onChange={() => props.toggleRole(role.name)}
                                        color="secondary"
                                        disabled={shouldBeDisabled(props.numberOfPlayers,
                                            props.activeAvalonRoles, role.name)}
                                    />
                                </div>
                            ))}
                    </div>
                </div>
            </Fade>
            <div className={props.styles.createGameWrapper}>
                <StyledButton text="Create Game" onClick={props.createGame} />
            </div>

        </SuccessModal>

        {props.creatingGame && (
            <div className={props.styles.spinnerWrapper}>
                <Spinner color="secondary" />
            </div>
        )}
    </>
);

CreateGame.defaultProps = {
    activeAvalonRoles: [],
    changeNumberOfPlayers: noop,
    creatingGame: false,
    createGame: noop,
    gameMode: '',
    gameName: '',
    isCustomNames: false,
    numberOfPlayers: 0,
    makingGame: false,
    scoreCap: 0,
    setGameMode: noop,
    setGameName: noop,
    setMakingGame: noop,
    setScoreCap: noop,
    setSkippingRule: noop,
    setTimePerRound: noop,
    skippingRule: '',
    timePerRound: 0,
    toggleCustomNames: noop,
    toggleRole: noop,
    styles: defaultStyles
};

CreateGame.propTypes = {
    activeAvalonRoles: PropTypes.arrayOf(PropTypes.string),
    changeNumberOfPlayers: PropTypes.func,
    creatingGame: PropTypes.bool,
    createGame: PropTypes.func,
    gameMode: PropTypes.string,
    gameName: PropTypes.string,
    isCustomNames: PropTypes.bool,
    numberOfPlayers: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    makingGame: PropTypes.bool,
    scoreCap: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    setGameMode: PropTypes.func,
    setGameName: PropTypes.func,
    setMakingGame: PropTypes.func,
    setScoreCap: PropTypes.func,
    setSkippingRule: PropTypes.func,
    setTimePerRound: PropTypes.func,
    skippingRule: PropTypes.string,
    timePerRound: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    toggleCustomNames: PropTypes.func,
    toggleRole: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string)
};

export default CreateGame;
