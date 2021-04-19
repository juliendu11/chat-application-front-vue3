const capitalize = (s:string) => {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const capitalizeAndGetFirstLetter = (s:string) => {
  return s.charAt(0).toUpperCase()
}

export { capitalize, capitalizeAndGetFirstLetter }
