<div>
  <img src="/public/icon.png" width="70"/>
  <h1>Marker</h1>
  <p>An open-source, user-friendly UI for viewing and editing markdown files</p>
</div>

## Download

Navigate to the [release page](https://github.com/tk04/Marker/releases) and select the installer that matches your platform.

#### Using Hombrew
```bash
$ brew install --cask tk04/tap/marker
```

#### [AUR](https://aur.archlinux.org/packages/marker-md) for Arch Linux
##### Using `paru`
```bash
$ paru -S marker-md
```

##### Using `yay`
```bash
$ yay -S marker-md
```

## Building Locally

To build Marker locally, clone this repo and run the following commands (make sure to have Rust already installed on your system):

```sh
$ pnpm install && npx tauri build
```

## Contributing

If you feel that Marker is missing something, feel free to open a PR. Contributions are welcome and highly appreciated.
