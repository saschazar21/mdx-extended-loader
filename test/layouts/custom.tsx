import React from 'react';

export const config = { amp: true };

export default ({ children }: any): JSX.Element => {
  return (
    <>
      <span>CUSTOM_TEMPLATE_MARKER</span>
      <main>{children}</main>
    </>
  );
};
