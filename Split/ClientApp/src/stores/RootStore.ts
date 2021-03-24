import AccountsStore from "./AccountsStore";
import DialogsStore from "./DialogsStore";
import DialogsPreviewsStore from "./DialogsPreviewsStore";
import AccountsConnection from "../sockets/AccountsConnection";
import DialogsConnection from "../sockets/DialogsConnection";
import authorizeService, { AuthorizeService } from "../components/api-authorization/AuthorizeService";

export default class RootStore {
    public readonly accountsStore: AccountsStore;
    public readonly dialogsStore: DialogsStore;
    public readonly dialogsPreviewsStore: DialogsPreviewsStore;

    private isConnected: boolean;
    public readonly accountsConnection: AccountsConnection;
    public readonly dialogsConnection: DialogsConnection;

    public readonly authorizeService: AuthorizeService;

    constructor() {
        this.authorizeService = authorizeService;

        this.accountsStore = new AccountsStore(this);
        this.dialogsStore = new DialogsStore(this);
        this.dialogsPreviewsStore = new DialogsPreviewsStore(this);

        this.isConnected = false;
        this.accountsConnection = new AccountsConnection(this);
        this.dialogsConnection = new DialogsConnection(this);

        const connectionsCallback = () => {
            if(authorizeService._isAuthenticated) {
                if(!this.isConnected) {
                    Promise.all([
                        this.accountsConnection.start(),
                        this.dialogsConnection.start()
                    ]).then(() => this.isConnected = true);
                }
            }
            else {
                if(this.isConnected) {
                    Promise.all([
                        this.accountsConnection.stop(),
                        this.dialogsConnection.stop()
                    ]).then(() => this.isConnected = false);
                }
            }
        };
        authorizeService.subscribe(connectionsCallback);
        authorizeService.isAuthenticated().then(connectionsCallback);
    }
}
