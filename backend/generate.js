const mongoose = require("mongoose");
const moment = require("moment");
const axios = require("axios");
const Robot = require("./db/robot");

require("./db/config");

const activityLogsByStatus = [
  {
    status: "active",
    logs: [
      "Task Started: Robot started cleaning operation in room 101",
      "Task Completed: Robot completed maintenance task in room 102",
      "Task Started: Robot initiated inspection in room 103",
      "Alert: Robot detected anomaly during operation in room 104",
      "Task Completed: Robot finished cleaning operation in room 105",
      "Alert: Low battery warning",
      "Task Started: Robot began scheduled maintenance in room 106",
      "Task Completed: Robot completed scheduled maintenance in room 107",
    ],
  },
  {
    status: "idle",
    logs: [
      "Alert: Robot awaiting further instructions",
      "Alert: Sensor calibration in progress",
      "Task Started: Robot preparing for next task",
      "Task Completed: Robot finished scheduled downtime",
      "Alert: System update in progress",
      "Alert: Environmental conditions outside operating parameters",
    ],
  },
];
let newRobot;
const simulateRobotBehavior = async () => {
  const initialBatteryLevel = 100; // Initial battery level (fully charged)
  const cycleDuration = 50000; // Duration of each simulation cycle in milliseconds (1 minute)
  const chargingThreshold = 20; // Battery level at which the robot starts charging
  const chargingRate = 20; // Rate at which the battery charges per cycle

  let batteryLevel = initialBatteryLevel;
  let status = "active"; // Initial status

  while (true) {
    let activityLog = "";
    if (batteryLevel <= chargingThreshold) {
      status = "charging";
      activityLog = "Alert: Low battery, initiating charging.\n";
    }

    // If charging, increase battery level
    if (status === "charging") {
      batteryLevel += chargingRate;
      if (batteryLevel >= 100) {
        batteryLevel = 100;
        status = "active";
        activityLog +=
          "Charging Completed: Robot battery charged successfully.\n";
      } else {
        activityLog = "Charging in progress.\n";
      }
    }
    if (status == "active" || status == "idle") {
      // Perform only one task per cycle if not charging
      const taskPerformed = Math.random() < 0.5; // 50% chance of performing a task
      status = "active";
      // Generate activity log for the cycle
      
      if (taskPerformed > 0 && status == "active") {
        // Select a random activity log based on the current status
        const logsForStatus = activityLogsByStatus.find(
          (entry) => entry.status === status
        );
        const randomLog =
          logsForStatus.logs[
            Math.floor(Math.random() * logsForStatus.logs.length)
          ];
        activityLog += randomLog + "\n";

        // Decrease battery level after performing the task
        batteryLevel -= 10;
      }

      if (taskPerformed == 0 && status == "active") {
        status = "idle";
        const logsForStatus = activityLogsByStatus.find(
          (entry) => entry.status === status
        );
        const randomLog =
          logsForStatus.logs[
            Math.floor(Math.random() * logsForStatus.logs.length)
          ];
        activityLog += randomLog + "\n";
      }
    }

    // Create a new robot document with current data and activity log
    newRobot = new Robot({
      batteryLevel,
      status,
      activityLog,
      time: new Date(), 
    });
    await newRobot.save();
    console.log("Robotic data saved to MongoDB successfully");

    // Wait for the next cycle
    await new Promise((resolve) => setTimeout(resolve, cycleDuration));
  }
};

// Start simulating robot behavior
simulateRobotBehavior().catch((error) => {
  console.error("Error in simulation:", error);
});
