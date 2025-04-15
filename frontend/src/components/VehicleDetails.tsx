import React, { useEffect, useState } from "react";
import { Paper, Typography, Box, Divider } from "@mui/material";
import { VehicleEvent, VehicleStats } from "../types/vehicle";
import { api } from "../services/api";

const VehicleDetails: React.FC = () => {
  const [stats, setStats] = useState<VehicleStats | null>(null);
  const [events, setEvents] = useState<VehicleEvent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, eventsData] = await Promise.all([
          api.getVehicleStats("VEH_001"),
          api.getAllEvents(),
        ]);
        setStats(statsData);
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
      }
    };

    fetchData();
  }, []);

  const latestEvent = events.length > 0 ? events[events.length - 1] : null;

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" gutterBottom>
        Vehicle Details
      </Typography>

      {stats && latestEvent && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {/* Vehicle Status */}
          <Box
            sx={{ flex: "1 1 100%", display: "flex", flexDirection: "column" }}
          >
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Current Status
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ flex: "1 1 50%" }}>
                  <Typography variant="subtitle2">Status</Typography>
                  <Typography variant="h6">{stats.status}</Typography>
                </Box>
                <Box sx={{ flex: "1 1 50%" }}>
                  <Typography variant="subtitle2">Last Update</Typography>
                  <Typography variant="h6">
                    {new Date(stats.lastUpdate).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ flex: "1 1 50%" }}>
                  <Typography variant="subtitle2">Battery Level</Typography>
                  <Typography variant="h6">{stats.batteryLevel}%</Typography>
                </Box>
                <Box sx={{ flex: "1 1 50%" }}>
                  <Typography variant="subtitle2">Fuel Level</Typography>
                  <Typography variant="h6">{stats.fuelLevel}%</Typography>
                </Box>
              </Box>
            </Paper>
          </Box>

          {/* Location */}
          <Box sx={{ flex: "1 1 50%" }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Current Location
              </Typography>
              <Typography variant="body1">
                Latitude: {stats.currentLocation.latitude.toFixed(6)}
              </Typography>
              <Typography variant="body1">
                Longitude: {stats.currentLocation.longitude.toFixed(6)}
              </Typography>
              <Box
                sx={{
                  mt: 2,
                  height: 200,
                  bgcolor: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Map would be displayed here
                </Typography>
              </Box>
            </Paper>
          </Box>

          {/* Vehicle Health */}
          <Box sx={{ flex: "1 1 50%" }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Vehicle Health
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ flex: "1 1 50%" }}>
                  <Typography variant="subtitle2">Odometer</Typography>
                  <Typography variant="h6">{stats.odometer} km</Typography>
                </Box>
                <Box sx={{ flex: "1 1 50%" }}>
                  <Typography variant="subtitle2">
                    Engine Temperature
                  </Typography>
                  <Typography variant="h6">
                    {latestEvent.data.engineTemp}°C
                  </Typography>
                </Box>
                <Box sx={{ flex: "1 1 100%" }}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Tire Pressure (PSI)
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    <Box sx={{ flex: "1 1 50%" }}>
                      <Typography variant="body2">
                        Front Left: {latestEvent.data.tirePressure.frontLeft}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: "1 1 50%" }}>
                      <Typography variant="body2">
                        Front Right: {latestEvent.data.tirePressure.frontRight}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: "1 1 50%" }}>
                      <Typography variant="body2">
                        Rear Left: {latestEvent.data.tirePressure.rearLeft}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: "1 1 50%" }}>
                      <Typography variant="body2">
                        Rear Right: {latestEvent.data.tirePressure.rearRight}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default VehicleDetails;
