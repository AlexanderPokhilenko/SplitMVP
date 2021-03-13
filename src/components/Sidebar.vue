<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <span class="md-title">Split</span>
      </md-app-toolbar>

      <md-app-drawer md-permanent="full">
        <md-toolbar class="md-transparent" md-elevation="0">
          <md-menu md-size="auto" class="fill">
            <md-button md-menu-trigger class="fill">
              <md-avatar class="md-large">
                <img
                  :src="selectedAccount.imageUrl"
                  alt="Current account avatar"
                />
              </md-avatar>
              {{ selectedAccount.username }}
              <md-icon>arrow_drop_down</md-icon>
            </md-button>

            <md-menu-content>
              <md-menu-item
                :class="{ selected: selectedAccount.id === 0 }"
                @click="selectAccount(0)"
              >
                Multi-account
              </md-menu-item>
              <md-divider />
              <md-menu-item
                v-for="account in this.accounts"
                :key="account.id"
                :class="{ selected: selectedAccount === account }"
                @click="selectAccount(account.id)"
              >
                <md-avatar>
                  <img :src="account.imageUrl" alt="Account avatar" />
                </md-avatar>
                {{ account.username }}
              </md-menu-item>
              <md-divider />
              <md-menu-item to="/sign">Log Out</md-menu-item>
            </md-menu-content>
          </md-menu>
        </md-toolbar>

        <md-list>
          <md-list-item :to="{ name: 'News' }" exact>
            <span class="md-list-item-text">Main</span>
          </md-list-item>

          <md-list-item :to="{ name: 'Dialogs' }">
            <span class="md-list-item-text">Dialogs</span>
          </md-list-item>

          <md-list-item :to="{ name: 'Comments' }">
            <span class="md-list-item-text">My comments</span>
          </md-list-item>

          <md-list-item :to="{ name: 'Settings' }">
            <span class="md-list-item-text">Settings</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <slot></slot>
      </md-app-content>
    </md-app>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Account from "@/data/Account";

@Component
export default class Sidebar extends Vue {
  selectAccount(id: number) {
    this.$store.commit("accounts/selectAccount", id);
  }

  get selectedAccount(): Account {
    return this.$store.state.accounts.selected;
  }

  get accounts(): Account[] {
    return this.$store.state.accounts.accounts;
  }
}
</script>

<style scoped>
.selected >>> * {
  font-weight: bold;
}

.md-toolbar {
  padding: 0;
}

.md-drawer {
  width: 240px;
}

.md-button {
  text-transform: none;
}

.md-button >>> .md-ripple > .md-button-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.md-button >>> .md-ripple > .md-button-content > * {
  margin: unset;
}

.md-list-item >>> .md-list-item-content {
  justify-content: flex-start;
}
</style>
