export const getInitials = (fullname: string) => {
  if (!fullname) {
    return '';
  }

  const [firstname, lastname] = fullname.split(' ');

  return `${firstname[0]}${lastname?.[0] ?? ''}`;
};
