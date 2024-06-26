import { USER_ROLE } from 'src/constants/common';

export const ROLES_DIV: {
  value: USER_ROLE;
  label: string;
}[] = [
  {
    value: USER_ROLE.FW,
    label: 'FW担当者' 
  },
  {
    value: USER_ROLE.SUBCONTRACTOR,
    label: '外注先',
  },
  {
    value: USER_ROLE.STOPPINGPOINT,
    label: '中継地',
  },
];
