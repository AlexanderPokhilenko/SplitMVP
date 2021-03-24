import {HubConnection, HubConnectionBuilder, HubConnectionState} from "@microsoft/signalr";
import authorizeService from "../components/api-authorization/AuthorizeService";

export default abstract class AbstractConnection {
    protected readonly connection: HubConnection;
    private _lastPromise: Promise<void>;

    protected constructor(url: string) {
        this.connection = new HubConnectionBuilder().withUrl(url,
            {
                accessTokenFactory: () => authorizeService.getAccessToken() as Promise<string>
            }).withAutomaticReconnect().build();
        this._lastPromise = Promise.resolve();
    }

    public get state(): HubConnectionState {
        return this.connection.state;
    }

    public get lastPromise(): Promise<void> {
        return this._lastPromise;
    }

    public get isConnected(): boolean {
        return this.connection.state === HubConnectionState.Connected;
    }

    public async start(): Promise<void> {
        this._lastPromise = this.connection.start();
        return this._lastPromise;
    }

    public async stop(): Promise<void> {
        this._lastPromise = this.connection.stop();
        return this._lastPromise;
    }
}
