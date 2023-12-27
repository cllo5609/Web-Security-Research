## A06:2017 Security Misconfiguration

[Security Misconfiguration](https://owasp.org/www-project-top-ten/2017/A6_2017-Security_Misconfiguration.html) often arises from a variety of common oversights. These include using insecure default settings, relying on incomplete or makeshift configurations, leaving cloud storage unsecured, improperly setting HTTP headers, and displaying detailed error messages that reveal sensitive information. 

Such vulnerabilities can open the door to numerous attacks. For example, attackers might exploit these weaknesses to conduct [SQL injection](A01-Injection/README.md). Insecure server configurations can lead to unauthorized access and data breaches. Additionally, misconfigured HTTP headers may enable [cross-site scripting](A07-XSS/README.m) attacks, allowing attackers to inject malicious scripts into webpages viewed by other users.

In this lesson, you'll learn to use automated tools to identify vulnerabilities and apply recon strategies to gain access to the support team's account. This is a six star challenge!

![challenge](https://github.com/jmr54/Website-Security-Research/assets/29048308/7fc13c66-747b-4dde-8e09-c4f1f1953877)

## Required Tools
Before we begin, you'll need to install the following tools:
  - [Nikto](https://github.com/sullo/nikto)
    -  a powerful web vulnerability scanner that will help us identify attack vectors for Security Misconfiguration.
  - [KeePass](https://keepass.info/) or [KeePassXC](https://keepassxc.org/)
    - A password manager tool that we'll use to access a special file (.kdbx)
  
## Find the Support Team's Email
Start by gathering email information for the support team through username enumeration. Juice Shop shop contains many hints throughout the site. Use the "Forgot Password?" feature to verify that you have the correct email address.

## Vulnerability Scanning with Nikto
Navigate to your Nikto source code directory. Use Nikto to scan for vulnerabilities with the following command (make sure the IP and port number locate Juice Shop):

```
./nikto.pl -h http://127.0.0.1:3000/
```

The scan may take a few minutes to complete. Here's what you should see once it's complete:

![nikto-results](https://github.com/jmr54/Website-Security-Research/assets/29048308/fde6c439-0d33-41c9-ae22-7b05a9debeb7)

## Analyze Scan Results
Wait for Nikto to complete its scan. Carefully review the findings, noting any vulnerabilities or suspicious outputs. There are a lot!

Particularly, pay attention to the line: ```OSVDB-3092: /ftp/: This might be interesting.```

![this_might_be_interesting](https://github.com/jmr54/Website-Security-Research/assets/29048308/a025e1ff-00d4-416b-b508-329116f0d50a)

FTP (File Transfer Protocol) servers can sometimes be misconfigured, exposing sensitive files. This finding suggests that the Juice Shop's FTP server might be publicly accessible.

## Access the FTP Portal
Visit ```http://127.0.0.1:3000/ftp``` in your browser. This should open a portal where you can download various files.

![ftp_portal](https://github.com/jmr54/Website-Security-Research/assets/29048308/3df6b320-63c6-4246-b749-ddaf372445c2)

## Download the KeePass Database File
Locate and download the file named ```incident-support.kdbx```. Juice Shop allows you to download it with a simple click!

```.kdbx``` files are KeePass database files used to store a variety of sensitive information, including passwords.

![download_file](https://github.com/jmr54/Website-Security-Research/assets/29048308/7c46295d-5cb1-470b-88a2-c9d9f4c4664d)

Open the downloaded ```incident-support.kdbx``` file in KeePass or KeePassXC. Note how a password is required to access the file.

## Crack the Password for incident-support.kdbx
Attempt to guess or brute-force the password of the KeePass file. To find hints, explore the Juice Shop application for any clues.

Use your browser's developer tools to inspect ```main.js```. Search for "support" within this file.

![analyze_code](https://github.com/jmr54/Website-Security-Research/assets/29048308/4998ba81-142b-4ccb-a72a-9bd3aa5c5917)

You'll discover an intriguing string and a regex pattern. Challenge yourself to understand the context and how it might relate to the KeePass file's password. Use the Internet to your advantage.

## Decode the KeePass Password
After your investigation, you might deduce that the password is

<details>
  <summary>Reveal Password</summary>
  
  ```Support2022!```
</details>

This showcases how sensitive information can sometimes be inadvertently exposed in a web application's client-side code.

Use this password in KeePass to unlock ```incident-support.kdbx```, and you'll find the email and password for the support team's account!

## Access the Support Team's Account
Now that you have the password, try to log in the support team's account in Juice Shop.

![login_support](https://github.com/jmr54/Website-Security-Research/assets/29048308/13a01368-da24-4e08-94c2-ac0c1efd5ea6)

![login_support_2](https://github.com/jmr54/Website-Security-Research/assets/29048308/1e90d2d7-f811-4edd-9030-72a53461fffe)

Nice work!

# Patching Security Misconfiguration in OWASP Juice Shop

OWASP states one of the ways an application can be vulnerable to security misconfirguation is if "unnecessary features are enabled or installed (e.g. unnecessary ports, services, pages, accounts, or privileges)". 

This is exactly what we discovered when carrying out our attack. In this section, we'll work on patching this vulnerability. Remember, this particular patch will not prevent all security misconfiguration attacks.

## Identifying the Issue

Through our security testing, we've identified that the Juice Shop exposes an FTP service via its web interface. Although Juice Shop is intentionally vulnerable for educational purposes, in real-world applications, such exposure can be a critical oversight. Tools like Nikto make it easy to spot such vulnerabilities.

## Steps to Patch the Vulnerability

To secure Juice Shop against this vulnerability, we will remove the routes and files associated with the `/ftp` endpoint. Here's a step-by-step guide:

1. **Locate & Remove FTP Service Enpoints**: Navigate to `./server.ts`.
    - Search for `/ftp`, and remove the following endpoints:
      
      <img width="1235" alt="remove_ftp_endpoints" src="https://github.com/jmr54/Website-Security-Research/assets/29048308/598bb6cb-9831-453b-893f-a5ae9c3ed232">

2. **Remove Relevant Files**:
    - Locate the `filerServer.ts` file in the `./routes` directory and remove it.
      
      <img width="353" alt="remove_fileServer" src="https://github.com/jmr54/Website-Security-Research/assets/29048308/3c241fdf-ef99-410c-8aa7-aaa2db1f1fe6">

3. **Verify the Changes**:
    - Run Juice Shop and verify that `/ftp` endpoint is no longer accessible.
    - Re-run the Nikto vulnerability scan to verify that it is no longer discoverable
      
      <img width="1792" alt="nikto_rerun" src="https://github.com/jmr54/Website-Security-Research/assets/29048308/22964155-e317-4021-a7da-190daeb14f8f">

## Additional Security Considerations

Beyond just patching this specific vulnerability, consider implementing the following best practices to enhance the overall security of your application:

- **Use Password Managers**: Leverage password managers (e.g., Bitwarden) for managing team passwords. Avoid storing passwords in shared resources or hard-coding them in the application.

- **Regular Security Scans**: Integrate tools like Nikto into your development and deployment pipeline to continually check for exposed services or endpoints.

- **Principle of Least Privilege**: Adhere to this principle across your application. Disable unnecessary services, endpoints, and privileges to minimize the attack surface.
