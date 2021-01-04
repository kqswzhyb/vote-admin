<template>
  <div>首页</div>
</template>

<script>
import { readOne } from '@/graphql/user/user.js'
export default {
  layout: 'admin',
  mounted() {
    this.$query(readOne, { id: '2' }).then((res) => {
      console.log(res)
    })
  },
}
</script>
