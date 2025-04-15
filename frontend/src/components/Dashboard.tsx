import React, { useEffect, useState } from "react";
import { Paper, Typography, Box } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { VehicleEvent, VehicleStats } from "../types/vehicle";
import { api } from "../services/api";

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<VehicleEvent[]>([]);
  const [stats, setStats] = useState<VehicleStats | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData, statsData] = await Promise.all([
          api.getAllEvents(),
          api.getVehicleStats("VEH_001"),
        ]);
        setEvents(eventsData);
        setStats(statsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const chartData = events.map((event) => ({
    time: new Date(event.timestamp).toLocaleTimeString(),
    speed: event.data.speed,
    batteryLevel: event.data.batteryLevel,
    fuelLevel: event.data.fuelLevel,
  }));

  return (
    <Box sx={{ width: "100%" }}>
      {/* Vehicle Status */}
      <Box sx={{ mb: 3 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Vehicle Status
          </Typography>
          {stats && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ flex: "1 1 100%", md: "1 1 25%" }}>
                <Typography variant="subtitle2">Status</Typography>
                <Typography variant="h6">{stats.status}</Typography>
              </Box>
              <Box sx={{ flex: "1 1 100%", md: "1 1 25%" }}>
                <Typography variant="subtitle2">Battery Level</Typography>
                <Typography variant="h6">{stats.batteryLevel}%</Typography>
              </Box>
              <Box sx={{ flex: "1 1 100%", md: "1 1 25%" }}>
                <Typography variant="subtitle2">Fuel Level</Typography>
                <Typography variant="h6">{stats.fuelLevel}%</Typography>
              </Box>
              <Box sx={{ flex: "1 1 100%", md: "1 1 25%" }}>
                <Typography variant="subtitle2">Odometer</Typography>
                <Typography variant="h6">{stats.odometer} km</Typography>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Speed Chart */}
      <Box sx={{ mb: 3, display: "flex", flexWrap: "wrap", gap: 3 }}>
        <Box sx={{ flex: "1 1 100%", md: "1 1 48%" }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Speed Over Time
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="speed"
                    stroke="#8884d8"
                    name="Speed (km/h)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>

        {/* Battery and Fuel Chart */}
        <Box sx={{ flex: "1 1 100%", md: "1 1 48%" }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Battery and Fuel Levels
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="batteryLevel"
                    stroke="#82ca9d"
                    name="Battery (%)"
                  />
                  <Line
                    type="monotone"
                    dataKey="fuelLevel"
                    stroke="#ffc658"
                    name="Fuel (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
