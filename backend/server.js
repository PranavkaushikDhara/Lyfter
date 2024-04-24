const express=require("express");
const app=express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
const axios = require('axios');
app.listen(8000,()=>{
    console.log("Server started on 8000")
})

async function getLocationCoordinates(location) {
    const apiKey = 'AIzaSyCqCLH7DZCPhh9LSJhERje4yuOomqNMsEE';
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
    res.json({start:start,dest:dest})
})