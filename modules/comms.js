const ws = require("ws");

class Comms {

    constructor () {

        this.commsQue = {};
        this.activeWorker = false;

        this.wsServer = new ws.Server({
            host: "localhost",
            port: 2999
        });

        this.wsServer.on("connection", function(conn) {
            
            if(this.activeWorker) return conn.close();
            console.log("Established connection with worker...");

            conn.once("close", function() {
                console.log("Lost connection with worker...");
                this.activeWorker = false;
            }.bind(this));

            conn.on("message", async function(data) {
                let msg = JSON.parse(data);

                if(msg && msg.type == "response" && msg.data && msg.key) {
                    
                    if(!this.commsQue[msg.key]) return console.log("Could not find callback function...");

                    this.commsQue[msg.key](msg.data);
                    this.commsQue[msg.key] = null;

                }
            }.bind(this));

            this.activeWorker = conn;
        }.bind(this))

        this.wsServer.once("close", function() {
            console.log("Server went offline...");
            this.activeWorker = null;
        }.bind(this));

    }

    async requestToken(req) {
        return new Promise(function(resolve) {
            if(!req || typeof req != "string") return resolve(false);

            if(this.activeWorker && this.activeWorker.readyState == 1) {
                setTimeout(function() {
                    this.commsQue[req] = null;
                    return resolve(false);
                }.bind(this), 30000);
                    
                this.commsQue[req] = resolve;
                this.activeWorker.send(JSON.stringify({
                    type: "request",
                    data: req
                }));
            } else {
                return resolve(false);
            }
        }.bind(this));
    };

}

module.exports = Comms;