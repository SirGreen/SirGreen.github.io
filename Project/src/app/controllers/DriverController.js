const driver = require("../models/Driver");
const journey = require("../models/Journey");
const car = require("../models/Car");
const truck = require("../models/Truck");
const coach = require("../models/Coach");
const admin = require("../controllers/AdminController");
const { json } = require("express");

class DriverController {
  index(req, res) {
    res.send("Driver Page");
  }

  //GET information
  async DisplayInfo(req, res) {
    try {
      const drivers = await driver.find({});
      res.json(drivers);
      console.log(drivers);
    } catch (error) {
      res.status(500).json({ err: "ERROR" });
    }
  }

  async CompleteJourney(req, res) {
    try {
      var d = null;
      var j = null;
      var t = null;
      d = await driver.findOne({ _id: req.params.id });
      if (d == null) {
        res.send("invalid driver");
        return;
      }
      j = await journey.findOne({ _id: d.JourneyIncharge._id });
      if (j == null) {
        res.send("invalid journey");
        return;
      }
      switch (j.TransportationType) {
        case "truck":
          // Truck
          t = await truck.findOne({ _id: j.Transportation._id });
          break;
        case "coach":
          // Coach
          t = await coach.findOne({ _id: j.Transportation._id });
          break;
        default:
          // Car
          t = await car.findOne({ _id: j.Transportation._id });
          break;
      }
      if (t == null) {
        res.send("invalid transportation");
        return;
      }
      //res.json(t);
      if (j.Status == 1) {
        await d.JourneyList.push(j);
        d.JourneyIncharge = null;
        j.Status = 2;
        t.VehicleStatus = "NotActive";
        t.Journey = null;
        await admin.FindJourneyForDriver(d);
        // var warranty = await admin.CheckForWarranty(t);
        // if (warranty == 1) {
        await admin.FindJourneyForTransportation(t, j.TransportationType);
        // } else {
        //   console.log("Transportation go warranty");
        // }
        await j.save();
        await d.save();
        await t.save();
        res.send(
          "successfully complete journey! Check if you have next journey!"
        );
      } else {
        res.send("cannot complete journey");
      }
    } catch (error) {
      res.status(500).json({ err: "ERROR" });
    }
  }
}

module.exports = new DriverController();
