const express = require('express')
const axios = require('axios').default
const redisClient = require('./redisClient')

const app = express()

app.get('/',async (req,res) => {

    const cacheValue = await redisClient.get('questions')

    if(cacheValue) return res.json(JSON.parse(cacheValue))

    const {data} = await axios.get('https://quizapi-production-ca3a.up.railway.app/question?api_key=06396e50-3e52-4fdf-b50c-f5a88041550b')

    await redisClient.set('questions',JSON.stringify(data))
    await redisClient.expire('questions',20)
    return res.json(data)
})

app.listen(3000)