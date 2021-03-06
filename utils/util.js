//菜单树形结构
export const handleMenu = (menus, all) => {
  menus.forEach((v) => {
    const flag = all.filter((k) => k.parentId === v.id)
    if (flag.length) {
      handleMenu(flag, all)
    }
    v.children = flag
  })
  return menus
}
//字符串首字母大写
export const firstStringUp = (word) => word.substring(0, 1).toUpperCase() + word.substring(1)
//vuex getters生成
export const generateGetters = (stateObj = {}) => {
  const keys = Object.keys(stateObj)
  const getters = {}
  if (!keys.length) return getters
  keys.forEach((v) => {
    getters[v] = (state) => state[v]
  })
  return getters
}
//vuex mutations生成
export const generateMutations = (stateObj = {}) => {
  const keys = Object.keys(stateObj)
  const mutations = {}
  if (!keys.length) return mutations
  keys.forEach((v) => {
    mutations[`set${firstStringUp(v)}`] = (state, data) => {
      state[v] = data
    }
  })
  return mutations
}
//可选链
export const optionalChaining = (obj, ...rest) => {
  let tmp = obj;
  for (let key in rest) {
    let name = rest[key];
    tmp = tmp?.[name];
  }
  return tmp || "";
};