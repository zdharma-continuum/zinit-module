# Contributing

## Repository layout

- `Src/zdharma_continuum/zinit.c` is the module source. `zinit.mdd` describes the module to the Zsh build system.
- `configure` is a plain shell script, not autoconf output. It downloads the matching Zsh release and writes `Makefile`.
- `.build/` holds the downloaded tarball and the Zsh build tree. `make distclean` deletes it.
- `scripts/mod-install.sh` is the installer for users without Zinit.

## Build and test

```zsh
./configure
make
```

Load the module in a clean shell to check a change:

```zsh
zsh -f -c 'module_path+=( "$PWD/Src" ); zmodload zdharma_continuum/zinit && zpmod source-study'
```

Also source a script from a read-only directory. The module cannot write a `.zwc` file there, so this runs the code path
for plain scripts.

To compile against another Zsh release, run `./configure --with-zsh-version=X.Y.Z` and `make`. A load test needs a Zsh
binary of that version.

Run `make distclean` to delete all build output.

## How the build works

`./configure` extracts the Zsh release into `.build/`. It copies `zinit.c` and `zinit.mdd` into the
`Src/zdharma_continuum/` directory of that tree and runs the Zsh configure script. `make` generates the Zsh headers and
compiles only the module. It never compiles Zsh itself.

The build workflow runs on each pull request and every week. It builds and loads the module on Ubuntu and macOS. It also
compiles the module against the newest Zsh release, so a Zsh release that breaks the module shows up in CI.

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
