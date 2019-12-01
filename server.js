require('./config/config');

var path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

var hbs = require('hbs');

const {Customer} = require('./models/Customer'); 
const {Employee} = require('./models/Employee');
const {Address} = require('./models/Address');
const {Document} = require('./models/Document');
const {PaymentMethod} = require('./models/PaymentMethod');
const {Order} = require('./models/Order');
const {Product} = require('./models/products/Product');
const {Cosmetic} = require('./models/products/Cosmetic');
const {General} = require('./models/products/General');
const {Medicine} = require('./models/products/Medicine');
const {MedicineBlack} = require('./models/products/MedicineBlack');
const {MedicineYellow} = require('./models/products/MedicineYellow');
const {MedicineRed} = require('./models/products/MedicineRed');
const {MedicineNone} = require('./models/products/MedicineNone');

let {authenticateCustomer, authenticateEmployee} =  require('./middleware/authenticate');

let app = express();
const port = 3000;

app.use(express.urlencoded());
app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/cliente/cadastro', function(rq, res){
  res.render('customers/register');
});
app.get('/cliente/login', function(rq, res){
  res.render('customers/login');
});
app.get('/cliente/validar-token', function(rq, res){
  res.render('customers/validateToken');
});
app.get('/cliente/novo-pedido', function(req, res){

  Product.findAll().then((products) => {
    res.render('customers/new-order', {products});
  })
  .catch((e) => res.send(e));
});
app.get('/cliente/listar-pedidos', function(req, res){
  res.render('customers/list-orders');
});

app.get('/funcionario/login', function(req, res){
  res.render('employees/login');
});
app.get('/funcionario/validar-token', function(rq, res){
  res.render('employees/validateToken');
});

app.get('/produto/adicionar', function(rq, res){
  res.render('products/add-product');
});
app.get('/produto/remedio/adicionar', function(req, res){
  res.render('products/add-medicine');
});

app.get('/produto/remedio/sem-tarja/adicionar', function(req, res){
  res.render('products/add-medicine-none');
});
app.get('/produto/remedio/tarja-preta/adicionar', function(req, res){
  res.render('products/add-medicine-black');
});
app.get('/produto/remedio/tarja-vermelha/adicionar', function(req, res){
  res.render('products/add-medicine-red');
});
app.get('/produto/remedio/tarja-amarela/adicionar', function(req, res){
  res.render('products/add-medicine-yellow');
});

app.get('/produto/cosmetico/adicionar', (req, res) => {
  res.render('products/add-cosmetic');
});

app.get('/produto/geral/adicionar', (req, res) => {
  res.render('products/add-general');
});

app.get('/produto/todos', function(req, res){
  

  Product.findAll().then((products) => {
    res.render('products/products', {products});
  })
  .catch((e)=>{
    res.send('error');
  });
});

app.get('/produto', (req, res) => {

  res.render('products/list-products');
});

app.get('/produto/remedio', (req, res) => {

  Medicine.findAll().then((medicines) => {

    res.render('products/products', {products:medicines});
  })
  .catch((e) => {
    res.send('error');
  })
});

app.get('/produto/cosmetico', (req, res) => {

  Cosmetic.findAll().then((cosmetics) => {

    res.render('products/products', {products:cosmetics});
  })
  .catch((e) => {
    res.send('error');
  })
});

app.get('/produto/variado', (req, res) => {

  General.findAll().then((generals) => {

    res.render('products/products', {products:generals});
  })
  .catch((e) => {
    res.send('error');
  })
});

hbs.registerHelper('list', function(items, options) {
 
  let out = '';
  let counter = 1;

  items.forEach((item, i) => {
    Object.keys(item).forEach((key) => {
      if(item[key] == null) item[key] = '-';
    });

    item.description = item.description.substr(0, 50) + '...';
    item.price = 'R$'+item.price;

    let date = new Date(item.expirationDate);
    item.expirationDate = date.getDate() +'/'+ (date.getMonth()+1)+'/'+ date.getFullYear();

    item.desconto = item.desconto !== '-' ? item.desconto + '%':item.desconto;

    switch(item.type){
      case 'MedicineNone':
        item.type = 'Remédio';
        break;
      case 'MedicineBlack':
        item.type = 'Remédio tarja preta';
        break;
      case 'MedicineRed':
        item.type = 'Remédio tarja vermelha';
        break;
      case 'MedicineYellow':
        item.type = 'Remédio genérico';
        break;
      case 'Cosmetic':
        item.type = 'Cosmético';
        break;
      case 'General':
        item.type = 'Variados';
        break;
    }

    out += `
    <tr>
      <th scope="row">${counter}</th>
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>${item.expirationDate}</td>
      <td>${item.manufacturer}</td>
      <td>${item.description}</td>
      <td>${item.composicao}</td>
      <td>${item.category}</td>
      <td>${item.contraIndicativos}</td>
      <td>${item.efeitosColaterais}</td>
      <td>${item.genericoDe}</td>
      <td>${item.desconto}</td>
      <td>${item.type}</td>
      <td>${item.quantity}</td>
    </tr>`;
    counter++;
  });

  return out;
});

