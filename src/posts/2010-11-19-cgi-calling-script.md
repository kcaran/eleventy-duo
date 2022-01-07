---
layout: post
title: "Calling a Perl CGI script from within another CGI script"
date:   '2010-11-19'
tags: [coding, perl, cgi]
permalink: posts/{{ title | slug }}/index.html
---

Awhile back we had an issue where a coworker wanted to use one of my
Perl CGI scripts inside of her scripts, using the backticks method
to have it spit its output to the webpage.  But for some reason, my
script refuse to recognize the arguments she was passing it.  The
weird thing was, if we ran her script from the command line, everything
worked fine.

The issue is in the way CGI.pm detects whether it is being called from a
web browser or from the command line.  It checks for the presence
of the **REQUEST_METHOD** environmental variable.  If it is present,
CGI knows to get its arguments from the web browser.

<!-- more -->

When the inner script it called either using `system()` or the
backticks method, it inherits the **REQUEST_METHOD** environmental
variable from the
calling program!  It therefore thinks it's being called directly from
Apache instead of the command-line shell, and ignores the arguments.
The trick to get it working is to temporarily clear the **REQUEST_METHOD**
environmental variable:

~~~ perl
my $cmd = "./gen_report.pl search_date=10/2009 pdf=1";

#
# Call gen_report.pl script to generate the report.  Since gen_report.pl is
# a CGI script that we are calling from the command line, we need to clear
# out the request method variable for CGI.pm
#
my $request_method = $ENV{ REQUEST_METHOD };
$ENV{ REQUEST_METHOD } = '';
my $display = `$cmd`;
$ENV{ REQUEST_METHOD } = $request_method;
~~~

