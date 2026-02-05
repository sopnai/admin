const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
  // Handle CORS preflight requests directly
  app.options('/admin/*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.sendStatus(200)
  })

  app.use(
    '/admin',
    createProxyMiddleware({
      target: 'https://apitmp.totallyflawless.co/admin',
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        '^/admin': ''
      },
      onProxyReq: (proxyReq, req, res) => {
        // Remove Origin header to bypass backend CORS check for localhost development
        proxyReq.removeHeader('origin')
      }
    })
  )
}
