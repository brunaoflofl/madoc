import { TextQuestion } from '../shared//text-question';

export class InputTextQuestion extends TextQuestion {
  mask: [] | boolean;

  constructor() {
    super();
  }

  build(input: any) {
    super.build(input);
    this.mask = input.mask ? eval(input.mask.replace(/\\/g, '\\')) : false;
    console.log('input.mask', input.mask);
  }
}
