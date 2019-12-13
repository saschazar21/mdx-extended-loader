import React from 'react';

export default ({ children }: any): JSX.Element => {
  return (
    <>
      <span>DEFAULT_TEMPLATE_MARKER</span>
      <div>{children}</div>
    </>
  );
};
