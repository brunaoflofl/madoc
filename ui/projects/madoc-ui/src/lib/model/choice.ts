export class Choice {

  public constructor(public id: string, public display: string,
                     public answer: any, public valid = true, public actions = true) { }
}
