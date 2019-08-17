# express-protocol
Decode protobuf data for express

- With the protobufjs library.
- It's easy to use.

[![NPM version](https://img.shields.io/npm/v/express-protocol.svg)](https://www.npmjs.com/package/@cxm/logsync)
[![License](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/dt/express-protocol.svg)](https://www.npmjs.com/package/@cxm/logsync)
[![node](https://img.shields.io/node/v/express-protocol.svg)](https://nodejs.org/en/download/)

# Installation
  
    npm i express-protocol

# Usage

### For the client example

	- Include script tag in html

		<script src="/protobuf.min.js"></script>

	- FE encode data to buffer

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
		var arr = buf.toString().split(',');

		console.log( arr );//submit {protoBuf:arr} json data to server


### For the simple server
		
		const ExpressProtocol = require('express-protocol');

		let indexDecode = new ExpressProtocol({
		  packName:'awesomepackage.AwesomeMessage',
		  parse:`
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
		});


		router.post('/', indexDecode.decode.bind( indexDecode ), function(req, res, next) {

		  console.log( req.body );
		});


