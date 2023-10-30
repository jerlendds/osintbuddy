[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Total Downloads](https://static.pepy.tech/badge/osintbuddy)](https://pepy.tech/project/osintbuddy)
[![Downloads](https://static.pepy.tech/badge/osintbuddy/week)](https://pepy.tech/project/osintbuddy)
[![OpenCollective Backers](https://badgen.net/opencollective/backers/osintbuddy)](https://opencollective.com/openinfolabs/projects/osintbuddy#category-CONTRIBUTE)


<br />


<p>
  <a href="https://github.com/jerlendds/osintbuddy">
    <img src="./ob/_assets/watermark.svg" height="130px" alt="OSINTBuddy Logo">
  </a>

> *I have no data yet. It is a capital mistake to theorize before one has data. Insensibly
> one begins to twist facts to suit theories, instead of theories to suit facts.*


-------
| &nbsp;&nbsp; [osintbuddy-plugins](https://github.com/jerlendds/osintbuddy-plugins) &nbsp;&nbsp; | [osintbuddy.com](https://osintbuddy.com) | &nbsp;&nbsp; [forum.osintbuddy.com](https://forum.osintbuddy.com) &nbsp;&nbsp; | &nbsp;&nbsp; [osintbuddy-core-plugins](https://github.com/jerlendds/osintbuddy-core-plugins) &nbsp;&nbsp; |
<span style="display: inline-block; width:830px"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   </span>


  ## Introducing OSINTBuddy

  <p>
      Welcome to the OSINTBuddy project where you can connect, combine,
      and get insights from unstructured and public data as results that
      can be explored step-by-step. An easy-to-use plugin system allows any
      Python developer to quickly integrate new data sources.
  </p>

  🚧 *Work in progress*
<br/>

![ob-demo](https://github.com/jerlendds/osintbuddy/assets/29207058/9a22223f-7477-4268-be85-46b94dd875bb)
  
  ⚠️ Actively searching for contributors, if you want to help, please contact me on the [osintbuddy discord](https://discord.gg/gsbbYHA3K3) ⚠️

  ---
</p>

<details open="open">
<summary> 
<b>Table of Contents</b>
</summary>
  <ol>
    <li>
      <a href="#what-is-osintbuddycom">What is OSINTBuddy</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#sponsor-osintbuddy">Sponsor OSINTBuddy</a></li>
  </ol>
</details>

### What is <a referrerpolicy="unsafe-url" target="_blank" href="https://osintbuddy.com">osintbuddy.com</a>?


Not much, yet.


But here's the concept:


An almost incomprehensible amount of data is created every day. And each year, figures are growing at an ever-increasing rate. These data sources can be divided up into six different categories of information flow:

- Public government data
- Media *(newspapers, magazines, radio)*
- Internet *(blogs, discussion groups, citizen media, etc)*
- Professional and academic publications *(budgets, hearings, telephone directories, websites, etc)*
- Commercial data *(commercial imagery, financial assessments, databases, etc)*
- Grey literature *(technical reports, preprints, patents, business documents, etc)*


Some of the main hindrances to practical OSINT is the volume of information it has to deal with [(information explosion)](https://en.wikipedia.org/wiki/Information_explosion) and the issue of low quality data. With the majority of this data being unstructured, there's many challenges to analyzing it and producing actionable intelligence since most data analytics databases are designed for structured data.


We've decided to do something about it. The rapid developments in technologies such as AI and big data analytics have opened new horizons for OSINT which weren't previously available. We want our information quick and to the point, that's why we're building an open-source OSINT tool that's free. Free to use, free to modify, free to do with as you wish, and built with plain old web technologies anyone can learn. But this isn't really the project. This is a free new community. A community for OSINT enthusiast around the world and we need your help to design it, to program it, and to build it. We want to hear your suggestions, your ideas, and we're going to build it right in front of your eyes. The notion of a “needle in a haystack” is taken to the extreme on the internet. Let's build a magnet.



### Key Features
- Simplified data fetching from multiple sources.
- Visual representation of fetched data for easy understanding.
- A development platform that is open for contributions.
- Plugin-based system for transforming data, check out the [osintbuddy](https://pypi.org/project/osintbuddy/) package.



## Getting Started

To start using OSINTBuddy, follow these simple installation steps:

### Installation
1. Clone the repo and submodules
   ```sh
   git clone --depth=1 --recurse-submodules https://github.com/jerlendds/osintbuddy.git
   cd osintbuddy
   ```
2. Install Docker
    - [Learn how to install Docker on Mac](https://docs.docker.com/desktop/install/mac-install/)
    - [Learn how to install Docker on Windows](https://docs.docker.com/desktop/install/windows-install/)
    - [Learn how to install Docker on Linux](https://docs.docker.com/desktop/install/linux-install/)
3. Start the stack with Docker: 
   ```sh
   # ./launcher               # display usage information.
     ./launcher bootstrap     # ensure the environment is setup correctly; build images.
     ./launcher start         # start the osintbuddy stack.
   ```
   - **Note:** the stack will take a few minutes to startup while Solr and ScyllaDB configure themselves for JanusGraph. If you try to connect before all the databases are ready you will encounter errors.

- **URLs**
  - Frontend: http://localhost:3000
  - Casdoor: http://localhost:8080
  - Backend: http://localhost:8000/api
  - Documentation: http://localhost:8000/docs
- Access OSINTBuddy through the URLs provided for the frontend, backend, and documentation.

## [↑](#introducing-osintbuddy)Roadmap
 
~~See our [trello board](https://trello.com/b/99Q70frX/) 
for a list of our upcoming features.~~

See the forum: [forum.osintbuddy.com](https://forum.osintbuddy.com), for a list of our upcoming features, potential ideas, and more (*Note: We're currently in the process of setting up the forum and moving trello issues over. We're not sure when this will be completed. For the time being you can count on dev log updates being on the forum from now on*).


See the [open issues](https://github.com/jerlendds/osintbuddy/issues)
for a list of requested features (and known issues).

### [↑](#introducing-osintbuddy)Progress Notes

- [x] Website node
- [x] Google search node
- [x] Google cache search node
- [x] Google dorks
- [x] DNS node
- [x] URL node
- [x] IP node
- [x] CSE node
- [x] Username node
- [x] Added a plugin system
- [x] Updated plugin system to be easier to work with
- [x] Implemented automatic saving for project graphs
- [x] Added `ob` and `launcher` CLI tools
- [x] Added Casdoor for auth
- [x] Improved UI/UX
- [] Added wizards for plugin create and custom `.env` setup
- [] Moved plugin system to its own service


For this update you'll have to rebuild your docker containers (`./launcher build`)! After a long wait you'll be rewarded with a new UX, an updated plugin system now running as its own service, Casdoor managed auth for signing in/up, a new CLI tool, `ob`, for managing plugin development and the plugin server, and another CLI `./launcher` for managing the OSINTBuddy stack. 


## [↑](#introducing-osintbuddy)Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/add-core-feature`)
3. Commit your Changes (`git commit -m 'feat: add core feature to osintbuddy app'`)
4. Push to the Branch (`git push origin feature/add-core-feature`)
5. Open a Pull Request


## [↑](#introducing-osintbuddy)License

Licensed under the GNU Affero General Public License v3.0.

Copyright 2023 jerlendds. [GNU AGPL v3](https://choosealicense.com/licenses/apache-2.0/).

*Note: the [OSINTBuddy PyPi package](https://github.com/jerlendds/osintbuddy-plugins) is MIT licensed*.

Patched `aiogremlin` library: [jerlendds/gremlinpy](https://github.com/jerlendds/gremlinpy/)



## [↑](#introducing-osintbuddy)Contact

[Open an issue](https://github.com/jerlendds/osintbuddy/issues/new?assignees=jerlendds&labels=Type%3A+Suggestion&projects=&template=feature.md&title=%5BFEATURE+REQUEST%5D+Your_feature_request_here) if you need to get in touch with me or send an email to <a href="mailto:jerlendds@osintbuddy.com">jerlendds@osintbuddy.com</a>.


## [↑](#introducing-osintbuddy)Sponsor OSINTBuddy 
Help us keep the OSINTBuddy project free and maintained forever.
Sponsor the OSINTBuddy project for unique benefits. Learn more on the [OSINTBuddy OpenCollective project page](https://opencollective.com/openinfolabs/projects/osintbuddy#category-CONTRIBUTE)

[![Yearly OpenCollective Income](https://badgen.net/opencollective/yearly/osintbuddy)](https://opencollective.com/openinfolabs/projects/osintbuddy#category-CONTRIBUTE)
[![OpenCollective Backers](https://badgen.net/opencollective/backers/osintbuddy)](https://opencollective.com/openinfolabs/projects/osintbuddy#category-CONTRIBUTE)



[contributors-shield]: https://img.shields.io/github/contributors/jerlendds/osintbuddy.svg?style=for-the-badge
[contributors-url]: https://github.com/jerlendds/osintbuddy/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/jerlendds/osintbuddy.svg?style=for-the-badge
[forks-url]: https://github.com/jerlendds/osintbuddy/network/members
[stars-shield]: https://img.shields.io/github/stars/jerlendds/osintbuddy.svg?style=for-the-badge
[stars-url]: https://github.com/jerlendds/osintbuddy/stargazers
[issues-shield]: https://img.shields.io/github/issues/jerlendds/osintbuddy.svg?style=for-the-badge
[issues-url]: https://github.com/jerlendds/osintbuddy/issues

