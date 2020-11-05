require('dotenv').config()

module.exports = {
  ssr: false,
  // mode: 'spa',

  telemetry: {
    enabled: false,
    consent: 1
  },

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
    '@/plugins/object-helpers',
    'node_modules/nuxt-models', // '@/plugins/nuxt-models/src',
    'node_modules/vue-common-components',
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
    { path: '~/components/card', prefix: 'card' },
    { path: '~/components/column/', prefix: 'column' },
    { path: '~/components/color-picker/', prefix: 'color-picker' },
    { path: '~/components/file/', prefix: 'file' },
    { path: '~/components/header/', prefix: 'header' },
    { path: '~/components/icons/', prefix: 'icon' },
    { path: '~/components/label/', prefix: 'label' },
    { path: '~/components/modals/', prefix: 'modal' },
    { path: '~/components/settings/', prefix: 'setting' },
    { path: '~/components/search/', prefix: 'search' },
    { path: '~/components/user/', prefix: 'user' }
  ],
  /*
  ** Vue-common-components options
  */
  commonComponents: {
    // exclude: ['input']
    nameCasing: 'kebab-case',
    modal: {
      icon: () => import('@/components/icons/cross')
    },
    checkbox: {
      icon: () => import('@/components/icons/check')
    }
  },
  /*
  ** Router options
  */
  router: {
    middleware: ['auth']
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
      config.node = {
        fs: 'empty'
      }
    }
  }
}
