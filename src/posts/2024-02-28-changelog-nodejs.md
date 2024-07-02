---
layout: post
title:  "Changelog/JS Party Podcast on Node.js Notes"
date:   '2024-02-28'
tags: [javascript, programming, nodejs]
permalink: posts/{{ title | slugify }}.html
---

[Episode 294](https://changelog.com/jsparty/294) of JS Party is titled *Reports of Node's death are greatly exaggerated* and features two members of the Node Technical Steering Committee: Matteo Collina and James Snell. Their perspective on the project (and software development in general) was insightful, especially some of the challenges they face.

<!-- more -->

### NodeJS Has Backwards-Compatibility Issues

The Node.js developers have discovered ways of making it much faster, but it would mean changing some of the internals of the project. Some programs developed in Node.js, most notably the [Express web framework](https://expressjs.com/), link directly into those internals and would break if they changed.

The Perl community has the same kind of issues. It's a recurring thing at conferences to hear the [Perl Porters](http://www.faqs.org/docs/perl5int/x108.html) rue that they could clean or speed up the language itself but they don't want to break working software that was written to rely on those specifics defects.

Backwards compatibility is a high goal to strive for, but it definitely comes with costs.

[Link to Transcript](https://changelog.com/jsparty/294#transcript-140)

### Programming Language Projects Are Best Written in Their Own Language

For large open-source projects, it's best to have the majority of the code base written in the *lingua franca* of the project itself. Node.js is written mainly in JavaScript, not C++. [Rust is written in Rust](https://users.rust-lang.org/t/understanding-how-the-rust-compiler-is-built/87237). The reason is this allows the project to expand the contributer base from the user base. The user base already knows the language of the project, but they might not be as familiar with a lower-level language.

[Link to Transcript](https://changelog.com/jsparty/294#transcript-159)

### C++ May Not Be Your Best Choice

[Matteo Collina](https://changelog.com/jsparty/294#transcript-159):

    To be honest, even C is a significant improvement over C++, in my point of view… [laughter] So the bar is pretty low. To be honest, I prefer writing C. I love C code. C is beautiful. C++ gives me a headache half of the time because I don’t know what exactly I’m calling. So it’s really “Oh, is this a method? Is this a function? What is this happening here?” It has so much overloads… But if you look at it with the wrong eye, it just blows, it explodes on top of your face. So everything is better than C++ at this point. 

### JavaScript is a Trademark of the Oracle Corporation

[TIL.](https://tinyclouds.org/trademark)

>    The trademark has no commercial value. Other than Oracle's JavaScript Extension Toolkit, Oracle does not have any products using the trademark and presumably no planned usage. Oracle doesn’t even participate in the development of any of the JavaScript engines like V8, JavaScriptCore, or Spidermonkey. It seems very likely that JavaScript trademark infringement would be unenforceable in court due to non-use.

>    “The trademark is a dark cloud looming over the world’s most popular programming language,” he wrote. “Careful law abiding engineers bend over backwards to avoid its use – leading to confusing terms like ECMAScript.”

