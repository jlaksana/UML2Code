function add(a: number, b: number): number {
  return a + b;
}

describe('add', () => {
  it('should do something', () => {
    expect(add(1, 2)).toBe(3);
  });
});
