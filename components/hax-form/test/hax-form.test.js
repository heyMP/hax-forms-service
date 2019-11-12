import { html, fixture, expect } from '@open-wc/testing';

import '../hax-form.js';

describe('HaxForm', () => {
  it('has a default title "Hey there" and counter 5', async () => {
    const el = await fixture(html`
      <hax-form></hax-form>
    `);

    expect(el.title).to.equal('Hey there');
    expect(el.counter).to.equal(5);
  });

  it('shows initially the text "hey there Nr. 5!" and an "increment" button', async () => {
    const el = await fixture(html`
      <hax-form></hax-form>
    `);

    expect(el).shadowDom.to.equal(`
      <h2>Hey there Nr. 5!</h2>
      <button>increment</button>
    `);
  });

  it('increases the counter on button click', async () => {
    const el = await fixture(html`
      <hax-form></hax-form>
    `);
    el.shadowRoot.querySelector('button').click();

    expect(el.counter).to.equal(6);
  });

  it('can override the title via attribute', async () => {
    const el = await fixture(html`
      <hax-form title="attribute title"></hax-form>
    `);

    expect(el.title).to.equal('attribute title');
  });
});
