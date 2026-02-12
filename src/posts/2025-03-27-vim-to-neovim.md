---
layout: post
title:  "Vim is a Text Editor, Neovim is an IDE"
date:   '2025-03-27'
tags: [vim, software, coding]
permalink: posts/{{ title | slugify }}.html
---

It's been on my list for some time to finally start using Neovim and all that it has to offer as an IDE. As an experienced Vim user, it was hard deciding on what path I should take to convert over. Almost by definition, Vi users are all distinct snowflakes and have their preferred tools and methodologies. That makes it hard to choose who's advice to follow.

### Takeaway

After trying (and failing) to bolt on the IDE components to my current Vim configuration, I came away with the feeling that I can still use Vim as a text editor, but to use Neovim as an IDE I should start from scratch with one of the pre-configured flavors.

Note that I was successful in porting my current Vim configuration, so it would be possible to use Neovim as my 'Vim'. But for now I think it is safest (and sanest) to maybe use both in tandem for different types of editing.

<!-- more -->

## My Process for Installing and Converting to Neovim

Even though I may scrap my configuration, this is how I tried to install and configure Neovim on my Macbook and on our RHEL 8 web servers.

### Macbook Installation

#### Installation

Any time I can avoid Homebrew I view it as a win. Fortunately, Neovim comes with pre-built releases for macOS:

```
$ curl -LO https://github.com/neovim/neovim/releases/download/nightly/nvim-macos-arm64.tar.gz
$ tar xzf nvim-macos-arm64.tar.gz
$ cd nvim-macos-arm64
$ sudo cp -a * /usr/local/
```

Running it the first time, Apple complains about all the shared libraries being downloaded from the internet.

#### Lua

This is the first big gotcha I had and I'm still kind of unclear. Neovim has Lua 5.1 embedded inside, so you don't really need to install it, **UNLESS...** ?? Unless what? The [lazy.nvim](https://lazy.folke.io/) package manager suggests that you might need `luarocks`, which means you would need lua 5.1 installed globally. Oh, and maybe LuaJIT 2.1 (which will automatically build lua?)?

I downloaded lua 5.1 and built in from source and was proud of myself, but now I think I should have tried to use LuaJIT.

#### lazy.nvim Package Manager

My plugin manager of choice on the Vim side is pathogen with a bash script that downloads the plugins from GitHub (or wherever). So using an actual **package** manager was a leap, especially trying to configure it in Lua.

I went back and forth on whether to use a package manager and struggled with the first plugin I tried to import (vim-hexokinase). Fortunately, this was actually the most (only) complicated plugin. Once I had it working, it was smooth sailing.

[The installation documentation](https://lazy.folke.io/installation) was both straightforward and slightly unclear. I copy-pasted the `lazy.lua` file, which tripped me up later because it redefined the leader character, but otherwise worked ok. For [defining (structuring?) my plugins](https://lazy.folke.io/usage/structuring) I used the `~/.config/nvim/lua/plugins.lua` file.

The lazy.nvim manager gives you a number of different hooks into the plugins: `config`, `opts`, and `init`. For vim-hexokinase, my woes were I was defining configuration in `config`, and then `opts`, but these were both too late in the start-up process.

```
 {
    "vim-hexokinase",
    init = function()
       vim.g.Hexokinase_highlighters = { 'backgroundfull' }
       vim.g.Hexokinase_palettes = { vim.fn.expand('$HOME') .. '/environ/safety_colors.json' }
    end,
 },
```

#### .vimrc to init.lua

Finally, I dumped my `.vimrc` file into an llm and asked it to convert the file to `init.lua`. It definitely saved me a lot of typing, but it really had trouble converting some strings to lua tables.

I also had to remove a number of stripped "legacy" features. This page was helpful:

https://neovim.io/doc/user/vim_diff.html#_removed-legacy-features

## Attempt at adding IDE features and conclusion

Unfortunately, attempting to add all the whiz-bang IDE features that made me go on this journey in the first place was not very successful. This was mainly because I was trying to use them on RHEL 8, which is simply too old for it to be a seamless process.

While `vim` itself works almost everywhere and is extremely stable in that you don't need to be on the latest version for it to work, Neovim is still in a state of flux. It has much higher aspirations to become a full-fledged IDE complete with AI code completion. This means that breaking changes are inevitable and keeping your software up to date is critical.

While I haven't given up on using Neovim as an IDE, my next attempt will be on a single platform using a base configuration [LazyVim seems to fit the bill](https://www.lazyvim.org/). Then I'll gradually add my configuration into it, instead of the other way around.


