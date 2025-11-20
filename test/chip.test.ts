/**
 * @jest-environment jsdom
 */
import '../src/index';

describe('<my-chip> component', () => {
  let chip;

  beforeEach(() => {
    chip = document.createElement('my-chip');
    document.body.appendChild(chip);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.useRealTimers();
  });

  test('renders with default structure', () => {
    const shadow = chip.shadowRoot;
    expect(shadow.querySelector('.label')).toBeTruthy();
    expect(shadow.querySelector('.close')).toBeTruthy();
  });

  test('applies label attribute correctly', () => {
    chip.setAttribute('label', 'Hello');
    expect(chip.shadowRoot.querySelector('.label').textContent).toBe('Hello');
  });

  test('shows close button when dismissible is set', () => {
    chip.setAttribute('dismissible', '');
    const btn = chip.shadowRoot.querySelector('.close');
    expect(btn.style.display).toBe('inline');
  });

  test('hides close button when dismissible is removed', () => {
    chip.setAttribute('dismissible', '');
    chip.removeAttribute('dismissible');
    const btn = chip.shadowRoot.querySelector('.close');
    expect(btn.style.display).toBe('none');
  });

  test('applies custom background, color, font-family and font-size', () => {
    chip.setAttribute('background', 'red');
    chip.setAttribute('color', 'white');
    chip.setAttribute('font-family', 'serif');
    chip.setAttribute('font-size', '20px');

    const style = chip.style;
    expect(style.background).toBe('red');
    expect(style.color).toBe('white');
    expect(style.fontFamily).toBe('serif');
    expect(style.fontSize).toBe('20px');
  });

  test('clicking close button removes element', () => {
    chip.setAttribute('dismissible', '');
    const btn = chip.shadowRoot.querySelector('.close');
    btn.click();
    expect(document.body.contains(chip)).toBe(false);
  });

  test('startDisappearTimer removes element after given time', () => {
    jest.useFakeTimers();
    chip.setAttribute('disappear-after', '1000');

    const removeSpy = jest.spyOn(chip, 'remove');
    chip.startDisappearTimer();

    jest.advanceTimersByTime(1000);
    expect(chip.style.opacity).toBe('0');

    jest.advanceTimersByTime(500);
    expect(removeSpy).toHaveBeenCalled();
  });

  test('invalid disappear-after value does nothing', () => {
    jest.useFakeTimers();
    chip.setAttribute('disappear-after', '-1');
    const spy = jest.spyOn(chip, 'remove');

    chip.startDisappearTimer();
    jest.advanceTimersByTime(2000);
    expect(spy).not.toHaveBeenCalled();
  });

  test('clears timeout on disconnect', () => {
    jest.useFakeTimers();
    chip.setAttribute('disappear-after', '2000');
    chip.startDisappearTimer();

    const clearSpy = jest.spyOn(global, 'clearTimeout');
    chip.disconnectedCallback();
    expect(clearSpy).toHaveBeenCalled();
  });

  test('re-renders when attributes change', () => {
    const renderSpy = jest.spyOn(chip, 'render');
    chip.setAttribute('label', 'Changed');
    expect(renderSpy).toHaveBeenCalled();
  });
});
