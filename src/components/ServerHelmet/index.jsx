import React from 'react';
import Helmet from 'react-helmet';

const ServerHelmet = () => {
  const head = Helmet.renderStatic();

  return (
    <>
      {head.base.toComponent()}
      {head.title.toComponent()}
      {head.meta.toComponent()}
      {head.link.toComponent()}
      {head.script.toComponent()}
    </>
  );
};

export default ServerHelmet;
