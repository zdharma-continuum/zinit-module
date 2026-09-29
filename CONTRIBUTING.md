# Contributing

## Repository layout

- `Src/zdharma_continuum/zinit.c` is the module source. `zinit.mdd` describes the module to the Zsh build system.
- `Src/`, `Config/`, `configure.ac`, and `aczsh.m4` hold the Zsh 5.3.1 sources and build system. The module build needs
  them for headers and generated prototypes.
- `configure`, `config.h.in`, and `stamp-h.in` come from autoconf. The repository tracks them, so users do not need
  autoconf.
- `scripts/mod-install.sh` is the installer for users without Zinit.
- `scripts/copy_from_zsh_src.zsh` copies sources from a Zsh checkout into this repository.

## Build and test

```zsh
./configure --disable-gdbm --without-tcsetpgrp
make
```

The repository has no automated tests. Load the module in a clean shell to check a change:

```zsh
zsh -f -c 'module_path+=( "$PWD/Src" ); zmodload zdharma_continuum/zinit && zpmod source-study'
```

For Homebrew Zsh, copy `Src/zdharma_continuum/zinit.so` to `zinit.bundle` first. Also source a script from a read-only
directory. The module cannot write a `.zwc` file there, so this runs the code path for plain scripts.

Run `make distclean` to delete all build output.

## Regenerate `configure`

After you change `configure.ac` or `aczsh.m4`, run:

```zsh
./.preconfig
```

This script needs `autoconf` and `autoheader`. Commit `configure`, `config.h.in`, and `stamp-h.in` together with the
source change. By default, `make` runs autotools only when one of these files is missing.

To let `make` regenerate them after each edit, configure your checkout in maintainer mode:

```zsh
./configure --enable-maintainer-mode --disable-gdbm --without-tcsetpgrp
```

## Sync the Zsh sources

```zsh
scripts/copy_from_zsh_src.zsh /path/to/zsh
```

The script runs `git clean -dxf` in this repository after a 3-second pause. That command deletes all untracked and
ignored files. The script then copies `configure.ac` and the `Src/*.c` and `Src/*.h` files that already exist here.
Last, it applies `patch_cfgac.diff` to `configure.ac`. Check that the patch applied, then run `./.preconfig` and
rebuild.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>(<scope>): <subject>
```

- Use one of these types: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`.
- Write the subject in lowercase. Only environment variable names, such as `$ZPFX`, can use uppercase.
- Keep the header at 80 characters or less.

The commit lint workflow checks the pull request title and every commit in the pull request. The rules are in
`commitlint.config.mjs`. To check your branch before you push, run:

```sh
npx --yes --package @commitlint/cli@21 --package @commitlint/config-conventional@21 -- commitlint --from origin/main
```

## Releases

Each push to `main` runs the release workflow. [semantic-release](https://semantic-release.gitbook.io/) reads the
commits since the last tag and picks the next version:

| Commit                                             | Release    |
| -------------------------------------------------- | ---------- |
| `fix` or `perf`                                    | Patch      |
| `feat`                                             | Minor      |
| `!` after the type, or a `BREAKING CHANGE:` footer | Major      |
| Other types                                        | No release |

For a release, the workflow updates `CHANGELOG.md` and `VERSION` and pushes that commit to `main`. It then tags the
commit `vX.Y.Z` and creates a GitHub release. A squash merge uses the pull request title as the commit message. The
title therefore sets the release type.
