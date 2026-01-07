const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: inline-flex;
      align-items: center;
      background: #eee;
      border-radius: 16px;
      padding: 6px 10px;
      margin: 4px;
      font-size: 0.9rem;
      color: #333;
      font-family: sans-serif;
      transition: opacity 0.5s ease;
      opacity: 1;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .close {
      margin-left: 8px;
      cursor: pointer;
      font-weight: bold;
      background: transparent;
      border: none;
      color: inherit;
    }
  </style>
  <div class="chip">
    <span class="label"><slot></slot></span>
    <button class="close" aria-label="close">✕</button>
  </div>
`;

export class MyChip extends HTMLElement {
  static get observedAttributes() {
    return [
      'label',
      'dismissible',
      'background',
      'color',
      'font-family',
      'font-size',
      'disappear-after',
    ];
  }

  private labelEl!: HTMLElement;
  private closeBtn!: HTMLButtonElement;
  private disappearTimeout?: number;
  private readonly handleClose: () => void;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));

    this.labelEl = shadow.querySelector('.label')!;
    this.closeBtn = shadow.querySelector('.close')!;
    
    // Wiązanie metody do instancji, aby removeEventListener działał poprawnie
    this.handleClose = () => this.remove();
  }

  connectedCallback() {
    this.render();
    this.applyCustomStyles();
    this.startDisappearTimer();

    this.closeBtn.addEventListener('click', this.handleClose);
  }

  disconnectedCallback() {
    this.closeBtn.removeEventListener('click', this.handleClose);
    if (this.disappearTimeout) clearTimeout(this.disappearTimeout);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'label':
      case 'dismissible':
        this.render();
        break;
      case 'background':
      case 'color':
      case 'font-family':
      case 'font-size':
        this.applyCustomStyles();
        break;
      case 'disappear-after':
        this.startDisappearTimer();
        break;
    }
  }

  render() {
    const labelAttr = this.getAttribute('label');
    if (labelAttr) this.labelEl.textContent = labelAttr;

    // Pokaż / ukryj przycisk zamknięcia
    if (this.hasAttribute('dismissible')) {
      this.closeBtn.style.display = 'inline';
    } else {
      this.closeBtn.style.display = 'none';
    }
  }

  applyCustomStyles() {
    const style = this.style;
    if (this.hasAttribute('background')) style.background = this.getAttribute('background')!;
    if (this.hasAttribute('color')) style.color = this.getAttribute('color')!;
    if (this.hasAttribute('font-family')) style.fontFamily = this.getAttribute('font-family')!;
    if (this.hasAttribute('font-size')) style.fontSize = this.getAttribute('font-size')!;
  }

  startDisappearTimer() {
    if (this.disappearTimeout) clearTimeout(this.disappearTimeout);

    const delayAttr = this.getAttribute('disappear-after');
    if (!delayAttr) return;

    const delay = parseInt(delayAttr, 10);
    if (isNaN(delay) || delay <= 0) return;

    this.disappearTimeout = window.setTimeout(() => {
      this.style.opacity = '0';
      setTimeout(() => this.remove(), 500);
    }, delay);
  }
}

customElements.define('my-chip', MyChip);
