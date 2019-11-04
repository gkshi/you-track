export default async ({ store, route, redirect }) => {
  if (!store.state.user) {
    const user = await store.dispatch('api/getUser').catch(() => {
      return null
    })
    if (user) {
      store.dispatch('updateUser', user)
      if (route.name === 'init') {
        return redirect('/')
      }
    } else if (route.name !== 'init') {
      return redirect('/init')
    }
  } else if (route.name === 'init') {
    return redirect('/')
  }
}
