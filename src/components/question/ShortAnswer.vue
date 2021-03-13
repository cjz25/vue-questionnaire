<template>
  <div class="d-flex justify-content-start">
    <span class="dotted-underline">
      Short answer text
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ShortAnswer'
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dotted-underline {
  border-bottom: 1px dotted rgba(0, 0, 0, 0.38);
}
</style>
