export class Message {
  constructor(public id: number,
              public text: string,
              public authorId: number,
              public dateTime: Date = new Date(),
              public filesSrc: string[] = []) {
  }
}
