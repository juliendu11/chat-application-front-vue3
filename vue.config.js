module.exports = {
  pwa: {
    name: 'Test',
    themeColor: '#5341D5',
    msTileColor: '#5341D5',
    manifestOptions: {
      background_color: '#5341D5'
    }
  },
  chainWebpack: config => {
    // GraphQL Loader
    config.module
      .rule('graphql')
      .test(/\.gql$/)
      .use('graphql-tag/loader')
      .loader('graphql-tag/loader')
      .end()
  }
}
