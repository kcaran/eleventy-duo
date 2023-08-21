---
layout: post
title:  "Java Terminator: Cross-Platform Terminal Emulator"
date:   '2010-11-05'
tags: [coding, software]
permalink: posts/{{ title | slugify }}.html
---

For years, I've been searching for a suitable terminal emulator for
<a href="https://www.cygwin.com">Cygwin</a>, but nothing seemed as
polished or had enough features to pull me away from the boring
default.

I finally found the Holy Grail in a program I'll call
[Java Terminator](https://github.com/software-jessies-org/jessies/wiki/Terminator).
The authors of this fine program just call it <i>Terminator</i>, but unfortunately a later Linux GNOME-based terminal emulator
[of the same name](https://launchpad.net/terminator)
stole some of their thunder.

<!-- more -->

The best part of
[Java Terminator](https://github.com/software-jessies-org/jessies/wiki/Terminator)
(and there are many excellent parts) is that, because it is written in Java, it runs on Cygwin, Linux, and MacOS.  I'm able to use it at home on my Windows XP box and at work on Ubuntu, with no issues.  Other terrific features are multiple tabs (liked tabbed web browsing, only with many terminals per window), unlimited scrollback, and automatic logging of everything.


As with any cross-platform program, there are a few configuration differences or issues to be aware of:

### Redhat (RHEL5.2) and Centos

* Creating `~/.terminfo/t/terminator` or `/usr/share/terminfo/t/terminator` doesn't have any effect on the shell,
<b>vim</b>, or <b>less</b> or <b>man</b> commands.  After
installing the terminfo, create a section for terminator in termcap.

	~~~ bash
	$ sudo sh -c "infocmp -C >> /etc/termcap"
	~~~

	To do this locally (when you don't have root access), you need to
	both create `~/.termcap` and set the TERMCAP environmental
	variable.

	~~~ bash
	$ infocmp -C > ~/.termcap
	$ export TERMCAP=~/.termcap
	~~~

* I was never able to get color working with Redhat's version of <b>vim</b>.  Instead, I downloaded vim and built it from source.  The built version uses ncurses instead of termcap, and it colors fine.

### Debian (4.0) and Ubuntu

* Create either `~/.terminfo/t/terminator` or `/usr/share/terminfo/t/terminator`.  These distributions don't use termcap, so everything just works!

### Cygwin

* I first tried creating `/usr/share/terminfo/t/terminator`
(without a local `~/.terminfo`).  Vim worked fine, but the shell
gave me a <b>No entry for terminal type "terminator"</b> error.  The
<b>less</b> and <b>man</b> commands both gave <b>WARNING: terminal is not fully functional</b> messages.  Added a local `~/.terminfo`
didn't help.

* Adding a record to termcap solved the shell issue, but not
<b>less</b> or <b>man</b>.  

	~~~ bash
	$ infocmp -C >> /etc/termcap
	~~~

	The <b>infocmp</b> command is part of the <b>ncurses</b> package.

	It turns out, when I installed Cygwin, I set the default to Unix line feeds.  But the <b>infocmp</b> command spits out DOS line feeds!  
So my termcap file had Unix line feeds except for the terminator section.  Apparently, the shell could still read the file, but the <b>less</b> and <b>man</b> commands could not.  The <b>dos2unix</b>
command solved the problem!

	~~~ bash
	$ dos2unix /etc/termcap
	~~~

* After that initial set-up, I've had no problems with emulator at all.  The program has an active <a href="https://groups.google.com/group/terminator-users/">Google group and mailing list</a>.  The authors and enthusiasts there are more than helpful.
