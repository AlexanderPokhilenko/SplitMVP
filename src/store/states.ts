import Account from "@/data/Account";
import Dialog from "@/data/Dialog";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootState {}

export interface ExtendedRootState extends RootState {
  accounts: AccountsState;
  dialogs: DialogsState;
  dialogsPreviews: DialogsPreviewsState;
}

export interface AccountsState {
  selected: Account;
  accounts: Account[];
  allAccounts: { [id: number]: Account };
}

export interface DialogsState {
  dialogs: { [id: number]: Dialog };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DialogsPreviewsState {}
