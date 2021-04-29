const getProfilPicUrl = (path:string) => {
  if (!process.env.VUE_APP_API) return path

  const url = process.env.VUE_APP_API?.replace('graphql', '')
  console.log(url + path)
  return url + path
}

export {
  getProfilPicUrl
}
