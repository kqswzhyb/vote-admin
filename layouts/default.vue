<template>
  <div>
    <Nuxt />
  </div>
</template>
<script>
export default {
  mounted(){
    this.$store.commit('setToken',localStorage.getItem('token'))
  }
}
</script>
<style>
</style>
