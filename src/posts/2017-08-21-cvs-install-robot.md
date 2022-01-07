---
layout: post
title:  "Automatically Updating CVS Revisions Remotely"
date:   '2017-08-21'
tags: [coding, cvs]
permalink: posts/{{ title | slug }}/index.html
---
Our install process involves updating the CVS versions of individual files
on the staging and ultimately production servers. Web Operations is
responsible for manually updating the files listed on an electronic
install form.

After over ten years of this process, I finally realized that we could
automate this process, at least for the staging server. A cron script
polling a system mailbox every two minutes kicks off the process.

## CVS Command

Because the cron job runs under the Apache web server user, we need to
set the correct CVSROOT before every CVS command.

``` perl
my $CVS_CMD = "export CVS_RSH=ssh; cvs -d :ext:$ENV{ USER }\@cvs_server:/home/cvs";
```

It's more challenging than you would think to get both the latest (head)
version on the main branch as well as the currently installed version. 
To get the head use cvs log and to get the current version cvs status.

``` perl
my ($head) = `cd $file->{ directory }
	&& $CVS_CMD log $file->{ filename } | grep head`
		=~ /head:\s+$CVS_VERSION/;

my ($current) = `cd $file->{ directory }
	&& $CVS_CMD status $file->{ filename } | grep Working`
		=~ /:\s+$CVS_VERSION/;
```

If the desired version was different than the current, the script would
use a cvs update command to get the right version. If the desired version
is the same as the head, the script adds the -A option to the command to
clear any sticky tags.

As shown by the CVSROOT used, the CVS repository is on a different server,
so I set up SSH keys for the Apache user on both machines.

The cron job worked well if just a little slow. I showed it to some coworkers,
and one broke it right away! His installed had about 50 files, and the
script would stop connecting with the CVS repository entirely after updating
10 or so files.

After playing with adding timeouts between commands, I realized that the
company firewall was mistaking my script for a DOS attack! Every file needed
multiple CVS commands to process, and each of these commands would open a
new, individual SSH connection to the CVS repository. Eventually, the
firewall would simply ignore requests SSH commands from the staging server
for a few minutes, and the script would fail.  

The fix was to keep the SSH connection open using the ControlMaster feature.
That way, all of the CVS commands would use the same socket, and the
firewall saw them as a single request.

~~~
-bash-4.1$ cat .ssh/config
Host cvs_server
        ControlPath ~/.ssh/%r@%h:%p
        ControlMaster auto
        ControlPersist 10m
~~~
