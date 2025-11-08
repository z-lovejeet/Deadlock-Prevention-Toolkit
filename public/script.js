function generateMatrix() {
  const p = document.getElementById('processes').value;
  const r = document.getElementById('resources').value;
  const area = document.getElementById('matrix-area');

  if (!p || !r) return alert("Please enter both process and resource numbers!");

  let html = "<h3>Allocation Matrix</h3><table><tr><th>Process</th>";
  for (let i = 0; i < r; i++) html += `<th>R${i}</th>`;
  html += "</tr>";

  for (let i = 0; i < p; i++) {
    html += `<tr><td>P${i}</td>`;
    for (let j = 0; j < r; j++) {
      html += `<td><input id="alloc-${i}-${j}" type="number" min="0" max="9" value="0"></td>`;
    }
    html += "</tr>";
  }
  html += "</table><br>";

  html += "<h3>Max Matrix</h3><table><tr><th>Process</th>";
  for (let i = 0; i < r; i++) html += `<th>R${i}</th>`;
  html += "</tr>";

  for (let i = 0; i < p; i++) {
    html += `<tr><td>P${i}</td>`;
    for (let j = 0; j < r; j++) {
      html += `<td><input id="max-${i}-${j}" type="number" min="0" max="9" value="0"></td>`;
    }
    html += "</tr>";
  }
  html += "</table><br>";

  html += `<h3>Available Resources</h3>`;
  for (let j = 0; j < r; j++) {
    html += `<input id="avail-${j}" type="number" min="0" max="9" value="0">`;
  }

  area.innerHTML = html;
}

// -------------------------------
// Run Detection and Draw RAG
// -------------------------------
function runDetection() {
  const p = parseInt(document.getElementById('processes').value);
  const r = parseInt(document.getElementById('resources').value);

  const alloc = [], max = [], avail = [];
  for (let i = 0; i < p; i++) {
    alloc[i] = [];
    max[i] = [];
    for (let j = 0; j < r; j++) {
      alloc[i][j] = parseInt(document.getElementById(`alloc-${i}-${j}`).value);
      max[i][j] = parseInt(document.getElementById(`max-${i}-${j}`).value);
    }
  }

  for (let j = 0; j < r; j++)
    avail[j] = parseInt(document.getElementById(`avail-${j}`).value);

  fetch('/detect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ alloc, max, avail, p, r })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById('output').innerText = data.result;
      drawRAG(p, r, alloc, data.result, data.need);
    })
    .catch(err => console.error(err));
}

// -------------------------------
// Draw Resource Allocation Graph
// -------------------------------
function drawRAG(p, r, alloc, resultText, need = null) {
  const canvas = document.getElementById('ragCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 420;

  const procSpacing = width / (p + 1);
  const resSpacing = width / (r + 1);
  const procY = height - 100;
  const resY = 100;

  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  // Draw resources (top)
  for (let j = 0; j < r; j++) {
    const x = (j + 1) * resSpacing;
    ctx.beginPath();
    ctx.arc(x, resY, 25, 0, 2 * Math.PI);
    ctx.fillStyle = "#00ff99"; // Green
    ctx.fill();
    ctx.strokeStyle = "#0b2535";
    ctx.stroke();
    ctx.fillStyle = "#001d3d";
    ctx.font = "bold 14px Poppins";
    ctx.fillText(`R${j}`, x - 10, resY + 5);
  }

  // Draw processes (bottom)
  for (let i = 0; i < p; i++) {
    const x = (i + 1) * procSpacing;
    ctx.beginPath();
    ctx.arc(x, procY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = "#48cae4"; // Blue
    ctx.fill();
    ctx.strokeStyle = "#0b2535";
    ctx.stroke();
    ctx.fillStyle = "#001d3d";
    ctx.font = "bold 14px Poppins";
    ctx.fillText(`P${i}`, x - 12, procY + 5);
  }

  // Allocation edges (R → P)
  for (let i = 0; i < p; i++) {
    for (let j = 0; j < r; j++) {
      if (alloc[i][j] > 0) {
        const fromX = (j + 1) * resSpacing;
        const fromY = resY + 25;
        const toX = (i + 1) * procSpacing;
        const toY = procY - 30;
        drawArrow(ctx, fromX, fromY, toX, toY, "#00ff99"); // Green for allocated
      }
    }
  }

  // Request edges (P → R)
  if (need) {
    for (let i = 0; i < p; i++) {
      for (let j = 0; j < r; j++) {
        if (need[i][j] > 0) {
          const fromX = (i + 1) * procSpacing;
          const fromY = procY - 25;
          const toX = (j + 1) * resSpacing;
          const toY = resY + 25;
          drawArrow(ctx, fromX, fromY, toX, toY, "#ffb703"); // Orange for requests
        }
      }
    }
  }

  // Legend
  ctx.font = "14px Poppins";
  ctx.fillStyle = "#ddd";
  ctx.fillText("Legend:", 40, 400);
  ctx.fillStyle = "#00ff99";
  ctx.fillRect(120, 390, 20, 10);
  ctx.fillStyle = "#ddd";
  ctx.fillText("Allocated (R → P)", 150, 400);
  ctx.fillStyle = "#ffb703";
  ctx.fillRect(320, 390, 20, 10);
  ctx.fillStyle = "#ddd";
  ctx.fillText("Request (P → R)", 350, 400);

  // Animate Safe Sequence
  const match = resultText.match(/Safe Sequence: (.+)/);
  if (match) {
    const sequence = match[1].split("->").map(s => s.trim());
    let index = 0;
    const interval = setInterval(() => {
      if (index >= sequence.length) {
        clearInterval(interval);
        return;
      }
      const pid = parseInt(sequence[index].replace("P", ""));
      const x = (pid + 1) * procSpacing;
      const y = procY;
      ctx.beginPath();
      ctx.arc(x, y, 35, 0, 2 * Math.PI);
      ctx.strokeStyle = "#00FFB0";
      ctx.lineWidth = 4;
      ctx.stroke();
      index++;
    }, 800);
  }
}

// -------------------------------
// Arrow Drawing Utility
// -------------------------------
function drawArrow(ctx, fromX, fromY, toX, toY, color) {
  const headlen = 10;
  const dx = toX - fromX;
  const dy = toY - fromY;
  const angle = Math.atan2(dy, dx);

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Arrowhead
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
  ctx.lineTo(toX, toY);
  ctx.fillStyle = color;
  ctx.fill();
}
