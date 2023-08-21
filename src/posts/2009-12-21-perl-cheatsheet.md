---
layout: post
title:  "Things I always need to look up in Perl"
date:   '2009-12-21'
tags: [coding, perl]
permalink: posts/{{ title | slugify }}.html
---

Here are some random Perl things I always need to look up:
 
<!-- more -->

#### Print the string representation in hex
print join( ' ', map { unpack "H*", $_ } split( //, $x ) );

#### Text replacement on a per-file basis

~~~ perl
perl -pi -e 's/\/business\//\/illus\/business.html/' */*.html
~~~

* -p : Iterate over each line of the file
* -i : Don't create a backup file
* -e : Enter one or more lines of script

#### Muliple line pattern modifiers:

* `/s` allows wildcards (.) to match a newline.  Use this to extend
a search beyond a single line.

* `/m` changes the behavior of `^` and `$` so they will
match the start and end of any line. `/^&lt;h4>/m` would match
any line that began with an h4 heading tag.

* To explicitly match the start and end of the string, use `\A` and the EOF character, `\z`.

* The `/s` and `/m` modifiers are not mutually
exclusive.

#### The `break` and `continue` keywords from C are `last` and `next` in Perl.

#### Use localtime to get the current year (assuming post-2000):

~~~ perl
# Year is the sixth element of the localtime list
$YEAR = 2000 + (( localtime )[5] % 100);
~~~

#### Redirecting STDOUT temporarily to a scalar (string)

~~~ perl
# Open a filehandle on a string
my $scalar_file = '';
open my $scalar_fh, '>', \$scalar_file
		or die "Can't open scalar filehandle: $!";

# Select scalar filehandle as default, save STDOUT
my $ostdout = select( $scalar_fh );

# Unbuffered output
$| = 1;

# Now, close scalar filehandle and bring back STDOUT
close( $scalar_fh );

print "ABC\n";
print "DEF\n";
print "GHI...\n";

# Bring STDOUT back
select( $ostdout );
~~~

#### Slurp an entire file into a scalar

~~~ perl
open my $text_fh, '&lt;', 'myfile.txt' or die $!;
my $contents = do { local $/;  &lt;$text_fh> };
~~~

#### Run a function inside of a double-quoted string

~~~ perl
my $input = qq|&lt;input type="text" name="email"
	value="<b>${ \escapeHTML( $email ) }</b>">|;
~~~~

#### Use Data::Dumper to display a data structure

~~~ perl
use Data::Dumper;
warn "KAC:", Data::Dumper->Dump( [$data_structure], ['*main::data_structure'] );
~~~~
