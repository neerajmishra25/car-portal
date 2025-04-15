const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Read vehicle data from JSON file
const getVehicleData = async () => {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "vehicleData.json"),
      "utf8"
    );
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading vehicle data:", error);
    return { events: [] };
  }
};

// API Endpoints

// Get all events
app.get("/api/events", async (req, res) => {
  try {
    const data = await getVehicleData();
    res.json(data.events);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get events by type
app.get("/api/events/type/:eventType", async (req, res) => {
  try {
    const { eventType } = req.params;
    const data = await getVehicleData();
    const filteredEvents = data.events.filter(
      (event) => event.eventType === eventType.toUpperCase()
    );
    res.json(filteredEvents);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get events by timeframe
app.get("/api/events/timeframe", async (req, res) => {
  try {
    const { start, end } = req.query;
    const data = await getVehicleData();
    const filteredEvents = data.events.filter((event) => {
      const eventTime = new Date(event.timestamp);
      return (
        (!start || eventTime >= new Date(start)) &&
        (!end || eventTime <= new Date(end))
      );
    });
    res.json(filteredEvents);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get vehicle statistics
app.get("/api/vehicle/:vehicleId/stats", async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const data = await getVehicleData();
    const vehicleEvents = data.events.filter(
      (event) => event.vehicleId === vehicleId
    );

    if (vehicleEvents.length === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    const latestEvent = vehicleEvents[vehicleEvents.length - 1];
    const stats = {
      lastUpdate: latestEvent.timestamp,
      currentLocation: latestEvent.location,
      batteryLevel: latestEvent.data.batteryLevel,
      fuelLevel: latestEvent.data.fuelLevel,
      odometer: latestEvent.data.odometer,
      status: latestEvent.eventType === "IGNITION_ON" ? "Active" : "Inactive",
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
