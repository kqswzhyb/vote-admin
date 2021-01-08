export default {
  data() {
    return {
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
      pageSizes: [1, 2, 3, 4, 5, 10, 20, 30, 40, 50],
    }
  },
  computed: {
    count() {
      return (this.page.current - 1) * this.page.size
    },
  },
  methods: {
    handleCurrentChange(val, fn) {
      this.page.current = val
      fn && fn()
    },
    handleSizeChange(val, fn) {
      this.page.current = 1
      this.page.size = val
      fn && fn()
    },
  },
}
