require('dotenv').config()

module.exports = {
  mode: 'spa', // universal, spa
  /*
  ** Environment variables
  */
  env: {
    db_username: process.env.db_username,
    db_password: process.env.db_password,
    secret1: process.env.secret1,
    secret3: 'value3'
  },
  // env: process.env.NODE_ENV !== 'production' ? {
  //   db_username: process.env.db_username,
  //   db_password: process.env.db_password,
  //   secret2: 'value2'
  // } : {
  //   secret3: 'value3'
  // },
  /*
  ** Headers of the page
  */
  head: {
    title: 'YouTrack - personal task tracker',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans:400,600&display=swap&subset=cyrillic' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Resources for components
  */
  styleResources: {
    scss: [
      '@/assets/scss/variables/_index.scss',
      '@/assets/scss/_mixins.scss'
    ]
  },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/scss/index.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    // 'node_modules/nuxt-models',
    '@/plugins/nuxt-models',
    '@/plugins/common-components',
    '@/plugins/modal',
    '@/directives/outside'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Router options
  */
  router: {
    middleware: ['auth']
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
