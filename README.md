[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<br />

<p align="center">
  <a href="https://github.com/jerlendds/osintbuddy">
    <img src="./docs/assets/logo-watermark.svg" height="200px" alt="OSINT Buddy Logo">
  </a>




  <h1 align="center">Introducing OSINTBuddy 2.0</h1>

  <h4 align="center">
  Mine, merge, and map data for novel insights.
  </h4>
</p>



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




## About The Project

Fetch data from different sources and returns the results 
as visual entities that you can explore step-by-step! *(scroll down for video demos)*

OSINTBuddy is a work-in-progress OSINT tool, which is distributed 
for educational and investigative purposes, the person who has bought 
or uses this tool is responsible for its proper use or actions committed, 
jerlendds, aka the developer of OSINTBuddy, is not responsible for the use 
or the scope that people can have through this software.


## Getting Started

This section is a stub. Updates to this section will come once this project reaches a later stage...


To get a local copy up and running follow these simple steps.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/jerlendds/osintbuddy.git
   ```
   
2. Install Docker

3. Start the stack with Docker:

   ```sh
   cd osintbuddy/backend/
   docker compose up
   ```
4. Start the frontend:

   ```sh
   cd ../frontend
   yarn && yarn start
   ```

 - **URLs**
    - Frontend: http://localhost:3000
    - Backend: http://localhost:8000/api/
    - Documentation: http://localhost:8000/docs -- http://localhost:8000/redoc
    - Flower: http://localhost:5555
    - Neo4J: http://localhost:7474/browser/

<!-- 



mk-fg recommendations: 
nmap with os fingerprinting options, metasploit/w3af scan, ssh whoarethey using corpus of pubkeys from github ( https://www.agwa.name/blog/post/whoarethey ), torrent activity for IP (from DHT and such, e.g. https://iknowwhatyoudownload.com/ but better data/targeting), dns name(s) for IP via various leaky protocols and related IPs from that (e.g. TLS cert altnames, SMTP, etc), spam-lists/dmarc reputation for IP/name, info on services and keys associated with name(s) from TXT/SRV records, address' AS BGP info

moddy recommendations:
math, map, reduce, filter, zip and zipwith function blocks


Awesome site: https://www.jsonapi.co/public-api

https://github.com/danielmiessler/SecLists/tree/master/Discovery/DNS


COMB breach @todo add password searching
magnet:?xt=urn:btih:7ffbcd8cee06aba2ce6561688cf68ce2addca0a3&dn=BreachCompilation&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fglotorrents.pw%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337


@todo VirusTotal
https://developers.virustotal.com/v2.0/reference/getting-started

@todo URLhaus
https://urlhaus-api.abuse.ch/

@todo google safe browsing
https://developers.google.com/safe-browsing/

@todo alienvault
https://otx.alienvault.com/api

@todo abuse ip db
https://docs.abuseipdb.com/#introduction

@todo https://builtwith.com/


@todo https://sploitus.com/

@todo https://nvd.nist.gov/

@todo https://www.reddit.com/dev/api/

@todo https://github.com/JustAnotherArchivist/snscrape


@todo username finder
https://whatsmyname.app/

@todo
https://github.com/Greyjedix/Profil3r - Profil3r is an OSINT tool that allows you to find potential profiles of a person on social networks, as well as their email addresses. This program also alerts you to the presence of a data leak for the found emails.

@todo https://epieos.com/

@todo https://github.com/megadose/holehe
https://os2int.com/toolbox/verifying-and-investigating-email-addresses-with-holehe/

https://github.com/kpcyrd/sn0int

https://github.com/DataSploit/datasploit


https://github.com/mxrch/ghunt
 -->


## Roadmap

See the [open issues](https://github.com/jerlendds/osintbuddy/issues) for a list of proposed features (and known issues).


## Progress Notes
- [x] Domain nodes
  - [x] To IP transformation
  - [x] To WHOIS transformation
  - [x] To DNS transformation
  - [x] To subdomains transformation
  - [x] To emails transformation
  - [x] To google
  - [x] To Traceroute transformation
  - [x] To URL scan transformation (urlscan.io)
  - [x] To URLs (extract all urls found on a page)
  - [ ] To Google Cache
- [x] Google search node
- [ ] Google Cache search node
- [x] Google result node
  - [x] To domain
  - [x] To URL
  - [x] To domain transformation
- [x] Google dorks
- [x] DNS Node
- [x] Email Node
  - [x] To Google result transformation
- [x] Url Node
  - [x] Open in new tab
  - [x] To URL scan transformation (urlscan.io)
  - [x] To IP
  - [x] To Domain
  - [x] To URLs (extract all urls found on a page)
  - [x] To emails
  - [ ] To Google Cache
- [x] Ip Node
  - [x] To Geolocation transformation
  - [x] To Domain transformation
  - [x] To Traceroute transformation
  - [x] To URL scan transformation (urlscan.io)
  - [ ] To Google Cache
- [ ] CSE Node


[osintbuddy-demo](https://user-images.githubusercontent.com/29207058/218629002-752322e1-4537-4849-ba1a-76fe4450404d.webm)


## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Contact

Open an issue if you need to get in touch with me

Project Link: [https://github.com/jerlendds/osintbuddy](https://github.com/jerlendds/osintbuddy)



<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/jerlendds/osintbuddy.svg?style=for-the-badge
[contributors-url]: https://github.com/jerlendds/osintbuddy/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/jerlendds/osintbuddy.svg?style=for-the-badge
[forks-url]: https://github.com/jerlendds/osintbuddy/network/members
[stars-shield]: https://img.shields.io/github/stars/jerlendds/osintbuddy.svg?style=for-the-badge
[stars-url]: https://github.com/jerlendds/osintbuddy/stargazers
[issues-shield]: https://img.shields.io/github/issues/jerlendds/osintbuddy.svg?style=for-the-badge
[issues-url]: https://github.com/jerlendds/osintbuddy/issues

