# TSL Server

## Description

Super simple TSL server for TCP/UDP.
The server returns a object every time it receives data:

```javascript
{
  address: INT,
  brightness: INT,
  tally4: BOOL,
  tally3: BOOL,
  tally2: BOOL,
  tally1: BOOL,
  label: STRING, //Padded to 16 chars
  sender: {
    address: STRING,
    port: INT,
    protocol: "UDP" || "TCP"
    }
}
```

## Getting started

```
npm install tslserver
```

### Example

```javascript
const TSLServer = require("tslserver");

let server = new TSLServer(5555, { udp: true, tcp: true });

server.on(
  "message",
  ({ address, brightness, tally1, tally2, tally3, tally4, label, sender }) => {
    console.log(
      address,
      brightness,
      tally1,
      tally2,
      tally3,
      tally4,
      label,
      sender
    );
  }
);
```
