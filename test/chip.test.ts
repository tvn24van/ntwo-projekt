import '../src/index';
describe('MyChip', () => {
  it('creates element', () => {
    const el = document.createElement('my-chip');
    document.body.appendChild(el);
    expect(el).toBeInstanceOf(HTMLElement);
  });
});