hbs.registerHelper('list-to-order', function(items, options) {
 
  let out = '';
  let counter = 1;

  items.forEach((item, i) => {
    Object.keys(item).forEach((key) => {
      if(item[key] == null) item[key] = '-';
    });

    item.description = item.description.substr(0, 50) + '...';
    item.price = 'R$'+item.price;

    let date = new Date(item.expirationDate);
    item.expirationDate = date.getDate() +'/'+ (date.getMonth()+1)+'/'+ date.getFullYear();

    item.desconto = item.desconto !== '-' ? item.desconto + '%':item.desconto;

    switch(item.type){
      case 'MedicineNone':
        item.type = 'Remédio';
        break;
      case 'MedicineBlack':
        item.type = 'Remédio tarja preta';
        break;
      case 'MedicineRed':
        item.type = 'Remédio tarja vermelha';
        break;
      case 'MedicineYellow':
        item.type = 'Remédio genérico';
        break;
      case 'Cosmetic':
        item.type = 'Cosmético';
        break;
      case 'General':
        item.type = 'Variados';
        break;
    }

    out += `
    <tr>
      <th scope="row">${counter}</th>
      <td>
        <input name="add-product" type="checkbox"><br>
        <input name="product-quantity" type="number" placeholder="Quantidade">
        <input name="product-id" hidden value="${item.id}">
      </td>
      <td id="product-name">${item.name}</td>
      <td>${item.price}</td>
      <td>${item.expirationDate}</td>
      <td>${item.manufacturer}</td>
      <td>${item.description}</td>
      <td>${item.composicao}</td>
      <td>${item.category}</td>
      <td>${item.contraIndicativos}</td>
      <td>${item.efeitosColaterais}</td>
      <td>${item.genericoDe}</td>
      <td>${item.desconto}</td>
      <td>${item.type}</td>
      <td>${item.quantity}</td>
    </tr>`;
    counter++;
  });

  return out;
});

hbs.registerHelper('list-orders', function(items, options) {
 
  let out = '';
  let counter = 1;

  let item;

  Object.keys(items).forEach((key) => {
    item = items[key].info;
 
    out += `
    <tr>
      <th scope="row">${counter}</th>
      <td id="product-name">${item.date}</td>
      <td>R$${item.totalPrice}</td>
      <td>${item.totalQuant}</td>
      <td>${item.status}</td>
    </tr>`;
    counter++;
    
    out += '<tr><td colspan="5"><ul>';
    items[key].products.forEach((product) => {
      let subtotal = product.price * product.productQuant;

      out += `<li>${product.name} - ${product.manufacturer} - ${product.productQuant} unidade(s) - subtotal: R$${subtotal}</li>`;
    });
    out += '</ul></td></tr>';
  });

  return out;
});


//rotas para consumo da API 
app.post('/employees/login', (req, res) => {

  Employee.findByCredentials(req.body.email, req.body.password, (employee) => {
    if(!employee) return res.status(401).send('Credenciais inválidas');

    employee.generateAuthToken().then((token) => {
        res.header('x-auth', token).send('Logado com sucesso! <br><br> Token de autenticação: '+token);
    });
  });
});

