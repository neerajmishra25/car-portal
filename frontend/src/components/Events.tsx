import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  TextField,
  MenuItem,
} from "@mui/material";
import { VehicleEvent } from "../types/vehicle";
import { api } from "../services/api";

const Events: React.FC = () => {
  const [events, setEvents] = useState<VehicleEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<VehicleEvent[]>([]);
  const [eventType, setEventType] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.getAllEvents();
        setEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = [...events];

    if (eventType) {
      filtered = filtered.filter((event) => event.eventType === eventType);
    }

    if (startDate) {
      filtered = filtered.filter(
        (event) => new Date(event.timestamp) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (event) => new Date(event.timestamp) <= new Date(endDate)
      );
    }

    setFilteredEvents(filtered);
  }, [events, eventType, startDate, endDate]);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" gutterBottom>
        Vehicle Events
      </Typography>

      {/* Filters */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <Box sx={{ flex: "1 1 100%", md: "1 1 33%" }}>
          <TextField
            select
            fullWidth
            label="Event Type"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            <MenuItem value="">All Events</MenuItem>
            <MenuItem value="IGNITION_ON">Ignition On</MenuItem>
            <MenuItem value="IGNITION_OFF">Ignition Off</MenuItem>
            <MenuItem value="TIME_INTERVAL">Time Interval</MenuItem>
          </TextField>
        </Box>
        <Box sx={{ flex: "1 1 100%", md: "1 1 33%" }}>
          <TextField
            type="datetime-local"
            fullWidth
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <Box sx={{ flex: "1 1 100%", md: "1 1 33%" }}>
          <TextField
            type="datetime-local"
            fullWidth
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </Box>

      {/* Events Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Event Type</TableCell>
              <TableCell>Speed (km/h)</TableCell>
              <TableCell>Battery Level (%)</TableCell>
              <TableCell>Fuel Level (%)</TableCell>
              <TableCell>Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  {new Date(event.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>{event.eventType.replace("_", " ")}</TableCell>
                <TableCell>{event.data.speed}</TableCell>
                <TableCell>{event.data.batteryLevel}</TableCell>
                <TableCell>{event.data.fuelLevel}</TableCell>
                <TableCell>
                  {event.location.latitude.toFixed(4)},{" "}
                  {event.location.longitude.toFixed(4)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Events;
