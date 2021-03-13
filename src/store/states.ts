import Account from "@/data/Account";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootState {}

export interface AccountsState {
  selected: Account;
  accounts: Account[];
  allAccounts: { [id: number]: Account };
}
