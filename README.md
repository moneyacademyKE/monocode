<p align="center">
  <img src="public/monocode.png" alt="MonoCode" width="88" />
</p>

<h1 align="center">MonoCode</h1>

<p align="center">
  <strong>A GUI for your coding agents.</strong>
</p>

<p align="center">
  <img width="1680" height="1050" alt="MonoCode with agent sessions open side by side" src="https://github.com/user-attachments/assets/2cd4a6ec-eb1e-4b45-8627-a76442ea3874" />
</p>

Works with your subscriptions on Claude Code, Codex, Cursor, Grok Build, OpenCode, Antigravity, Pi, omp, fx, Hermes Agent, and Devin. If they’re installed and logged in, MonoCode can run them. Tabs are sessions. The composer is the input. MonoCode does not sell tokens.

## Why this fork exists

[OpenCrabs](https://github.com/adolfousier/opencrabs) is a coding agent that lives in your terminal and your chat channels. It has no desktop app of its own — no window, no tabs, no composer. [MonoCode](https://github.com/hardbeat920/monocode) is exactly that missing piece: a desktop platform for coding agents. This fork exists to put the two together, and then some:

- **A desktop home for OpenCrabs.** The adapter bundled here makes OpenCrabs a first-class provider in MonoCode — sessions as tabs, a model picker with the real model list, tool-call approval prompts, usage meters, everything the other agents get, driven by OpenCrabs' ACP server mode.
- **Downloads that work.** Upstream has paused new provider PRs, so this fork ships its own builds: macOS, Linux, and Windows binaries in [Releases](https://github.com/moneyacademyKE/monocode/releases/latest), built straight from the adapter branch.
- **Adapter fixes land here first.** Hardening like named connect failures, mode-switch error reporting, and the picker fixes ship in this fork's builds, then flow upstream via [PR #343](https://github.com/hardbeat920/monocode/pull/343).

The other half of the bridge — the ACP server inside OpenCrabs itself — is tracked upstream in [adolfousier/opencrabs#1674](https://github.com/adolfousier/opencrabs/pull/1674). If both PRs merge, this fork's remaining job is the release channel. Until then, it's the only place to get MonoCode and OpenCrabs in one installer.

## Install

Install and sign in to at least one supported agent first. See [provider setup](docs/providers.md) for instructions.

| Platform | Download |
| --- | --- |
| macOS, Apple Silicon | [MonoCode.dmg](https://github.com/moneyacademyKE/monocode/releases/latest) |
| Linux, x86_64 | [.deb, .rpm, or AppImage](https://github.com/moneyacademyKE/monocode/releases/latest) |
| Windows, x86_64 | [Installer](https://github.com/moneyacademyKE/monocode/releases/latest) |

On macOS, open the DMG and drag MonoCode to Applications. On Windows, run the installer. See [Linux setup](docs/install.md) for dependencies and package instructions.

## Get started

Open a project folder, choose an agent, and send a message. Each tab is a session. Split panes to work with sessions side by side.

- Keep conversations organized by project.
- Use separate Git worktrees for parallel tasks.
- Edit files and review changes in the app.
- Start a message with `/operator` to let an agent open sessions and manage worktrees and notes.

Monos are experimental agents that work across your projects. They keep a memory and can run scheduled tasks you set up with them.

MonoCode is still early. If something breaks, [report a bug](https://github.com/hardbeat920/monocode/issues).

## Guides

- [Provider setup](docs/providers.md)
- [Linux installation](docs/install.md)
- [Agent access with /operator](docs/agent-access.md)
- [Remote sessions, experimental](docs/remote-access.md)

## Build from source

You’ll need Node.js 20+ and a stable Rust toolchain. See [build setup](docs/building.md) for platform dependencies and packaging.

```bash
npm install
npm run tauri dev
```

### Ubuntu / Debian packages

On an Ubuntu/Debian workstation, the repository can install the native Tauri prerequisites and build distributable Linux packages directly:

```bash
npm run setup:linux:deb
npm ci
npm run build:linux
```

The Linux build emits `.deb` and AppImage bundles under `target/release/bundle/`.
`build:linux` repacks the AppImage so it uses the host WebKitGTK 4.1 stack instead of bundled Ubuntu libraries.

Prerelease tags such as `v0.9.1-beta.1` publish to `beta/latest.json`, and beta builds use that feed even when a stable updater endpoint is configured. Beta releases leave the stable feed and macOS download links unchanged. To trial AppImage updates, install a beta AppImage in a writable directory, publish a newer beta, and verify the update downloads, installs, and relaunches successfully before publishing a stable version.
Tauri loads `src-tauri/tauri.linux.conf.json` automatically for Linux development and builds.

### Fedora / Enterprise Linux packages

On Fedora, or on an Enterprise Linux 10 system (registered RHEL, Rocky, Alma, CentOS Stream, Oracle), install the release `.rpm` from [GitHub Releases](https://github.com/moneyacademyKE/monocode/releases/latest). Enterprise Linux needs EPEL first, because `webkit2gtk4.1` is an EPEL package there — CRB is not needed to run MonoCode. On Oracle Linux 10, `epel-release` does not enable `ol10_developer_EPEL`, which is the repository that provides that package. Enable it before installing the rpm:

```bash
# Enterprise Linux 10 only; skip on Fedora.
sudo dnf install -y epel-release   # RHEL: sudo dnf install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-10.noarch.rpm
# Oracle Linux 10, instead of epel-release:
# sudo dnf install -y oracle-epel-release-el10 dnf-plugins-core
# sudo dnf config-manager --set-enabled ol10_developer_EPEL
sudo dnf install ./MonoCode-*.rpm
```

The `.rpm` declares its own runtime dependencies, so `dnf` pulls the WebKitGTK stack for you. GitHub Releases builds that package on Enterprise Linux 10 so it loads on Fedora and EL 10. The AppImage also uses the host WebKitGTK 4.1 stack (`webkit2gtk4.1` on Fedora).

To build it yourself instead — which also enables EPEL 10 and CRB automatically, since the -devel packages need CRB:

```bash
npm run setup:linux:fedora
npm ci
npm run build:fedora
```

That emits a `.rpm` under `target/release/bundle/rpm/`, installable with `sudo dnf install ./target/release/bundle/rpm/MonoCode-*.rpm`. EL 9 and older are unsupported (`webkit2gtk4.1-devel` only exists in EPEL 10).

### Troubleshooting on Fedora / Wayland

The AppImage uses the host WebKitGTK 4.1 stack and native Wayland, like the `.deb` and `.rpm`. Install WebKit with `sudo dnf install webkit2gtk4.1` if the launcher asks for it. Set `GDK_BACKEND=x11` to keep the previous X11-forced behavior (for example NVIDIA plus Wayland). Older AppImages that bundled Ubuntu-built libraries aborted with `Could not create default EGL display: EGL_BAD_PARAMETER`; current builds do not.

### Windows packages

```bash
npm ci
npm run build:windows
```

The Windows build emits an NSIS installer under `target/release/bundle/nsis/`.
Tauri loads `src-tauri/tauri.windows.conf.json` automatically for Windows development and builds.

Small, focused contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## Contributors

Thanks to everyone who contributes to MonoCode!

[![MonoCode contributors](https://contrib.rocks/image?repo=hardbeat920/monocode)](https://github.com/hardbeat920/monocode/graphs/contributors)

Contributor image by [contrib.rocks](https://contrib.rocks).

## License

[MIT](LICENSE). Provider names and logos are trademarks of their owners. See [NOTICE](NOTICE).
