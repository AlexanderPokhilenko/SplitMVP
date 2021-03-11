<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <span class="md-title">Split</span>
      </md-app-toolbar>

      <md-app-drawer md-permanent="full">
        <md-toolbar class="md-transparent" md-elevation="0">
          Navigation
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

@Component
export default class Sidebar extends Vue {}
</script>

<style scoped>

</style>
