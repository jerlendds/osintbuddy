# Contributing to OSINTBuddy

Hey, thanks for your interest in contributing! We're always looking for more hands to help out on the project. Please check out the [CONTRIBUTOR_AGREEMENT.md](./CONTRIBUTOR_AGREEMENT.md) before filing your first PR: [forum.osintbuddy.com/t/osintbuddy-contributor-agreement](https://forum.osintbuddy.com/t/osintbuddy-contributor-agreement/23)

*Note: this contributing document is a work-in-progress, if you notice any instructions or steps missing feel free to include them and make a PR. If you run into any issues and need some help, feel free to contact me on the [OSINTBuddy Discord](https://discord.gg/gsbbYHA3K3) or by email [jerlendds@osintbuddy.com](mailto:jerlendds@osintbuddy.com)* 

## Setting up the development environments

### Downloading Git and Docker Compose

Let's make sure your system is updated...

```bash
sudo apt update && sudo apt upgrade
sudo apt upgrade git
```

Now it's time to setup docker/compose. Assuming you already have the `curl` command installed you can run the following:

```bash
curl https://get.docker.com | bash
sudo groupadd docker
sudo usermod -aG docker $USER
```

Log out and back in so that your group membership is re-evaluated or run `newgrp docker`.
Now we're going to configure docker to start on boot.

```bash
sudo systemctl enable docker.service
sudo systemctl enable containerd.service
```


We recommend using vscode (or `vscodium`) for development and disabling automatic extension updates:
![image](https://github.com/jerlendds/osintbuddy/assets/29207058/6e032a23-ddf2-42a4-ad6f-21ab93e0ff90)

Once automatic extension updates are disabled let's download and install a Python extension for an improved Python development experience. Here's some [context](https://github.com/VSCodium/vscodium/issues/1556) on why we're downloading this version. Download url: [marketplace.visualstudio.com/_apis/public/gallery/publishers/ms-python/vsextensions/vscode-pylance/2023.6.40/vspackage](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/ms-python/vsextensions/vscode-pylance/2023.6.40/vspackage)

To install the extension manually press `CTRL+SHIFT+X` or click on the extensions tab to open the extensions sidebar then select the 3 dots at the top...

![image](https://github.com/jerlendds/osintbuddy/assets/29207058/bc592ef7-e296-4bcc-b42e-3649514e5c50)

Select the previously downloaded Pylance `.vsix` file and proceed with the installation. We also recommend installing extensions for TypeScript/JavaScript alongside the prettier and eslint extensions. If you're using VSCodium, check out [their docs on how to use Microsoft's VS Code Marketplace](https://github.com/VSCodium/vscodium/blob/master/docs/index.md#How-to-use-a-different-extension-gallery) 



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

Here are the basic installation instructions that install the Python build dependencies and pyenv. I recommend checking out their docs if you run into any issues installing Python 3.11.4.

```bash
# install build deps
sudo apt update; sudo apt install build-essential libssl-dev zlib1g-dev \
libbz2-dev libreadline-dev libsqlite3-dev curl \
libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev python3.11-venv jq

# run the automatic installer
curl https://pyenv.run | bash

# setup your shell environment
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo 'command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(pyenv init -)"' >> ~/.bashrc
source ~/.bashrc
```

After setting up the above you should reboot/open a new terminal/source your new environment for these changes to take effect. Once you do that the `pyenv` command will be available.

```bash
# install and use python 3.11.4
pyenv install 3.11.4
pyenv global 3.11.4
```

We also need yq for some of the launcher commands. To install yq run:
```bash
python3 -m pip install yq
```
