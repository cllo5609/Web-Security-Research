# Website-Security-Research
Welcome! 🎉

This repository houses practical tutorials aimed at mastering the ***OWASP Top Ten*** web application attacks and defenses.

Engage in a hands-on learning experience by attacking and defending an adaptation of [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/), a purposely vulnerable web application created for educational and research purposes. This unique setup provides a safe and controlled environment for users to witness firsthand how specific threats unfold, while also gaining valuable insights on implementing effective defenses to thwart these attacks.

Embark on this journey to elevate your security skills, understanding the attacker’s mindset, and learn how to shield your applications from potential threats. Happy learning!

## Tools You'll Need
- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/)
- [Docker](https://docs.docker.com/get-docker/)
- [Burp Suite Community Edition](https://portswigger.net/burp/communitydownload)
- [Foxy Proxy](https://getfoxyproxy.org/)
- [Git](https://github.com/git-guides/install-git)

## OWASP Juice Shop
_Juice Shop_ is an open-source web application created by _OWASP_. _OWASP_ helps users to develop and strengthen trustworthy and secure applications on the web.

## Installing Juice Shop Vulnerable
1. Make sure Docker is installed on your local machine

2. Open up a Command shell or Terminal and run the following commands:
   
   ```
   docker pull chenhol/website-security-research:vulnerable
   ```
   
   ```
   docker run --rm -p 3000:3000 chenhol/website-security-research:vulnerable
   ```
   
4. Head to http://localhost:3000 on your local browser to view Juice Shop Vulnerable

## Installing Juice Shop Secure
1. Make sure Docker is installed on your local machine

2. Open up a Command shell or Terminal and run the following commands

  ```
  docker pull chenhol/website-security-research:secure
  ```
  
  ```
  docker run --rm -p 3001:3000 chenhol/website-security-research:secure
  ```
  
3. Head to http://localhost:3001 on your local browser to view Juice Shop Secure

## Using Juice Shop
Once you have **Juice Shop Vulnerable** and **Juice Shop Secure** running on your local machine, use the buttons located at the top of the web page to toggle between the two versions.

&nbsp;![main-buttons](https://github.com/jmr54/Website-Security-Research/assets/55637731/8832beb1-e4b2-4c66-8d84-a1a0dc701bf2)&nbsp;

Choose one of the cyberattacks from the ***Table of Contents***, located below, to learn about the attack. Then, follow along with the step-by-step guide to using the attack and securing against it on the Juice Shop Vulnerable website.

## Securing Juice Shop Vulnerable
To modify the source code for the Juice Shop Vulnerable web application, you will need to _clone_ a copy of the Website-Security-Research repository by following the instructions below.
1. Make sure **Docker** is installed on your local machine
2. Make sure **[Git](https://github.com/git-guides/install-git)** is installed on your local machine
3. Open up a Command shell or Terminal and run the following command

  ```
  git clone https://github.com/jmr54/Website-Security-Research.git
  ```
4. Navigate to the cloned directory with
   
  ```
  cd Juice-Shop-Vulnerable
  ```
5. Open the cloned repository in your [IDE](https://en.wikipedia.org/wiki/Integrated_development_environment) of choice to edit the source code
6. Save all code changes and build your Docker Image by running
   
   ```
   docker build -t juice-shop-vul:1.0 .
   ```
7. Once the Docker Image is finished building, run
   
   ```
   docker run --rm -p 3000:3000 juice-shop-vul:1.0
   ```
10. Head to [http://localhost:3000](http://localhost:3000) on your local browser to view your modified Juice Shop Vulnerable web application

## Table of Contents
1. [A01:2017 - Injection](A01-Injection/README.md)
2. [A02:2017 - Broken Authentication](A02-Broken-Authentication/README.md)
3. [A03:2017 - Sensitive Data Exposure](A03-Sensitive-Data-Exposure/README.md)
4. [A04:2017 - XML External Entities (XXE)](A04-XXE/README.md)
5. [A05:2017 - Broken Access Control](A05-Broken-Access-Control/README.md)
6. [A06:2017 - Security Misconfiguration](A06-Security-Misconfiguration/README.md)
7. [A07:2017 - Cross-Site Scripting (XSS)](A07-XSS/README.md)
8. [A08:2017 - Insecure Deserialization](A08-Insecure-Deserialization/README.md)
9. [A09:2017 - Using Components with Known Vulnerabilities](A09-Known-Vulnerabilities/README.md)
10. [A10:2017 - Insufficient Logging & Monitoring](A10-Insufficient-Logging-Monitoring/README.md)

##### References
[OWASP Juice Shop](https://owasp.org/www-project-juice-shop/)

[OWASP 10 Vulernability](https://www.vpnmentor.com/blog/top-10-common-web-attacks/)
