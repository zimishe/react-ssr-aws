import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
// import withStyles from 'isomorphic-style-loader/withStyles';

import { homeSelector, initApp as initAppAction } from './Home.sack';

import styles from './styles.css';

const HomePage = ({ initApp, initialized }) => {
  const onButtonClick = () => {
    initApp();
  };

  return (
    <div className={styles.body}>
      <h3>Hi Honey, I am Home!</h3>
      <p className={styles.p}>
        by the way, the app{' '}
        {`is${initialized ? ' initialized' : 'n"t initialized'}`}
      </p>
      <button type="button" onClick={onButtonClick}>
        button
      </button>
    </div>
  );
};

const mapStateToProps = state => ({
  initialized: homeSelector(state).initialized,
});

const mapDispatchToProps = {
  initApp: initAppAction,
};

HomePage.propTypes = {
  initialized: PropTypes.bool,
  initApp: PropTypes.func,
};

export default compose(
  // withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(HomePage);
