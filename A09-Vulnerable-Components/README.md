### Using Components with Known Vulnerabilities

## What are components?
Component is a modular and reusable piece of software that encapsulates a set of related functionalities. Components can be classes, modules, or even entire systems that interact with each other to form a larger software application. Examples include libraries, frameworks, and individual code modules.

## Why is using components a security risk
These vulnerabilities can be the result of coding errors, design flaws, or outdated libraries or frameworks. Attackers can exploit these vulnerabilities to gain unauthorized access to systems, steal sensitive data, or disrupt operations. Vulnerable components can allow attackers to bypass security controls such as firewalls and intrusion detection systems and gain access to sensitive data or systems. 


One common attack vector for exploiting known vulnerabilities in components is a supply chain attack. In a supply chain attack, attackers target a third-party component that is used in the development of an application. By compromising the component’s code or infrastructure, attackers can inject malicious code into the application and gain access to sensitive data.
 									


## Real life examples
Equifax Data Breach (2017):
The attackers exploited a known vulnerability in the Apache Struts web application framework. Equifax failed to apply a patch for the vulnerability, leading to the exposure of sensitive personal information of millions of individuals.


WannaCry Ransomware (2017):
WannaCry exploited a vulnerability in Microsoft's Windows operating system. The ransomware spread rapidly by leveraging the EternalBlue exploit, which targeted a vulnerability in the Windows Server Message Block (SMB) protocol. Microsoft had released a patch for this vulnerability prior to the attack, but many organizations had not applied it, leading to widespread infections.

## How to prevent?
The best way to prevent using components with known vulnerabilities would be to never use third-party components and build these functions by yourself. However, this is not always possible and therefore it just means that you need to take precautions when choosing which 3rd party tools to use.


So here are some things you can do to minimize these attacks. 

1.) Always upgrade components to the latest version (patching)


2.) Dependency Tracking: Developers should keep track of all the dependencies their software relies on. This includes not only direct dependencies but also indirect ones. Regularly audit and update these dependencies to ensure the latest and most secure versions are in use.


3.) There should be a patch management process in place to: * Remove unused dependencies, unnecessary features, components, files, and documentation.


4.) Only obtain components from official sources over secure links. Prefer signed packages to reduce the chance of including a modified, malicious component.


5.) Monitor for libraries and components that are unmaintained or do not create security patches for older versions. If patching is not possible, consider deploying a virtual patch to monitor, detect, or protect against the discovered issue.


## OWASP Juice Shop Exploit
We will exploit a vulnerability of an outdated component called Juicy-Chat bot. There is a line of code 
```
this.factory.run(users.addUser("${token}", "${name}"))
```

This code allows users to change the users to " and , making it vulnerable to injection attacks. It is basically a eval() function and will execute anything. Set your usernamse  to admin"); process=null; users.addUser("1337", "test, as below.
<img width="1280" alt="Screenshot 2023-11-09 130453" src="https://github.com/jmr54/Website-Security-Research/assets/67990368/4aa5f5b2-e413-45ef-b50f-ffbd5b27eade">

If you navigate to the chat bot now, it will crash the chat bot as shown below.
<img width="1280" alt="Screenshot 2023-11-09 130439" src="https://github.com/jmr54/Website-Security-Research/assets/67990368/1d1e4589-7c01-45a7-b5c9-ea39597e1d15">


## How to fix this vulnerability?
Since this is a 3rd party component, we cannot directly change their code. We would first either send a request/ticket regarding this concern or hope that there is an update regarding this componenet. Another thing we could have done is make our own chatbot as well or completely remove the chatbot.
However, since this is a test site, we cannot do that. So instead I modified the code and made sure that users can only use alphanumeric characters for their username. 
As shown in the code below
```
          // Ensure username contains only alphanumeric characters
          if (!/^[a-zA-Z0-9]+$/.test(req.body.username)) {
            return res.status(400).send('Invalid username format. Use only alphanumeric characters.')
          }
```
So when you try to set the username as above, it will show this below instead. 
<img width="1280" alt="Screenshot 2023-11-09 132243" src="https://github.com/jmr54/Website-Security-Research/assets/67990368/c072839a-8d70-44b3-8e67-2a0a01b4e247">

