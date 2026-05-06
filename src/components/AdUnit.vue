<template>
  <div class="row justify-content-center my-3">
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
    slotId: { type: String, required: true }
  },
  mounted() {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {}
  }
}
</script>
