/** 
 * Class: DataSource
 * Represents a websocket data source
  */
var DataSource = function (id, name) {
			
	this.id = id;
	this.name = name;
	
};

/** 
 * Class: Message
 * Represents a websocket message
  */
var Message = function (dataSource, payload) {
			
	this.timeStamp = Math.floor(Date.now()/1000);;
	this.dataSource = dataSource;
	this.payload = payload;
	
};