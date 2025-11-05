const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host { display: inline-flex; align-items: center; }
    .chip { background: #eef2ff; color: #3730a3; padding: 4px 10px; border-radius: 9999px; display: inline-flex; align-items: center; gap: 8px; }
    .close { border: none; background: transparent; cursor: pointer; }
  </style>
  <div class="chip">
    <span class="label"><slot></slot></span>
    <button class="close" aria-label="close">✕</button>
  </div>
`;

export class MyChip extends HTMLElement {
  static get observedAttributes() {
    return ['label', 'dismissible'];
  }

  private labelEl!: HTMLElement;
  private dismissible!: boolean;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: inline-flex;
        align-items: center;
        background: #eee;
        border-radius: 16px;
        padding: 4px 8px;
        margin: 4px;
        font-size: 0.9rem;
        color: #333;
      }
      .close {
        margin-left: 8px;
        cursor: pointer;
        font-weight: bold;
      }
    `;

    const wrapper = document.createElement('span');
    this.labelEl = document.createElement('span');
    this.labelEl.classList.add('label');

    wrapper.appendChild(this.labelEl);
    shadow.appendChild(style);
    shadow.appendChild(wrapper);
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    if (name === 'label') {
      this.labelEl.textContent = newValue ?? '';
    }
    if (name === 'dismissible') {
      this.render();
    }
  }

  render() {
    const shadow = this.shadowRoot!;
    const existingClose = shadow.querySelector('.close');
    if (existingClose) existingClose.remove();

    this.labelEl.textContent = this.getAttribute('label') ?? '';

    if (this.hasAttribute('dismissible')) {
      const close = document.createElement('span');
      close.textContent = '×';
      close.className = 'close';
      close.addEventListener('click', () => this.remove());
      shadow.appendChild(close);
    }
  }
}

customElements.define('my-chip', MyChip);