app.post('/customers', (req, res) => {
  let b = req.body;

  let address = new Address({
    street: b.street,
    district: b.district,
    number: b['address-number'],
    city: b.city,
    cep: b.cep
  });

  let document = new Document({
    number: b['doc-number'],
    issuingBody: b.issuingBody,
    type: b['doc-type']
  });

  let paymentMethod = new PaymentMethod({
    cardNumber: b.cardNumber,
    cardName: b.cardName,
    validUntil: b.validUntil,
    securityCode: b.securityCode
  });

  let customer = new Customer({
    name: b.name,
    email: b.email,
    birthday: b.birthday,
    cpf: b.cpf,
    phone: b.phone,
    address,
    document,
    paymentMethod
  });

  customer.register(b.password).then((token) => {
    
    res.header('x-auth', token).send('Cadastrado com sucesso! <br><br> Token de autenticação: '+token);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.get('/customers', authenticateCustomer, (req, res) => {
  Customer.findByToken(req.token).then((customer) => {
    res.send(customer);
  }).catch((e) => res.send(e));
})

app.put('/customers', authenticateCustomer, (req, res) => {
  Customer.findByToken(req.token).then((customer) => {
    customer = new Customer(customer);
    customer.updateInfo(req.body, req.token).then((newCustomer) => {
      res.send(newCustomer);
    });
  })
  .catch((e) => res.send(e));
});

app.post('/customers/login', (req, res) => {
  

  Customer.findByCredentials(req.body.email, req.body.password, (customer) => {
    if(!customer) return res.status(401).send('Credenciais inválidas');

    customer.generateAuthToken().then((token) => {
        res.header('x-auth', token).send('Logado com sucesso! <br><br> Token de autenticação: '+token);
    });
  });
});

app.post('/authenticateCustomer', authenticateCustomer, (req, res) => {

  res.send('autenticado com sucesso!');
});

app.post('/authenticateEmployee', authenticateEmployee, (req, res) => {

  res.send('autenticado com sucesso!');
});

app.post('/products/medicine/:type', authenticateEmployee, (req, res) => {

  let body = req.body;
  body.type = req.params.type;

  let medicine;

  switch(req.params.type){
    case 'MedicineNone':
      medicine = new MedicineNone(body);
      break;
    case 'MedicineBlack':
      medicine = new MedicineBlack(body);
      break;
    case 'MedicineRed':
      medicine = new MedicineRed(body);
      break;
    case 'MedicineYellow':
      medicine = new MedicineYellow(body);
      break;
    default:
      res.send('Tipo de medicamento inválido');
      break;
  }

  medicine.save().then(() => {
    res.send('Produto adicionado com sucesso: '+JSON.stringify(medicine))
  }).catch((err) => {
    res.send(err);
  });
});

app.post('/products/cosmetic', authenticateEmployee, (req, res) => {
  let body = req.body;
  body.type = 'Cosmetic';

  let cosmetic = new Cosmetic(body);
  cosmetic.save().then(() => {
    res.send('Produto adicionado com sucesso: '+JSON.stringify(cosmetic))
  }).catch((err) => {
    res.send(err);
  });
});

app.post('/products/general', authenticateEmployee, (req, res) => {
  let body = req.body;
  body.type = 'General';

  let general = new General(body);
  general.save().then(() => {
    res.send('Produto adicionado com sucesso: '+JSON.stringify(general))
  }).catch((err) => {
    res.send(err);
  });
});

app.get('/products', (req, res) => {
  Product.findAll().then((products) => {
    res.send(products);
  })
  .catch((e)=>{
    res.send(e);
  });
});

app.get('/products/medicines', (req, res) => {
  Medicine.findAll().then((products) => {
    res.send(products);
  })
  .catch((e)=>{
    res.send(e);
  });
});

app.get('/products/cosmetics', (req, res) => {
  Cosmetic.findAll().then((products) => {
    res.send(products);
  })
  .catch((e)=>{
    res.send(e);
  });
});

app.get('/products/general', (req, res) => {
  General.findAll().then((products) => {
    res.send(products);
  })
  .catch((e)=>{
    res.send(e);
  });
});

app.post('/customers/orders', authenticateCustomer, (req, res) => {
  let products = req.body;
  let ids = products.ids.split(',');
  let quantities = products.quantities.split(',');

  products = [];

  for(i = 0; i < ids.length; i++){
    products.push({
      id: ids[i],
      quantity: quantities[i]
    });
  }

  Product.getInfo(ids).then((productsInfo) => {

    let price = productsInfo.reduce((ac, v, i) => ac + (parseFloat(v.price)*products[i].quantity), 0.0);

    let itemsQuant = products.reduce((ac, v) => ac + parseInt(v.quantity), 0);
    
    let order = new Order({
      status: 'completed',
      customerId: req.user.id,
      price,
      itemsQuant
    });

    order.addProduct(...products);

    order.save().then(() => {
      res.send('Pedido criado com sucesso!');
    })
    .catch((e) => res.send('Falha ao criar pedido: '+e));

  })
  .catch((e) => res.send(e));
});

app.get('/customers/orders', authenticateCustomer, (req, res) => {
  Order.findByCustomerId(req.user.id).then((orders) => {
    res.send(orders);
  })
  .catch((e) => res.send(e));
});

app.post('/cliente/pedido', authenticateCustomer, (req, res) => {
  Order.findByCustomerId(req.user.id).then((orders) => {
    res.render('customers/orders', {orders});
  })
  .catch((e) => res.send(e));
});

app.listen(port, function () {
  console.log(`Servidor online na porta ${port}`);
});

module.exports = {app};
