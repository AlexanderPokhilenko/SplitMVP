<template>
  <Sidebar>
    <router-view />
  </Sidebar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Sidebar from "@/components/Sidebar.vue";
@Component({
  components: { Sidebar }
})
export default class App extends Vue {}
</script>

<style>
.page-container,
.md-app {
  min-height: 100vh;
  height: 100%;
}
</style>
