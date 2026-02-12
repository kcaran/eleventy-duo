---
layout: post
title:  "Prerequisite Programming Tools for MacOS: Xcode, homebrew, and bash"
date:   '2025-07-25'
tags: [macos, bash, xcode, homebrew, coding, software]
permalink: posts/{{ title | slugify }}.html
---
Every time I set up a new Mac, I follow a specific process to install my command-line programming tools. My goal is simple: create a development environment that closely mirrors the RHEL web servers I work with daily. This guide outlines that process.

This guide outlines how to install three prerequisites to working from the command line on MacOS: Xcode command line tools, Homebrew, and bash. 

<!-- more -->

## Step 1: Install Xcode Command Line tools

The absolute first step on any new Mac is to install the Xcode Command Line Tools. This package provides essential developers tools like Git, and compilers like `clang` and `make`, which are necessary for building software from source.

Running a git command will automatically prompt you to install them:

```
% git --version
```

### Pro-Tip: Keeping XCode Tools Up-to-Date

Over time, these tools can become outdated, especially after a major macOS update. If you run into strange compilation errors, it's a good idea to reinstall them to get the latest version.

```
# First, remove the old tools
$ sudo rm -rf /Library/Developer/CommandLineTools
# Then, trigger the installation prompt again
$ xcode-select --install
```

## Step 2: Install Homebrew (Selectively)

I have a complicated relationship with Homebrew. On one hand, it's fantastic for quickly installing small utilities and dependencies. On the other, I find it unnecessarily complex for core programming languages that I might want to configure or modify myself.

My rule of thumb is: if I'm ever going to want to compile a tool with non-standard flags or inspect its source, I'll install it manually. For everything else, Homebrew is fine.

To install Homebrew, run the official command from their website. 

```
# This command will download and run the installation script.
% /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

One fun aspect (maybe the funnest) of Homebrew is the default location of the files seems to change regularly. According to [https://docs.brew.sh/Installation](), the default install location is `/usr/local` for Intel binaries and `/opt/homebrew` for the newer Apple Silicon (M-series).

## Step 3: Upgrade to a Modern Version of Bash

I'm (probably) too old to learn a new shell, and I don't want to use different shells when I'm on linux, so `bash` it is. 

Unfortunately, the version of `bash` that ships with macOS is ancient (version 3.2, from 2007). Apple has avoided updating it due to the more restrictive GPLv3 license of newer versions. This old version lacks critical features like modern tab-completion.

Thankfully, we can install a current version with Homebrew and set it as our default shell. The instructions on this blog post are excellent. 

https://www.unindented.org/blog/change-shell-to-latest-bash-on-macos/

```
# 1. Install the latest bash from Homebrew
$ brew install bash

# 2. Add the new bash to the list of approved shells
#    `brew --prefix` correctly finds the Homebrew path (/opt/homebrew or /usr/local)
$ sudo sh -c 'echo $(brew --prefix)/bin/bash >> /etc/shells'

# 3. Change your user's default shell to the new bash
$ chsh -s $(brew --prefix)/bin/bash

# Add this to your .bashrc
export BASH_SILENCE_DEPRECATION_WARNING=1
```

### Enable bash completion

Maybe this isn't necessary?? Brew actually has multiple formulas, but `bash-completion@2` is compatible with the later versions of bash.

$ brew install bash-completion@2

Then, add the following line to your `~/.bash_profile` to activate it for every new terminal session:

```
# Add to ~/.bash_profile
[ -f $(brew --prefix)/etc/bash_completion ] && . $(brew --prefix)/etc/bash_completion
```

## Install Better Command-Line Utilities

The default BSD-based versions of some tools on macOS are less feature-rich than their GNU counterparts. I use Homebrew to replace a few of them.

### less and lesskey

The BSD version of `less` doesn't support `lesskey`, but the Homebrew version is fine. You don't even have to run `lesskey` to convert the file to binary anymore!

```
$ brew install less
```

## Conclusion

And that's it! My Mac now has the basic tools that allows me to set up a simple, stable, and predictable development environment. 
