import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { homeSelector, initApp as initAppAction } from './Home.sack';

import styles from './styles.css';

const HomePage = ({ initApp, initialized }) => {
  useEffect(() => {
    !initialized && initApp();
  });

  return (
    <div className={styles.body}>
      <h3>Hi Honey, I am Home!</h3>
      <p className={styles.p}>
        by the way, the app{' '}
        {`is${initialized ? ' initialized' : 'n"t initialized'}`}
      </p>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
