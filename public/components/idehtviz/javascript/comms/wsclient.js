/**
 * @author onurs
 */

/** 
 * Class: WSClient
 * Represents a websocket comms client
 */
var WSClient = function (uri, dataSource, agent) {

	var self = this;
	
	self.uri = uri;
	self.dataSource = dataSource;
	self.socket;	
	self.agent = agent;
	self.queue = [];

	self.send = function (payload, payloadClass) {
		payload.agentId = self.dataSource.id;
		var payloadWrapper = {};
		payloadWrapper['class'] = payloadClass;
		payloadWrapper['value'] = JSON.stringify(payload);
		var message = {
			timeStamp : Math.floor(Date.now()/1000), 
			dataSource : self.dataSource, 
			payload : payloadWrapper
		};
		self.socket.send(JSON.stringify(message));
	};
	
	self.receive = function (event) {
		var message = JSON.parse(event.data);
		var payload = JSON.parse(message.payload.value);
		postMessage({payload: payload, payloadClass: message.payload.class});
	};
	
	self.connect = function () {
		self.socket = new WebSocket("ws://"+self.uri);
		self.socket.onmessage = self.receive;
	};
	
	self.close = function () {
		self.socket.close();
	};
};

var wsClient;

/* 
	Function: onmessage

	Callback function that is called when the client receives a message from the server

	Parameters:

		e - received message wrapper
					
	Returns:
		
		N/A
*/
onmessage = function(e) {
	if (e.data.type == "Send") {
		wsClient.send(e.data.payload, e.data.payloadClass);
	} else if (e.data.type == "Setup") {
		wsClient = new WSClient(e.data.visualizationServiceURI, e.data.dataSource, e.data.agent);
		wsClient.connect();
		sendConnectMessage();
	}
};

/* 
	Function: sendConnectMessage

	Sends out a connection message to the server registering this client with the server

	Parameters:

		N/A
					
	Returns:
		
		N/A
*/
sendConnectMessage = function () {
	if(wsClient.socket.readyState != 1) {
		setTimeout(sendConnectMessage, 1000);
	} else {
		var connect = {
			agent: wsClient.agent
		}
		wsClient.send(connect, "com.perc.cyberviz.data.payload.Connect");
		postMessage({payload: {uri: wsClient.uri}, payloadClass: "Connected"});
	}		
};
