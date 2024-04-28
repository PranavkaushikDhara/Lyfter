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
    const duration=await sendRequest(req.body.start,req.body.dest);
    console.log(duration)
    res.json({start:start,dest:dest,duration:duration})
})

async function sendRequest(start,dest){
  const url = `https://maps.googleapis.com/maps/api/directions/json?destination=${dest}&origin=${start}&transit_mode=train&key=${apiKey}`;
  const response = await axios.get(url);
  return response.data.routes[0].legs[0].duration.text;
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

app.post("/authorizeUser",async(req,res)=>{
  console.log(req.body);
  if(!await client.indices.exists({
      index:'users'
  })){
    console.log("Index does not exist")
      res.json([]);
  }
  const searchResult = await client.search({
      index: 'users',
      body: {
          query: {
              bool: {
                  must: [
                      { match: { email: req.body.email }},
                      { match: { password: req.body.password }},
                      { match: { type: req.body.type }}
                  ]
              }
          }
      }
  });
  console.log(searchResult)
  res.json(searchResult.hits.hits);
})

app.post("/bookRide",async (req,res)=>{
  const ride=req.body;
  const body = {
      mappings: {
          properties: {
              userEmail:{type:'text'},
              userName: { type: 'text' },
              start: { type: 'text' },
              dest: { type: 'text' },
              rideStatus:{type:'text'},
              duration: { type: 'text' }
          }
      }
  };
  if(!await client.indices.exists({index: 'rides'})){
      await client.indices.create({ index: 'rides', body: body })
      console.log("Created new index")
  }
  const addedRide=await client.index({
      index: 'rides',
      document: {
        userEmail:ride.userEmail,
        userName: ride.userName,
        start: ride.start,
        dest: ride.dest,
        rideStatus:"requested",
        duration: ride.duration
      },
    })

  res.json({ message: "Added the ride" ,id:addedRide._id});
})

app.get("/getAllRides",async(req,res)=>{
  const body = {
    mappings: {
        properties: {
            userEmail:{type:'text'},
            userName: { type: 'text' },
            start: { type: 'text' },
            dest: { type: 'text' },
            rideStatus:{type:'text'},
            duration: { type: 'text' }
        }
    }
};
  if(!await client.indices.exists({index: 'rides'})){
      await client.indices.create({ index: 'rides', body: body })
  }
  try {
  const searchResult = await client.search({
      index: 'rides',
      body: {
        query: {
          bool: {
              must: [
                  { match: { rideStatus: "requested" }},
              ]
          }
      }
      }
  });
  res.json(searchResult.hits.hits);
  } catch (error) {
      console.error(`Error getting documents from posts`, error);
  }

});

app.post("/getRideStatus",async(req,res)=>{
  //call get all rides here
  const id=req.body.id;
  const response = await axios.get('http://localhost:8000/getAllRides');
  const ride = response.data.find(ride => ride._id === id);
  
  res.json({ride});
  //now from the response.data only send back the document with this id 
})


app.post("/acceptRide",async(req,res)=>{
  //call get all rides here
  const id=req.body.rideId;
  const response = await axios.get('http://localhost:8000/getAllRides');
  const ride =await response.data.find(ride => ride._id === id);
  const updateResult = await client.update({
    index: 'rides',
    id: id,
    doc:{
      rideStatus: "booked",
    }
    
});
  console.log(updateResult)
  res.json(ride);
  
  //now from the response.data only send back the document with this id 
})



async function fetchStationInformation() {
  const response = await fetch('https://gbfs.divvybikes.com/gbfs/en/station_information.json');
  const stationsInfoJson = await response.json();

  const stationIdMapping = new Map();
  stationsInfoJson.data.stations.forEach((station, index) => {
      stationIdMapping.set(station.station_id, index + 1);
  });

  return stationIdMapping;
}

async function fetchAndSaveDivvyData() {
  const stationsResponse = await fetch('https://gbfs.divvybikes.com/gbfs/en/station_status.json');
  const stationsInfoResponse = await fetch('https://gbfs.divvybikes.com/gbfs/en/station_information.json');

  const stationsJson = await stationsResponse.json();
  const stationsInfoJson = await stationsInfoResponse.json();

  const stationIdMapping = await fetchStationInformation();

  updateStationInfo(stationsInfoJson, stationIdMapping);
  updateStationStatus(stationsJson, stationIdMapping);

  const divvyStationsRealtimeStatus = processStationData(stationsJson, stationsInfoJson);
  return divvyStationsRealtimeStatus;
}

function updateStationInfo(stationInfoJson, stationIdMapping) {
  stationInfoJson.data.stations = stationInfoJson.data.stations.filter(station =>
      stationIdMapping.has(station.station_id)
  );
}

function updateStationStatus(statusJson, stationIdMapping) {
  statusJson.data.stations = statusJson.data.stations.filter(station =>
      stationIdMapping.has(station.station_id)
  );
}

function processStationData(stationsJson, stationsInfoJson) {
  const stations = stationsJson.data.stations;
  const stationsInfo = stationsInfoJson.data.stations;

  const divvyStationsRealtimeStatus = [];
  stations.forEach(station => {
      const matchingInfo = stationsInfo.find(info => info.station_id === station.station_id);
      if (matchingInfo) {
          const row = {
              altitude: 0,
              availableBikes: parseInt(station.num_bikes_available),
              availableDocks: parseInt(station.num_docks_available),
              city: 'Chicago',
              id: station.station_id,
              is_renting: !!station.is_renting,
              kioskType: matchingInfo.has_kiosk,
              landMark: 'Chicago',
              lastCommunicationTime: new Date(parseInt(station.last_reported) * 1000).toISOString(),
              latitude: parseFloat(matchingInfo.lat),
              location: 'Chicago',
              longitude: parseFloat(matchingInfo.lon),
              postalCode: 60602,
              stAddress1: 'Chicago',
              stAddress2: 'Chicago',
              stationName: matchingInfo.name,
              status: 'IN_SERVICE',
              statusKey: 1,
              statusValue: 'IN_SERVICE',
              testStation: false,
              totalDocks: parseInt(matchingInfo.capacity)
          };
          divvyStationsRealtimeStatus.push(row);
      }
  });

  return divvyStationsRealtimeStatus;
}

function saveStationDataToCsv(data, filename) {
  const header = Object.keys(data[0]).join(',');
  const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
  fs.writeFileSync(filename, `${header}\n${rows}`);
}

async function fetchNearestDivvy(lat, long) {
  const divvyStationsRealtimeStatus = await fetchAndSaveDivvyData();

  divvyStationsRealtimeStatus.forEach(station => {
      const stationLat = parseFloat(station.latitude);
      const stationLong = parseFloat(station.longitude);
      const distance = Math.sqrt(Math.pow(lat - stationLat, 2) + Math.pow(long - stationLong, 2));
      station.distance = distance;
  });

  divvyStationsRealtimeStatus.sort((a, b) => a.distance - b.distance);
  const nearestStation = divvyStationsRealtimeStatus[0];
  return {latitude:nearestStation.latitude, longitude: nearestStation.longitude};
};



app.post("/getNearestDivvy", async function(req, res) {
const start=await getLocationCoordinates(req.body.start);
const dest=await getLocationCoordinates(req.body.dest);
const nearestDivvyFromStart = await fetchNearestDivvy(start.latitude, start.longitude)
const nearestDivvyFromDestination = await fetchNearestDivvy(dest.latitude, dest.longitude)
res.json({nearestDivvyFromStart:nearestDivvyFromStart,nearestDivvyFromDestination:nearestDivvyFromDestination})
})