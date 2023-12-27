# Insecure Deserialization
## What is Serialization?
To explain deserialization one must understand what serialization is. Serialization is the process of converting a data structure or object into a format that can be easily stored, transmitted, or reconstructed. The primary purpose of serialization is to save the state of an object or data structure in a way that can be easily reconstructed at a later time. This is particularly useful when you need to transfer data between different systems, such as sending data over a network or saving it to a file.
Once serialized, the data can be sent over a network, saved to a file, or stored in a database. Later, it can be deserialized, which is the process of reconstructing the original object or data structure from the serialized form.

## What is Deserialization
Deserialization is the reverse of that process, taking data structured in some format, and rebuilding it into an object. 
Common formats for serialized data include JSON (JavaScript Object Notation), XML (eXtensible Markup Language), and binary formats like Protocol Buffers and MessagePack. The choice of serialization format often depends on factors such as human readability, interoperability with different programming languages, and the efficiency of data representation.

## Why is Insecure Deserialzation Dangerous?
Insecure deserialization refers to a security vulnerability that occurs when an application or system does not properly validate serialized data before deserializing it. The attacker can manipulate the serialized data in a way that causes unexpected and potentially harmful behavior in the application. This can lead to a variety of security issues and types of attacks.
There are some common attacks due to the insecurity of deserialization.


1. Object Instantiation Attacks: Attackers may attempt to create instances of unexpected or malicious classes during deserialization, leading to unauthorized actions.


2. Denial of Service (DoS): Large or complex serialized data may cause excessive resource consumption during deserialization, leading to a denial-of-service situation.


## How to prevent Insecure Deserialization?
To mitigate insecure deserialization vulnerabilities, developers should:


1. Validate Serialized Data and ensure that the serialized data is valid. Make sure that the data is the expected structures before deserializing it.


2. Whenever possible, use strong typing to enforce the expected types during deserialization, preventing unexpected or malicious classes from being instantiated.


3. Implement integrity checks, such as digital signatures, to verify that the serialized data has not been tampered with.


4. Run deserialization processes in isolated environments with limited privileges to minimize the impact of potential security breaches.

5. Use available libraries to require configuration options such as fastjson. 
	
## Example used in OWASP Juice Shop Perform a Remote Code Execution

In OWASP Juice Shop, we perform a Remote Code Execution, which is another way of doing a DDOS. Juice shop contains an B2B API called Swagger that allow us to check the contents of their JSON. 

In order to access the B2B API, click the following link http://localhost:3000/api-docs/#/Order/createCustomerOrder . Then in order to authorize you must find the authorization token in the Juice Shop Order page as shown below. 

<img width="1280" alt="Screenshot 2023-11-04 150434" src="https://github.com/jmr54/Website-Security-Research/assets/67990368/17ec5c47-fa88-427d-8d5f-8225ea2ccd51">

Then after that shift back to the Swagger and click on the authorize button to input your token and log in. It should look like the following below.

<img width="1280" alt="Screenshot 2023-11-04 150622" src="https://github.com/jmr54/Website-Security-Research/assets/67990368/eb7c2e18-8840-4c12-862e-3c826665d4a9">


Then click on try it out and then an example order JSON shall be shown below like the image below. 
![image](https://github.com/jmr54/Website-Security-Research/assets/67990368/fcabb426-238a-4263-837a-9a3759849b1e)

After that click on execute it should show a successful respone like the image below.
![image](https://github.com/jmr54/Website-Security-Research/assets/67990368/11c50a75-ae18-4fc9-95c8-f086d1175daf)

Then in order to perform a DDOS attack post this following code into the Customer Order to be Placed field {"orderLinesData": "(function dos() { while(true); })()"} . Like the below image. 
<img width="1280" alt="Screenshot 2023-11-04 151609" src="https://github.com/jmr54/Website-Security-Research/assets/67990368/acd4cc5b-90ba-4302-86a2-65f410e7485d">

Then click execute and an error shall be shown stating that there is infinite loop that has been detected like the image below. 
![image](https://github.com/jmr54/Website-Security-Research/assets/67990368/b05eff4d-3775-4b01-b950-e5903e92531e)

## How do we prevent this?

In this Juice Shop example we will simulate a DDOS attack. The server will throw out an error saying that there is a infinite loop. This is a safeguard to prevent a real server crash. This option could be a way to prevent an insecure deserialziation by limiting a server response. However, for this testing example, pretend that the 2 seconds is indeed a DDOS attack. In order to prevent this, we would implement a JSON data check in order to make sure our data is in the right format. 

```
module.exports = function b2bOrder () {
  return ({ body }: Request, res: Response, next: NextFunction) => {
    if (!utils.disableOnContainerEnv()) {
      const orderLinesData = body.orderLinesData || ''
      // Validate and parse JSON data
      let parsedData
      try {
        parsedData = JSON.parse(orderLinesData)
      } catch (parseError) {
        // Handle parsing error
        res.status(400).json({ error: 'Invalid JSON data' })
        return // Stop further execution
      }
      try {
        const sandbox = { safeEval, orderLinesData }
        vm.createContext(sandbox)
        vm.runInContext('safeEval(orderLinesData)', sandbox, { timeout: 2000 })
        res.json({ cid: body.cid, orderNo: uniqueOrderNumber(), paymentDue: dateTwoWeeksFromNow() })
      } catch (err) {
        if (utils.getErrorMessage(err).match(/Script execution timed out.*/) != null) {
          challengeUtils.solveIf(challenges.rceOccupyChallenge, () => { return true })
          res.status(503)
          next(new Error('Sorry, we are temporarily not available! Please try again later.'))
        } else {
          challengeUtils.solveIf(challenges.rceChallenge, () => { return utils.getErrorMessage(err) === 'Infinite loop detected - reached max iterations' })
          next(err)
        }
      }
    } else {
      res.json({ cid: body.cid, orderNo: uniqueOrderNumber(), paymentDue: dateTwoWeeksFromNow() })
    }
  }
```
The code below shows how would parse the JSON data and make sure that it is valid. If it is not, there will be an error 400 status. 
```
      // Validate and parse JSON data
      let parsedData
      try {
        parsedData = JSON.parse(orderLinesData)
      } catch (parseError) {
        // Handle parsing error
        res.status(400).json({ error: 'Invalid JSON data' })
        return // Stop further execution
      }
```


The following code below shows how to help safeguard this attack.
![Screenshot 2023-11-21 122206](https://github.com/jmr54/Website-Security-Research/assets/67990368/9502c127-08ef-4412-b54c-4223edb848e3)

In the code below, it shows that we timeout after 2 seconds. This is another way to prevent a DDOS attack by setting a time out. However for this case, we pretend that this is a "DDOS attack". It also uses a third party called NotEvil that uses a safe version of Eval() and prevents any malicious codes. 
```
vm.createContext(sandbox)
        vm.runInContext('safeEval(orderLinesData)', sandbox, { timeout: 2000 })
        res.json({ cid: body.cid, orderNo: uniqueOrderNumber(), paymentDue: dateTwoWeeksFromNow() })
      } catch (err) {
        if (utils.getErrorMessage(err).match(/Script execution timed out.*/) != null) {
          challengeUtils.solveIf(challenges.rceOccupyChallenge, () => { return true })
          res.status(503)
          next(new Error('Sorry, we are temporarily not available! Please try again later.'))
        } else {
          challengeUtils.solveIf(challenges.rceChallenge, () => { return utils.getErrorMessage(err) === 'Infinite loop detected - reached max iterations' })
          next(err)
        }
```




