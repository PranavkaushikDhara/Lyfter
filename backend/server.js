const express=require("express");
const app=express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
const axios = require('axios');
const { Client } = require('@elastic/elasticsearch');
const client = new Client({
  node: 'https://872ce0c234044163ad8bd832161a55b9.us-central1.gcp.cloud.es.io:443', // Elasticsearch endpoint
  auth: {
    apiKey: { // API key ID and secret
      id: 'farLGI8BeqwjdO7PczZR',
      api_key: 'EXBjcmpYRIWt5Hnd-M0Pxg',
    }
  }
})
app.listen(8000,()=>{
    console.log("Server started on 8000")
})
const apiKey = 'AIzaSyCqCLH7DZCPhh9LSJhERje4yuOomqNMsEE';
async function getLocationCoordinates(location) {
    
    const encodedLocation = encodeURIComponent(location);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedLocation}&key=${apiKey}`;
    // console.log(url);
    try {
      const response = await axios.get(url);
    //   console.log(response)
      const result = response.data;
      if (result.status === 'OK' && result.results.length > 0) {
        const { lat, lng } = result.results[0].geometry.location;
        return { latitude: lat, longitude: lng };
      } else {
        throw new Error('Unable to geocode location');
      }
    } catch (error) {
        // console.log(error)
      throw new Error('Failed to fetch location data');
    }
  }


app.post("/getLocationCoordinates",async(req,res)=>{
    // console.log(req.body.start+" "+req.body.dest)
    const start=await getLocationCoordinates(req.body.start);
    const dest=await getLocationCoordinates(req.body.dest);
    // console.log(start);
    // console.log(dest);
    sendRequest(req.body.start,req.body.dest);
    res.json({start:start,dest:dest})
})

async function sendRequest(start,dest){
  const url = `https://maps.googleapis.com/maps/api/directions/json?destination=${dest}&origin=${start}&transit_mode=train&key=${apiKey}`;
  const response = await axios.get(url);
  console.log(response.data.routes[0].legs[0].duration.text);
}

app.post("/addUser",async(req,res)=>{

  const user=req.body;
  const body = {
      mappings: {
          properties: {
              email:{type:'text'},
              name: { type: 'text' },
              password: { type: 'text' },
              type: { type: 'text' }
          }
      }
  };
  if(!await client.indices.exists({index: 'users'})){
      await client.indices.create({ index: 'users', body: body })
  }
  await client.index({
      index: 'users',
      document: {
          email:user.email,
          name:user.name,
          password:user.password,
          type:user.type
      },
    })
  
  res.json({ message: "Received post data" });
})

app.get("/getAllUsers",async(req,res)=>{
  const body = {
      mappings: {
          properties: {
              email:{type:'text'},
              name: { type: 'text' },
              password: { type: 'text' },
              type:{ type: 'text' },
              }
          }
      }
  if(!await client.indices.exists({index: 'users'})){
      await client.indices.create({ index: 'users', body: body })
  }
  try {
  const searchResult = await client.search({
      index: 'users',
      body: {
          query: {
              match_all: {}
          }
      }
  });
  res.json(searchResult.hits.hits);
  } catch (error) {
      console.error(`Error getting documents from posts`, error);
  }

});