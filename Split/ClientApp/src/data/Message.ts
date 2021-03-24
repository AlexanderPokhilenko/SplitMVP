export default class Message {
    private static dateFormatter = new Intl.DateTimeFormat('default', {dateStyle: "short"});
    private static timeFormatter = new Intl.DateTimeFormat('default', {timeStyle: "short"});

    constructor(public id: number,
                public text: string,
                public authorId: number,
                public date: Date | string = new Date()/*,
                public filesSrc: string[] = []*/) {
    }

    public static getDateTimeStr(date: Date | string): string {
        const dateTime = date instanceof Date ? date : new Date(date);
        const oneDayMs = 60 * 60 * 24 * 1000;
        const dayAgo = Date.now() - oneDayMs;
        const isOld = dayAgo >= dateTime.getTime();
        return isOld ? Message.dateFormatter.format(dateTime) : Message.timeFormatter.format(dateTime);
    }
}
