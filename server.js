<<<<<<< Updated upstream
=======
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/detect", (req, res) => {
  const { alloc, max, avail, p, r } = req.body;

  // Format input for C++
  let input = `${p} ${r}\n`;
  alloc.forEach(row => (input += row.join(" ") + "\n"));
  max.forEach(row => (input += row.join(" ") + "\n"));
  input += avail.join(" ") + "\n";

  const exePath = path.join(__dirname, "algorithms", "banker");
  const process = spawn(exePath);

  let output = "";
  process.stdin.write(input);
  process.stdin.end();

  process.stdout.on("data", data => {
    output += data.toString();
  });

  process.stderr.on("data", data => {
    console.error("Error:", data.toString());
  });

  process.on("close", () => {
    if (output.includes("System is not in a Safe State.")) {
      output += "\n\nSuggestion:\n1. Release resources from low-priority processes.\n2. Increase available resources.\n3. Terminate a process.";
    }
    res.json({ result: output.trim() });
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
>>>>>>> Stashed changes
