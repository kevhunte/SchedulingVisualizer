<template>
  <div v-if="sidebar" class="sidebar-ad-unit">
    <ins class="adsbygoogle"
         style="display:block; width:160px;"
         data-ad-client="ca-pub-1958595222279898"
         :data-ad-slot="slotId"
         data-ad-format="auto"></ins>
  </div>
  <div v-else class="row justify-content-center my-3">
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-1958595222279898"
         :data-ad-slot="slotId"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
  </div>
</template>

<script>
export default {
  name: 'AdUnit',
  props: {
    slotId: { type: String, required: true },
    sidebar: { type: Boolean, default: false }
  },
  mounted() {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {}
  }
}
</script>
