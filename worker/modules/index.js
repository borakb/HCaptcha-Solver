let workerStatus = document.getElementById("status");
let autoReconnect = false;

let allowConnect = true;
let isConnected = false;

let wsUrl = "ws://localhost:2999";

function setStatus(status) {
    switch(status) {
        case -1:
            workerStatus.className = "red";
            workerStatus.textContent = "Inactive";
            break;
        case 0:
            workerStatus.className = "yellow";
            workerStatus.textContent = "Connecting...";
            break;
        case 1:
            workerStatus.className = "green";
            workerStatus.textContent = "Active";
    }
}

function worker() {};

worker.prototype.connect = function() {
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = this.onopen.bind(this);
    this.ws.onclose = this.onclose.bind(this);
    this.ws.onmessage = this.onmessage.bind(this);
}

worker.prototype.onopen = function() {
    setStatus(1);
    isConnected = true;
}

worker.prototype.onclose = function() {
    setStatus(-1);
    isConnected = false;
    if(!autoReconnect) return;
    allowConnect = true;
    connect();
}

worker.prototype.onmessage = async function(d) {
    let msg = JSON.parse(d.data);

    if(msg && msg.type == "request" && msg.data) {
        let token = await getn(msg.data);
        if(this.ws.send) {
            this.ws.send(JSON.stringify({
                type: "response",
                data: token,
                key: msg.data
            }));
        }
    }
}

function connect() {
    if(!allowConnect || isConnected) return;
    allowConnect = false;
    setStatus(0);
    setTimeout(function() {
        let curWorker = new worker();
        curWorker.connect();
        allowConnect = true;
    }, 500);
}
