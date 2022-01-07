---
layout: post
title:  "Writing an Apache Module for RHEL 5"
date:   '2009-01-14'
tags: [coding, cvs]
permalink: posts/{{ title | slug }}/index.html
---

Recently, I was asked by my employer to write an Apache module.  The module reads the requestor&rsquo;s digital certificate and checks it against our database of active users.  In this post, I&rsquo;ll explain how to get started writing Apache modules, especially for Red Hat Enterprise Linux 5 (RHEL 5.2).

<!-- more -->

<div class="imgleft">
<a href="http://www.amazon.com/gp/product/0132409674?ie=UTF8&tag=michelllougeeenv&linkCode=as2&camp=1789&creative=9325&creativeASIN=0132409674"><img border="0" src="/assets/img/51sQph2MYyL._SL160_.jpg"></a>
</div>

The best (and possibly only) useful source of information about writing modules for Apache 2 is Nick Kew&rsquo;s
<a href="http://www.amazon.com/gp/product/0132409674?ie=UTF8&tag=michelllougeeenv&linkCode=as2&camp=1789&creative=9325&creativeASIN=0132409674">The Apache Modules Book.</a><img src="http://www.assoc-amazon.com/e/ir?t=michelllougeeenv&l=as2&o=1&a=0132409674" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

The first thing you&rsquo;ll want to do is buy this book.
It is well written, provides lots of examples, and is very thorough.
But even with <i>The Apache Modules Book</i>, you will need to do some exploring in the Apache code to understand how everything works and to apply it to your work.

Currently, RHEL5 ships with Apache 2.2.3 and APR 1.2.7.  APR, the Apache Portable Runtime, provides all the tools and libraries you&rsquo;ll need to build your own module.  You&rsquo;ll also need apxs, which is used to compile and install modules.  The apxs binary is the httpd-devel package.  You&rsquo;ll want to install that before anything else:

~~~ bash
# yum install httpd-devel
~~~

Also, get the source code directly from apache.org
(<a href="http://archive.apache.org/dist/httpd/httpd-2.2.3.tar.gz">http://archive.apache.org/dist/httpd/httpd-2.2.3.tar.gz</a>).  
You don&rsquo;t need to rebuild and reinstall apache, but you definitely will want to peruse the included modules.  I went so far as to add debug statements in some of the modules to learn more about them.  There's also a terrific template at <code>modules/experimental/mod_example.c</code> to help you get started.

Finally, download the source code for the latest versions of apr and apr-util (1.3.3 and 1.3.4 as of this writing) at 
<a href="http://apr.apache.org/download.cgi">http://apr.apache.org/download.cgi</a>.  

Like the httpd, you&rsquo;ll want to be able to view and modify the source code.  But more importantly, the ODBC DBD driver is built-in as of version 1.3.1 of apr-util.  This is a big enough enhancement to upgrade the stock versions used by RHEL 5.2.

Install apr-1.3.3 using

~~~ bash
# ./configure --prefix=/usr
# make
# make install
~~~

Install apr-util-1.3.4 using

~~~ bash
# ./configure --with-ldap --with-apr=/usr/ --prefix=/usr
# make
# make install
~~~

You now have everything you need to start writing your own Apache module!  Use the apxs utility to compile and install it:

Compile and install mod_safeca:

~~~ bash
# apxs -c mod_safeca.c
# apxs -i mod_safeca.la 
~~~

Restart httpd

~~~ bash
# service httpd restart
~~~

