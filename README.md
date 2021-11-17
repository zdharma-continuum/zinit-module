# Zinit Module

[![MIT License][mit-badge]][mit-link] [![Join the chat at https://gitter.im/zdharma-continuum/zinit][gitter-badge]][gitter-link]

## Motivation

The module is a binary Zsh module (think about `zmodload` Zsh command, it's that topic) which transparently and
automatically **compiles sourced scripts**. Many plugin managers do not offer compilation of plugins, the module is
a solution to this. Even if a plugin manager does compile plugin's main script (like Zinit does), the script can
source smaller helper scripts or dependency libraries (for example, the prompt `geometry-zsh/geometry` does that)
and there are very few solutions to that, which are demanding (e.g. specifying all helper files in plugin load
command and investigating updates to the plugin – in Zinit case: by using `compile` ice-mod).

![image](https://raw.githubusercontent.com/zdharma-continuum/zinit/images/mod-auto-compile.png)


## Installation

### Without Zinit

To install just the binary Zinit module **standalone** (Zinit is not needed, the module can be used with any
other plugin manager), execute:

```zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/zdharma-continuum/zinit-module/HEAD/scripts/mod-install.sh)"
```

This script will display what to add to `~/.zshrc` (2 lines) and show usage instructions.

### With Zinit

Zinit users can build the module by issuing following command instead of running above `mod-install.sh` script
(the script is for e.g. `zgen` users or users of any other plugin manager):

```zsh
zinit module build
```

This command will compile the module and display instructions on what to add to `~/.zshrc`.

## Measuring Time of `source`s

Besides the compilation-feature, the module also measures **duration** of each script sourcing. Issue `zpmod source-study` after loading the module at top of `~/.zshrc` to see a list of all sourced files with the time the
sourcing took in milliseconds on the left. This feature allows to profile the shell startup. Also, no script can
pass-through that check and you will obtain a complete list of all loaded scripts, like if Zshell itself was
investigating this. The list can be surprising.

## Debugging

To enable debug messages from the module set:

```zsh
typeset -g ZPLG_MOD_DEBUG=1
```

[gitter-badge]: https://badges.gitter.im/zdharma-continuum/zinit.svg
[gitter-link]: https://gitter.im/zdharma-continuum/community
[mit-badge]: https://img.shields.io/badge/license-MIT-blue.svg
[mit-link]: ./LICENSE

<!-- vim:set ft=markdown tw=80 fo+=1n: -->
