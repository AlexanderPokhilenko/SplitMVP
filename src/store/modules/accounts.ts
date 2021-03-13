import { Module } from "vuex";
import { AccountsState, RootState } from "../states";
import Account, { multiAccount } from "@/data/Account";

const accountsArr = [
  // temporary
  new Account(1, "First Username", "https://i.imgur.com/sicII7N.jpg"),
  new Account(2, "Second Username", "https://i.imgur.com/3tgjufY.jpg"),
  new Account(3, "Third Username", "https://i.imgur.com/WfdkN3o.jpg")
];

export const allAccounts: { [id: number]: Account } = accountsArr.reduce(
  (dict, acc) => ({ ...dict, [acc.id]: acc }),
  {}
); // temporary
allAccounts[4] = new Account(
  4,
  "Interlocutor 1",
  "https://i.imgur.com/CFpa3nK.jpg"
);
allAccounts[5] = new Account(
  5,
  "Interlocutor 2",
  "https://i.imgur.com/fgrfeVu.jpg"
);

const state: AccountsState = {
  selected: multiAccount,
  accounts: accountsArr,
  allAccounts
};

const accounts: Module<AccountsState, RootState> = {
  namespaced: true,
  state,
  getters: {
    getAccountById: (state: AccountsState) => (id: number) =>
      state.allAccounts[id]
  },
  mutations: {
    selectAccount(state: AccountsState, id: number): void {
      state.selected =
        state.accounts.find(account => account.id === id) ?? multiAccount;
    }
  }
};

export default accounts;
