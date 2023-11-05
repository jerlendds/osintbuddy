# Contributing to OSINTBuddy

Hey, thanks for your interest in contributing! We're always looking for more hands to help out on the project. Please check out the [CONTRIBUTOR_AGREEMENT.md](./CONTRIBUTOR_AGREEMENT.md) before filing your first PR: [forum.osintbuddy.com/t/osintbuddy-contributor-agreement](https://forum.osintbuddy.com/t/osintbuddy-contributor-agreement/23)

*Note: this contributing document is a work-in-progress, if you notice any instructions or steps missing feel free to include them and make a PR. If you run into any issues and need some help, feel free to contact me on the [OSINTBuddy Discord](https://discord.gg/gsbbYHA3K3) or by email [jerlendds@osintbuddy.com](mailto:jerlendds@osintbuddy.com)* 

## Setting up the development environments


### Setting up the frontend

We're using **`Node` v18.18.2** on the frontend. I personally use [nvm](https://github.com/nvm-sh/nvm) to manage multiple Node environments for me. To setup `nvm` and install `Node` you can run:
```bash
# install and setup nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
source ~/.bashrc

# installing and enabling Node 18.18.2
nvm install 18
nvm use 18
```

### Setting up the backend

We're using **`Python` 3.11.4** on the backend. I use and recommend checking out the [pyenv](https://github.com/pyenv/pyenv) project for managing multiple Python installations. However, do note Pyenv does not officially support Windows and does not work in Windows outside the Windows Subsystem for Linux (which we **highly recommend** using, I don't have the time or energy to support Windows specific ['features'](https://www.gnu.org/proprietary/malware-microsoft.en.html))

```bash
# run the automatic installer
curl https://pyenv.run | bash
# optionally, compile a dynamic bash extension to speed up pyenv. if this fails pyenv still works normally
cd ~/.pyenv && src/configure && make -C src

# setup your shell environment
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo 'command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(pyenv init -)"' >> ~/.bashrc
```
