import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import defaultStyles from './Game.module.scss';

const Game = props => (
    <div className={props.styles.gameWrapper}>
            In a game
    </div>
);

Game.defaultProps = {
    styles: defaultStyles
};

Game.propTypes = {
    styles: PropTypes.objectOf(PropTypes.string)
};

const mapDispatchToProps = {
};

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);

export { Game as GameUnconnected };
