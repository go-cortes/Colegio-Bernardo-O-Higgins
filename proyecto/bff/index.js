const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const SERVICES = {
  USERS: "http://microservice-users:8081",
  ACADEMIC: "http://microservice-academic:8082"
};

// Error handler utility
const handleRequest = async (res, requestFn) => {
  try {
    const data = await requestFn();
    res.status(200).json(data);
  } catch (err) {
    console.error("Error:", err.message);
    const statusCode = err.response?.status || 500;
    res.status(statusCode).json({ error: "Service unavailable", details: err.message });
  }
};

app.get("/students", (req, res) => {
  handleRequest(res, async () => {
    const response = await axios.get(`${SERVICES.USERS}/students`);
    return response.data;
  });
});

app.get("/grades", (req, res) => {
  handleRequest(res, async () => {
    const response = await axios.get(`${SERVICES.ACADEMIC}/grades`);
    return response.data;
  });
});

const path = require("path");

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/dashboard", async (req, res) => {
  try {
    // Parallel requests for better performance
    const [studentsRes, gradesRes] = await Promise.all([
      axios.get(`${SERVICES.USERS}/students`),
      axios.get(`${SERVICES.ACADEMIC}/grades`)
    ]);

    const students = studentsRes.data;
    const grades = gradesRes.data;

    // Combine data
    const dashboardData = students.map(student => {
      const studentGrades = grades.filter(g => g.studentId === student.id);
      return {
        ...student,
        grades: studentGrades,
        average: studentGrades.length > 0 
                 ? studentGrades.reduce((acc, curr) => acc + curr.score, 0) / studentGrades.length 
                 : 0
      };
    });

    res.status(200).json({
      status: "success",
      data: dashboardData
    });
  } catch (err) {
    console.error("Dashboard Error:", err.message);
    res.status(500).json({ error: "Error assembling dashboard", details: err.message });
  }
});

app.listen(3000, () => console.log("BFF running on 3000"));
