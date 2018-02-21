A push notification service for [HTMLCOINCORE Node](https://github.com/HTMLCOIN/htmlcoincore-node).

## Getting Started

```bashl
npm install -g htmlcoincore-node@latest
htmlcoincore-node create mynode
cd mynode
htmlcoincore-node install htmlcoin-notification
htmlcoincore-node start
```

## Configuration
Add this configuration to `htmlcoincore-node.json`

```json
{
    "htmlcoin-notification": {
      "routePrefix": "notification",
      "db": {
        "host": "127.0.0.1",
        "port": "27017",
        "database": "htmlcoin-notification",
        "user": "",
        "password": ""
      },
      "firebaseConfigPath": ""
    }
}
```

### Send device token to server
POST method:
```
  /notification/devicetoken/create
```
POST params:
```
  addresses: ["array of address"]
  deviceToken: "registration token from firebase"

  eg

  {
    "addresses":["qWYCiZEfZ6ebczufBojXpStpPcfxyZaKX2","qSmDcdH5u4nTMUmyKhDiWLrQrQAicwB7pS"],
    "deviceToken":"cZXmLEv-H8Y:APA91bG4m6XbzlZRi5eI3CtcypVU93EexZ_00wcaI4A35s0StRcToItXF1wXOI_3mn3Eu_8qq_HA5Y0Gmr6LxBu9qILluFwUVscxvNEUjd29dQiChsWcxzSqgkYV6OQJOl9Pvbgu4aTk"
  }

```
POST response:
```
  {
      "result":true
  }
```

## License
(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
