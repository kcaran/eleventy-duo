---
layout: post
title:  "Using ack to search Apache web logs"
date:   '2021-01-12'
tags: [coding, perl, apache]
permalink: posts/{{ title | slugify }}.html
---

The `ack` utility uses Perl regular expressions to efficiently search
source code, with smart defaults to limit the results to what you
expect.

One of the ways I use it is to search our Apache web log files. The
logs capture all requests, including ones for images, style sheets,
fonts, and javascript files. But usually I'm only interested in who
visited which web pages, including CGI scripts.

I've added a Bash function to my `.bashrc` file, `acklog`, that filters
out the extraneous files automatically:

~~~ bash
# ack (grep) for scripts in apache
function acklog() {
  ack "$@" | ack -v '\.(css|eot|gif|ico|jpe?g|js|png|svg|swf|webp|woff2?|xml)[? ]'
}
~~~
