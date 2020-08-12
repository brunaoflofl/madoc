import {Question} from '../question';


export class DecimalQuestion extends Question {
  public mask: string;

  public constructor() {
    super();
  }

  build(input: any) {
    super.build(input);
    this.mask = input.mask;
  }
}
