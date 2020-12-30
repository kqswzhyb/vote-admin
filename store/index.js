const state = () => ({
    count: 0
})

const getters = {
    getCount(state) {
        return state.count
    }
}

const mutations = {
    setCount(state, data) {
        state.count = data
    }
}

const actions = {
    fetchCount({commit, state}) {
        commit('setCount', 101)
    }
}

export {state, getters, mutations, actions}