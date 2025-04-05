/**
 * JSDoc configuration file
 */
module.exports = {
  plugins: ['plugins/markdown'],
  source: {
    include: ['./src', './README.md'],
    exclude: ['node_modules', 'build', 'dist'],
    includePattern: '.+\\.js(x)?$',
    excludePattern: '(^|\\/|\\\\)_',
  },
  sourceType: 'module',
  tags: {
    allowUnknownTags: true,
    dictionaries: ['jsdoc', 'closure'],
  },
  templates: {
    cleverLinks: false,
    monospaceLinks: false,
    default: {
      outputSourceFiles: true,
      includeDate: false,
    },
  },
  markdown: {
    idInHeadings: true,
  },
  opts: {
    template: 'node_modules/docdash',
    destination: 'docs',
    recurse: true,
    readme: 'README.md',
  },
  docdash: {
    static: false,
    sort: true,
    search: true,
    collapse: true,
    typedefs: true,
    removeQuotes: 'none',
    scripts: [],
    menu: {
      'Project Website': {
        href: '/',
        target: '_blank',
        class: 'menu-item',
        id: 'website_link',
      },
    },
  },
};
