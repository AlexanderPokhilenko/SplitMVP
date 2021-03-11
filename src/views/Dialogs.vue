<template>
  <div class="dialogs">
    <md-empty-state
      v-if="id === undefined"
      md-icon="chat_bubble"
      md-label="Select dialog to start"
    >
    </md-empty-state>
    <h1 v-else>This is a dialogs page with id = {{ id }}</h1>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Dialogs extends Vue {
  @Prop() private id!: number | undefined;
}
</script>

<style scoped></style>
