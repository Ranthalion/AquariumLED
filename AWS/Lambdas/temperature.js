//temperature.js
var AWS = require('aws-sdk');

exports.saveTemperature = function(event, context, callback) {

	if (event.probe	=== undefined){
		callback('probe is undefined');
	}
	if (event.timestamp === undefined){
		callback('timestamp is undefined');
	}
	if (event.temperature === undefined){
		callback('temperature is undefined');
	}

	var docClient = new AWS.DynamoDB.DocumentClient();

	var params = {
		TableName: 'TemperatureReadings',
		Item: event
	};

    console.log('Saving');
    
	docClient.put(params).promise()
	.then(function(data){
	    console.log('saved ', data)
	    callback(null, data);
	})
	.catch(function(err){
	    console.log('error' , err)
	    callback(err);
	});

	//TODO: [ML] Check for error scenarios and send alert if needed
	
};

exports.getTemperatures = function(event, contect, callback){
	//TODO: [ML] Use params to limit the time range and avoid a scan	
	var dynamodb = new AWS.DynamoDB();
	
	var end = new Date().toISOString();  	
	var start = new Date();
	
	if (event.start	=== undefined){
	    console.log('defaulting');
  	    start.setDate(start.getDate() -1);
  	    start = start.toISOString();
	}
	else {
	    console.log('using input');
	    start = event.start;
	}
	
	if (event.end !== undefined){
		end = event.end;
	}
	
	var params = {
		TableName: 'TemperatureReadings', 
		KeyConditionExpression: "probe = :probe and #t between :start and :end",
		ExpressionAttributeNames: {
			"#t": "timestamp"
		},
		ExpressionAttributeValues: {
   			":probe": {
     			"N": "1"
    		},
    		":start": {
    			"S": start
    		},
    		":end": {
    			"S": end
    		}
  		} 
	};

	dynamodb.query(params).promise()
	.then(function(data){
		data.Items.map(function(item){
			item = parseDynamoDb(item);
		});
		callback(null, data.Items);
	})
	.catch(function(err){
		callback(err);
	});

};


function parseDynamoDb(item){
	Object.keys(item).forEach(function(key){
		Object.keys(item[key]).forEach(function(val){
			if (val === 'S'){
				item[key] = item[key][val];
			}
			else if (val === 'N'){
				item[key] = parseFloat(item[key][val]);
			}
			else{
				item[key] = item[key][val];
			}
		});			
	});
	return item;
}