export default async ({ store, route, redirect }) => {
  if (!isAuthed(store)) {
    const user = await getUser(store)
    if (user.name) {
      store.dispatch('updateUser', user)
    }
    next(user, route, redirect)
  } else {
    next(store.state.user, route, redirect)
  }
}

function isAuthed (store) {
  return !!store.state.user.name
}

function getUser (store) {
  return new Promise((resolve, reject) => {
    store.dispatch('api/getUser').then(res => {
      resolve(res)
    }).catch(() => {
      resolve({})
    })
  })
}

function next (user = {}, route, redirect) {
  if (user.name) {
    if (route.name === 'start') {
      return redirect('/')
    }
  } else if (route.name !== 'start') {
    return redirect('/start')
  }
}
