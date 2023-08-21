---
layout: post
title:  "Perl Modules Primer"
date:   '2005-09-26'
tags: [coding, perl]
permalink: posts/{{ title | slugify }}.html
---

Splitting a Perl application into seperate files can be trickier than
doing it in other languages, like C or C++, but it is still an
important part of producing maintainable code.  

## Creating the Package

A Perl <b>module</b> is a collection of code stored in a single file.
By definition, all variables and function names in the module are
stored in a <b>package</b> with the same name as the file.

For example, a module named <b>Cgiutils</b> would be stored in the file
<b>Cgiutils.pm</b>.  Any functions or variables in the module belongs
to the <b>Cgiutils</b> package namespace.  The beginning of the file
should look like this:

<!-- more -->

~~~ perl
#!/usr/bin/perl
#
# Cgiutils.pm - various debugging utilities for the CGI.pm module and other
#		CGI scripts.
#

package Cgiutils;

use strict;
use warnings;
~~~

## Accessing Package Variables

To access a function or a variable declared in <b>Cgiutils</b>, you first
need to tell the main program to import the module with the <b>use</b>
command.  Then, the module's code can be accessed by prefixing the
module name, <b>Cgiutils::</b> to its functions and variables.

~~~ perl
use Cgiutils;

my $ip = $Cgiutils::ip_address();
~~~

If it is too much of a hassle to type out the fully qualified
names of the module's functions and variables, you can export them
from the module with the following code:

~~~ perl
#!/usr/bin/perl
#
# Cgiutils.pm
#

package Cgiutils;

use strict;
use warnings;

use Exporter;
our (@ISA, @EXPORT);
@ISA = qw( Exporter );
@EXPORT = qw( &amp;ip_address $cgi_debug %cgi_hash );

our $cgi_debug;
our %cgi_hash;
~~~

Note that any variables that are exported <i>must</i> be declared
using <b>our</b> instead of <b>my</b>.  This gives the main program
access to those variables.

## Using Global Variables in the Package

Global variables are the bane of neat and organized code, but
they can be unavoidable in Perl.  Here's how to use them in
modules.

In your main program, declare the variables to be global:

~~~ perl
use strict;

# Define these variables as globals... **DO NOT USE 'my $xxx' with these!**
use vars qw($chosen_sort $sort_order $sort_type);
~~~

The module can now use these variables with the default main package.  
<b>Warning:</b> make sure that you don't try to declare them again
with 'my' later on in the program!.  

~~~ perl
print "The chosen sort is ", $::chosen_sort, "\n";
~~~

## Adding sort routines to modules

Finally, a word on moving sort routines into modules.  If the sort
routine inside the module will be used in the main program, make sure you
use $::a and $::b for the sort variables.

~~~ perl
# Sort subroutine located in a module and called from the main program
sub sort_by_field()
 {
  my $a_val = $::a->{ $::chosen_sort };
  my $b_val = $::b->{ $::chosen_sort };
  my $ret_val;

  # Determine how to compare based on the chosen field's type
  $ret_val = $a_val <=> $b_val;

  return ($ret_val);
 }
~~~

## Sample Programs

Here's a sample main program and module:

### modmain.pl

~~~ perl
#!/usr/bin/perl
#
# modmain.pl
#
# Testing main program for relationship between a
# main program and a module
#
use strict;
use warnings;

use modmodule;

use vars qw( $global_var );

$global_var = 5;

print "The module_var = $module_var\n\n";
module_func();
~~~

### modmodule.pm

~~~ perl
#!/usr/bin/perl
#
# modmodule.pm
#
# Testing module for relationship between a main program
# and a module
#

package modmodule;

use strict;
use warnings;

use Exporter;
our ( @ISA, @EXPORT );
@ISA = qw( Exporter );
@EXPORT = qw( &amp;module_func $module_var );

our $module_var = 34;           # NOTE: Can't use 'my' here!

sub module_func {
	print "Calling module_func()...\n";
	print "The global_var = $::global_var\n";
}
~~~
