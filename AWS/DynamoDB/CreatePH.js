/*eslint no-console: "off"*/
var AWS = require('aws-sdk');

// var endpoint = 'http://localhost:8000';
var region = 'us-east-1';

if (process.argv.length > 2) {
	console.log('Setting endpoint to ', process.argv[2]);
	AWS.config.update({
		endpoint: process.argv[2]
	});
}

AWS.config.update({
	region: region
});

var dynamodb = new AWS.DynamoDB();

var params = {
	TableName: 'PHReadings',
	KeySchema:[
		{AttributeName: 'probe', KeyType: 'HASH'},
		{AttributeName: 'timestamp', KeyType: 'RANGE'}
	],
	AttributeDefinitions: [
		{AttributeName: 'probe', AttributeType: 'N'},
		{AttributeName: 'timestamp', AttributeType: 'S'}
	],
	ProvisionedThroughput: {
		ReadCapacityUnits: 1,
		WriteCapacityUnits: 1
	}
};

dynamodb.createTable(params, function(err, data) {
	if (err){
		console.error('Unable to create table. ', JSON.stringify(err, null, 2));
	} else {
		console.log('Created table. ', JSON.stringify(data, null, 2));
	}
});