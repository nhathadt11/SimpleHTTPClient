# SimpleHTTPClient
An XHR-based HTTP client inspired by promise-based HTTP client

## How to use?
```
<script src="https://raw.githubusercontent.com/nhathadt11/SimpleHTTPClient/master/index.js" />
```
```
const client = new http.SimpleHTTPClient();
client
  .get('https://jsonplaceholder.typicode.com/todos/1')
  .after(handleResults)
  .but(handleError)
  .whatever(handleEndOfRequest)
  .send();
```
