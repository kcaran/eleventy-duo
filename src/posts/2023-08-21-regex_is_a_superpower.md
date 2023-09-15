---
layout: post
title:  "Regex is a Programming Superpower!"
date:   '2023-08-21'
tags: [coding, perl, regex]
permalink: posts/{{ title | slugify }}.html
---

![I Am Devloper Regex Tweet](/img/i_am_devloper_regex.png)

In an August 15 tweet, [@iamdevloper](https://twitter.com/iamdevloper/status/1691353496673513472?s=20), a very funny programmer-humor account, asked which technology you wouldn't bother to learn over again: JavaScript, Regex, Kubernetes, or PHP. Never mind the completely obvious answer (if you aren't in operations at Google, you probably don't need Kubernetes), I was blown away on how many of the responders admitting to not knowing Regex.

<!-- more -->

## A Brief Origin Story

Back in the 90's when the World Wide Web was just getting started and you could [teach yourself to publish for the web in a week](https://www.amazon.com/Teach-Yourself-Publishing-Html-Week/dp/0672306670), building HTML forms and processing them with CGI was my first real foray into text processing. I wrote some CGI-processing scripts in C, but it was hard! It was tedious!

About the same time a college intern I worked with introduced me to Perl. I couldn't believe how easy it made everything. I could read in text files, process the lines, and output the results? Without allocating any memory or guessing how big the file was? I could work directly on entire strings, lines, or even files instead of processing them character by character? It was magic!

Regular expressions were (and still are) a fundamental part of Perl. The [Learning Perl book](https://www.amazon.com/Learning-Perl-Making-Things-Possible-dp-1492094951/dp/1492094951/), which is still an incredible resource, devotes three entire chapters to them:

> Regular expressions are actually tiny programs in their own special language, built inside Perl.

Regular expressions are an integral part of Perl. Other languages seem to bolt on the functionality almost as an afterthought. My suspicion is that is why some programmers haven't learned to use them.

## My Own Regular Expression Usage

Using ack I took a quick look at my [Advent of Code](https://www.adventofcode.com) solutions over the years to see how many of my programs contained regular expressions:

~~~
kacmbp23:~$ ls -1 adventofcode20*/*.pl | wc -l
     266
kacmbp23:~$ ack -l \[\!\=\]\~ adventofcode*/*.pl | wc -l
     148
~~~

148/266 = 55.6% of my Advent of Code programs had at least one regular expression. I was actually a little surprised it was that *low*.

Running over a sample of perl scripts at work (which are mostly web applications), regular expression usage is even higher:

~~~
ramone8:/var/www/apps$ ls -1 */*.pl | wc -l
566
ramone8:/var/www/apps$ ack -l \[\!\=\]\~ */*.pl | wc -l
445
~~~

445/566 = 78.6% of our web application programs have at least one regular expression. That's more like it!

## Conclusion and Recommendation

If you aren't using regular expressions, um, regularly, in your code, you may be doing yourself a disservice! Take it from *Learning Perl*, they aren't all that terribly difficult to learn. You don't have to use all the features immediately. Some of the more advanced ones, like `/(negative\s)?look(ahead|behind)/` can come later.

## Resources

### Learn regex the easy way

<https://github.com/ziishaned/learn-regex>

A very nice, short summary of the basics of regular expressions

### _Learning Perl_ and _Mastering Regular Expressions_

[Learning Perl book](https://www.amazon.com/Learning-Perl-Making-Things-Possible-dp-1492094951/dp/1492094951/)

[Mastering Regular Expressions](https://www.amazon.com/Mastering-Regular-Expressions-Jeffrey-Friedl/dp/0596528124/) is supposed to be the absolute Tome of Enlightenment on the subject, but I wouldn't know because I felt like I had enough background from Perl. It is probably a blind spot for me.

### Mastering Lookahead and Lookbehind

<https://www.regular-expressions.info/lookaround.html>

I'll admit that lookahead/lookbehind has always been troublesome for me and in the past I would go out of my way to avoid them. But this is my reference for when I do use them.

This one is also good:

<https://www.rexegg.com/regex-lookarounds.html>

### Using regular expressions in JavaScript

<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions>

JavaScript seems to have a more dysfunctional relationship with regular expressions than any other language. It's been largely corrected over the years, but I still wind up having to look up syntax and waste brain cycles over how to properly craft an expression in JS.

