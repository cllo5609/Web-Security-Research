# Insufficient logging and monitoring 
Insufficient logging and monitoring is a security weakness that occurs when an application or system doesn't generate or retain adequate logs, and the logs that are generated are not effectively monitored. 
This weakness can have serious implications for the security of an application or system, as it makes it more challenging to detect and respond to security incidents in a timely manner.
## Causes of Insufficient Logging and Monitoring:
1. Lack of Comprehensive Logs: The system fails to generate logs that capture relevant events and activities, such as authentication attempts, access control changes, and critical system events.
2. Insufficient Details: Even if logs exist, they may lack the necessary details to understand the context of an event or the actors involved.
3. No Real-Time Monitoring: There is no system in place to actively monitor logs in real-time. Without monitoring, security incidents may go unnoticed for an extended period.
4. Failure to Alert: Even if logs are generated and stored, the absence of an alerting mechanism means that security teams are not promptly notified of suspicious or malicious activities.
5. Non-Compliance Audit: Inadequate logging and monitoring practices may result in non-compliance with security and privacy regulations, which could lead to legal and financial consequences.
6. Difficulty in Auditing: Auditing and post-incident analysis become challenging without comprehensive logs, making it difficult to understand how an incident occurred.
7. Delayed Incident Detection: Security incidents, such as unauthorized access or data breaches, may go undetected for an extended period, allowing attackers more time to operate within the system.
8. Impact on Incident Response: Without adequate logs, incident response teams face challenges in understanding the scope and timeline of an incident, hindering their ability to contain and remediate the threat.
### Real Life Examples
1. Yahoo Data Breaches (2013-2016): Yahoo suffered multiple data breaches between 2013 and 2016, affecting billions of user accounts. The breaches involved the theft of sensitive user information, including email addresses and hashed passwords. 
They faced criticism for its delayed detection and disclosure of the breaches. Inadequate logging and monitoring contributed to the extended period during which the attackers had access to user data without detection.
2. Sony Pictures Entertainment Hack (2014): Sony Pictures Entertainment experienced a high-profile cyberattack in 2014, resulting in the leakage of confidential data, employee information, and unreleased films.
The attackers were able to move laterally within Sony's network for an extended period without being detected.
3. Marriott International Data Breach (2014-2018): Marriott International reported a data breach in 2018 that exposed personal information of approximately 500 million guests. The breach had started in 2014 but was only discovered in 2018. The attackers had unauthorized access to the Starwood guest reservation database for several years. 
### Juice Shop Example
In our Juice Shop, we will look for logs that are hidden within the Juice Shop Website. To save time within this test example, I went and found out the location of the hidden log access. However, in order to find it in the first place, one would use a scanner
such as Dirbuster. This applicaiton will scan the website and look for hidden files or directory. In the image below, it shows the layout of Dirbuster. The files are hidden in /support/logs (Note that you would find that out if you scanned the entire website, I did it to prevent scanning the entire website again). 
<img width="1276" alt="Screenshot 2023-11-18 162229" src="https://github.com/jmr54/Website-Security-Research/assets/67990368/73c5e0df-5dd4-48a2-a992-c7dd7dfb2b06">
We then would find the log files like the image below.
<img width="1275" alt="Screenshot 2023-11-18 163603" src="https://github.com/jmr54/Website-Security-Research/assets/67990368/0295111e-b7e5-4f8a-aa6a-c758e1f46f73">
Then we would go to the link http://localhost:3000/support/logs to find our access logs.
<img width="1280" alt="Screenshot 2023-11-18 163751" src="https://github.com/jmr54/Website-Security-Research/assets/67990368/7b477b3a-05f6-4b17-a960-4b298d20fa45">

## How to Address Insufficient Logging and Monitoring:
So in our Juice Shop Example, I deleted the route that was set in the server.ts. Best practice is to avoid uploading any log access file on the website. Always secure the log in a database if possible. The code below is the log access file. 
~~~
  /* /logs directory browsing */ // vuln-code-snippet neutral-line accessLogDisclosureChallenge
  app.use('/support/logs', serveIndexMiddleware, serveIndex('logs', { icons: true, view: 'details' })) // vuln-code-snippet vuln-line accessLogDisclosureChallenge
  app.use('/support/logs', verify.accessControlChallenges()) // vuln-code-snippet hide-line
  app.use('/support/logs/:file', logFileServer()) // vuln-code-snippet vuln-line accessLogDisclosureChallenge
~~~
1. Implement Comprehensive Logging: Generate logs that cover key security events and activities, including authentication, authorization, and system changes. Include sufficient details in logs to facilitate effective analysis during incident response.
2. Establish Real-Time Monitoring: Implement real-time monitoring systems that actively analyze logs and generate alerts for suspicious or malicious activities. Set up alerting mechanisms that promptly notify security teams of potential incidents. Establish escalation procedures for different types of alerts.
3. Regular Log Reviews: Conduct regular reviews of logs to identify patterns, anomalies, or indicators of compromise.

### Where to Save Event Information:
Programs often store event log data in two main places: the file system or a database (like SQL or NoSQL). For applications on computers or mobile devices, they might keep data locally, use local databases, or send it to a remote storage location.
Certain framework might limit where you can save this data. Different types of programs can either send event data to faraway systems or save it more locally.
This distant storage could be a centralized log collection and management system (like SIEM or SEM) or another program somewhere else. 
For logs saved as files, set strong rules about which users can get into the folders and what they can do with the files.
In web applications, don't put logs where people on the internet can get to them. If you have to, make sure they're protected and set up with a plain text type, not HTML.
When using a database, it's better to have a separate account just for putting log data in, and that account should only be able to do very specific things with the database, tables, functions, and commands.
### What Events to Keep Track Of:
Decide on the level and details of security monitoring, alerting, and reporting early in your project, tailoring it to the security risks. This helps determine what to log. 
There's no one-size-fits-all solution, and just following a checklist can create unnecessary alerts, making it hard to spot real issues.
#### Some key things one should always log:
1. Input errors like protocol issues or invalid data
2. Output errors like mismatches in database records
3. Successes and failures in authentication
4. Failures in authorization (access control)
5. Session problems like unauthorized changes to session values
6. Application errors and system events like syntax errors, connectivity problems, and configuration changes
7. Start-ups, shut-downs, and initialization of applications and related systems
8. Risky actions like network connections, user changes, and administrative tasks
9. Legal and consent-related events like permissions and data usage agreements

### Verification of Logging:
Make sure logging is thoroughly reviewed during code checks, application tests, and security verifications. 
#### Here's what to check:
1. Confirm that logging is functioning correctly as intended.
2. Check that events are consistently classified, and field names, types, and lengths match the agreed standard.
3. Ensure logging is active during security, fuzz, penetration, and performance tests.
4. Test for vulnerabilities to injection attacks in the logging mechanisms.
5. Make sure there are no unintended consequences when logging happens.
6. Check how logging behaves when the network connection is lost (if applicable).
7. Ensure logging can't be misused to consume system resources, causing issues like disk space filling up or exceeding database transaction log space, leading to denial of service.
8. Test the impact on the application when logging faces failures, such as simulated database connectivity loss, lack of file system space, missing write permissions, or runtime errors in the logging module.
9. Verify that access controls on the event log data are in place.
10. If log data affects user actions (like blocking access or account lock-out), make sure it can't be exploited to cause denial of service for other users.


