<template>
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
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class NavList extends Vue {}
</script>

<style scoped></style>
