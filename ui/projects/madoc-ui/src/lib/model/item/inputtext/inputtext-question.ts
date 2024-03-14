import { TextQuestion } from '../shared//text-question';

export class InputTextQuestion extends TextQuestion {
  mask: [] | boolean;
  validationType = '';

  constructor() {
    super();
  }

  build(input: any) {
    super.build(input);
    this.mask = input.mask ? eval(input.mask.replace(/\\/g, '\\')) : false;
    this.validationType = input.validationType;
    console.log('input.validationType', input.validationType);
  }
}
