---
layout: post
title:  "A Guide to Building Perl From Source on macOS"
date:   '2025-07-30'
tags: [macos, perl, coding, software]
permalink: posts/{{ title | slugify }}.html
---
This guide explains how I install a clean version of Perl from source on macOS, along with the modules that I use every day.

My philosophy for programming tools is to try to keep things as simple and transparent as possible. I often find that modern package and version managers, while powerful, add layers of complexity I don't need. I rarely require multiple versions of a programming language on the same machine, and I don't want to hunt for where my binaries and libraries are located. Instead, I prefer a stable, predictable architecture where I know exactly where to find everything.

<!-- more -->

## Prerequisites

This guide assumes you have a basic command-line development environment set up on your Mac. Specifically, you'll need the **Xcode command line tools** and **Homebrew**, as we'll use Homebrew to install a couple of dependencies.

If you're starting from a fresh macOS installation, I recommend following my other guide first: **[Prerequisite Programming Tools for macOS: Xcode, Homebrew, and Bash](https://www.kcaran.com/posts/prerequisite-programming-tools-for-macos-xcode-homebrew-and-bash.html)**.

Once you have Homebrew installed, you're ready to proceed.

## The Golden Rule: Don't Touch System Perl

Before we start, here is the most important rule for using Perl on macOS, which I have learned the hard way:

```
********************************************
** Do *not* use the system Perl on MacOS. **
**     It is for Apple, not for you.      **
********************************************
```

Apple includes a version of Perl with macOS for its own system scripts and internal use. You should treat it as part of the operating system, not as a development tool. If you try to install modules to it or modify it, future macOS updates could overwrite your changes or, worse, break system functionality that depends on it. Leaving it alone is the safest and smartest path.

## Why Not Just Use Homebrew?

The most common way to install packages on macOS is with [Homebrew](https://brew.sh/). So, why not just run `brew install perl`?

In my experience, installing Perl via Homebrew creates a complex web of symbolic links and version-specific directories (e.g., `/opt/homebrew/Cellar/perl/5.38.2/...`). This makes it difficult to have a stable, version-agnostic path for my scripts and libraries. Upgrading the Perl version via Brew can sometimes feel like a major migration.

Because Perl is famously backward-compatible, I don't feel this level of compartmentalization is necessary for my workflow. I prefer to build it from source and install it directly into `/usr/local/`, just like in the old days. This gives me one predictable location for the Perl binary (`/usr/local/bin/perl`) and its libraries.

## The Installation Process

Here are the step-by-step instructions for downloading and compiling Perl from source.

### Step 1: Install Prerequisites

We'll need `wget` to download the source code. If you don't have it, you can install it with Homebrew.

```bash
brew install wget
```

### Step 2: Download and Unpack the Perl Source

Navigate to your Downloads folder, grab the latest stable Perl source code from CPAN, and unpack it.

```
# Go to your downloads directory
cd ~/Downloads

# Download the source (check cpan.org for the latest version)
$ wget https://www.cpan.org/src/5.0/perl-5.40.0.tar.gz

# Unpack the archive
tar -xvzf perl-5.40.0.tar.gz 

# Change into the new directory
$ cd perl-5.40.0/
```

### Step 3: Configure the Build

This is the most important step. We'll run the Configure script with specific flags to tell it exactly where to install everything.

```
$ Configure -des \
    -Dprefix=/usr/local \
    -Dsitelib='/usr/local/lib/site_perl' \
    -Dsitelib_stem='/usr/local/lib/site_perl' \
    -Dsitelibexp='/usr/local/lib/perl5/site_perl' \
    -Dsitearch='/usr/local/lib/site_perl/'
    -Dsitearchexp='/usr/local/lib/site_perl/' \
    -Dinstallsitearch='/usr/local/lib/site_perl/' \
    -Darchlib='/usr/local/lib/perl5/' \
    -Dprivlib='/usr/local/lib/perl5/'
```

What do these flags mean?

* **-des**: A common set of defaults. `d` uses default answers for configuration questions, `e` ensures the build continues on its own, and `s` silences most of the verbose output.

* **-Dprefix=/usr/local**: This is the master key. It sets the main installation directory to `/usr/local`. The Perl binary will be installed at `/usr/local/bin/perl`.

* **-Dprivlib** & **-Darchlib**: These flags define where Perl's standard library files will go. We're pointing them to a clean `/usr/local/lib/perl5` directory.

* **-Dsitelib** & **-Dsitearch**: These define where add-on CPAN modules will be installed. We're pointing them to a subdirectory, `/usr/local/lib/perl5/site_perl`, to keep them separate from the core library.

### Step 4:  Build, Test, and Install

Now we compile the source code, run the built-in tests to ensure everything works correctly, and finally, install it.

```
# Compile the source code. This can take a few minutes.
$ make

# Run the test suite. This is crucial to ensure the build is stable.
$ make test

# Install the compiled files into /usr/local/.
# We use `sudo` because we are writing to a system-protected directory.
$ sudo make install
```

After this, you should close and reopen your terminal. You can verify the new Perl is your default by running which perl, which should now output /usr/local/bin/perl.

## Essential Tools: cpanm and ack

With Perl installed, the next step is to install `cpanm`, a fast and friendly client for installing modules from CPAN. We'll also install ack, a fantastic code-searching tool written in Perl that acts as a better grep.

```
# Install cpanm (cpanminus)
curl -L https://cpanmin.us | perl - --sudo App::cpanminus

# Use our new cpanm to install ack
sudo cpanm App::Ack
```

## My Commonly Used Perl Modules

Here are a few of the modules I install on every new machine.

```
# For classic web scripting and handling parameters
$ cpanm --sudo CGI

# A modern, simple API for file and directory manipulation
$ cpanm --sudo Path::Tiny

# A beautiful data dumper for debugging
$ cpanm --sudo Data::Printer

# A powerful, real-time web framework (and associated tool set)
$ cpanm --sudo Mojolicious
```

## Improving the Perl Debugger with Readline

The default Perl debugger is powerful but can be clunky. Installing `Term::ReadLine::Gnu` gives it command history and better editing capabilities, similar to the standard Bash shell. It depends on the readline library, which we can install with Homebrew.

```
# Install the readline library
brew install readline

# Install the necessary Perl modules for the debugger
$ cpanm --sudo DB::Pluggable
$ cpanm --sudo Term::ReadLine::Gnu
```

## Setting Up Playwright for Browser Automation

`Playwright.pm` is a Perl interface to the powerful Playwright browser automation framework from Microsoft. It's excellent for testing web applications. Setting it up requires a few extra steps because it depends on Nodejs.

[Here is my post on how to install Nodejs on MacOS](https://www.kcaran.com/posts/adding-nodejs-to-macos.html)

### Step 1: Install Node.js Dependencies

Playwright.pm is a wrapper around the JavaScript Playwright library, so we need to install it first using npm (the Nodejs package manager).

```
# Install the playwright library and its dependencies globally using npm.
# The -E flag preserves the environment, which can be important for sudo.
$ sudo -E npm install -g uuid express playwright

# Download the browser binaries (Chrome, Firefox, WebKit) that Playwright uses.
$ npx playwright install
```

### Step 2: Install the Perl Modules

Now we can install the Perl modules that interface with Playwright. I've had issues in the past with its dependencies, so I install Test2::Harness and Sereal::Encoder separately as a precaution.

```
$ cpanm --sudo Test2::Harness
$ cpanm --sudo Sereal::Encoder
$ cpanm --sudo Playwright
```

And that's it! You now have a clean, robust, and predictable Perl environment on your Mac, ready for development. 
