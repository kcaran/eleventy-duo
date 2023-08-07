---
layout: post
title:  "Notes from the Perl FAQ"
date:   '2012-01-20'
tags: [coding, perl]
permalink: posts/{{ title | slug }}.html
---

Like the fellow that never read his car's owner's manual, I had never read the
entire 
[Perl FAQ](https://perldoc.perl.org/index-faq.html).
I finally did it over the holidays, and these are some notes that I took.
 
<!-- more -->

* [`Time::Piece`](https://metacpan.org/pod/Time::Piece)
 -- CPAN module that provides object oriented time objects, It also provides date and time addition, subtraction and comparison and date parsing.

	~~~ perl
	use Time::Piece;
    
	my $t = localtime;
	print "Time is $t\n";
	print "Year is ", $t->year, "\n";
	~~~

* [`Text::Autoformat`](https://metacpan.org/pod/Text::Autoformat)
 -- CPAN module that provides paragraph formatting and case transformations

* A list has a fixed set of elements, but an array is variable. You can use arrays for list functions, but you can't use lists with array functions (`push(), pop(), shift(), unshift()`). [<<link>>](https://perldoc.perl.org/perlfaq4.html#What-is-the-difference-between-a-list-and-an-array%3f)

* `@array[1]` - The sigil is *not* the variable type. This is actually a slice with a single element. [<<link>>](https://perldoc.perl.org/perlfaq4.html#What-is-the-difference-between-%24array%5b1%5d-and-%40array%5b1%5d%3f)

* [`List::Util`](https://metacpan.org/pod/List::Util) - `first()` - Similar to grep, but returns the first element where the result from the block is a true value. 

	Also includes `max()`, `min()`, `shuffle()`, `sum()`, and `reduce()`. The perldoc also includes a number of example subroutines (all, any, none, notall).

* `"\L$a"` - Returns the contents of $a, but all lowercase.

* `$| = 1` - perl filehandle select. Each filehandle has its own copy of this value, so you can't set it globally.  
	If you use IO::Handle, you can call the autoflush method to change the setting of the filehandle:

	~~~ perl
	use IO::Handle;
	open my( $io_fh ), ">", "output.txt";
	$io_fh->autoflush(1);
	~~~

	[<<link>>](https://perldoc.perl.org/perlfaq5.html#How-do-I-flush%2funbuffer-an-output-filehandle%3f-Why-must-I-do-this%3f)

* `print "@array"` puts spaces between the elements, `print @array` does not.

* `/o`, which tells Perl to complie a regular expression only once, is obsolete as of 5.6.

* `use re 'debug';` to debug regular expressions

* `\G` in regular expressions - Used with the `/g` flag, this anchors the last
match. It uses the value of `pos()` as the position to start the next match. It is similar to the string anchor `^` and can be helpful in finding only consecutive matches. [<<link>>](https://perldoc.perl.org/perlfaq6.html#What-good-is-%5cG-in-a-regular-expression%3f)

* The special variables `@-` and `@+` replace `$```, `$&`, and `$'` [<<link>>](https://perldoc.perl.org/perlfaq6.html#Why-does-using-%24%26%2c-%24%60%2c-or-%24'-slow-my-program-down%3f)

* Smart match (`~~`) in perl 5.10 - Compare against an array of regular expressions

	~~~ perl
	my @patterns = ( qr/Fr.d/, qr/B.rn.y/, qr/W.lm./ );
	if( $string ~~ @patterns ) {
		...
	};
	~~~

* "A class is just a package, and its methods are just the package's subroutines"

	See <a href="https://perldoc.perl.org/perlboot.html">perlboot</a>,
	<a href="https://perldoc.perl.org/perltoot.html">perltoot</a>,
	<a href="https://perldoc.perl.org/perlbot.html">perlbot</a>,
	and <a href="https://perldoc.perl.org/perlobj.html">perlobj</a>

* Although it has the same precedence as in C, Perl's `?:` operator produces an
lvalue. This assigns $x to either $a or $b, depending on the trueness of
$maybe:

	~~~ perl
	($maybe ? $a : $b) = $x
	~~~

* Don't use the double-pipe or with unlink and other commands that are list operators, or put in extra parentheses: [<<link>>](https://perldoc.perl.org/perlfaq7.html#Why-do-Perl-operators-have-different-precedence-than-C-operators%3f)

	~~~ perl
	unlink $file || die; # This is wrong! You need to use 'or' here
	(unlink $file) || die; # This will work ok
	~~~

* Use undef on the left side to skip return values in a list
	~~~ perl
	my ($name, $address, undef, undef, $zip) = get_address( $person );
	~~~

* `redo` - restarts the loop block without evaluating the conditional again.

* Creating a module - <a href="http://perldoc.perl.org/perlmod.html">perlmod</a>, <a href="http://perldoc.perl.org/perlmodlib.html">perlmodlib</a>, <a href="http://perldoc.perl.org/perlmodstyle.html">perlmodstyle</a> explain modules in all the gory details.

	<a href="http://perldoc.perl.org/perlnewmod.html">perlnewmod</a> gives a brief overview of the process along with a couple of suggestions about style.

	If you don't need to use C code, other tools such as
[`ExtUtils::ModuleMaker`](https://metacpan.org/pod/ExtUtils::ModuleMaker)
and
[`Module::Starter`](https://metacpan.org/pod/Module::Starter)
can help you create a skeleton module distribution.

* Tom Christainsen's article on why you almost always need a comparison
function when calling `sort`. Perl's `cmp` function (and C's `strcmp`)
is not an alphanumeric comparator -- it is a code point comparator.

	<a href="http://www.perl.com/pub/2011/08/whats-wrong-with-sort-and-how-to-fix-it.html">
http://www.perl.com/pub/2011/08/whats-wrong-with-sort-and-how-to-fix-it.html</a>

* Use 
[`Unicode::Collate`](https://metacpan.org/pod/Unicode::Collate)
to correctly sort unicode.
