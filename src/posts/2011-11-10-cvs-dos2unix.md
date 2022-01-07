---
layout: post
title:  "'No such file or directoryectory' in CVS update"
date:   '2011-11-10'
tags: [coding, cvs]
permalink: posts/{{ title | slug }}/index.html
---

When I execute a CVS update command at work, I often get the following error:

~~~
[caran@mater safetypublic]$ cvs -q update -AdP
: No such file or directoryectory /home/cvs/safetypublic/rsvp
cvs update: skipping directory rsvp
~~~

**No such directoryectory?**  What the heck is that??

<!-- more -->

Most of my colleagues don't work directly on the Linux-based web servers.  They
use TortoiseCVS on their workstations using a shared drive.  For some reason,
it occasionally (but not always) will convert the files in the CVS directory
to DOS line endings.

The fix is simple.  Use the `dos2unix` command to reset the CVS files to
Unix line endings.  It's the `repository` file that causes the error.

~~~
[caran@mater safetypublic]$ cd rsvp/
[caran@mater rsvp]$ dos2unix CVS/*
dos2unix: converting file CVS/Entries to UNIX format ...
dos2unix: converting file CVS/Repository to UNIX format ...
[caran@mater rsvp]$ cvs -q update -AdP
M index.html
M rsvp-thankyou.html
[caran@mater rsvp]$ 
~~~

**NOTE:** Interestingly, a colleague of mine gets a slightly different
error, but the cause and cure are both the same:

~~~
: No such file or directoryctory
~~~
