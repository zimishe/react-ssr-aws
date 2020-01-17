import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { homeSelector, initApp as initAppAction } from './Home.sack';

const HomePage = ({ initApp, initialized }) => {
  useEffect(() => {
    initApp();
  });

  return (
    <div>
      <h3>Hi Honey, I am Home!</h3>
      <p>app status: {initialized}</p>
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
