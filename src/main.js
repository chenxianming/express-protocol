const protobuf = require("protobufjs");

class expressProtocol {
  constructor ( options ) {

    let self = this;
    this.packName = options.packName || null;
    this.file = options.file || null;
    this.parse = options.parse || null;
    this.root = null;
    this.proto = null;

    if(  !this.packName && ( !this.file || !this.parse )  ){
      throw Error('Options missing.');
    }

    if( this.file ){
      protobuf.load(  this.file, function(err, root) {
          self.root = root;
          self.proto = root.lookupType( self.packName );
      });
    }else if( this.parse ){
        this.root = protobuf.parse( self.parse ).root;
        this.proto = this.root.lookupType( self.packName );
    }else{
      throw Error('Unable to parse proto file.');
    }
  }

  decode ( req, res, next  )  {

      if( !req.body.protoBuf ){
        return next();
      }

      let arr = [];

      let json = JSON.parse( req.body.protoBuf );

      json.forEach( a => arr.push( a * 1 ) );

      let buf = new Uint8Array( arr );

      let data = this.proto.toObject( this.proto.decode( buf ) );

      req.body.protoData = data;

      next();
  }
}

module.exports = expressProtocol;
