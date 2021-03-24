import { makeAutoObservable } from "mobx";

export default class Dialog {
    constructor(public id: number,
                public name: string | null,
                public imageUrl: string | null,
                public membersIds: number[],
                public lastReadMessageId: number = 0) {
        makeAutoObservable(this);
    }

    public static checkIsDirect(dialog: Dialog): boolean {
        return dialog.membersIds.length <= 2 &&
            (dialog.name === undefined || dialog.name === null) &&
            (dialog.imageUrl === undefined || dialog.imageUrl === null);
    }
}

