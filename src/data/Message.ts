export default class Message {
  private static dateFormatter = new Intl.DateTimeFormat("default", {
    dateStyle: "short"
  } as any);
  private static timeFormatter = new Intl.DateTimeFormat("default", {
    timeStyle: "short"
  } as any);

  constructor(
    public id: number,
    public text: string,
    public authorId: number,
    public dateTime: Date = new Date(),
    public filesSrc: string[] = []
  ) {}

  get dateTimeStr(): string {
    const oneDayMs = 60 * 60 * 24 * 1000;
    const dayAgo = Date.now() - oneDayMs;
    const isOld = dayAgo >= this.dateTime.getTime();
    return isOld
      ? Message.dateFormatter.format(this.dateTime)
      : Message.timeFormatter.format(this.dateTime);
  }
}
