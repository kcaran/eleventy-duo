---
layout: post
title:  "Using LWP::Simple to retrieve binary data"
date:   '2010-04-16'
tags: [coding, perl]
permalink: posts/{{ title | slug }}.html
---

We have a Perl CGI script at work that acts as a proxy.  It grabs a
<a href="http://www.flatmtn.com/article/creating-pkcs12-certificates">pkcs12 digital certificate</a>
file from an internal server and delivers it to a
user through his or her web browser.  The pkcs12 file is in binary format.

Everything worked fine until we put the code on a new server.  Suddenly, the
files downloaded by the web users were corrupted.  We also began seeing the
following warning in the log files:

~~~ perl
Wide character in print at download.cgi line 124.
~~~

Here is the code...

<!-- more -->

~~~ perl
use LWP::Simple;

# $cert_url is the URL for the internal server's pkcs12 certificate file
my $cert_p12 = get $cert_url;
if ($cert_p12) {
  # Get file name from the url
  $cert_url =~ /\/(\w+)\.p12$/;
  my $id = $1 || 'certificate';

  print "Content-type: application/x-pkcs12;\n";
  print "Content-Disposition: attachment; filename=\"$id.pfx\"\n\n";
  print $cert_p12;
~~~

It turns out that someone had installed the latest version of LWP directly from CPAN onto the new server.  All of our other servers were using the version that came with RHEL5 from Red Hat.  The Red Hat version is almost six years old!

The newer version of LWP::Simple sees the binary data inside of the pkcs12 file and tries (unsuccessfully) to discern its character encoding &mdash; except that it is binary data!

**The solution is not to use LWP::Simple for retrieving binary data files.  Use LWP::UserAgent instead.**

~~~ perl
use LWP::UserAgent;

# $cert_url is the URL for the internal server's pkcs12 certificate file
my $response = LWP::UserAgent->new->get( $cert_url );
my $cert_p12 = $response->content;

if ($cert_p12) {
  # Get file name from the url
  $cert_url =~ /\/(\w+)\.p12$/;
  my $id = $1 || 'certificate';

  print "Content-type: application/x-pkcs12;\n";
  print "Content-Disposition: attachment; filename=\"$id.pfx\"\n\n";
  print $cert_p12;
~~~

