const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const postgres = require('postgres');

dotenv.config();

const app = express()

app.use(morgan('tiny'));
app.use(express.static('public'));
app.use(express.json());

const URL = process.env.DATABASE_URL;
const PORT = process.env.PORT;
const sql = postgres(URL);

app.get('/resorts', async (req, res)=>{
    try {
        const data = await sql`SELECT * FROM resorts`;
        res.json(data)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get('/resorts/:id', async (req, res)=>{
    const id = req.params.id
    try {
        const data = await sql`SELECT * FROM resorts WHERE resort_id=${id}`
        res.json(data)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get('/reviews/:id', async (req, res)=>{
    const id = req.params.id
    try {
        const data = await sql`SELECT * FROM reviews WHERE resort_id=${id}`
        res.json(data)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post('/reviews/:id', async (req, res)=>{
    const id = req.params.id
    const { username = 'anonymous', title, content, rating } = req.body
    try {
        await sql`INSERT INTO reviews (username, title, content, rating, resort_id) VALUES (${username}, ${title}, ${content}, ${rating}, ${id})`
        res.json({success: true})
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post('/resorts', async (req, res)=>{
    const { name, city, state } = req.body
    try {
        await sql`INSERT INTO resorts (name, city, state) VALUES (${name}, ${city}, ${state})`
        res.json({success: true})
    } catch (error) {
        res.status(500).send(error)
    }
})

app.delete('/resorts/:id', async (req, res)=>{
    const id = req.params.id
    try {
        await sql`DELETE FROM resorts WHERE resort_id=${id}`
        res.json({success: true})
    } catch (error) {
        res.status(500).send(error)
    }
})

app.delete('/reviews/:id', async (req, res)=>{
    const id = req.params.id
    try {
        await sql`DELETE FROM reviews WHERE review_id=${id}`
        res.json({success: true})
    } catch (error) {
        res.status(500).send(error)
    }
})

app.listen(PORT, ()=>{
    console.log(`Listening on port: ${PORT}`);
})