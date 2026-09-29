# Zinit Module

[![MIT License][mit-badge]][mit-link]
[![Join the chat at https://gitter.im/zdharma-continuum/zinit][gitter-badge]][gitter-link]

A binary Zsh module that compiles every script you `source`. Load it with `zmodload`, and it replaces the `source` and
`.` builtins. Each sourced script gets compiled to a `.zwc` file, and later loads read the compiled file. The module
also records how long each `source` call takes. It works with Zinit or any other plugin manager.

Many plugin managers do not compile plugins. Zinit compiles the main file of a plugin, but that file often sources
helper scripts or libraries. The `geometry-zsh/geometry` prompt is one example. Without the module, you must list each
helper file in a `compile` ice to get it compiled.

![image](https://raw.githubusercontent.com/zdharma-continuum/zinit-module/HEAD/images/mod-auto-compile.png)

## Requirements

- Zsh with dynamic module support. The module works with Zsh 5.8, 5.9, and 5.9.2 on macOS. Other versions and systems
  are untested.
- A C compiler (`clang` or `gcc`), `make`, and `git`.

You do not need autoconf. The repository includes the generated `configure` script.

## Install

### With Zinit

```zsh
zinit module build
```

The command clones or updates the module in `${ZINIT[MODULE_DIR]}`, which defaults to `${ZINIT[HOME_DIR]}/module`. Then
it runs `./configure` and `make`, and prints the two lines to add to `~/.zshrc`. Run `zinit module info` to print them
again. Add `--clean` to run `make distclean` before the build.

The build runs `git clean` and `git reset --hard` in the module directory. Do not keep local changes there.

### Without Zinit

```sh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/zdharma-continuum/zinit-module/HEAD/scripts/mod-install.sh)"
```

The script clones the repository to `${ZDOTDIR:-$HOME}/.zinit/mod-bin` and builds it. Run it again to update and
rebuild.

The script prints `zdharma-continuum/zinit` as the module name. The correct name has an underscore:
`zdharma_continuum/zinit`. Use the lines in [Load the module](#load-the-module).

### Build by hand

```zsh
git clone https://github.com/zdharma-continuum/zinit-module.git
cd zinit-module
./configure --disable-gdbm --without-tcsetpgrp
make
```

The build writes the module to `Src/zdharma_continuum/zinit.so`.

### File suffix on macOS

Zsh loads modules with the suffix that its own build used. The macOS system Zsh (`/bin/zsh`) loads `zinit.so`. Homebrew
Zsh loads `zinit.bundle`. `zinit module build` creates both files. After a build with `mod-install.sh` or by hand, copy
the file for Homebrew Zsh:

```zsh
cp Src/zdharma_continuum/zinit.so Src/zdharma_continuum/zinit.bundle
```

## Load the module

Add these lines at the top of `~/.zshrc`, before Zinit and any plugins. Replace the path with the `Src` directory of
your module checkout. `zinit module build` prints the exact path.

```zsh
module_path+=( "$HOME/.local/share/zinit/module/Src" )
zmodload zdharma_continuum/zinit
```

Check that the module loaded:

```zsh
zmodload | grep zdharma_continuum/zinit
zpmod -h
```

To unload the module and restore the original `source` and `.` builtins, run:

```zsh
zmodload -u zdharma_continuum/zinit
```

## Usage

### Automatic compilation

When you source a file, the module compiles it to `file.zwc` if the `.zwc` file is missing or older than the script. It
compiles only when it can write to the directory of the script. Then it loads the `.zwc` file. If no current `.zwc` file
exists, the module sources the plain script.

Aliases that exist when you run `source` expand in the compiled script, as they do in a plain `source`. The `.zwc` file
keeps those aliases until the script changes. Zsh compiles the whole file before it runs any line. An alias that the
script defines therefore does not apply to later lines of the same script. Compiled scripts see `file` at the end of
`$ZSH_EVAL_CONTEXT`, as plain scripts do.

### Measure the time of `source` calls

```zsh
zpmod source-study
zpmod source-study -l
```

`zpmod source-study` lists every file loaded with `source` or `.`, with the load time in milliseconds. The `-l` option
shows full paths. Load the module at the top of `~/.zshrc` to profile the whole shell startup.

### Append to a Zinit report

```zsh
zpmod report-append {plugin-ID} {text}
```

This command appends text to `ZINIT_REPORTS[{plugin-ID}]`. It fails if Zinit is not loaded or if the plugin has no
report entry.

## Debugging

```zsh
typeset -g ZINIT_MOD_DEBUG=1
```

With this variable set to `1`, the module tries to compile scripts in directories that it cannot write to. It also warns
when it cannot read a script.

If `zmodload` fails after a Zsh upgrade, rebuild the module.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

<!-- vim:set ft=markdown tw=80 fo+=1n: -->

[gitter-badge]: https://badges.gitter.im/zdharma-continuum/zinit.svg
[gitter-link]: https://gitter.im/zdharma-continuum/community
[mit-badge]: https://img.shields.io/badge/license-MIT-blue.svg
[mit-link]: ./LICENSE
