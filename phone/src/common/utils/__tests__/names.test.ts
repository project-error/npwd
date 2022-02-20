import { getInitials } from '../names';

describe('util: getInitials', () => {
  test('should return initials for valid name', () => {
    expect(getInitials('Charles Carlsberg')).toBe('CC');
  });

  test('should return initials for only firstname', () => {
    expect(getInitials('Charles')).toBe('C');
  });

  test('should return initials for no name', () => {
    expect(getInitials('')).toBe('');
  });

  test('should return handle multiple names', () => {
    expect(getInitials('Charles Von Carlsberg')).toBe('CV');
  });
});
