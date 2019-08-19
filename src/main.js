const protobuf = require("protobufjs");

class expressProtocol {
    constructor( options ){
        let self = this;

        this.packName = options.packName || null;
        this.file = options.file || null;
        this.parse = options.parse || null;
        this.send = options.send || null;
        this.sendName = options.sendName || null;

        this.root = null;
        this.proto = null;

        this.err = false;

        if( !this.packName && ( !this.file || !this.parse ) ){
            return self.err = true;
        }

        if( this.file ){
            protobuf.load(  this.file, function(err, root) {
                if( err ){
                    return self.err = true;
                }

                self.root = root;
                self.proto = root.lookupType( self.packName );
            });
        }else if( this.parse ){
            this.root = protobuf.parse( self.parse ).root;
            this.proto = this.root.lookupType( self.packName );
        }else{
            self.err = true;
        }
    }

    middleware( req, res, next ){
        if( !req.body.protoBuf || this.err ){
            return next();
        }

        let arr = [];

        let json = JSON.parse( req.body.protoBuf );

        json.forEach( a => arr.push( a * 1 ) );

        let buf = new Uint8Array( arr );

        let data;

        try{
            this.proto.toObject( this.proto.decode( buf ) );
        }catch(e){
            return next();
        }

        req.body.protoData = data;

        if( this.send ){
            return this.preSend( req, res, next );
        }

        next();
    }

    preSend( req, res, next ){
        let root,
            proto,
            self = this;

        if( this.send && !this.sendName ){
            protobuf.load( this.send, function(err, rt) {
                if( err ){
                    return self.err = true;
                }

                root = rt;
                proto = root.lookupType( self.sendName );
            });
        }else if( this.sendName && this.send ){
            root = protobuf.parse( self.send ).root;
            proto = root.lookupType( self.sendName );
        }else{
            self.err = true;
        }

        const wrap = ( json ) => ( obj ) => {
            let buf = proto.encode(obj).finish();
            json({
                protoBuf:buf.toJSON().data
            });
        }

        res.json = wrap(res.json.bind(res));

        next();
    }

    decode(){
        return this.middleware.bind( this );
    }
}

module.exports = expressProtocol;
