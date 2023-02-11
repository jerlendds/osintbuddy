[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<br />

<p align="center">
  <a href="https://github.com/jerlendds/osintbuddy">
    <img src="./docs/assets/logo-watermark.svg" height="200px" alt="OSINT Buddy Logo">
  </a>




  <h3 align="center">OSINT Buddy 2.0</h3>

  <p align="center">
    osintbuddy is a work-in-progress OSINT tool
    <br />  </p></p>



<!-- TABLE OF CONTENTS -->

<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
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




<!-- ABOUT THE PROJECT -->
## About The Project

*this project is a work-in-progress however feel free to extract out the microservice directory in the backend that's for the Google scraper*

The goal is to create a poor mans maltego :)


<!-- GETTING STARTED -->

## Getting Started

This section is a stub. Updates to this section will come once this project reaches a later stage...


To get a local copy up and running follow these simple steps.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/jerlendds/osintbuddy.git
   ```
   
2. Install Docker Compose

3. Start the stack with Docker Compose:

   ```sh
   cd backend/
   docker-compose up
   ```

 - **URLs**
    - Frontend: http://localhost
    - Backend: http://localhost/api/
    - Documentation: http://localhost/docs -- http://localhost/redoc
    - PGAdmin: http://localhost:5050
    - Flower: http://localhost:5555

<!-- 


https://github.com/danielmiessler/SecLists/tree/master/Discovery/DNS

 -->

<!-- ROADMAP -->

## Roadmap

See the [open issues](https://github.com/jerlendds/osintbuddy/issues) for a list of proposed features (and known issues).



## Progress Notes
- [x] Domain nodes
  - [x] To IP transformation
  - [x] To WHOIS transformation
  - [x] To DNS transformation
  - [x] To subdomains transformation
  - [x] To emails transformation
- [x] Google search node
- [x] Google result node
  - [x] To domain transformation
- [x] Google dorks


[latest demo here](https://user-images.githubusercontent.com/29207058/218184452-27809ec8-f68b-43d1-8e65-d83b56b153d8.webm)
  

[osintbuddy-to-emails](https://user-images.githubusercontent.com/29207058/218228524-609a9ef6-e4d6-4d30-ba20-9c9617623b9e.webm)


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- CONTACT -->
## Contact

Open an issue if you need to get in touch with me

Project Link: [https://github.com/jerlendds/osintbuddy](https://github.com/jerlendds/osintbuddy)



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/jerlendds/osintbuddy.svg?style=for-the-badge
[contributors-url]: https://github.com/jerlendds/osintbuddy/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/jerlendds/osintbuddy.svg?style=for-the-badge
[forks-url]: https://github.com/jerlendds/osintbuddy/network/members
[stars-shield]: https://img.shields.io/github/stars/jerlendds/osintbuddy.svg?style=for-the-badge
[stars-url]: https://github.com/jerlendds/osintbuddy/stargazers
[issues-shield]: https://img.shields.io/github/issues/jerlendds/osintbuddy.svg?style=for-the-badge
[issues-url]: https://github.com/jerlendds/osintbuddy/issues

