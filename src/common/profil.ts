import { useStore } from '../store/Store'

const getProfilInformation = () => {
  const store = useStore()

  const username = store.member.getUsername()
  const profilPic = store.member.getProfilPic()

  return {
    username, profilPic
  }
}

export {
  getProfilInformation
}
