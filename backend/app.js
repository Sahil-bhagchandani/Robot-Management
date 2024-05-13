const express = require("express");
const cors = require('cors')
const moment = require('moment-timezone');
require("./db/config");
const User = require("./db/user");
const Robot = require("./db/robot");
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("app is working");
});

app.post("/signup", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  res.send(result);
});

app.post("/login", async (req, res) => {
  req.body.name = req.body.username
  req.body.password = req.body.pass
  delete req.body.pass
  delete req.body.username
  if (req.body.name && req.body.password) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.send("result : no user found ");
    }
  }else
  {
    res.send("result : no user found ");
  }
});
app.get("/robotic-data",async(req,res)=>{
    let latestRobot = await Robot.find().sort({_id:-1}).limit(1);
    latestRobot1 = latestRobot[0];
    const formattedData = {
      time: latestRobot1.time,
      batteryLevel: latestRobot1.batteryLevel,
      status: latestRobot1.status,
      formattedActivityLog: latestRobot1.activityLog.replace(/\n/g,"")
    };
    res.send(formattedData)
});

app.get("/historical-data", async (req,res)=>{
    try{
        const {startTime, endTime, batteryLevel, status} = req.query;
        let conditions = {};

        if(startTime && endTime)
        {
            const dateIST = moment().tz('Asia/Kolkata');
            const SdateTimeIST = dateIST.format(`YYYY-MM-DDT${startTime}:00:00.000Z`);
            const EdateTimeIST = dateIST.format(`YYYY-MM-DDT${endTime}:00:00.000Z`);
            const startTimeUTC = moment(SdateTimeIST).utc().toDate();
            const endTimeUTC = moment(EdateTimeIST).utc().toDate();
            conditions.time = { $gte: startTimeUTC, $lte: endTimeUTC };

        }
        if(batteryLevel)
        {
            switch (batteryLevel) {
                case 'low':
                  conditions.batteryLevel = { $lt: 40 };
                  break;
              case 'medium':
                  conditions.batteryLevel = { $gte: 40, $lte: 70 };
                  break;
                case 'high':
                  conditions.batteryLevel = { $gt: 70 };
                  break;
                case 'idle':
                  conditions.status = batteryLevel;
                  break;
                case 'active':
                  conditions.status = batteryLevel;
                  break;
                default:
                  break;
              }
        }
        const historicalData = await Robot.find(conditions);
        const formattedData = historicalData.map(data => ({
          time: moment(data.time).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
          batteryLevel: data.batteryLevel,
          status: data.status,
          activityLog: data.activityLog.replace(/\n/g, '')
      }));
      res.send(formattedData);
     }catch(error)
     {
         console.error("Error fetching historical data: ", error);
         res.status(500).json({error: "Internal Server Error"});
      }
});
app.listen(5000);



