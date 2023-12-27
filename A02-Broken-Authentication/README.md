# A02:2017 - Broken Authentication
[Broken Authentication](https://owasp.org/www-project-top-ten/2017/A2_2017-Broken_Authentication) is a security flaw that allows attackers to impersonate legitimate users.

Typically, attackers initiate their intrusion by manually probing the application, exploiting **username enumeration** to pinpoint potential targets. Following this reconnaissance phase, they then deploy automated tools to relentlessly exploit the identified vulnerability.

## Explore OWASP Juice Shop
Start OWASP Juice Shop via Docker and familiarize yourself with its features as an **unauthenticated user**. Pay close attention to product reviews for any user information, like email addresses.

Locate and note down Bender's email from a product review for later use.

![find-benders-email](https://github.com/jmr54/Website-Security-Research/assets/29048308/a1944dbd-8ab8-44cf-97a5-205a0c975117)

## Attempt to Login
Attempt to log in with Bender's email and a random password. The error message should be generic, such as "Invalid email or password."

![goto-login](https://github.com/jmr54/Website-Security-Research/assets/29048308/f4cebd7c-319e-4c05-8831-79b2fb081261)

Let's try to login with Bender's email using a random password to see how Juice Shop reacts to an invalid login attempt. Notice the error: "Invalid email or password", which neither confirms nor denies whether the email address or password actually exists in the system.

![username-enumeration-attempt-1](https://github.com/jmr54/Website-Security-Research/assets/29048308/1b516ce4-dc53-412d-b0db-73622ef0f2f5)

## Check "Forgot Password?" Functionality

Use the "Forgot Password" feature with Bender's email. A green border or a visible security question indicates a valid user, revealing a potential for username enumeration.

![username-enumeration-attempt-2](https://github.com/jmr54/Website-Security-Research/assets/29048308/efbf6805-24e5-4101-97d2-a88d6d7eb17a)

Compare this with an invalid email like test@test.com, which doesn't progress to a security question.

## Brute Force Bender's Security Question

Now, we'll use a brute force method to bypass the security question. We'll utilize [Burp Suite Community Edition](https://portswigger.net/burp/communitydownload) to automate this process.

1. Copy this list of possible answers to Bender's security question
```
stop'n'drop
Stop'N'Drop
STOP'N'DROP
stop'N'drop
sTop'n'droP
StOp'N'DrOp
stoP'N'DROp
Stop'n'drop
STOP'N'drop
stOP'N'DROP
stop'N'DROP
Stop'N'drop
sTOP'n'drop
StoP'n'DroP
Stop'n'Drop
STOP'N'Drop
stop'n'DROP
```

2. Turn on browser proxy with Foxy Proxy.
   
   ![enable_foxy_proxy](https://github.com/jmr54/Website-Security-Research/assets/29048308/1d9b5a2d-be43-4e84-b88c-2e5fe99d6e1e)

3. Open Burp Suite and navigate to the Proxy tab.
   
   ![proxy_tab](https://github.com/jmr54/Website-Security-Research/assets/29048308/c3f5202c-a806-4370-a941-837fdc9ca007)

4. Click on the 'Intercept is off' button to turn on Intercept.
   
   ![intercept_is_off](https://github.com/jmr54/Website-Security-Research/assets/29048308/ca2d228a-5cd4-4872-ad7f-f4407d32bba4)

5. In Juice Shop, open the "Forgot Password" feature and input 'test123' for the security question and both password fields. Then, click 'Change'. Burp Suite should intercept this request.
   
   ![bender_change_attempt](https://github.com/jmr54/Website-Security-Research/assets/29048308/c53310d0-8146-4866-a69d-54efb1908661)

   ![captured_request](https://github.com/jmr54/Website-Security-Research/assets/29048308/34bf64cb-7e94-49d3-a7c7-5b8da50e2ac3)

6. In Burp Suite, select and right-click the 'test123' value next to the 'answer' key, then click 'Send to Intruder'.
    
   ![select-answer-burp](https://github.com/jmr54/Website-Security-Research/assets/29048308/22473ffc-be31-40a1-9511-c9f0c03e071f)

   ![send-to-intruder-burp](https://github.com/jmr54/Website-Security-Research/assets/29048308/e2c748a3-7258-42cf-b6c1-56d15e2ac149)

7. In the Intruder tab, select 'Sniper' as your attack, then go to 'Payloads' tab.
    
   ![select-sniper-attack-burp](https://github.com/jmr54/Website-Security-Research/assets/29048308/efee96ad-5ea4-401f-b0f2-739df4c11658)

   ![payloads_tab](https://github.com/jmr54/Website-Security-Research/assets/29048308/224d69c7-6596-4f5b-93cf-54ed04a8b5d0)

8. Under 'Payload settings [Simple list]', click 'Paste' to paste the list of possible answers to Bender's security question.
    
   ![paste_answers](https://github.com/jmr54/Website-Security-Research/assets/29048308/1b841088-232d-43b0-a081-e30e958f6d2b)

9. Now, click 'Start attack' in the top-right corner. The attack will run.

    ![start-attack](https://github.com/jmr54/Website-Security-Research/assets/29048308/7c8d972f-4c52-4d71-9415-b12478552eb5)

10. Once the attack is finsihed, look through the results for a 200 response code, which means we found the answer. Here it is!

    ![found](https://github.com/jmr54/Website-Security-Research/assets/29048308/97010a6e-4666-4a19-a873-d428d082a824)

11. Now that we verified the answer using brute force, go back to Juice Shop and try to change Bender's password using the 'Forgot Password' function

    ![change_succes](https://github.com/jmr54/Website-Security-Research/assets/29048308/7de15376-1680-40f6-b4dd-435eb7c6ecf3)

    ![bender_hacked](https://github.com/jmr54/Website-Security-Research/assets/29048308/c18b0228-4510-4dd9-a7b6-6843232fed9a)

   Nice, you just hacked Bender's account!

# Securing the 'Forgot Password' Feature in Juice Shop

This section focuses on securing the 'Forgot Password' feature in the Juice Shop using best practices from OWASP's [Forgot Password Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html#url-tokens).

## Implementing Side-Channel Password Reset

OWASP recommends the use of a "side-channel" for secure password resets. Our approach involves sending an email with a unique URL for password reset.

## Modifying the Source Code

Visit the [Juice-Shop-Secure](../Juice-Shop-Secure) directory to view the code patches. Take note of the files and modifications.

#### [resetPassword.ts](../Juice-Shop-Secure/routes/resetPassword.ts)
- Removed variables and logic related to handling security questions and direct entry of new and repeat passowords
- Modified the resetPassword function to generate a unique URL and email it to the User to initiate the reset password flow

#### [forgot-password.component.ts](../Juice-Shop-Secure/frontend/src/app/forgot-password/forgot-password.component.ts)
- Removed logic related to handling security questions and changing the password from the page
- Modified confirmation to display message that tells users what happens but also prevents email enumeration

#### [forgot-password.component.html](../Juice-Shop-Secure/frontend/src/app/forgot-password/forgot-password.component.ts)
- Removed the input fields for security question answer and passwords to only allow email and reflect backend modifications


