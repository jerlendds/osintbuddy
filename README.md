[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<br />

<p align="center">
  <a href="https://github.com/jerlendds/osintbuddy">
    <img src="./docs/assets/logo-watermark.svg" height="200px" alt="OSINT Buddy Logo">
  </a>

  <h2 align="center">Introducing OSINTBuddy</h2>

  <h4 align="center">
    Mine, merge, and map data for novel insights.
  </h4>

</p>

<details open="open">
  <summary>
  
  ## Table of Contents

  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
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
  </ol>
</details>

## [↑](#Table-of-Contents)Introducing the OSINTBuddy Toolbox: A Powerful Tool for Investigators

Fetch data from different sources and returns the results
as visual entities that you can explore step-by-step!

OSINTBuddy is an OSINT tool in beta which is distributed
for educational and investigative purposes, the person who has bought
or uses this tool is responsible for its proper use or actions committed,
jerlendds, the developer(s) of OSINTBuddy, are not responsible for the use
or the scope that people can have through this software.

[OSINTBuddy demo video](https://www.youtube.com/watch?v=XKBusfYGL4M)


### Key Features
- Simplified data fetching from multiple sources
- Visual representation of fetched data for easy understanding
- A powerful development platform that is open for contributions
- New plugin-based system for transforming data, check out the [osintbuddy](https://pypi.org/project/osintbuddy/) package. Documentation is coming soon.
![osintbuddy-demo](https://github.com/jerlendds/osintbuddy/assets/29207058/c01357a9-9e55-44e3-9734-c84130bd110b)


&nbsp;&nbsp;&nbsp;\> **[https://docs.osintbuddy.com](https://docs-osintbuddy-com.vercel.app/)**

## [↑](#-Table-of-Contents)Getting Started

To start using OSINTBuddy, follow these simple installation steps:

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/jerlendds/osintbuddy.git
   ```
2. Install Docker

3. Start the stack with Docker:

   ```sh
   cd osintbuddy/backend/
   cp .env.example .env
   docker compose up
   ```

4. Start the frontend:
   ```sh
   cd ../frontend
   yarn && yarn start
   ```

- **URLs**
  - Frontend: http://localhost:3000
  - Backend: http://localhost:5000/api/
  - Documentation: http://localhost:5000/docs -- http://localhost:5000/redoc
  - Flower: http://localhost:5555
  - Neo4J: http://localhost:7474/browser/
- Access OSINTBuddy through the URLs provided for frontend, backend, documentation, and more.

## [↑](#-Table-of-Contents)Roadmap

See the [open issues](https://github.com/jerlendds/osintbuddy/issues) for a list of proposed features (and known issues).

## [↑](#-Table-of-Contents)Progress Notes

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
-  For this update you'll have to rebuild your docker containers. After that long wait you'll be rewarded with a newly released package: [osintbuddy](https://pypi.org/project/osintbuddy/)  
    The osintbuddy package allows for transforming data through a `@transform` decorator, which is applied to methods in the OBPlugin class.
- The transform decorator must have a label and, optionally, a [tabler-icons](https://tabler-icons.io/) icon name. You can manage node transformations and node creation easily through the API.
-  Basically these updates make it easier to create nodes and context menu options for a nodes transform options which are mapped to plugin methods.
- More documentation is coming soon when I have the time.
  Here's a video on the new update in the meantime: [Introducing OSINTBuddy: A plugin based Maltego alternative in beta](https://www.youtube.com/watch?v=XKBusfYGL4M)
  



## [↑](#-Table-of-Contents)Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/add-core-plugin`)
3. Commit your Changes (`git commit -m 'feat: add core plugin to osintbuddy app'`)
4. Push to the Branch (`git push origin feature/add-core-plugin`)
5. Open a Pull Request

## [↑](#-Table-of-Contents)Contact

Open an issue if you need to get in touch with me

Project Link: [https://github.com/jerlendds/osintbuddy](https://github.com/jerlendds/osintbuddy)


[contributors-shield]: https://img.shields.io/github/contributors/jerlendds/osintbuddy.svg?style=for-the-badge
[contributors-url]: https://github.com/jerlendds/osintbuddy/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/jerlendds/osintbuddy.svg?style=for-the-badge
[forks-url]: https://github.com/jerlendds/osintbuddy/network/members
[stars-shield]: https://img.shields.io/github/stars/jerlendds/osintbuddy.svg?style=for-the-badge
[stars-url]: https://github.com/jerlendds/osintbuddy/stargazers
[issues-shield]: https://img.shields.io/github/issues/jerlendds/osintbuddy.svg?style=for-the-badge
[issues-url]: https://github.com/jerlendds/osintbuddy/issues
