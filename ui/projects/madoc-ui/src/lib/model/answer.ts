
export class Answer {
  public other: string;

  public constructor(public value?: any, public display?: string, public selected?: boolean) {}

  public toString() {
    return this.value;
  }
}
