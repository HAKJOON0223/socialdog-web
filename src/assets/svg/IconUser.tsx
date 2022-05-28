import React from 'react';
import { theme } from 'assets/styles/theme';
import { IIconprops } from 'assets/interface-icon';

function IconUser({ size, color }: IIconprops) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size}>
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill={color}
        d="M20 22h-2v-2a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v2H4v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v2zm-8-9a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
      />
    </svg>
  );
}

IconUser.defaultProps = {
  size: 24,
  color: theme.color.achromatic.black,
};
export default IconUser;
