---
layout: post
title:  "Adding Nodejs to MacOS"
date:   '2025-07-29'
tags: [macos, nodejs, coding, software]
permalink: posts/{{ title | slugify }}.html
---

There are many ways to install Node.js on MacOS, such as nvm or homebrew, but I've always preferred a direct, manual approach. For me, this method gives you complete control, involves no extra package managers, and makes upgrades transparent and simple.

This guide will walk you through manually installing Node.js on macOS (and the same principles apply to Linux).

<!-- more -->

### Why Install Manually?

Before we dive in, why avoid the popular tools?

*   **nvm (Node Version Manager):** Excellent for projects that require you to switch between different Node.js versions frequently. However, it adds a small amount of overhead to your shell's startup time and can be overkill if you just need one version.

*   **Homebrew:** A fantastic package manager for macOS, but it comes with its own dependencies and update cycles. Installing Node.js manually keeps it isolated from your other Homebrew-managed tools.

*   **Official Installer:** This works well, but it's a "black box." It runs scripts and places files on your system without you seeing exactly what's happening.

The manual method has the advantages of **simplicity and control**. You know exactly where the files are, and there are no other tools to manage.

### Step 1: Download the Binaries

Download the pre-built binaries from the official Node.js website. "Pre-built" means the code is already compiled for your machine, so you don't need to build it from source.

**[Go to the Node.js Downloads Page](https://nodejs.org/en/download)**

Look for the **"Standalone Binary (.gz)"**. You'll need to choose the right version for your Mac's architecture:
*   **ARM64:** For newer Macs with Apple Silicon (M1, M2, M3, etc.).
*   **x64:** For older Macs with Intel processors.

This will download a file like `node-v20.16.0-darwin-arm64.tar.gz` into your `Downloads` folder.

### Step 2: Install Node.js

Now, we'll unpack the archive and copy the files to `/usr/local`, a standard directory for user-installed software on macOS and other Unix-like systems. Placing the files here ensures that the `node` and `npm` commands are available in your terminal's `PATH`.

Open your terminal and run the following commands.

**Remember to replace the version number and architecture with the file you downloaded!**

```
# Navigate to your Downloads folder where the file was saved
$ cd ~/Downloads

# Unpack the archive (your filename will vary)
$ tar xvf node-v20.16.0-darwin-arm64.tar 
$ cd node-v20.16.0-darwin-arm64/

# Copy the directories into /usr/local
# The 'sudo' command is needed because /usr/local is a system-protected directory.
# The '-a' flag on 'cp' preserves the file structure and permissions.
$ sudo cp -a bin /usr/local
$ sudo cp -a include /usr/local
$ sudo cp -a lib /usr/local
$ sudo cp -a share /usr/local
```

### Step 3: Verify the installation

Check that node and npm are working correctly.

```
$ node --version
v20.16.0 

$ npm --version
10.8.1
```

If you see the version numbers, congratulations! Node.js is installed.

### Managing Global npm Packages

To install global NPM packages, I use the -E flag with sudo to preserve the user environment, which can help prevent certain permission errors.

```
# Example: installing node-sass globally
$ sudo -E npm install -g --unsafe-perm node-sass
```

### Upgrading

To upgrade `node`, first remove the installed version, and then repeat
the steps above:

```
$ sudo -E rm -rf /usr/local/bin/node /usr/local/bin/npm /usr/local/bin/npx /usr/local/include/node /usr/local/lib/node_modules /usr/local/share/doc/node /usr/local/share/man/man1/node.1
```
