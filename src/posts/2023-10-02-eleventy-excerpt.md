---
layout: post
title:  "Excerpts for Eleventy: My Implementation"
date:   '2023-10-02'
tags: [eleventy]
permalink: posts/{{ title | slugify }}.html
---

Converting my relatively basic personal website to Eleventy has shown me how challenging it is to build a static-site generator flexible enough to satisfy all the user cases and requirements. The great thing about Eleventy is being simultaneously opinionated by default and yet extremely flexible and customizable.

One area where everyone seems to have different requirements are reproducing blog post excerpts on the site's home page. Here are my wants:

* By default, use the start of the content (up to a delimiter)
* Optionally, define the excerpt in the front matter configuration
* Markdown is parsed exactly the same as the original post
* Include images but allow custom styling on the home page
* Syntax highlighting

Here is how I implemented each of the requirements.

<!-- more -->

## Use start of content as the default excerpt

Eleventy's built-in excerpting handles grabbing the starting content and putting it into `page.excerpt`. I use `<!-- more -->` as the delimiter. It stands out more than `---` and is easier for me to type than `<!-- excerpt -->`.

```js
eleventyConfig.setFrontMatterParsingOptions({
  excerpt: true,
  // Optional, default is "---"
  excerpt_separator: '<!-- more -->'
});
```

## Optionally define excerpt using front matter

If I want to use different content for the excerpt than the start of the post, I include it in the page's front matter under `excerpt` using a [YAML HereDoc](https://lzone.de/cheat-sheet/YAML#yaml-heredoc-multiline-strings).

```yaml
---
excerpt |
  ### Heading
  This is an example excerpt with an ![image](/url/image.png)
---
```

In the post listing include template, if `data.excerpt` is present, use it. Otherwise use the page excerpt.

```js
<li id="{{ '{{ post.data.title | slugify }}' }}" class="post-list__item">
...
  <article class="post-list__excerpt">
    {{ '{% if post.data.excerpt % }' }}
      {{ '{{ post.data.excerpt | md | safe }}' }}
    {{ '{% else %}' }}
      {{ '{{ post.page.excerpt | md | safe }}' }}
    {{ '{% endif %}' }}
  </article>
  <a class="post-list__read-more" href="{{ '{{ post.url }}' }}">read article</a>
</li>
```

## Markdown parsing

By default Eleventy doesn't "do" anything with the excerpt content. I expect it to be markdown and parsed accordingly. In my `eleventy.config.js` file I placed the `markdown-it` configuration in a function that I can call in two places: one for the standard Eleventy markdown parsing, and the other as a filter that I can use for excerpts:

```js
function configureMarkdownIt() {
  'use strict';

  // Reference: https://github.com/markdown-it/markdown-it-container/issues/23
  return require('markdown-it')({
      html: true,
      linkify: true,
      typographer: true
    })
    .use(require('markdown-it-bracketed-spans'))
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
    .use(require('markdown-it-highlightjs'), {
        code: true,
        inline: false
    })
    .use(require('markdown-it-smartarrows'))
    .use(require('markdown-it-attrs'));		// Should be last
}

  eleventyConfig.setLibrary( 'md', configureMarkdownIt() );

  // https://github.com/11ty/eleventy/issues/1380
  eleventyConfig.addFilter( 'md', function (content = '') {
    let html = configureMarkdownIt().render( content );
    return html;
  });
```

## Excerpt images

On the home page, I might want to include an image from the post, but resize it to better fit in the list of posts.  I may generalize the display of images in excerpts in the future, but for now I rely on the post title to style the images in the excerpt:

```css
li#regex-is-a-programming-superpower article img {
    object-position: 0 0;
}
.post-list .hero {
    max-height: 300px;
    object-fit: cover;
    width: 100%;
}
```

## Syntax highlighting

This is where I fell down a rabbit hole. Everything worked as I wanted to this point except for the syntax highlighting. [This is a known issue](https://github.com/11ty/eleventy-plugin-syntaxhighlight/issues/15). I messed around with the default syntax highlighting plugin but wasn't able to implement what I wanted.

In the end, I decided to forego the syntax highlighting plugin entirely and use the [`markdown-it-highlightjs`](https://www.npmjs.com/package/markdown-it-highlightjs) plugin instead. It works great, or at least as great as hightlight.js does.

I think the only thing I really lose by going with `markdown-it-highlightjs` is the baked-in shortcode. But as long as I only want to render markdown, I don't think this is an issue.

