const { response, request } = require("express");
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json())
const  customers = [];


// Middleware

function verify(request, response, next){
    const { cpf } = request.headers; 

    const customer = customers.find(customer => customer.cpf === cpf);

    request.customer = customer;

    if(!customer){
        return response.status(400).json({error: "Customer Not Found!"});
    }

    return next();
}


app.post("/account", (request, responde)=>{
    const {cpf, name} = request.body;
    const id = uuidv4();

    const customeAlreadyExists = customers.some(
        (customer) => customer.cpf === cpf
    );

    if (customeAlreadyExists){
        return response.status(400).json({
            error: "Customer Already Exists!"
        });
    }

    customers.push({
        cpf,
        name,
        id,
        statement:[]
    });

    return response.status(201).send();
});


app.get("/statement", verify, (request, response)=>{
    const { customer } = request;

    return response.json(customer.statement);
});

app.listen(3333);