##propertyParser uses https://translate.yandex.net to go through a properties file and converts the text values based on locale:

**To use:**

Update the service key in propertyParser.js:

```
const key = 'trnsl.1.1.20170505T025536Z.3edcea2be083e2f2.63e93143a8cbe4e89a2de0d36c0bbb7c4259f2d6';
```

**To run:**
```
node propertyParser.js
```

You will be prompted for the path to your properties file and then locale you'd like applied. 

What gets created is a new file with the locale changes applied.

Here is what you'll see when it runs:
```
jeff@debian:~/Documents/propertiesParser$ node propertyParser.js 
What is the name of file?: test.properties
What locale do you want to convert to?: es
{"pid":11247,"hostname":"debian","level":30,"time":1496276394719,"msg":"Command-line input received:","v":1}
{"pid":11247,"hostname":"debian","level":30,"time":1496276394720,"msg":"  Sanitized filename: test.properties","v":1}
{"pid":11247,"hostname":"debian","level":30,"time":1496276394720,"msg":"  locale: es","v":1}
{"pid":11247,"hostname":"debian","level":30,"time":1496276394723,"msg":"New filename: test_es.properties","v":1}
{"pid":11247,"hostname":"debian","level":30,"time":1496276394985,"msg":"Processing: hello {0} you {1} again, interval: 1496276394985","v":1}
{"pid":11247,"hostname":"debian","level":30,"time":1496276395238,"msg":"Processing: hello blobby, interval: 1496276395238","v":1}
{"pid":11247,"hostname":"debian","level":30,"time":1496276395493,"msg":"Processing: Please sign in again, interval: 1496276395493","v":1}
{"pid":11247,"hostname":"debian","level":30,"time":1496276395749,"msg":"Processing: Not a valid username, interval: 1496276395749","v":1}
{"pid":11247,"hostname":"debian","level":30,"time":1496276396008,"msg":"Processing: Not a valid password, interval: 1496276396008","v":1}
{"pid":11247,"hostname":"debian","level":30,"time":1496276396268,"msg":"Processing: File not found, interval: 1496276396268","v":1}
{"pid":11247,"hostname":"debian","level":30,"time":1496276396271,"msg":"Processing: , interval: 1496276396271","v":1}
{"pid":11247,"hostname":"debian","level":30,"time":1496276396532,"msg":"Processing: username, interval: 1496276396532","v":1}
{"pid":11247,"hostname":"debian","level":30,"time":1496276396799,"msg":"Processing: password, interval: 1496276396799","v":1}

jeff@debian:~/Documents/propertiesParser$ ls
node_modules  package.json  propertyParser.js  README.md  test_es.properties  test.properties
```
We requested a spanish version of our properties file be created.  After the command ran we have test_es.properties.

Enjoy.

