import React from 'react';

export const meta = { layout: 'DEFAULT_TEMPLATE_MARKER' };

export default ({ children }: any): JSX.Element => {
  return (
    <>
      <span>DEFAULT_TEMPLATE_MARKER</span>
      <div>{children}</div>
    </>
  );
};
