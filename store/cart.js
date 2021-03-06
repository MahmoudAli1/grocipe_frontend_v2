import Cookies from 'js-cookie'

export const state = () => ({  
  items: []
})

export const mutations = {  
  setItems(state, items) {
    state.items = items
  },
  add(state, item) {
    const record = state.items.find(i => i._id === item._id)

    if (!record) {
      state.items.push({
        quantity: 1,
        ...item
      })
    } else {
      record.quantity++
    }
    Cookies.set('cart', state.items)
  },
  remove(state, item) {
    const record = state.items.find(i => i._id === item._id)

    if (record.quantity > 1) {
      record.quantity--
    } else {
      const index = state.items.findIndex(i => i._id === item._id)
      state.items.splice(index, 1)
    }
    Cookies.set('cart', state.items)
  },
  emptyList(state) {
    state.items = []
    Cookies.set('cart', state.items)
  }
}

export const getters = {  
  items: state => {
    return state.items
  },
  price: state => {
    return state.items.reduce(
      (accumulator, item) => accumulator + item.Price * item.quantity,
      0
    )
  },
  numberOfItems: state => {
    return state.items.reduce(
      (accumulator, item) => accumulator + item.quantity,
      0
    )
  }
}