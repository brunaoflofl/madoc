import { MultiLineTextQuestion } from '../shared//multiline-text-question';



export class RichTextQuestion extends MultiLineTextQuestion {

  constructor() {
    super();
  }

  build(input: any) {
    super.build(input);
  }

  isEqualDefaultValue() {
    return this.strip_html_tags(this.answer) === this.strip_html_tags(this.defaultValue);
  }

  strip_html_tags(str) {
    return (str != null && str.trim() !== '') ? str.toString().trim().replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ').replace(/\r?\n|\r/g) : null;
  }
}
