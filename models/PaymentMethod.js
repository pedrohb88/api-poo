class PaymentMethod{

    constructor(obj){
        this.cardNumber = obj.cardNumber;
        this.cardName = obj.cardName;
        this.validUntil = obj.validUntil;
        this.securityCode = obj.securityCode;
    }
}

module.exports = {PaymentMethod};