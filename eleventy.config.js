const { DateTime } = require('luxon');
const timeToRead = require('eleventy-plugin-time-to-read');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const fs = require('fs-extra');
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

  return require('markdown-it')({
      html: true,
      linkify: true,
      typographer: true
    })
    .use(require('markdown-it-bracketed-spans'))
    .use(require('markdown-it-container'), 'dynamic', {
      //
      // https://github.com/markdown-it/markdown-it-container/issues/23
      // ::: foo
      // <div class="foo">
      //
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
    .use(require('markdown-it-highlightjs'), {
        code: true,
        inline: false
    })
    .use(require('markdown-it-smartarrows'))
    .use(require('markdown-it-attrs'));		// Should be last
}

// https://github.com/manustays/eleventy-plugin-generate-social-images
const generateSocialImages = require("@manustays/eleventy-plugin-generate-social-images");

module.exports = function (eleventyConfig) {
  'use strict';

  eleventyConfig.addPlugin(timeToRead);
  eleventyConfig.addPlugin(pluginRss);
  //eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(generateSocialImages, {
    promoImage: "./src/img/carangelo_keith_4126.jpg",
    outputDir: "preview",
    urlPath: "/preview",
	siteName: "kcaran.com/",
	titleColor: "#fedb8b",
	bgGradient: ['#ABB8C0', '#A0ACB3']
  });

  eleventyConfig.setLibrary( 'md', configureMarkdownIt() );

  // setup mermaid markdown highlighter
  //const highlighter = eleventyConfig.markdownHighlighter;
  //eleventyConfig.addMarkdownHighlighter((str, language) => {
  //  if (language === 'mermaid') {
  //    return `<pre class="mermaid">${str}</pre>`;
  //  }
  //  return highlighter(str, language);
  //});

  // Excerpts
  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    // Optional, default is "---"
    excerpt_separator: '<!-- more -->'
  });

  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addPassthroughCopy({ 'src/img': 'img' });
  eleventyConfig.addPassthroughCopy( { 'favicon' : '/' } );
  eleventyConfig.addPassthroughCopy( 'poker' );
  eleventyConfig.addPassthroughCopy({ 'src/xsl': 'xsl' });

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
    let html = configureMarkdownIt().render( content );
    return html;
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

  // https://github.com/11ty/eleventy/discussions/2389
  eleventyConfig.on('eleventy.after', async ({ dir, results, runMode, outputMode }) => {
    fs.copy('preview', 'build/preview', err => {
      if (err) return console.error(err);
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
