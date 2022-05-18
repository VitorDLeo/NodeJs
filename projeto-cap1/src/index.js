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

// balance

function getBalance(statement){
    const balance = statement.reduce((acc, operation) =>{
        if(operation.type === 'credit'){
            return acc + operation.amount;
        } else {
            return acc - operation.amount;
        }
    }, 0);
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


app.post("/deposit", verify, (request, responde)=>{
    const { description, amount } = request.body;

    const { customer } = request;

    const statementOperation = {
        description,
        amount, 
        created_at: new Date(),
        type: "credit"
    }

    customer.statement.push(statementOperation);

    return  response.status(201).send();
});

app.post("/withdraw", verify, (request, response) => {
    const { amount } = request.body;
    const { customer } = request;

    const balance = getBalance(customer.statement);

    if (balance < amount){
        return response.status(400).json({error: "Insuficient funds"})
    }

    const statementOperation = {
        amount,
        created_at: new Date(),
        type: "credit"
    };

    customer.statement.push(statementOperation);

    return response.status(201).send();
});

app.listen(3333);