---
layout: post
title:  "The Perl and Raku Conference 2024 - Las Vegas"
date:   '2024-07-09'
tags: [perl,coding,software,cgi,vegas]
permalink: posts/{{ title | slugify }}.html
---

![Perl Conference Swag](/img/perl_vegas.jpg){.hero}

I was fortunate enough to attend my very first in-person
[Perl conference](https://tprc.us/tprc-2024-las/)
this year in Las Vegas! 
[Ironically](https://www.youtube.com/watch?v=AakBK5leleE) my first real exposure to Perl was almost 30 years (!!) ago when I read
 [Learning Perl](https://www.amazon.com/Learning-Perl-Making-Things-Possible/dp/1492094951/)
on a plane to Vegas!

It was great to finally meet so many wonderful people that I felt I already knew through using their software and watching conference talks from prior years. Here were the highlights of the conference for me.

<!-- more -->

## Party Like It's 19100+ℯ^iπ – Curtis Poe [link to video](https://youtu.be/22-7yP0inu8?si=cWiFQXP2lrGUHDJY) {.video} 

Ovid started the conference with a keynote that detailed the history of 25 years of Perl conferences. The highlights for me:

* His personal experience of 9/11 was deeply moving and a reminder that
even as software developers, our main focus should be on the people we
work with and the people who use our software.

* If we are to understand complicated systems, we need to understand the
*history* of how they got to their current state. I run into this all
the time at work: why does this venerable application work the way it does? 
Sometimes features are vestigial, obsolete remnants that should be removed, but others might have deep, important reasons for existing.

* On the controversies surrounding Perl&nbsp;7 (my paraphrasing):
 
>  I don't want to moralize but we didn't need to have that happen. 
>  I know a number of folks who are no longer in the Perl community
>  because of the abuse.  Attacking our best and brightest is not
>  the best strategy.
>
>  Why is it that hard to be nice?  Why do we have to make fun of
>  others&mdash;other languages, other people, other ideas? 
>  Why do we have to be abusive? It makes me very sad.

* The most important skill when working with AI is prompt engineering.  It is an alchemy that is constantly changing, but it is the most important factor for getting accurate and useful information out of LLMs.

* It's always a good reminder of how old some of the versions of Perl are
that people expect to be supported as if they were new. The earliest
version of modern Perl, 5.8, was released in 2004! Even 5.16 was released
in 2012. What other languages are expected to carry such old versions
while trying to improve the language at the same time?

## Outreachy Updates – Bruce Gray for Makoto Nozaki [link to video](https://youtu.be/gCyx7MEt2Jk?si=u3drnVS__Ug-bleD) {.video}

Our company has a thriving internship program across multiple business units in an effort to recruit graduates into the insurance industry. I found a lot of parallels with the efforts of The Perl and Raku Foundation. Bruce brought up an excellent point: the hard part of internship programs isn't finding suitable projects for the interns to work on, it's finding **mentors to guide the interns**. He estimated the mentors needed five hours per week, and that tracks with my experience. Managing an intern is basically equivalent to managing a regular, full-time employee, and that effort needs to be recognized.

## Structure Based Structuring of Unstructured Data – Adam Russell [link to video](https://youtu.be/dn9msFIED-8?si=IWsqGeCYfp83Tlcu) {.video}

Adam Russell's talk was a terrific primer on how LLMs are affecting the efforts to recognize, categorize, and ultimately use unstructured data. Given a document (or more likely, many many documents) of unknown or inconsistent formatting, how can we read in the data and organize it in a way to make it useful?

He explained the latest research into using LLMs to help automate the semantic knowledge graphs used to organize unstructured data. To me, this is exciting because working with unstructured data is hard! LLMs might be a way to unlock a lot of value from data that is currently opaque. 

## The Test2 Ecosystem – Chad Granum [link to video](https://youtu.be/DdSQkIfeoqU?si=SDScDGw2J4s_So8i) {.video}

Chad actually gave three talks at the conference, and it's always great to hear him speak about testing in Perl. The Test2 suite of modules is insanely comprehensive. There seems to be a plugin or some other way to test almost any software. He also previewed the new version of `yath` ([Test2::Harness](https://metacpan.org/pod/Test2::Harness)). Version 2.0 will significantly improve the performance and accessibility of test suites.

Some of the useful plugins and features Chad touched on in his talks include:

* [Test2::Tools::Compare](https://metacpan.org/pod/Test2::Tools::Compare) - Use the `is()` function instead of Test2::Tools::Basic. It is even being used to validate HTML form and JSON inputs!

* [Test2::API](https://metacpan.org/pod/Test2::API) - Gives you hooks to intercept events. It provides the framework for useful debugging tools such as [Test2::Plugin::DieOnFail](https://metacpan.org/pod/Test2::Plugin::DieOnFail).

* [Test2::Tools::Spec](https://metacpan.org/pod/Test2::Tools::Spec) - Similar to Ruby's `rspec`. It allows you to describe a block of tests and to define code to run before and after the suite or individual tests.

* [Test2::Tools::QuickDB](https://metacpan.org/pod/Test2::Tools::QuickDB) can spin up a basic database for your tests.

* Tests can be rerun from the log files generated by Test2 using `yath`. You can also use [Test2::Plugin::SRand](https://metacpan.org/pod/Test2::Plugin::SRand) to generate "random" numbers repeatedly.

* [Test2::Plugin::UTF8](https://metacpan.org/pod/Test2::Plugin::UTF8) is used to turn on UTF8 encoding for test output.

## YAMLScript and Clojure – Ingy döt ؜Net­[link to video](https://youtu.be/RFIukRdFe1o?si=rVb__2IKfsCGX5sL) {.video}

Ingy had three talks related to his latest project, [YAMLScript](https://yamlscript.org/), and I was blown away by its potential. It is compelling to think about both from the top down and the bottom up. 

From the top down, YAMLScript can serve as a dynamic YAML parser. This will allow you to build custom YAML configuration files, depending on, say, the environment or particular server the configuration file is actually on.  Ingy is striving to make the `ys` executable the gold standard for parsing YAML, making it unnecessary for other languages to roll their own parsers. It is also a complete and logical scripting language in its own right (with the added benefit that it is _fast!_).

From the bottom up, YAMLScript compiles down to Clojure, which itself runs on the JVM. This means that with YAMLScript you can reap all the benefits of the vast array of pre-existing Java libraries without actually having to write Java code! Its appeal over Clojure is that its syntax will be more familiar to developers experienced in the C-type languages and their syntax style.

I admit that up to now I've favored JSON over YAML when given the choice. But YAML is only growing in popularity and use for configuration of tools such as static site generators. YAMLScript is the catalyst I need to start using YAML more. Also, I would love to be able to generate PDFs using the [OpenPDF library](https://github.com/LibrePDF/OpenPDF) without having to resort to writing Java!

## Playwright-Perl – George S. Baugh [link to video](https://youtu.be/ePnKUNW4r8c?si=vYCVtK-Ujlrt71Ps) {.video}

In the past I've used George's Selenium::Remote::Driver to run tests against our insured account application and mobile app and he really does yeoman's work to keep Perl support of Selenium up and running. This talk was the final straw for me and I am going to port all of them to [Playwright](https://metacpan.org/pod/Playwright). I believe the usefulness of his playwright-server utility could extend beyond Perl testing.

## Actually Portable Perl – Gavin Hayes [link to video](https://youtu.be/H3dITR0np54?si=4c3oO7X75qvuD_Vk) {.video}

Gavin's talk was about using [Actually Portable Perl](https://computoid.com/APPerl/)
to compile a Perl program (including perl and any necessary modules) into a fully portable executable that can "run anywhere". There was a palpable excitement about his work by the end of the talk. It's a bit of a work-in-progress (it uses [cosmopolitan libc](https://justine.lol/cosmopolitan/) as the C compiler, which is in active development),
but I would love to be able to run my Perl on any Windows, Mac, or Linux machine.

## Common-Sense Optimization – D&nbsp;Ruth Holloway [link to video](https://youtu.be/8hUEOpzdWxU?si=TfEPlo8Af1Y5NOFn) {.video}

Ask yourself what is the cost of *not* optimizing, and compare it to the estimated time and effort of trying to optimize. Also, what exactly should you be optimizing for? Is it the speed of the application? The amount of resources you need? 

Remember the 80/20 principle and make sure you are focusing on the small problems that have a outsized impact.

Robert Heinlein said that proof only comes from experiment. In order to solve optimization problems, you'll need to get your hands dirty! "You can't talk it out". This can apply to life in general, not just coding.

Quote from a young developer: **"I don't like old people's code."** I thought that was hilarious, but I'm not sure who is more right. Older developers need to be cognizant of getting stuck in the way they write code that might be obsolete or just out of fashion (and therefore making it harder for others to work with it). But young developers can be just as stubborn and automatically assume that they know the One True Path for everything.

## Demystifying Perl One-Liners – Walter C. Mankowski [link to video](https://youtu.be/ZqSddysHJb0?si=P5zAzrBCREkd5J5d) {.video}

Walt's talks about Perl one-liners are always excellent and it really should be part of any Perl programmer's toolkit. I recently read [Efficient Linux at the Command Line by Daniel J. Barrett](https://a.co/d/0cUXmCPd), and more than once I thought, "why the heck would I learn sed or awk to accomplish this???"

One issue that came up near the end of the talk is how to use UTF-8 in one-liners. It turns out to be a little more involved than I expected, but I will post my findings soon!

## PerlGPT, A Code Llama LLM Fine-Tuned For Perl – William N. Braswell, Jr. [link to video](https://youtu.be/Agw6E1omIvY?si=YJ7Q7FEi-fCIsqyA) {.video}

## The State of the Onion AI – William Braswell

Will the Thrill gave two talks on Perl and AI and stressed the importance of getting the Perl community involved in AI projects so the language doesn't get left behind. One interesting thing I learned is that Google pivoted its TensorFlow project from Python to C, which makes it much easier to create bindings to use its libraries in Perl.

PerlGPT is a specialized model based off of Code Llama trained on a curated set of modules from MetaCPAN. Code Llama Python uses other LLMs to derive the training set. This leads to "garbage-in garbage-out"-type quality issues.

Will maintains that source code is the most complex type of information that is still understandable. The *human intention* behind the code is necessary for true understanding, and is derived from the documentation and comments.

__Code comments and names of functions and variables should capture your intentions__

[https://perlcommunity.org/ai/](https://perlcommunity.org/ai/)
[](https://gitlab.com/aiperl/perlgpt)

## Direct Access to PDF Internals with PDF::Data – Deven Corzine [link to video](https://youtu.be/fzEWyELP5hI?si=uMdfIdeYJ5V6Es3j) {.video}

Every so often we run into issues at work with PDFs, and [PDF::Data](https://metacpan.org/pod/PDF::Data) looks incredibly useful for tweaking PDFs programmatically using our language of choice. I can't wait to try it out!

Refer to the [PDF specification](https://opensource.adobe.com/dc-acrobat-sdk-docs/pdfstandards/PDF32000_2008.pdf) for a better understanding of how to manipulate the files!

## The Once and Future Perl – Damian Conway [link to video](https://youtu.be/0x9LD8oOmv0?si=GflzVlcLMwqR0tiY) {.video}

Damian's keynote did not disappoint and it's hard to watch any presentation of his _without_ coming away with a greater knowledge of Perl. For me and this presentation, it was that it is time for me to start learning how to use [subroutine signatures](https://perldoc.perl.org/perlsub#Signatures).

He gave a couple of examples of how to use [AI::Chat](https://metacpan.org/pod/AI::Chat) to embed normal language prompts inside your code, so that the LLM of your choice returns the output you want. This is much different than trying to use the LLM to _write code_ (or help you to write code) that does what you want. It's an interesting spin on how most developers think about using AI.

Paraphrasing from Brian Kernighan in _The Elements of Programming Style_: "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible you are - by definition - **not smart enough to debug it.**" This is especially true for AI-generated code. If AI produces code more clever than you could come up with, you will have an especially difficult time tracking down the bugs that will invariably come with the code.

## Wrap-up

As this post shows, I got so much out of this conference! I am so grateful to [J.E. Turcotte](https://x.com/je_turcotte) for his tireless work in making sure that so many videos were posted. There were a few talks that I was unable to attend due to conflicts, and now I'll be able view them! Peter and Amber Krawczyk did an amazing job finding a [beautiful and appropriate venue](https://www.alexispark.com/), keeping us all fed, and giving us cool Vegas-themed swag!

I'd love to see a few more tracks (i.e. groups of talks on a similar theme). I think it might encourage others to give talks. For example, I wish there had been more talks specifically on web development.

One way that we might be able to encourage more attendees is to have a "beginners track." Maybe there is a day or two of hands-on classes. Almost everyone I met at the conference was a seasoned pro, and the talks reflected that audience.

I look forward to seeing you all at future Perl events!

