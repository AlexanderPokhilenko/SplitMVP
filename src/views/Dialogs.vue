<template>
  <div class="dialogs">
    <md-empty-state
      v-if="id === undefined"
      md-icon="chat_bubble"
      md-label="Select dialog to start"
    >
    </md-empty-state>
    <div v-else id="dialog-container" class="container">
      <div id="inner-dialog-container" class="row">
        <md-card class="main-column">
          <!-- Dialog header -->
          <md-card-header style="border-bottom-style: groove">
            <!-- Profile picture -->
            <md-avatar>
              <img
                :src="preview.pictureSrc"
                class="thumbnail"
                alt="Current dialog picture"
              />
            </md-avatar>
            <!-- Username -->
            <div class="md-title">{{ preview.name }}</div>
            <div class="md-subhead">
              <template v-if="dialog.interlocutors.length < 3">
                Direct messages to
                <strong>{{ getFirstCurrentAccountUsername() }}</strong>
              </template>
              <template v-else>
                {{ dialog.interlocutors.length }} members including
                <strong>{{ getFirstCurrentAccountUsername() }}</strong>
                <md-menu md-size="auto">
                  <md-button
                    md-menu-trigger
                    class="md-icon-button md-dense raised"
                    aria-label="Chat users dropdown button"
                  >
                    <md-icon>more_vert</md-icon>
                  </md-button>
                  <md-menu-content>
                    <md-menu-item
                      v-for="account in dialog.interlocutors"
                      :key="account.id"
                    >
                      <md-avatar>
                        <img
                          :src="account.imageUrl"
                          class="small-thumbnail"
                          alt="Account picture"
                        />
                      </md-avatar>
                      <span
                        class="flex-fill align-self-center "
                        :style="{
                          fontWeight: isCurrentAccount(account.id) ? 'bold' : ''
                        }"
                      >
                        {{ account.username }}
                      </span>
                    </md-menu-item>
                  </md-menu-content>
                </md-menu>
              </template>
            </div>
          </md-card-header>
          <!-- Dialog container -->
          <md-card-content id="messages-container">
            <!-- Messages -->
            <md-card
              v-for="message of dialog.messages"
              :id="'msg' + message.id"
              :key="message.id"
              class="message"
              :style="{
                alignSelf: isCurrentAccount(message.authorId)
                  ? 'flex-end'
                  : 'flex-start'
              }"
            >
              <md-card-header v-if="!dialog.isDirect">
                <md-avatar class="md-small">
                  <img
                    :src="getAccountById(message.authorId).imageUrl"
                    alt="Author profile picture"
                  />
                </md-avatar>
                <strong class="message-username">{{
                  getAccountById(message.authorId).username
                }}</strong>
              </md-card-header>
              <md-card-content>
                <span class="text-break">{{ message.text }}</span>
                <span class="message-date-time">{{ message.dateTimeStr }}</span>
              </md-card-content>
            </md-card>
          </md-card-content>
          <!-- Input -->
          <md-card-actions>
            <md-field appearance="outline">
              <md-button class="md-prefix" aria-label="Send message">
                <md-icon>attach_file</md-icon>
              </md-button>
              <md-textarea
                id="message-area"
                placeholder="Write message..."
                name="text"
                md-autogrow
                v-model.lazy.trim="dialog.draftText"
              ></md-textarea>
              <md-button
                class="md-suffix"
                aria-label="Send message"
                @click="sendMessage"
              >
                <md-icon>send</md-icon>
              </md-button>
            </md-field>
          </md-card-actions>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Account from "@/data/Account";
import DialogPreview from "@/data/DialogPreview";
import Dialog from "@/data/Dialog";

@Component
export default class Dialogs extends Vue {
  @Prop() private id!: number | undefined;

  get dialog(): Dialog {
    if (this.id === undefined) throw new Error("Dialog id was empty!");
    return this.$store.getters["dialogs/getDialogById"](this.id);
  }

  get preview(): DialogPreview {
    return this.$store.getters["dialogsPreviews/getPreviewFromDialog"](
      this.dialog
    );
  }

  get draftText(): string | null {
    return this.dialog.draftText;
  }

  set draftText(text: string | null) {
    this.$store.commit("dialogs/addDraft", {
      dialogId: this.id,
      text: text
    });
  }

  updated(): void {
    if (this.id !== undefined) {
      this.$store.commit("dialogs/markDialogAsRead", this.id);
      this.scrollToLastRead();
    }
  }

  scrollToLastRead(): void {
    const lastReadMessage = document.getElementById(
      "msg" + this.dialog.lastReadMessageId
    );
    if (lastReadMessage === null) {
      return;
    }
    lastReadMessage.scrollIntoView();
  }

  sendMessage(): void {
    this.$store.dispatch("dialogs/sendMessage", {
      dialogId: this.id,
      text: this.dialog.draftText
    });
    this.scrollToLastRead();
  }

  getFirstCurrentAccountUsername(): string {
    const selectedAccount: Account = this.$store.state.accounts.selected;
    if (this.dialog.interlocutors.find(acc => acc === selectedAccount)) {
      return selectedAccount.username;
    }
    return (
      this.dialog.interlocutors.find(acc => this.isCurrentAccount(acc.id))
        ?.username ?? "Unknown Account"
    );
  }

  isCurrentAccount(id: number): boolean {
    const accounts: Account[] = this.$store.state.accounts.accounts;
    return accounts.find(a => a.id === id) !== undefined;
  }

  getAccountById(id: number): Account {
    return this.$store.getters["accounts/getAccountById"](id);
  }
}
</script>

<style scoped>
.dialogs {
  display: contents;
}

#messages-container {
  overflow-y: auto;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  -ms-flex-wrap: nowrap;
  flex-flow: column nowrap;
  flex-grow: 1;
}

#messages-container > :first-child {
  margin-top: auto !important;
}

#message-area {
  resize: none;
}

.text-cut {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.text-break {
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: break-spaces;
}

.raised {
  margin-top: -16px;
}

.message {
  min-width: 25%;
  max-width: 75%;
  margin: 0.5em 0;
  margin-bottom: 0.5em !important;
}

.message-username {
  font-size: 10pt;
}

.message-date-time {
  font-size: 8pt;
  color: dimgray;
  float: right;
  margin-left: 0.25em;
}

.message >>> .md-card-content,
.md-card-header {
  padding: 8px;
}

.message >>> .md-card-header + .md-card-content {
  padding-top: 0;
}

.md-list-item >>> .md-list-item-content {
  justify-content: flex-start;
}
</style>
