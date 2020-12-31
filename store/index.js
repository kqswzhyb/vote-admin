const state = () => ({
    token: ''
})

const getters = {
    token: state => state.token
}

const mutations = {
    setToken(state, data) {
        state.token = data
    }
}

const actions = {
    fetchCount({commit, state}) {
        commit('setCount', 101)
    }
}

export {state, getters, mutations, actions}