# express-protocol
Decode protobuf data for express

- With the protobufjs library.
- It's easy to use.

[![NPM version](https://img.shields.io/npm/v/express-protocol.svg)](https://www.npmjs.com/package/express-protocol)
[![License](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/dt/express-protocol.svg)](https://www.npmjs.com/package/express-protocol)
[![node](https://img.shields.io/node/v/express-protocol.svg)](https://nodejs.org/en/download/)

# Installation

    npm i express-protocol

# Usage

### For the client example

Include script tag in html

		<script src="https://raw.githubusercontent.com/chenxianming/express-protocol/master/dist/protobuf.min.js"></script>


FE encode data to buffer

	  var root = protobuf.parse(`
		syntax = "proto3";
		package awesomepackage;

		message AwesomeMessage {
			optional string stringVal = 1;
			message EmbeddedMessage {
				optional int32 key2 = 1;
				optional string key3 = 2;
			}
			optional EmbeddedMessage embeddedExample1 = 2;
			optional int32 key4 = 3;
			optional string ke5 = 4;
		}
	  `).root;

	  var AwesomeMessage = root.lookupType("awesomepackage.AwesomeMessage");

	  var message = AwesomeMessage.create({
		  stringVal:'123',
		  embeddedExample1:{
			  key2:1,
			  key3:'123'
		  },
		  key4:123,
		  key5:'111'
	  });

	  var buf = AwesomeMessage.encode(message).finish();
	  var arr = buf.toString();

	  //Send array string to server
	  post( {protoBuf:'['+arr+']' } )

If you completed setup server, try to encode postdata and decode response data.

The post format like this one , or you can submit "application/json" format.

![request](http://www.coldnoir.com/request.png "request")

	  $.post('/', {protoBuf:'['+arr+']' }, function( data ){

		  var root = protobuf.parse(`
			  syntax = "proto3";
			  package test;

			  message Message {
				optional string msg = 1;
				message ResultMessage {
					required int32 statusCode = 1;
					required int32 count = 2;
					message Listobj {
					  required string key1 = 1;
					  required int32 key2 = 2;
					}
					repeated Listobj list = 3;
				}
				optional ResultMessage result = 2;
			  }
		  `).root;

		  var arr = [];

		  var proto = root.lookupType("test.Message");

		  var buf = new Uint8Array( data.protoBuf );

		  console.log( proto.decode(buf).toJSON() );
	  });

You will recived an array  to parse.

![response](http://www.coldnoir.com/response.png "response")

Log the decode result;

![console](http://www.coldnoir.com/console.png "console")


### For the node client( Example for post encode only )

	let buf = AwesomeMessage.encode(message).finish();

	let data = buf.toJSON().data;

	let postArr = [];

	data.forEach( a => postArr.push( a ) );

	let arr = '['+postArr+']';

		//send postdata to server
	request( {protoBuf:arr} );


### For the server route

	const ExpressProtocol = require("express-protocol");

	let indexDecode = new ExpressProtocol({
	  packName: "awesomepackage.AwesomeMessage",
	  parse: `
		  syntax = "proto3";
		  package awesomepackage;

		  message AwesomeMessage {
			  optional string stringVal = 1;
			  message EmbeddedMessage {
				  optional int32 key2 = 1;
				  optional string key3 = 2;
			  }
			  optional EmbeddedMessage embeddedExample1 = 2;
			  optional int32 key4 = 3;
			  optional string ke5 = 4;
		  }
	  `,
	  sendName: "test.Message",
	  send: `
		syntax = "proto3";
		package test;

		message Message {
		  optional string msg = 1;
		  message ResultMessage {
			  required int32 statusCode = 1;
			  required int32 count = 2;
			  message Listobj {
				required string key1 = 1;
				required int32 key2 = 2;
			  }
			  repeated Listobj list = 3;
		  }
		  optional ResultMessage result = 2;
		}
	  `
	});

	router.post("/", indexDecode.decode(), function(req, res, next) {

        //You will recived a json data from req.body.protoData          
        console.log( req.body );

		//And you can see the buffer data in the client response.
		res.json({
			msg: "ok",
			result: {
				statusCode: 200,
				list: [
					{
						key1: "123",
						key2: 456
					},
					{
						key1: "test",
						key2: 789
					}]
			}
		});

	});

### Config / syntax

	let indexDecode = new ExpressProtocol({
		packName:'Index, to get the proto function object',
		parse:'Text, protocol buffer descriptor',
		sendName:'options, like a packName, if you want to response protobuf json to client',
		send:'Text, protocol buffer descriptor for response json.'
	});

In the express route

	router.post("/", indexDecode.decode(), function(req, res, next) {
		//do something
	});
