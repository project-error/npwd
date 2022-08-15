module.exports = {
  pefcl: () => {
    return import('pefcl/config');
  },
  npwd_esx_garage: () => {
    return import('npwd_esx_garage/config');
  },
  npwd_qb_garage: () => {
    return import('npwd_qb_garage/config');
  },
};
