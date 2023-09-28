const { DateTime } = require('luxon');
const timeToRead = require('eleventy-plugin-time-to-read');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const fs = require('fs');
const inspect = require('util').inspect;
const path = require('path');

const manifestPath = path.resolve(
  __dirname,
  'build',
  'assets',
  'manifest.json'
);

const manifest = JSON.parse(fs.readFileSync(manifestPath, { encoding: 'utf8' }));

function configureMarkdownIt() {
  'use strict';

  // Reference: https://github.com/markdown-it/markdown-it-container/issues/23
  return require('markdown-it')({
      html: true,
      linkify: true,
      typographer: true
    })
    .use(require('markdown-it-attrs'))
    .use(require('markdown-it-container'), 'dynamic', {
      validate: function () { return true; },
      render: function (tokens, idx) {
        const token = tokens[idx];
        if (token.nesting === 1) {
          return '<div class="' + token.info.trim() + '">';
        } else {
          return '</div>';
        }
      }
    })
    .use(require('markdown-it-implicit-figures'), {
        figcaption: 'title',
        keepAlt: true,
        link: true
    })
    .use(require('markdown-it-smartarrows'));
}

module.exports = function (eleventyConfig) {
  'use strict';

  eleventyConfig.addPlugin(timeToRead);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.setLibrary( 'md', configureMarkdownIt() );

  // setup mermaid markdown highlighter
  const highlighter = eleventyConfig.markdownHighlighter;
  eleventyConfig.addMarkdownHighlighter((str, language) => {
    if (language === 'mermaid') {
      return `<pre class="mermaid">${str}</pre>`;
    }
    return highlighter(str, language);
  });

  // Excerpts
  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    // Optional, default is "---"
    excerpt_separator: '<!-- more -->'
  });

  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addPassthroughCopy({ 'src/img': 'img' });
  eleventyConfig.addPassthroughCopy( 'poker' );
  eleventyConfig.addPassthroughCopy( { 'favicon' : '/' } );

  eleventyConfig.addShortcode('bundledcss', function () {
    return manifest['main.css'] ?
      `<link href="${manifest['main.css']}" rel="stylesheet" />`
      : '';
  });

  eleventyConfig.addShortcode('bundledjs', function () {
    return manifest['main.js'] ?
      `<script src="${manifest['main.js']}"></script>`
      : '';
  });

  eleventyConfig.addFilter('readableDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(
      'dd LLL yyyy'
    );
  });

  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  });

  eleventyConfig.addFilter('dateToIso', (dateString) => {
    return new Date(dateString).toISOString();
  });

  eleventyConfig.addFilter('head', (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  // https://github.com/11ty/eleventy/issues/1526
  eleventyConfig.addFilter( 'debug',
		(content) => `<pre>${inspect(content)}</pre>`);

  // https://griffa.dev/posts/tips-for-debugging-in-11ty/
  eleventyConfig.addFilter( 'debugger', (...args) => {
    console.log( 'KAC', ...args );
    debugger;
  });

  // https://github.com/11ty/eleventy/issues/1380
  eleventyConfig.addFilter( 'md', function (content = '') {
    return configureMarkdownIt().render( content );
  });

  eleventyConfig.addCollection('tagList', function (collection) {
    let tagSet = new Set();
    collection.getAll().forEach(function (item) {
      if ('tags' in item.data) {
        let tags = item.data.tags;

        tags = tags.filter(function (item) {
          switch (item) {
            case 'all':
            case 'nav':
            case 'post':
            case 'posts':
              return false;
          }

          return true;
        });

        for (const tag of tags) {
          tagSet.add(tag);
        }
      }
    });

    return [...tagSet];
  });

  eleventyConfig.addFilter('pageTags', (tags) => {
    const generalTags = ['all', 'nav', 'post', 'posts'];

    return tags
      .toString()
      .split(',')
      .filter((tag) => {
        return !generalTags.includes(tag);
      });
  });

  return {
    dir: {
      input: 'src',
      output: 'build',
      includes: 'includes',
      data: 'data',
      layouts: 'layouts'
    },
    passthroughFileCopy: true,
    templateFormats: ['html', 'njk', 'md'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  };
};
