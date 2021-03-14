<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <md-button
          class="md-icon-button"
          @click="menuVisible = !menuVisible"
          v-if="!menuVisible"
        >
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title">Split</span>
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="menuVisible" md-persistent="full">
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
                v-for="account in accounts"
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
              <md-menu-item :to="{ name: 'Sign' }">Log Out</md-menu-item>
            </md-menu-content>
          </md-menu>
        </md-toolbar>

        <NavList v-if="!isDialogsPage" />
        <md-tabs v-else md-alignment="fixed" md-active-tab="tab-dialogs">
          <md-tab id="tab-pages" md-label="Pages">
            <NavList />
          </md-tab>
          <md-tab id="tab-dialogs" md-label="Dialogs">
            <md-list class="md-double-line padding-0">
              <md-list-item
                v-for="preview in dialogsPreviews"
                :key="preview.id"
                :to="{ name: 'Dialogs', params: { id: preview.id } }"
              >
                <md-avatar>
                  <img :src="preview.pictureSrc" alt="Dialog image" />
                </md-avatar>
                <div class="md-list-item-text">
                  <span class="flex">
                    <span class="inline bold flexFill">{{ preview.name }}</span>
                    <span class="inline right unsetOverflow">{{
                      preview.dateTimeStr
                    }}</span>
                  </span>
                  <span>
                    <strong>
                      {{
                        preview.isDraft
                          ? "Draft"
                          : preview.isCurrentAccount(selectedAccount.id)
                          ? "You"
                          : preview.shortUsername
                      }}:
                    </strong>
                    {{ preview.text }}
                  </span>
                </div>
                <md-badge
                  v-if="preview.unreadMessagesCount > 0"
                  :md-content="preview.unreadMessagesCount"
                />
              </md-list-item>
            </md-list>
          </md-tab>
        </md-tabs>
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
import NavList from "@/components/NavList.vue";
import DialogPreview from "@/data/DialogPreview";

@Component({
  components: { NavList }
})
export default class Sidebar extends Vue {
  private menuVisible = true;

  selectAccount(id: number) {
    this.$store.commit("accounts/selectAccount", id);
  }

  get dialogsPreviews(): DialogPreview[] {
    return this.$store.getters["dialogsPreviews/getPreviews"];
  }

  get selectedAccount(): Account {
    return this.$store.state.accounts.selected;
  }

  get accounts(): Account[] {
    return this.$store.state.accounts.accounts;
  }

  get isDialogsPage(): boolean {
    return this.$route.name === "Dialogs";
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

.md-tab {
  padding: 0;
}

.md-tabs >>> .md-tab-nav-button {
  min-width: 0 !important;
}

.padding-0 {
  padding: 0 !important;
}

.inline {
  display: inline;
}

.flex {
  display: flex;
}

.flexFill {
  flex: 1 1 auto !important;
  min-width: 0;
}

.bold {
  font-weight: bold;
}

.right {
  float: right;
}

.unsetOverflow {
  overflow: unset;
  width: auto;
}
</style>
