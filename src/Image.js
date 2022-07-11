export const setFallbackImgSrc = src => e => () => {
  e.onerror = null
  e.src = src
}