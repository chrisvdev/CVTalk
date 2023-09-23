import getURLParams from './get_url_params.js'

const params = getURLParams()
if (params.style) {
  const externalStyle = document.createElement('link')
  externalStyle.rel = 'stylesheet'
  externalStyle.href = params.style
  document.head.appendChild(externalStyle)
}
