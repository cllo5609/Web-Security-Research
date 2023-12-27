# A05:2017 - Broken Access Control

## What is Access Control
**Access Control** is a broad term that describes the many mechanisms, policies and protocols put in place for a web application to manage what a user can do and access when interacting with it. Users with higher privileges, such as an administrator, typically have more access to the application’s features and data, including the ability to manipulate both.

## What is Broken Access Control
If a user is able to access features or data that are unauthorized, given their user privileges, the web application’s access control has failed and is considered broken. [Broken access control](https://owasp.org/www-project-top-ten/2017/A5_2017-Broken_Access_Control) can lead to data theft, vulnerability to malicious software and impersonation of other users.

Typically, broken access control occurs when a web application has insufficient authentication and authorization methods, poor input validation that leaves stored data susceptible to injection, and direct object reference, which exposes references to database objects that can be used to manipulate data.

## Broken Access Control Demonstration
Any web application that allows users to create an account will have a database to store that user's account and information contained within it. In order to differentiate one account from another, databases use a unique identifier to reference specific accounts, often referred to as an **account id** or **user id**. Objects stored in a database often contain sensitive data such as usernames and passwords, and should therefore only be accessible to users authorized to view that data.

One way that attackers exploit broken access controls is by using these unique identifiers to give them authorization they shouldn’t have. To demonstrate this, begin by opening the ***Juice-Shop-Vulnerable*** web application via ***Docker***.

___
### Create or Login to an Account
Begin by navigating to the ***Account*** tab in the upper right corner of the web page and clicking the ***Login*** button.

&nbsp;![bac-account](https://github.com/jmr54/Website-Security-Research/assets/55637731/822d3e07-c797-44b4-be41-2565ac572789)&nbsp;

Use the login page to either create a new account by clicking ***Not yet a customer?*** or log in to an existing account.

___
### Navigate to the Customer Feedback Page
Once you are logged in to your account, open the menu tab in the upper left corner of the Juice Shop homepage and select ***Customer Feedback***.

&nbsp;<img width="541" alt="bac-feedback" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/9ce35aa1-c888-47bb-9115-00e6e3afbced">&nbsp;

Based on what we know about unique identifiers and database objects, take a look at the Customer Feedback form and see if any of the form fields stick out as potentially vulnerable. 

&nbsp;<img width="647" alt="bac-form" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/e8dbcc34-b0f5-4d2c-95f3-5d3bd4217426">&nbsp;

___
### Inspect the Webpage
The ***Author*** field of this form has been auto-filled with the email address used for our Juice Shop account.

If you try clicking on the text-box for ***Author***, you will see that we are unable to edit the value of this field. Clearly, this was implemented by the developers to prohibit a user from posting feedback as a user other than themselves.

But something must have happened behind the scenes that identified us as the user and auto-filled the correct email into the form. 

Let’s use the ***Inspect*** tool to view the html of the webpage and see if it provides any useful information. To do this, right click anywhere on the webpage to bring up the menu, then select ***Inspect***.

&nbsp;<img width="1004" alt="bac-inspect" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/c744bdf3-fb93-4f6e-9bfa-41915c930ea8">&nbsp;

___
### Locate the HTML for the _Author_ Text Field
With the html for the ***Customer Feedback*** form open, begin searching the contents of the html by clicking the dropdown arrows, paying close attention to the portions of the webpage that are highlighted with each dropdown menu. 

&nbsp;![bac-dropdown](https://github.com/jmr54/Website-Security-Research/assets/55637731/991e734a-5618-41c3-a10d-d9ebe25cefaf)&nbsp;

Continue opening the dropdown arrows until you reach the line of code outlined below.

&nbsp;<img width="1406" alt="bac-input-id" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/01a3fca5-c951-4f1d-9b1c-bacff52905ea">&nbsp;

We can see that there are individual sections for each of the form fields, as we would expect. But, there is something else there too. Just above the ***Author*** field, there is an ```input``` tag that contains an ```id``` attribute with the value ```userId```. Perhaps this is how our form is auto-filling our email address? There is another attribute here called ```hidden```.

&nbsp;<img width="1042" alt="bac-input-2" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/2788527b-c057-4c1a-8b87-1161a25ca542">&nbsp;

___
### Modify the HTML for the Unique Id
Let’s try editing the html to remove this ***hidden*** attribute and see what happens. To do this, right click on the html and press ***edit as html***, then delete the text ```hidden=""```.

&nbsp;![bac-edit-html](https://github.com/jmr54/Website-Security-Research/assets/55637731/ab33a351-3b91-40cc-b132-56765d31fb54)&nbsp;

Woah! You should now see an input box with an integer value just above the ***Author*** field. 

___
### Change the Unique Id
As you probably have guessed by now, that integer is our unique identifier and we have just exposed the user id that references our juice shop account. Knowing this, we can reasonably assume that if we change that value, we are now referencing another user’s account in the database that we are unauthorized to access. 

&nbsp;<img width="645" alt="bac-id-show" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/a737a43a-4b87-4424-bc7c-ef4ba7803ff7">&nbsp;

Not only this, but we are about to submit a form using another user’s account. Go ahead and change the value shown to the integer ```9```.

___
### Modify the HTML for the _Author_ Text Field 
While we’re at it, let’s see if we can change the auto-filled details to an email address that is not ours. Navigate to the html for the ***Author*** field of the form. Using the same dropdown arrows as before, look for the line of code outlined below. 

&nbsp;![bac-author-show](https://github.com/jmr54/Website-Security-Research/assets/55637731/bef0d543-d31f-45d4-a2e3-60c82fee5342)&nbsp;

There must be something happening here that is preventing us from modifying the value of the input. That ```disabled``` attribute could be something. Let’s edit this html once again and delete the text 
```disable=""```.

&nbsp;<img width="1230" alt="bac-disable" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/3640a577-3db0-42c9-8fa4-2757fddf2ac1">&nbsp;

Surprise, surprise! We are now able to put any value into the ***Author*** field. Go ahead and type in a new email here. 

&nbsp;![bac-author-input](https://github.com/jmr54/Website-Security-Research/assets/55637731/9ec797a0-08c5-4a66-b98c-2387f0bc4537)&nbsp;

Now, finish filling out the form and hit the ***Submit*** button. 

___
### Find Customer Feedback
Click the dropdown menu in the upper left corner and select ***About Us***.

&nbsp;<img width="495" alt="bac-about-us" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/ac42ea4a-57b5-4247-aa79-d440203b3fc9">&nbsp;

Once here, click the left arrow of the photo carousel until you see a familiar post!

&nbsp;<img width="494" alt="bac-comment" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/ec6e4930-e85a-410c-a7c0-50bfdf355ffd">&nbsp;

Because of ***Broken Access Control***, we were able to exploit direct object references in the web application and submit a customer review under another user’s credentials. Though submitting a review under another user may seem like a prank, this same information can be used to carry out much more serious attacks, including data theft and manipulation.

## Securing the Customer Feedback Form Vulnerability in Juice Shop

Broken access control takes many forms. When building a web application, it is imperative that all access vulnerabilities are addressed and mitigated. One of the simplest yet most effective measures that can be taken to mitigate broken access control is to only allow necessary data and information to be accessible to the user when developing a web application.

### Identifying the Vulnerability
In the example above, our broken access control was rooted in the direct use of object references to identify individual users. The user's email was displayed in the author field of the form and we were able to modify input that should have been inaccessible.

Take a look at the outlined code snippet from the ***contact.component.html*** file in the ***Juice Shop Vulnerable*** source code below.

&nbsp;<img width="1578" alt="bac-vul-code" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/af1f8da7-bbcf-410a-b3e7-4040c80439ff">&nbsp;

Located in the ***contact.component.html*** file is the code that makes up the ***Customer Feedback*** webpage. HTML code is responsible for the structure, among other things, of a webpage, including the ***Customer Feedback*** form we exploited. The line of code outlined in _red_ displays the _user id_ on the webpage and the block of code outlined in _pink_ displays the ***Author*** field and email address.

### Securing the Vulnerability
To better secure ***Access Control*** for a web application, it is important to avoid displaying or making accessible any information that is not necessary. The more information available to users means greater risk that this information will be exploited. 

Because the ***Customer Feedback*** form was auto-filled with the unique id and user email address of the logged in user, we can assume that this information was gathered and stored somewhere on the backend of the application. This means that user input is not required and thus, the author field of the form serves no purpose and should be omited from the form entirely. 
This includes the user id that was initially hidden on the form. Because the form is already linked to the user on the backend of the application, there is no reason it should be displayed on the frontend.

1. **Get the Juice-Shop-Vulnerable Source Code**
     - Navigate to the _Juice-Shop-Vulnerable_ directory on your local machine or follow the instructions on the [Juice-Shop-Vulnerable](../Juice-Shop-Vulnerable) GitHub page to create a local copy on your      machine.

2. **Locate the _contact.component.html_ File**
     - In the _Juice-Shop-Vulnerable_ source code, navigate to the [contact.component.html](../Juice-Shop-Vulnerable/frontend/src/app/contact/contact.component.html) file, located in the _contact_               directory, and open it.
  
3. **Modify the _contact.component.html_ File**
     - Locate the following vulnerable line of code in the the _contact.component.html_ file responsible for the _Unique Id_.
       
       &nbsp;<img width="890" alt="bac-id-fix" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/3d72909c-ca78-48a8-a29e-0b9f85b1364e">&nbsp;

     - Delete this line of code shown in the image above
     - Locate the following vulnerable line of code in the the _contact.component.html_ file responsible for the _Author_ form field.
  
       &nbsp;<img width="1395" alt="bac-author-fix" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/c8095082-4115-4e79-aa31-606e1d9b985c">&nbsp;
       
     - Delete this line of code shown in the image above.
     - Save all changes made.


     By removing this sensitive data from the frontend of the application, we have not only secured our web application from attackers impersonating users, but have secured critical information about            individual users and database information.

     For instructions on how to run the **Secure** version of this web application or view source code that secures against this attack, go to [Juice-Shop-Secure](../Juice-Shop-Secure).
   
## Additional Security Considerations
_Broken Access Control_ can occur for a variety of different reasons. To fully secure a web application from giving users unauthorized access, the following security practices should also be considered:
- **Proper Authentication**: Practice secure password policies by using strong passwords and enforcing password changes frequently.
- **Enforce Least Privileges**: Frequently audit and assess access controls for different users. A user should only have access to what is necessary for that user role. Roles that enable more access should be limited and carefully considered. 
- **Audit Access Controls**: Frequently audit and assess integrity of access to the web application for the different user roles. Change or remove access privileges if they are no longer appropriate for a user role.
