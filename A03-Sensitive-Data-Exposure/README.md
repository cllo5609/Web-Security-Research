# A03:2017 - Sensitive Data Exposure

## What is Sensitive Data Exposure

[Sensitive Data Exposure](https://owasp.org/www-project-top-ten/2017/A3_2017-Sensitive_Data_Exposure) is a vulnerability on web applications that exposes data that is meant to be inaccessible to unauthorized users. The data exposed is considered sensitive, in that, it is private information that if used nefariously, could be unethical or illegal. This sensitive data can range from confidential documents and records, to login credentials and personal identifiers in an application’s database.

A web application can be vulnerable to sensitive data exposure for many different reasons. Typically, this vulnerability occurs as a result of insecure storage of data in a database, insecure code vulnerable to attacks such as injection, improperly stored or exposed files, and inadequate encryption of data.

## Sensitive Data Exposure Demonstration
Many of the commonly known web attacks can be used by attackers to expose sensitive data. _Injection_, _Cross-site Scripting_ and _Cross-site Forgery_ are some of the more frequently used attacks, but in some cases, if confidential files are improperly stored, exploiting this vulnerability can be achieved by simply navigating through the website itself.

To demonstrate this, begin by opening the ***Juice-Shop-Vulnerable*** web application via ***Docker***. Let’s explore the site and see if we can find anything that might provide us with some data.

___
### Explore the _About Us_ Page
Open the side menu by clicking the top left corner of the screen and navigate to the ***About Us*** page.

&nbsp;<img width="495" alt="sde-about-us" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/0c5a8aeb-1bca-412c-a1e4-f8b0d921930c">&nbsp;

Here we can see that the ***About Us*** page has a few links that we can click. Let’s check out the terms of use link located in the paragraph under ***Corporate History and Policy***.

&nbsp;<img width="501" alt="sde-link" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/e7b44c07-73ad-4ec9-85d6-db264943a5fa">&nbsp;

___
### Observe the URL
As you would expect, we are redirected to file ***legal.md*** that provides us with the requested information.

&nbsp;![sde-legal](https://github.com/jmr54/Website-Security-Research/assets/55637731/b173efb5-a7a4-414a-8142-212c5246e562)&nbsp;

This is obviously not confidential information and the data provided is authorized. 
However, if we take a look at the URL ```http://localhost:3000/ftp/legal.md``` we see that this file is stored in a directory named **FTP**. Could there be other files stored in that directory too?

___
### Edit the URL
Edit the URL by deleting **legal.md** ```http://localhost:3000/ftp/``` then hit enter.

Whoa! Not only does this directory contain the legal.md file, but a whole bunch of files and even another directory.

&nbsp;<img width="776" alt="sde-ftp" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/8d23ca30-f207-4c5e-9501-c3c5c9273f06">&nbsp;

___ 
### Look in the Directory for Sensitive Data
It appears that some of the files are encrypted and some are left in plain text. Let’s checkout some of the unencrypted files. ***acquistions.md*** sounds interesting. Double click on the file to see what's inside!

&nbsp;<img width="611" alt="sde-acqu" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/beefd6f7-9add-4e1b-a3f0-f07bf95a3a0e">&nbsp;

As you can see from the second line in this text file, this data is intended to be confidential and should not be accessible to client side users of the web application.

Not only did the web developer leave unnecessary folders on the client side application, but this folder contained unencrypted sensitive data that was not intended to be made public.

## Securing Exposed Sensitive Data in Juice Shop

There are several things that can be done to secure a web application against sensitive data exposure. The best solution is to remove unnecessary files, directories, credentials, or anything else that exposes data or gives users unauthorized access to data.  

### Identifying the Vulnerability
In the example above, the ***ftp*** folder contained sensitive data that served no functional purpose and was not intended to be publicly available. 
The developer clearly did not intend to leave such sensitive information exposed. The best solution to secure this data is to remove it from the client side altogether.

Take a look at the outlined code snippet from the ***Juice Shop Vulnerable*** source code below.

&nbsp;<img width="1071" alt="sde-ftp-code" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/7f7c771c-d4c4-45a9-80b1-30e73d122c76">&nbsp;

Located in the ***server.ts*** file are three lines of code. This code is responsible for allowing the _ftp_ directory to be accessed by a **relative path** rather than an **absolute path**, giving any user access to the directory.

### Securing the Vulnerability
To mitigate sensitive data exposure, it is important to conduct regular security testing and code audits to identify exposed data. This in part can be done by reviewing the source code to identify data that should not be public as well as client side feature testing. 

Even data stored on the server side or database of a web application is not immune to being exposed. For this reason, it is crucial that all sensitive data be encrypted using a strong encryption algorithm.

1. **Get the Juice-Shop-Vulnerable Source Code**
  - Navigate to the _Juice-Shop-Vulnerable_ directory on your local machine or follow the instructions on the [Juice-Shop-Vulnerable](../Juice-Shop-Vulnerable) GitHub page to create a local copy on your machine.

2. **Locate the _acquisitions.md_ File**
    - In the _Juice-Shop-Vulnerable_ source code, navigate to the [acquisitions.md](../Juice-Shop-Vulnerable/ftp/acquisitions.md) file, located in the _ftp_ directory, and open it.
   
    &nbsp;<img width="513" alt="sde-acq" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/77547187-6a6f-40d5-a1fe-daa0e384377c">&nbsp;

    - Copy the contents of the _acquisitions.md_ file

3. **Create a New _acquisitions.md_ File**
    - In the _Juice-Shop-Vulnerable_ source code, navigate to the [files](../Juice-Shop-Vulnerable/test/files) directory, located in the _test_ directory.
    - Create a new file named ```acquisitions.md``` in the 'files' directory by right clicking on the directory and selecting _New File..._.

    &nbsp;<img width="497" alt="sde-files" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/e848d729-cf23-4e90-b4ea-0e2f61d36abd">&nbsp;

    - Paste the content from the original **acquisitions.md** file into the new **acquisitions.md** file.

4. **Modify the Encryption Algorithm**
    - In the _Juice-Shop-Vulnerable_ source code, navigate to the [encrypt.py](../Juice-Shop-Vulnerable/test/files/encrypt.py) file, located in the _files_ directory.
    - Replace the code in the _encrypt.py_ file with the code provided below:
      
    ```
    import os
    
    # Public Parameters
    N = 145906768007583323230186939349070635292401872375357164399581871019873438799005358938369571402670149802121818086292467422828157022922076746906543401224889672472407926969987100581290103199317858753663710862357656510507883714297115637342788911463535102712032765166518411726859837988672111837205085526346618740053
    e = 65537
    
    # Open the first unencrypted document for reading
    confidential_document = open('./test/files/announcement.md', 'r')
    
    # Create a new file to write encrypted data to
    encrypted_document = open('./test/files/announcement_encrypted.md', 'w')
    
    # Encrypt the document!
    for char in confidential_document.read():
        encrypted_document.write(str(pow(ord(char), e, N)) + '\n')
    
    # Save the file
    encrypted_document.close()
    
    # Delete the unencrypted file
    os.remove('./test/files/announcement.md')
    
    # Open the second unencrypted document for reading
    confidential_document_2 = open('./test/files/acquisitions.md', 'r')
    
    # Create a new file to write encrypted data to
    encrypted_document_2 = open('./test/files/acquisitions_encrypted.md', 'w')
    
    # Encrypt the document!
    for char in confidential_document_2.read():
        encrypted_document_2.write(str(pow(ord(char), e, N)) + '\n')
    
    # Save the file
    encrypted_document_2.close()
    
    # Delete the unencrypted file
    os.remove('./test/files/acquisitions.md')
    ```

    The code in the ***encrypt.py*** file will read the text in the ***announcement.md*** file and the ***acquisitions.md*** file and save each to a variable.
    
    Next, the script will create an ***announcement_encrypted.md*** file and a ***acquisitions_encrypted.md*** to write the encrypted data to.
    
    Using the encryption key defined in the encrypt.py file, the original plain text will be encrypted and stored in the newly created files.

5. **Modify the _server.ts_ File**
    - In the _Juice-Shop-Vulnerable_ source code, navigate to the [server.ts](../Juice-Shop-Vulnerable/server.ts) file, located in the _Juice-Shop-Vulnerable_ directory.
    - Locate the following lines of code in the ***server.ts*** file.
      
    &nbsp;<img width="1071" alt="sde-ftp-code" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/8e121075-8312-4991-8198-e4562714d04e">&nbsp;

    - Delete the lines of code shown in the image above.

6. **Encrypt the Sensitive Data**
    - Open a _terminal_ window and navigate to the directory ***Juice-Shop-Vulnerable***. (This directory will be in the same location used to run Docker locally)
    - Once in the ***Juice-Shop-Vulnerable*** directory, paste ```python3 ./test/files/encrypt.py``` into the command line of the terminal window and press _enter_.
    - Save all changes made.

    Running ***encrypt.py*** will create two new files, ***acquisitions_encrypted.md*** and ***announcement_encrypted.md*** in the ***files*** directory. These files contain the encrypted data from the         confidential documents ***acquisitions.md*** and ***announcement.md***. The unencrypted ***acquisitions.md*** and ***announcement.md*** files are then deleted.
    
    &nbsp;<img width="414" alt="sde-encrypted" src="https://github.com/jmr54/Website-Security-Research/assets/55637731/03e39fef-0bf7-4879-b557-ba01447b1249">&nbsp;
    
    Encrypted files can only be decrypted using the private decryption key located in the ***decrypt.py*** file.
    
    For instructions on how to run the **Secure** version of this web application or view source code that secures against this attack, go to [Juice-Shop-Secure](../Juice-Shop-Secure).

## Additional Security Considerations
_Sensitive Data Exposure_ can occur for a variety of different reasons. To fully secure a web application from exposing sensitive data, the following security practices should also be considered:
- **Secure Data Storage**: In addition to encrypting sensitive data, ensure that encrypted data stored in databases are properly built and secured.
- **Access Controls**: Frequently audit and assess access controls for different users. A user should only have access to what is necessary for that user role. Roles that enable more access should be limited and carefully considered. 
- **Continuous Development**: Frequently audit and assess integrity of the web application's security to ensure it is up-to-date with the latest security measures and practices. 

