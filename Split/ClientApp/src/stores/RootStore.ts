import AccountsStore from "./AccountsStore";
import DialogsStore from "./DialogsStore";
import DialogsPreviewsStore from "./DialogsPreviewsStore";

export default class RootStore {
    public readonly accountsStore: AccountsStore;
    public readonly dialogsStore: DialogsStore;
    public readonly dialogsPreviewsStore: DialogsPreviewsStore;

    constructor() {
        this.accountsStore = new AccountsStore(this);
        this.dialogsStore = new DialogsStore(this);
        this.dialogsPreviewsStore = new DialogsPreviewsStore(this);
    }
}
