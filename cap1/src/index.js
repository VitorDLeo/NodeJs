const { response } = require('express');
const express = require('express');

const app = express();


// localhost:3333
app.get("/courses", (request, response)=>{
    return response.json(["curso 1", "curso 2", "curso 3"]);
});

app.post("/courses", (request, response)=>{
    return response.json(["curso 1", "curso 2", "curso 3"]);
});

app.put("/couse/:id", (request, response)=>{
    return response.json(["curso 6", "curso 2", "curso 3"]);
});

app.patch("/course/:id", (request, response)=>{
    return response.json(["curso 6", "curso 7", "curso 3"]);
});

app.delete("/course/:id", (request, response)=>{
    return response.json(["curso 6", "curso 7"]);
});



app.listen(3333);