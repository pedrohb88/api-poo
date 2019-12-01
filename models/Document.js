class Document{

    constructor(obj){

        this.number = obj.number;
        this.issuingBody = obj.issuingBody;
        this.type = obj.type;

        this.id = null;
    }
}

module.exports = {Document};