import { Module } from "vuex";
import { DialogsPreviewsState, ExtendedRootState, RootState } from "../states";
import { unknownAccount } from "@/data/Account";
import Dialog from "@/data/Dialog";
import DialogPreview from "@/data/DialogPreview";

function isNullOrWhitespace(str: string | null | undefined): boolean {
  return str === undefined || str === null || str.match(/^ *$/) !== null;
}

const state: DialogsPreviewsState = {};

const dialogsPreviews: Module<DialogsPreviewsState, RootState> = {
  namespaced: true,
  state,
  getters: {
    getPreviews: (state, getters, rootState, rootGetters) => {
      const previews = [];
      const dialogs: Dialog[] = rootGetters["dialogs/getDialogs"];
      dialogs.sort(
        (d1, d2) =>
          d2.lastMessage.dateTime.getTime() - d1.lastMessage.dateTime.getTime()
      );
      for (const dialog of dialogs) {
        const preview: DialogPreview = getters.getPreviewFromDialog(dialog);
        previews.push(preview);
      }
      return previews;
    },
    getPreviewFromDialog: (state, getters, rootState, rootGetters) => (
      dialog: Dialog
    ) => {
      const lastMessage = dialog.messages[dialog.messages.length - 1];
      const lastAuthor = rootGetters["accounts/getAccountById"](
        lastMessage.authorId
      );
      const dateTimeStr = lastMessage.dateTimeStr;
      const currentAccounts = (rootState as ExtendedRootState).accounts
        .accounts;
      const otherInterlocutor =
        dialog.interlocutors.find(
          acc => !currentAccounts.find(a => a.id === acc.id)
        ) ?? unknownAccount;
      const name = dialog.isDirect
        ? otherInterlocutor.username
        : dialog.name ?? "Unnamed dialog";
      const picture = dialog.isDirect
        ? otherInterlocutor.imageUrl
        : dialog.pictureSrc ?? unknownAccount.imageUrl;
      const isDraft = !isNullOrWhitespace(dialog.draftText);
      const text = isDraft
        ? dialog.draftText ?? "No text yet."
        : lastMessage.text;
      return new DialogPreview(
        dialog.id,
        name,
        picture,
        dateTimeStr,
        text,
        lastAuthor,
        lastMessage.id - dialog.lastReadMessageId,
        isDraft
      );
    }
  },
  mutations: {},
  actions: {}
};

export default dialogsPreviews;
