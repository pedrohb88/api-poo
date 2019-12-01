class Address{

    constructor(obj){

        this.street = obj.street;
        this.district = obj.district;
        this.number = obj.number;
        this.city = obj.city;
        this.cep = obj.cep;

        this.id = null;
    }
}

module.exports = {Address};