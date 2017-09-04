/* eslint-disable max-len */
import evenOddRowStyle from './evenOddRowStyle';

describe('evenOddRowStyle', () => {
  const evenRowBackground = 'black';
  const oddRowBackground = 'yellow';

  it('should return evenRowBackground if row and column are even', () => {
    const result = evenOddRowStyle({
      evenRowBackground,
      oddRowBackground,
      rowIndex: 0,
      columnIndex: 0,
    });

    expect(result).toEqual({backgroundColor: evenRowBackground});
  });

  it('should return oddRowBackground if row is even but column is odd', () => {
    const result = evenOddRowStyle({
      evenRowBackground,
      oddRowBackground,
      rowIndex: 0,
      columnIndex: 1,
    });

    expect(result).toEqual({backgroundColor: oddRowBackground});
  });

  it('should return oddRowBackground if row is odd but column is even', () => {
    const result = evenOddRowStyle({
      evenRowBackground,
      oddRowBackground,
      rowIndex: 1,
      columnIndex: 2,
    });

    expect(result).toEqual({backgroundColor: oddRowBackground});
  });

  it('should return evenRowBackground if row is odd and column is odd', () => {
    const result = evenOddRowStyle({
      evenRowBackground,
      oddRowBackground,
      rowIndex: 1,
      columnIndex: 1,
    });

    expect(result).toEqual({backgroundColor: evenRowBackground});
  });
});
