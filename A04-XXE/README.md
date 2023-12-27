# How to perform XXE attack on OWASP Juice Shop

## What is XML?

XML is a markup language that defines a set of rules for encoding documents in a format that is both human-readable and machine-readable. It is designed to store and transport data, and it's widely used for representing structured information in a text format. It provides a common format for representing structured data that can be easily parsed and processed.
 An XML document is made up of elements, which are defined by tags. Elements can have attributes (name-value pairs) that provide additional information about the element.

 
```
<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
	<book>
    	<title>Introduction to XML</title>
    	<author>John Doe</author>
    	<price>29.95</price>
	</book>
	<book>
    	<title>Web Development Basics</title>
    	<author>Jane Smith</author>
    	<price>19.99</price>
	</book>
</bookstore>
```


In this example, bookstore, book, title, author, and price are elements, and the text within the elements represents the data. The <?xml ... ?> declaration at the beginning specifies the version of XML being used and the character encoding.


## So why is XML attacks an issue?
Often, applications need to receive and process XML documents from users. Old or poorly configured XML parsers can enable an XML feature known as external entity references within XML documents, which when evaluated will embed the contents of another file. Attackers can abuse this to read confidential data, access internal systems, and even shut down the application in a Denial of Service (DoS) attack.
For example, an XML document containing this:
]>&xxe;
would include the contents of the password file within the XML document. This can be seen in the example I provided in order to create a XXE attack. 


## How to Prevent
There are a couple of ways to prevent this attack.
You can simply disable DTD and External entity evaluation in the parser.
Upgrade to a modern parser library that is not vulnerable.
Use less complex data formats such as JSON, and avoid serialization of sensitive data.
Implement positive (“whitelisting”) server-side input validation, filtering, or sanitization to prevent hostile data within XML documents, headers, or nodes.
Verify that XML or XSL file upload functionality validates incoming XML using XSD validation or similar.
What I did in the example was two different things. In Juice Shop it uses libxmljs2, which checks the XML files for any dangerous components. Then I just disabled XML upload if the file contains text word Entity. 

## Steps to recreate a XXE Attack
In order to perform an attack on the OWASP juice shop, you have to install it on your local pc.

    Install node.js
    Run git clone https://github.com/juice-shop/juice-shop.git 
    Go into the cloned folder with cd juice-shop
    Run npm install (only has to be done before first start)
    Run npm start
    Browse to http://localhost:3000
With the provided xml I provided in the folder, select the xml file that correspond with your pc. So if I had windows I would use the following XML script.
```
<?xml version="1.0"?>
<!DOCTYPE xxe [
<!ELEMENT xxe ANY >
<!ENTITY xxe SYSTEM "file:///c:/Windows/system.ini" >]><xxe>&xxe;</xxe>
```
I would then submit it under the complaint section. Then a challenge should show up and state that you were able to get this challenge. 

In the image below it shows how it should look like after attacking it on a windows pc. 
![Screenshot 2023-10-26 154736](https://github.com/jmr54/Website-Security-Research/assets/67990368/77616376-a761-4bcf-b3f3-39874136e186)


## How would we prevent this attack?
For this tutorial I disabled any XML upload that contains the word "entity". I also had libxmljs2, which is a library and has the ability to check the XML files for any dangerous components. You can see the edit I made on the fileUpload.ts file under the routes folder from the Juice Shop.
```
        // If it contains entity prevent the attack. 
        if (xmlString.includes('ENTITY')) {
          res.status(400); 
          next(new Error('XML content contains forbidden string "ENTITY" (' + file.originalname + ')'));
          return;
        }

```
Down below you can see the code for the libxmljs2.
```

        // Add the strict option to the parser constructor and set it to false
        const xmlDoc = vm.runInContext('libxml.parseXml(data, { strict: false, noblanks: true, noent: true, nocdata: true, xxe: false })', sandbox, { timeout: 2000 });

```

In the image below, it shows how it looks like after fixing this vulernability. 
<img width="1280" alt="Screenshot 2023-10-28 205529" src="https://github.com/jmr54/Website-Security-Research/assets/67990368/25962468-7f41-4e90-8d37-9bc124aa11e7">
