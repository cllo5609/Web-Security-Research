# A01:2017 - Injection
[Injection](https://owasp.org/www-project-top-ten/2017/A1_2017-Injection) is an attack that inserts or **"injects"** unauthorized code, commands, or data into a computer program or system. These attacks typically target vulnerabilities in an application's input handling and processing mechanisms, with the goal of executing malicious actions. There are several types of injection attacks, each affecting various types of software including web applications, databases, and operating systems. Some of the more common injection types include Cross-Site Scripting (XSS), Command Injection and HTTP Header Injection, though SQL Injection is by far the most commonly used of these attacks.

## What is SQL
**Structured Query Language** or **SQL**, is a programming language used for managing relational databases. SQL allows for storage and retrieval of data using queries. Data stored in an SQL database can be managed using different commands to update data, add new data or delete existing data.

## What are SQL Injections (SQLi)
SQL Injections are focused on exploiting vulnerabilities in web applications by injecting SQL code into the application's input fields, including search boxes and forms. This injected code manipulates the original query to allow unauthorized access to data stored in the SQL database, often revealing personal or sensitive information, such as, login information, usernames, passwords, credit card numbers, etc.
Many of the [largest data breaches in history](https://www.computerworld.com/article/2522045/rockyou-hack-exposes-names--passwords-of-30m-accounts.html) came as the results of SQL Injection attacks.

## SQL Injection Demonstration
SQL Injection attacks make use of an application's input fields in order to execute malicious code. The query used in a request is written in such a way that it escapes the original query, often allowing for further commands to be made.
  
Let's take a look at the ***Juice-Shop-Vulnerable*** web application to see how this works.
  
First, Navigate to the the ***Account*** button in the top right corner of the webpage. Make sure that you are logged out and then click ***Login***. You will be redirected to the Login page.
  
![Inj-account](https://github.com/jmr54/Website-Security-Research/assets/55637731/38c8918b-ff85-4aff-a008-b3350ebe033d)
  
___
### Inspect the Webpage 
  
Now, right click your mouse anywhere on the page to bring up the menu and click on ***Inspect***. This will allow you to inspect the elements on the page and provide us with some useful information regarding our requests.
  
<img width="948" alt="inj-inspect" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/7568a298-febe-4d5e-a583-28d4a1a10079">

___
### Test the Login Feature
Typically, an SQLi attack starts with a series of tests and observations. In order for someone to exploit a database, they must first understand the database.
  
Let's start by putting in any username and password and see what the results are.
  
&nbsp;<img width="546" alt="inj-invalid" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/93f5c2c1-f8f4-409a-98cf-8e956cb201a3">&nbsp;

  
As expected, we are given a message, informing us that our credentials are invalid. Using your element inspector, navigate over to the ***Network*** tab. Let;s see if we can gather any information. If you click on the ***login*** request and open the ***General*** tab, you'll see that the status code of the request is **"401 Unauthorized"** and the server responded with an **"Invalid email or password"**.

  
&nbsp;<img width="932" alt="inj-network-inspect" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/1c47d49b-1a91-4f94-abce-b285d3a24a19">&nbsp;
  
___
### Test the Login with a Single Quote
Let's try that again, but this time put a single quote ```'``` as the email and the same password we tried before. Woah, now instead of error message, we are receiving the message **"[object Object]"**.
  
&nbsp;<img width="545" alt="inj-single-quote" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/68fa8e4d-8ed9-4155-97b6-0d2ebb578379">&nbsp;
  
Could this be part of the database? Let's check the network tab of our inspector again and see if we can spot anything different.
This time instead of a 401 status code, we received **"500 Internal Server Error"**. Interesting!
  
&nbsp;<img width="929" alt="inj-network-inspect2" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/c0f60db6-e5c3-4cce-8712-25d1bed78bd9">&nbsp;
  
___
### Check the Server Response
Let's check the response. Hmmm... an error message and it looks like it gave us SQL code thats requesting information from a ***Users*** database. That could be interesting.
If we break down the query string, it looks like it is selecting all data from a database called "Users" where the email and password is equal to our inputs as a string.
  
&nbsp;<img width="1545" alt="inj-network-response" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/97d1c798-17e6-45d6-9002-39943a1ae85a">&nbsp;
  
Looking at the ```email = '''``` line of the query, what is differentiating our input of a single quote and the single quotes around our input when the query is interpreted by the server. The answer is **It Doesn't!**
  
___
### Test the Login with a Comment
Knowing this, what if we decided to keep our single quote as the input, but comment out the rest? Let's see!
For the email field, keep the single quote but add two hyphens ```'--``` and use the same password as before and click login.
  
&nbsp;<img width="541" alt="inj-comment" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/1ddceef1-b556-4649-be1f-bacf8283137e">&nbsp;
  
Hmmm.. we're back to the expected error message of "Invalid email or password" that we saw before. Let's think about this. If we comment out everything after the email, our SQL query turns into  ```SELECT * FROM Users WHERE email = ''```. Obviously there is no email in the database that is an empty string, but what if we added a condition where this statement is always true?
  
___
### Test the Login with a Conditional Statement
This time for the email field, add a condition after our single quote but before our comment starts ```' OR true--``` and click login.
  
&nbsp;<img width="543" alt="inj-or-true" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/bac49077-8b6c-4870-ae96-cd2cd9da73d5">&nbsp;
  
After clicking ***login*** you should be redirected back to the home page. Once again, click on the ***Account*** button in the upper right corner of the screen.
Unfortunately for the site administrator, we were able to gain full access to their account by injecting just a few characters into a SQL query.
  
&nbsp;<img width="347" alt="inj-admin" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/d736d588-b6af-4ca7-abd4-03fa91779996">&nbsp;

## Securing the 'User Login' Vulnerability in Juice Shop

There are several things that can be done to help mitigate risk of an SQL injection attack, the most important of which being the use of _prepared statements_ with _parameterized queries_. Rather than directly embedding user input into SQL queries, as we saw in the previous example, this technique requires that the query be defined completely by the developer. User input is then passed into the query at a later point, preventing manipulation of the intende query. Most modern programming languages have built in tools to accomplish this. For an SQLite database, such as the one running the Juice Shop Application, the built-in bind function is used.

### Identifying the Vulnerability
Take a look at the outlined code snippet from the ***Juice Shop Vulnerable*** below

 &nbsp;![inj-vuln-code](https://github.com/jmr54/Website-Security-Research/assets/55637731/db0abcbb-3711-4968-bd83-75faebca5327)&nbsp;

You will notice that the SQL query uses ```req.query.email``` and ```req.query.password``` as input. This means that the query is using input directly from the request that a user sent to fill in the information for ```email =``` and ```password =```. This SQL statement is neither a prepared statement nor is it parameterized. This is what allows attackers to manipulate SQL commands and gain unauthorized access.  

### Securing the Vulnerability
By using place holders in our SQL query and the bind function to safely pass in values to the query, we are able to create a predefined query that is immune from an SQL injection attack.
Follow the steps below to learn how to secure the **Juice Shop** application from this attack.

1. **Get the Juice-Shop-Vulnerable Source Code**
    - Navigate to the _Juice-Shop-Vulnerable_ directory on your local machine or follow the instructions on the [Juice-Shop-Vulnerable](../Juice-Shop-Vulnerable) GitHub page to create a local copy on your      machine.

2. **Locate the _login.ts_ File**
    - In the _Juice-Shop-Vulnerable_ source code, navigate to the _login.ts_ file, located in the _routes_ directory, and open it.

3. **Modify the _login.ts_ File**
    - Locate the following vulnerable line of code in the the _login.ts_ file 

      &nbsp;![inj-vuln-code](https://github.com/jmr54/Website-Security-Research/assets/55637731/db0abcbb-3711-4968-bd83-75faebca5327)&nbsp;

    - Replace the vulnerable line of code

      ```
      models.sequelize.query(`SELECT * FROM Users WHERE email = '${req.body.email || ''}' AND password = '${security.hash(req.body.password || '')}'
      AND deletedAt IS NULL`, { model: UserModel, plain: true })
      ```

      with the following secure code that utilizes prepared statements with parameterized queries.

      ```
      models.sequelize.query(`SELECT * FROM Users WHERE email = $1 AND password = $2 AND deletedAt IS NULL`,
          { bind: [req.body.email, security.hash(req.body.password)], model: UserModel, plain: true })
      ```

   - Once your code matches the image below, go ahead and save your changes.
    
      &nbsp;![inj-code-secure](https://github.com/jmr54/Website-Security-Research/assets/55637731/059eacb6-51b7-4f7b-854a-4ae376a45ae1)&nbsp;

In the image above, you can see that the SQL query now uses a prepared statement that cannot be manipulated based on user input.

Using the 'bind' function, we are able to add the collected input to the parameters and make a call to the database safely. If the user input is invalid, an error message is sent back.

For instructions to run the secure version of this web application or view source code that secures against this attack, go to [Juice-Shop-Secure](../Juice-Shop-Secure).

## Additional Security Considerations

_SQL Injection_ is just one of many types of _Injection_ attacks used to exploit vulnerable web applications. To fully secure a web application against injection attacks, the following security practices should also be considered:
- **Input Sanitization**: Sanitize user input by removing characters that could be used for injection, such as quote and comment characters.
- **Input Validation**: Compile a list of allowed characters and statements for user input to be compared against and reject input that doesn't match the list.
- **Least Privilege Principle**: Ensure that database access is appropriate for the type of user. The user should only have access to what is neccessary and nothing more.  
