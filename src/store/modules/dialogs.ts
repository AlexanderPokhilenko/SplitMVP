import { Module } from "vuex";
import { DialogsState, ExtendedRootState, RootState } from "../states";
import Account from "@/data/Account";
import Dialog from "@/data/Dialog";
import Message from "@/data/Message";
import { allAccounts } from "./accounts";
import Vue from "vue";

const getAccountById = (id: number) => allAccounts[id];
const dialogsDict = {
  // temporary
  1: new Dialog(
    1,
    [getAccountById(1), getAccountById(4)],
    [
      new Message(
        1,
        "Some text.",
        1,
        new Date(Date.now() - 1000 * 60 * 60 * 24 * 31)
      ),
      new Message(
        2,
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        4,
        new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
      )
    ]
  ),
  2: new Dialog(
    2,
    [getAccountById(1), getAccountById(5)],
    [
      new Message(1, "Hi!", 1, new Date(Date.now() - 1000 * 60 * 60 * 24)),
      new Message(2, "Hello!", 5, new Date(Date.now() - 1000 * 60 * 60))
    ]
  ),
  3: new Dialog(
    3,
    [
      getAccountById(1),
      getAccountById(2),
      getAccountById(3),
      getAccountById(4),
      getAccountById(5)
    ],
    [
      new Message(1, "Good day!", 1, new Date(Date.now() - 1000 * 60 * 10)),
      new Message(2, "Hi!", 2, new Date(Date.now() - 1000 * 60 * 9)),
      new Message(3, "Hello there!", 3, new Date(Date.now() - 1000 * 60 * 8)),
      new Message(4, "Hello!", 4, new Date(Date.now() - 1000 * 60 * 7)),
      new Message(5, "Greetings!", 5, new Date(Date.now() - 1000 * 60 * 6))
    ],
    "General chat",
    "https://i.imgur.com/tGUXjPO.jpeg"
  )
};

interface SendingMessage {
  dialogId: number;
  text: string;
}

interface AddingMessage {
  dialogId: number;
  message: Message;
}

const state: DialogsState = {
  dialogs: dialogsDict
};

const dialogs: Module<DialogsState, RootState> = {
  namespaced: true,
  state,
  getters: {
    getDialogById: (state: DialogsState) => (id: number) => state.dialogs[id],
    getDialogs: (state: DialogsState) => Object.values(state.dialogs)
  },
  mutations: {
    addMessage(
      state: DialogsState,
      { dialogId, message }: AddingMessage
    ): void {
      const dialog = state.dialogs[dialogId];
      dialog.messages.push(message);
    },
    markDialogAsRead(state: DialogsState, id: number): void {
      const dialog = state.dialogs[id];
      Vue.set(
        dialog,
        "lastReadMessageId",
        dialog.messages[dialog.messages.length - 1].id
      );
    },
    addDraft(state: DialogsState, { dialogId, message }: AddingMessage): void {
      const dialog = state.dialogs[dialogId];
      Vue.set(dialog, "draftText", message);
    },
    clearDraft(state: DialogsState, id: number): void {
      const dialog = state.dialogs[id];
      Vue.set(dialog, "draftText", null);
    }
  },
  actions: {
    sendMessage(
      { dispatch, commit, getters, rootGetters, rootState, state },
      { dialogId, text }: SendingMessage
    ): void {
      if (text === null || text === undefined || text.trim() === "") {
        return;
      }

      const dialog: Dialog = getters.getDialogById(dialogId);
      const messages = dialog.messages;
      const nextMessageId = messages[messages.length - 1].id + 1;
      const selectedId: number = (rootState as ExtendedRootState).accounts
        .selected.id;
      const accounts: Account[] = (rootState as ExtendedRootState).accounts
        .accounts;
      const accountId =
        selectedId !== 0 &&
        dialog.interlocutors.find(acc => acc.id === selectedId)
          ? selectedId
          : dialog.interlocutors.find(acc =>
              accounts.find(a => a.id === acc.id)
            )?.id ?? 0;

      commit("addMessage", {
        dialogId: dialog.id,
        message: new Message(nextMessageId, text, accountId)
      });
      commit("markDialogAsRead", dialog.id);
      commit("clearDraft", dialog.id);
    }
  }
};

export default dialogs;
