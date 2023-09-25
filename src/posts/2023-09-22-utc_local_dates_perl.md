---
layout: post
title:  "UTC/Local Date Conversion in Perl With Time::Piece"
date:   '2023-09-22'
tags: [coding, perl, dates]
permalink: posts/{{ title | slugify }}.html
---

`Time::Piece` is my preferred perl module for handling dates. Here is how it can be used to convert between UTC and the local time, even for past dates which may have crossed the current daylight savings time status.

## Assumptions and Restrictions

Date conversions can be confusing because there are a number of tools used in the process, each with its own quirks (or limitations). So there are the caveats to this process.

* The *only* date formats supported are UTC and the local timezone. The assumption here is if you live in New York, you won't see dates from California or any other timezone.

* The dates being converted are in standard ISO format: '2015-03-08 06:59:00'.

### Step 1: Format the Date String

Before passing the date string to Time::Piece, strip off everything after the integer seconds. If you need the milliseconds data, you can re-attach it after conversion. The same applies to any timezone indicators: add them back in after conversion.

Not following this step caused me a lot of confusion in the past. The linux `strptime` c-function doesn't do a great job of supporting timezones. You are much better off stripping them off before trying to convert between UTC and local time. 

### Step 2: Create a new Time::Piece object using `strptime`

The `strptime` function converts a well-formed date string to a Time::Piece object. The trick here is that you use `Time::Piece->strptime()` if the date is already in UTC, and you use `localtime->strptime()` if the date is a local time.

### Step 3: Convert the date using the epoch seconds

Use the `epoch()` function to create a new `Time::Piece` in the desired timezone. If you want your date in UTC, use `Time::Piece->gmtime( $epoch )`. Otherwise, use `Time::Piece->localtime( $epoch )` for the local timezone.

### Step 4: Use `strftime` to create the converted date string

I always use `$tp->strftime( '%Y-%m-%d %H:%M:%S' )` to create a date string from a `Time::Piece` object, but `$tp->datetime` works as well (with a capital T separating the date and time).

### Sample program

~~~perl
#!/usr/bin/env perl
#
# $Id: $
#
use feature ':5.16';

use strict;
use warnings;
use utf8;
use open ':std', OUT => ':encoding(UTF-8)';

use Time::Piece;

sub utc_to_local {
  my ($utc_ts) = @_;
  $utc_ts =~ s/^(\d{4}-\d{2}-\d{2}).(\d{2}:\d{2}:\d{2}).*$/$1 $2/
        or die "Illegal date format: $utc_ts";

  my $utc_tp = Time::Piece->strptime( $utc_ts, '%Y-%m-%d %H:%M:%S' );
  print "UTC epoch is   ", $utc_tp->epoch, "\n";
  my $local_tp = localtime( $utc_tp->epoch );
  return $local_tp->strftime( '%Y-%m-%d %H:%M:%S' );
}

sub local_to_utc {
  my ($local_ts) = @_;
  $local_ts =~ s/^(\d{4}-\d{2}-\d{2}).(\d{2}:\d{2}:\d{2}).*$/$1 $2/
        or die "Illegal date format: $local_ts";
  my $local_tp = localtime->strptime( $local_ts, '%Y-%m-%d %H:%M:%S' );
  print "Local epoch is ", $local_tp->epoch, "\n";
  my $utc_tp = gmtime( $local_tp->epoch );
  return $utc_tp->strftime( '%Y-%m-%d %H:%M:%S' );
 }

my ($utc, $local);

# DST not in effect
$utc = '2015-03-08T06:59:00.399Z';
$local = utc_to_local( $utc );
print "DST not in effect: utc($utc) = local($local)\n";

# DST is in effect
$utc = '2015-03-08 07:00:00Z';
$local = utc_to_local( $utc );
print "DST *is in effect: utc($utc) = local($local)\n";

# DST not in effect
$local = '2015-03-08T01:59:00-05:00';
$utc = local_to_utc( $local );
print "DST not in effect: utc($utc) = local($local)\n";

# DST is in effect
$local = '2015-03-08T02:00:00-04:00';
$utc = local_to_utc( $local );
print "DST *is in effect: utc($utc) = local($local)\n";

# DST is in effect
$local = '2015-03-08T03:00:00-04:00';
$utc = local_to_utc( $local );
print "DST *is in effect: utc($utc) = local($local)\n";

exit;
~~~

Here is the output of the script. Note that the dates are one minute (60 epoch seconds) apart, but Daylight Savings Time in the Eastern time zone changes the time from 1:59am to 3:00am. Both 2:00am and 3:00am for that day return the same epoch time.

~~~sh
$ perl timezone.pl
UTC epoch is   1425797940
DST not in effect: utc(2015-03-08T06:59:00.399Z) = local(2015-03-08 01:59:00)
UTC epoch is   1425798000
DST *is in effect: utc(2015-03-08 07:00:00Z) = local(2015-03-08 03:00:00)
Local epoch is 1425797940
DST not in effect: utc(2015-03-08 06:59:00) = local(2015-03-08T01:59:00-05:00)
Local epoch is 1425798000
DST *is in effect: utc(2015-03-08 07:00:00) = local(2015-03-08T02:00:00-04:00)
Local epoch is 1425798000
DST *is in effect: utc(2015-03-08 07:00:00) = local(2015-03-08T03:00:00-04:00)
~~~
