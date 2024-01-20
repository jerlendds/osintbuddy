---
title: Installation
description: Fetch data from different sources and returns the results as visual entities that you can explore step-by-step
---

Learn how to get OSINTBuddy set up in about 30 minutes. To start using the alpha version of OSINTBuddy, ensure you have the prerequisites then follow the installation steps.


**Prerequisites:**
- Git
- Docker & Docker Compose 
- _Windows only_:
   - WSL2
   - Tabby.sh _(optional)_

*Note that if you're on **Windows** and want this project to work you need unix line endings [(context)](https://stackoverflow.com/a/13154031). Before cloning, run: `git config --global core.autocrlf false`*


*Note that if you're running on an **Apple** device you will need to open your Docker app, select the **features in development** tab on the left hand side of the docker app, and enable/checkmark the `Use Rosetta for x86/64 emulation on Apple Silicon` option if you want this project to work*


## OSINTBuddy Install Instructions
1. Clone the repo and submodules
   ```bash
   git clone --recurse-submodules https://github.com/jerlendds/osintbuddy.git
   cd osintbuddy
   # using ssh?
   # git clone --recurse-submodules git@github.com:jerlendds/osintbuddy.git 
   ```

2. Install Docker & Compose
    - [Install Guide for Mac](https://docs.docker.com/desktop/install/mac-install/)
    - [Install Guide for Windows](https://docs.docker.com/desktop/install/windows-install/)
    - [Install Guide for Linux](https://docs.docker.com/desktop/install/linux-install/)

3. Start the stack with Docker:
   ```bash
   # ./launcher               # display usage information.
   # ./launcher bootstrap     # first time developing osintbuddy? read .github/CONTRIBUTING.md then run  
   #                            bootstrap to setup the development environments for the stack.
     ./launcher start         # start the osintbuddy app.
   # ./launcher stop          # stop the osintbuddy app.
   ```
   - **Note:** the stack will take a few minutes to startup while Solr and ScyllaDB configure themselves for JanusGraph. If you try to connect before all the databases are ready you will encounter errors.


You can now access OSINTBuddy through the URLs provided for the frontend, backend, and documentation.
- **Default login**:
   - username:  `osintbuddy`
   - password:  `osintbuddy`
- **URLs**
  - Frontend: [localhost:3000](http://localhost:3000)
  - Casdoor: [localhost:45910](http://localhost:45910)
  - Backend: [localhost:48997/api](http://localhost:48997/api)
  - Documentation: [localhost:48997/docs](http://localhost:48997/docs)
