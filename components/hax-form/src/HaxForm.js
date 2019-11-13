import { html, css, LitElement } from 'lit-element';

export class HaxForm extends LitElement {
  static get properties() {
    return {
      endpoint: { type: String },
      loading: { type: Boolean, reflect: true },
      formId: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  constructor() {
    super();
    this.endpoint = null;
    this.loading = false;
    this._form = null;
    this.formId = null;
  }

  /**
   * When the element first sets up add
   * an event listener to monitor any slot changes.
   * We do this to gather the children of the component.
   */
  firstUpdated() {
    this.shadowRoot
      .querySelector('slot')
      .addEventListener('slotchange', this.slotChangedHandler.bind(this));
  }

  disconnectedCallback() {
    this.shadowRoot
      .querySelector('slot')
      .removeEventListener('slotchange', this.slotChangedHandler.bind(this));
    super.disconnectedCallback();
  }

  /**
   * When new children are added look for a form element and
   * compture all submission events from that form.
   * @param {event} e 
   */
  slotChangedHandler(e) {
    // get all children
    const nodes = e.target.assignedNodes({ flatten: true });
    const form = [...nodes].find(i => i.nodeName === 'FORM');
    // if there is a form
    if (form) {
      this._form = form;
      form.addEventListener('submit', _e => {
        _e.preventDefault();
        this.submitForm();
      });
    }
  }

  /**
   * Collects all of the form values and submits
   * them to the endpoint
   */
  submitForm() {
    const form = this._form;

    if (!form) {
      console.error(`No form found.`);
    }

    if (this.endpoint) {
      const values = this.constructor.collectFormValues(form);
      const id = this.formId;

      fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          values,
        }),
      })
        .then(() => {
          this.loading = true;
        })
        .finally(() => {
          this.loading = false;
        });
    } else {
      console.error(`Endpoint not defined`);
    }
  }

  /**
   * Collect all values of a form
   * @param {DOM Node} form 
   * @return {object}
   *  - value
   *  - name
   */
  static collectFormValues(form) {
    const formItems = form.querySelectorAll('[name]');
    const values = [...formItems].map(i => ({ name: i.name, value: i.value }));
    return values;
  }

  render() {
    return html`
      <div id="slot">
        <slot></slot>
      </div>
    `;
  }
}
