// Some remnants of the migration to Material UI v5
const themeOverrides = {
  components: {
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'unset' } },
    },
  },
};

export default themeOverrides;
