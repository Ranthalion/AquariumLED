/**
 * SnapshotController
 *
 * @description :: Server-side logic for serving images and video from the IP camera
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	small: function(req, res){

		var curl = require('curlrequest');
		var fs = require('fs');

		var url = 'http://camera:81/img/snapshot.cgi?user=admin&pwd=888888';
		
		var opts = {
			url: url,
			output: 'snapshot.jpg',
			get: ''
		};
		curl.request(opts, function cb(err, data, meta){
			fs.readFile('snapshot.jpg', function(error, img) {
				res.set('Content-Type', 'image/jpeg');
				res.send(img);
			});
		});
	}
};
