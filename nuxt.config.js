require('dotenv').config()

module.exports = {
  mode: 'spa', // universal, spa
  /*
  ** Server config
  */
  server: {
    host: process.env.HOST || 'localhost', // default: localhost
    port: process.env.PORT || 3000, // default: 3000
    timing: false
  },
  /*
  ** Environment variables
  */
  env: {
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,

    PUBLIC_VAPID_KEY: process.env.PUBLIC_VAPID_KEY,
    PRIVATE_VAPID_KEY: process.env.PRIVATE_VAPID_KEY
  },
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }
    ]
    // script: [
    //   { src: '/js/helpers.js' }
    // ]
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
      '@/assets/scss/_mixins.scss',
      '@/assets/scss/_extends.scss'
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
    '@/plugins/helpers',
    'node_modules/nuxt-models', // '@/plugins/nuxt-models/src',
    '@/plugins/common-components',
    '@/mixins/modal',
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
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxt/components'
  ],
  /*
  ** Component auto import
  */
  components: [
    '~/components', // shortcut to { path: '~/components' }
    { path: '~/components/settings/', prefix: 'settings' }
  ],
  models: {
    logs: false
  },
  /*
  ** Router options
  */
  router: {
    middleware: ['connection']
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
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
