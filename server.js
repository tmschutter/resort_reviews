const express = require('express')
const morgan = require('morgan')
const dotenv = require('dotenv')
const pool = require('./pool.js')

dotenv.config()

const app = express()

app.use(morgan('tiny'))
app.use(express.static('public'))
app.use(express.json())

app.get('/resorts', async (req, res)=>{
    try {
        const { rows } = await pool.query('SELECT * FROM resorts')
        res.json(rows)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get('/resorts/:id', async (req, res)=>{
    const id = req.params.id
    try {
        const { rows } = await pool.query('SELECT * FROM resorts WHERE resort_id=$1', [id])
        res.json(rows)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get('/reviews/:id', async (req, res)=>{
    const id = req.params.id
    try {
        const { rows } = await pool.query('SELECT * FROM reviews WHERE resort_id=$1', [id])
        res.json(rows)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post('/reviews/:id', async (req, res)=>{
    const id = req.params.id
    const { username = 'anonymous', title, content, rating } = req.body
    try {
        await pool.query(
            'INSERT INTO reviews (username, title, content, rating, resort_id) VALUES ($1, $2, $3, $4, $5)',
            [username, title, content, rating, id]
        )
        res.json('{"success": "true"}')
    } catch (error) {
        res.status(500).send(error)
    }
})

const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`Listening on port: ${PORT}`);
})