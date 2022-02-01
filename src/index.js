const EventEmitter = require("events").EventEmitter;
const Net = require("net");
const dgram = require("dgram");
const Parser = require("binary-parser").Parser;

class tslumd extends EventEmitter {
  constructor(port = 5000, { udp = true, tcp = true }) {
    super();
    this.port = port;
    this.eventEmitter = new EventEmitter();
    this.TSLdata = new Parser()
      .endianess("big")
      .bit1("u")
      .bit7("address")
      .bit2("u2")
      .bit2("brightness")
      .bit1("tally4")
      .bit1("tally3")
      .bit1("tally2")
      .bit1("tally1")
      .string("label", { length: 16, zeroTerminated: false });

    if (udp) {
      // Setup UDP server
      const UDPServer = dgram.createSocket("udp4");

      // On data
      UDPServer.on("message", (msg, rinfo) => {
        let data = this.TSLdata.parse(msg);
        delete data.u;
        delete data.u2;
        data.sender = {
          address: rinfo.address,
          port: rinfo.port,
          protocol: "UDP",
        };
        this.emit("message", data);
      });

      // Start UDP server
      UDPServer.on("listening", () => {
        const address = UDPServer.address();
        console.log(`UDP Server listening ${address.address}:${address.port}`);
      });

      UDPServer.bind(port);
    }

    if (tcp) {
      // Setup TCP server
      const TCPServer = new Net.Server();

      TCPServer.on("connection", (socket) => {
        // Client Object
        let clientAddress = socket.address();

        // On data
        socket.on("data", (chunk) => {
          let data = this.TSLdata.parse(chunk);
          delete data.u;
          delete data.u2;
          data.sender = {
            address: clientAddress.address,
            port: clientAddress.port,
            protocol: "TCP",
          };
          this.emit("message", data);
        });
      });

      // Start TCP server
      TCPServer.listen(port, (obj) => {
        console.log(`TCP Server listening localhost:${port}`);
      });
    }
  }
}

module.exports = tslumd;
