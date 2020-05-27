const express = require('express');
const app = express();
const Joi = require('joi');

app.use(express.json());

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' }
]

//Standard GET
app.get('/', (request, response) => {
    response.send('Hello World!');
});

//Standard GET
app.get('/api/courses', (request, response) => {

    response.header("Content-Type",'application/json');
    response.send(courses);
});

//Parameter ID
app.get('/api/courses/:id', (request, response) => {

    const course = courses.find(c => c.id === parseInt(request.params.id));
    if (!course) return response.status(404).send('The course with the given ID was not found!');
    
    response.send(course);

});

//Query strings
app.get('/api/courses/:year/:month', (request, response) => {
    response.send(request.query);
});

//POST
app.post('/api/courses', (request, response) => {

    const {error} = validateRequest(request);

    if (error) return response.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: request.body.name
    };

    courses.push(course);
    response.send(course);
});

app.put('/api/courses/:id', (request, response) => {

    const {error} = validateRequest(request);
    const course = courses.find(c => c.id === parseInt(request.params.id));
    
    if (!course) return response.status(404).send(`Unable to find course ${request.params.id}`);
    if (error) return response.status(400).send(error.details[0].message);
 
     const newCourse = {
        id: + request.params.id,
        name: request.body.name
    };

    courses[courses.indexOf(course)] = newCourse;

    response.send(newCourse);
});

app.delete('/api/courses/:id', (request, response) => {

    const course = courses.find(c => c.id === parseInt(request.params.id));
    if (!course) return response.status(404).send(`Unable to find course ${request.params.id}`);

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    response.send(course);
});



function validateRequest(request) {
    const scehma = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(request.body, scehma);
}

//Setting the server port to the env variable $PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));