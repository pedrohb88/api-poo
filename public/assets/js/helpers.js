$(document).ready(function () {

    $('#new-order').submit(function(e){
        e.preventDefault();

        let checkboxes = $('input[type=checkbox]:checked');

        let quantError = false;

        let form = $('<form hidden method="post" action="/customers/orders"></form>');
        let ids = [];
        let quantities = [];

        $.each(checkboxes, function (i, v) { 
            let elem = $(v);

            let id = elem.siblings('input[name=product-id]').val();
            let quantity = elem.siblings('input[name=product-quantity]').val();

            if(quantity == false) {
                quantError = true;

                let name = elem.parent().parent().find("#product-name").html();

                return alert(`Quantidade do produto: ${name} não informada.`);
            }

            ids.push(id);
            quantities.push(quantity);
        });

        if(quantError) return;
        if(!ids.length) return alert('Nenhum produto selecionado.');

        let idsInput = $(`<input name="ids" value="${ids.join(',')}">`);
        let quantitiesInput = $(`<input name="quantities" value="${quantities.join(',')}">`);

        let token = $('input[name=x-auth]').val();

        if(!token.length) return alert('Token não informado.');

        let tokenInput = $(`<input name="x-auth" value="${token}">`);

        form.append(idsInput);
        form.append(quantitiesInput);
        form.append(tokenInput);

        $('body').append(form);

        form.submit();
    });
});