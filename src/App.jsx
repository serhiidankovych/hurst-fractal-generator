import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Box, Button } from "@mui/material";
import "./App.css";

import { alpha, styled } from "@mui/material/styles";

let App = () => {
  const [newXData, setNewXData] = useState([]);

  const [H, setH] = useState(0.5);
  const [N, setN] = useState(700);

  const handleHChange = (e) => {
    setH(e.target.value);
  };
  const handleNChange = (e) => {
    setN(e.target.value);
  };

  function findSmallestM(N) {
    let m = 0;
    while (Math.pow(2, m) + 1 < N) {
      m++;
    }
    return m;
  }

  useEffect(() => {
    let m = findSmallestM(N);

    let midpointDisplacement = (x, indexes, dispersion) => {
      let newIndexes = [];
      for (let j = 0; j < indexes.length - 1; j++) {
        let newIndex = (indexes[j] + indexes[j + 1]) / 2;
        let i1 = Math.round(N * newIndex);
        let i2 = Math.round(N * indexes[j]);
        let i3 = Math.round(N * indexes[j + 1]);

        if (i2 === 0) i2 = 1;

        x[i1] = (x[i2] + x[i3]) / 2;
        x[i1] += (Math.random() * 12 - 6) * dispersion;
        x[i2] += (Math.random() * 12 - 6) * dispersion;
        x[i3] += (Math.random() * 12 - 6) * dispersion;

        newIndexes.push(newIndex);
      }
      return newIndexes;
    };

    let generateFractal = () => {
      let dispersion = 1;
      let dispersionArray = [];
      let indexes = [0, 0.5, 1];
      let x = new Array(N).fill(0);

      for (let i = 1; i <= m; i++) {
        dispersion = 1 * Math.pow(1 / 2, 2 * H * (i - 1));
        dispersionArray.push({ m: i, dispersion });

        let newIndexes = midpointDisplacement(x, indexes, dispersion);
        indexes.push(...newIndexes);
        indexes.sort((a, b) => a - b);
      }

      let newX = indexes.map((index) => x[Math.round(N * index)]);

      let transformedData = newX
        .filter((value) => !isNaN(value))
        .map((value, index) => ({ index, value }));

      setNewXData(transformedData);
      console.log(dispersionArray);
    };

    generateFractal();
  }, [H, N]);

  const CssTextField = styled(TextField)(({ theme }) => ({
    "& .MuiInputLabel-root": {
      color: "white", // Change the color of the label
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "white",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "white",
      },
      "&:hover fieldset": {
        borderColor: "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",
      },
      "& input": {
        color: "white",
      },
    },
  }));
  return (
    <Container
      maxWidth="md"
      sx={{
        backgroundColor: "#141414",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "stretch",
        gap: "20px",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#1b2127",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          borderRadius: "5px",
          gap: "5px",
          color: "white",
        }}
      >
        <Typography variant="h3" color={"white"}>
          Fractal generator by Hurst exponent
        </Typography>
        <LineChart width={800} height={400} data={newXData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="index" domain={[0, 700]} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </Box>

      <Box
        sx={{
          backgroundColor: "#1b2127",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "5px",
          padding: "10px",
        }}
      >
        <Typography variant="h5">Set up</Typography>
        <Box
          sx={{
            backgroundColor: "#1b2127",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "stretch",
            padding: "10px",
            borderRadius: "5px",
            gap: "8px",
            color: "white",
          }}
        >
          <CssTextField
            label="Hurst exponent"
            type="number"
            inputProps={{ step: 0.1, min: 0, max: 1 }}
            value={H}
            onChange={handleHChange}
            sx={{
              width: "200px",
            }}
          />
          {/* <CssTextField
            label="Number of points"
            type="number"
            inputProps={{ step: 100, min: 0, max: 1000 }}
            value={N}
            onChange={handleNChange}
            sx={{
              width: "200px",
            }}
          /> */}
        </Box>
      </Box>
    </Container>
  );
};

export default App;
