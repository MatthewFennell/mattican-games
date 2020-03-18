import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import defaultStyles from './Overview.module.scss';
import StyledButton from '../common/StyledButton/StyledButton';
import SuccessModal from '../common/modal/SuccessModal';
import Dropdown from '../common/dropdown/Dropdown';
import TextInput from '../common/TextInput/TextInput';
import Fade from '../common/Fade/Fade';
import Switch from '../common/Switch/Switch';
import * as constants from '../constants';
import { createGameRequest } from './actions';
import Spinner from '../common/spinner/Spinner';

const shouldBeDisabled = (numberOfPlayers, activeAvalonRoles, role) => {
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

const Overview = props => {
    const [creatingGame, setCreatingGame] = useState(false);
    const [gameMode, setGameMode] = useState('');
    const [numberOfPlayers, setNumberOfPlayers] = useState(5);

    const [activeAvalonRoles, setActiveAvalonRoles] = useState([]);

    const toggleRole = useCallback(role => {
        if (activeAvalonRoles.includes(role)) {
            setActiveAvalonRoles(activeAvalonRoles.filter(x => x !== role));
        } else {
            setActiveAvalonRoles([...activeAvalonRoles, role]);
        }
    }, [setActiveAvalonRoles, activeAvalonRoles]);

    const changeNumberOfPlayers = useCallback(numPlayers => {
        if (numPlayers <= 6) {
            setActiveAvalonRoles(activeAvalonRoles.filter(x => x.isGood));
        }
        setNumberOfPlayers(numPlayers);
    }, [setActiveAvalonRoles, setNumberOfPlayers, activeAvalonRoles]);

    const createGame = useCallback(() => {
        let roles = [];

        if (gameMode === constants.gameModes.Avalon) {
            roles = activeAvalonRoles;
        }

        props.createGameRequest(gameMode, numberOfPlayers, roles);
        setCreatingGame(false);

        // eslint-disable-next-line
    }, [activeAvalonRoles, gameMode, numberOfPlayers]);

    return (
        <div className={props.styles.overviewWrapper}>
            <div className={props.styles.createGameWrapper}>
                <StyledButton text="Create Game" onClick={() => setCreatingGame(true)} />
            </div>

            <SuccessModal
                closeModal={() => setCreatingGame(false)}
                isOpen={creatingGame}
                headerMessage="Creating game"
            >
                <div className={props.styles.createGameModalWrapper}>
                    <Dropdown
                        options={Object.values(constants.gameModes).map(mode => ({
                            id: mode,
                            value: mode,
                            text: mode
                        }))}
                        value={gameMode}
                        onChange={setGameMode}
                        title="Choose a game"
                    />
                </div>
                <TextInput
                    onChange={changeNumberOfPlayers}
                    value={numberOfPlayers}
                    type="number"
                    label="Number of players (5-10)"
                />

                <Fade checked={gameMode === constants.gameModes.Avalon} label="Test">
                    <div>
                        <div className={props.styles.avalonRolesMessage}>
                            Roles
                        </div>
                        <div className={props.styles.goodGuyRoles}>
                            {Object.values(constants.avalonRoles)
                                .filter(role => role.isGood).map(role => (
                                    <div className={props.styles.roleWrapper}>
                                        <div className={props.styles.avalonGoodRoleName}>
                                            {role.name}
                                        </div>
                                        <Switch
                                            checked={activeAvalonRoles.includes(role.name)}
                                            onChange={() => toggleRole(role.name)}
                                            color="primary"
                                        />
                                    </div>
                                ))}
                        </div>

                        <div className={props.styles.badGuyRoles}>
                            {Object.values(constants.avalonRoles)
                                .filter(role => !role.isGood).map(role => (
                                    <div className={props.styles.roleWrapper}>
                                        <div className={props.styles.avalonBadRoleName}>
                                            {role.name}
                                        </div>
                                        <Switch
                                            checked={activeAvalonRoles.includes(role.name)}
                                            onChange={() => toggleRole(role.name)}
                                            color="secondary"
                                            disabled={shouldBeDisabled(numberOfPlayers,
                                                activeAvalonRoles, role.name)}
                                        />
                                    </div>
                                ))}
                        </div>
                    </div>
                </Fade>
                <div className={props.styles.createGameWrapper}>
                    <StyledButton text="Create Game" onClick={createGame} />
                </div>

            </SuccessModal>

            {props.creatingGame && (
                <div className={props.styles.spinnerWrapper}>
                    <Spinner color="secondary" />
                </div>
            )}
        </div>
    );
};

Overview.defaultProps = {
    creatingGame: false,
    styles: defaultStyles
};

Overview.propTypes = {
    createGameRequest: PropTypes.func.isRequired,
    creatingGame: PropTypes.bool,
    styles: PropTypes.objectOf(PropTypes.string)
};

const mapDispatchToProps = {
    createGameRequest
};

const mapStateToProps = state => ({
    creatingGame: state.overview.creatingGame
});

export default connect(mapStateToProps, mapDispatchToProps)(Overview);

export { Overview as OverviewUnconnected };
