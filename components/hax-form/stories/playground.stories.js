/* eslint-disable import/extensions */
import { html } from 'lit-html';
import { withKnobs, withWebComponentsKnobs, text } from '@open-wc/demoing-storybook';

import '../hax-form.js';

export default {
  title: 'HaxForm|Playground',
  component: 'hax-form',
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: { options: { selectedPanel: 'storybookjs/knobs/panel' } },
};

export const singleComponent = () => html`
  <hax-form></hax-form>
`;

export const manualContent = () => html`
  <hax-form>
    <p>${text('Content', 'Some text', 'Properties')}</p>
  </hax-form>
`;
