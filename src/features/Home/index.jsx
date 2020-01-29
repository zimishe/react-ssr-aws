import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import { homeSelector, loadHomeDataSaga } from './Home.sack';
import BetImage from '../../assets/images/bet.jpg';

import styles from './styles.css';

const HomePage = ({ initialized, data }) => {
  return (
    <>
      <Helmet>
        <title>Home page</title>
      </Helmet>
      <div className={styles.body}>
        <h3>Hi Honey, I am Home!</h3>
        <img src={BetImage} alt="" />
        <p className={styles.p}>
          by the way, the app{' '}
          {`is${initialized ? ' initialized' : 'n"t initialized'}`}
        </p>
        <div className={styles.categories}>
          <h5>Categories</h5>
          {data.map(({ id, name }) => (
            <span className={styles.category} key={id}>
              {name}
            </span>
          ))}
        </div>
        <button type="button">button</button>
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  initialized: homeSelector(state).initialized,
  data: homeSelector(state).data,
});

HomePage.propTypes = {
  initialized: PropTypes.bool,
  data: PropTypes.array,
};

HomePage.preload = () => [[loadHomeDataSaga, { language: 'en' }]];

export default connect(mapStateToProps)(HomePage);
