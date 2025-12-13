export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    },
    footer: {
      slots: {
        root: 'border-t border-default',
        left: 'text-sm text-muted'
      }
    }
  },
  seo: {
    siteName: 'Balm Documentation'
  },
  header: {
    title: '',
    to: '/',
    logo: {
      alt: '',
      light: '',
      dark: ''
    },
    search: true,
    colorMode: true,
    links: [{
      'icon': 'i-simple-icons-discord',
      'to': 'https://discord.gg/36qHFMNgAh',
      'target': '_blank',
      'aria-label': 'Discord'
    }, {
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/TwelveIterationMods/Balm',
      'target': '_blank',
      'aria-label': 'GitHub'
    }]
  },
  footer: {
    credits: `Copyright © ${new Date().getFullYear()} Jean Baker. All Rights Reserved.`,
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-discord',
      'to': 'https://discord.gg/36qHFMNgAh',
      'target': '_blank',
      'aria-label': 'Balm on Discord'
    }, {
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/TwelveIterationMods/Balm',
      'target': '_blank',
      'aria-label': 'Balm on GitHub'
    }]
  },
  toc: {
    title: 'Table of Contents',
    bottom: {
      title: 'Community',
      edit: 'https://github.com/TwelveIterationMods/balm-docs/edit/main/docs',
      links: [{
        icon: 'i-lucide-star',
        label: 'Star on GitHub',
        to: 'https://github.com/TwelveIterationMods/Balm',
        target: '_blank'
      }, {
        icon: 'i-lucide-message-circle-code',
        label: 'Chat on Discord',
        to: 'https://discord.gg/36qHFMNgAh',
        target: '_blank'
      }]
    }
  }
})
