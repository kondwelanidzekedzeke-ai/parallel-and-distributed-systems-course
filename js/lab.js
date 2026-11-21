/*
 * ============================================================================
 * INTERACTIVE LEARNING LAB — Simulators and visualisations
 * ============================================================================
 */

const Lab = (() => {
  /* ---------- Helpers ---------- */
  const $ = (id) => document.getElementById(id);

  const clear = (node) => { node.innerHTML = ""; };

  const rect = (x, y, w, h, opts = {}) => {
    const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    r.setAttribute("x", x); r.setAttribute("y", y);
    r.setAttribute("width", w); r.setAttribute("height", h);
    r.setAttribute("fill", opts.fill || "#fff");
    r.setAttribute("stroke", opts.stroke || "#b9d4c6");
    r.setAttribute("stroke-width", opts.strokeWidth || "2");
    r.setAttribute("rx", opts.rx || "6"); r.setAttribute("ry", opts.ry || "6");
    return r;
  };

  const circ = (cx, cy, r, opts = {}) => {
    const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("cx", cx); c.setAttribute("cy", cy); c.setAttribute("r", r);
    c.setAttribute("fill", opts.fill || "#fff");
    c.setAttribute("stroke", opts.stroke || "#b9d4c6");
    c.setAttribute("stroke-width", opts.strokeWidth || "2");
    return c;
  };

  const line = (x1, y1, x2, y2, opts = {}) => {
    const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
    l.setAttribute("x1", x1); l.setAttribute("y1", y1);
    l.setAttribute("x2", x2); l.setAttribute("y2", y2);
    l.setAttribute("stroke", opts.stroke || "#5c7568");
    l.setAttribute("stroke-width", opts.strokeWidth || "2");
    if (opts.dash) l.setAttribute("stroke-dasharray", opts.dash);
    if (opts.markerEnd) l.setAttribute("marker-end", opts.markerEnd);
    return l;
  };

  const text = (x, y, content, opts = {}) => {
    const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
    t.setAttribute("x", x); t.setAttribute("y", y);
    t.setAttribute("fill", opts.fill || "#10251c");
    t.setAttribute("font-size", opts.size || "12");
    t.setAttribute("font-family", "var(--font-sans)");
    t.setAttribute("text-anchor", opts.anchor || "middle");
    t.setAttribute("font-weight", opts.weight || "600");
    t.textContent = content;
    return t;
  };

  /* ---------- 1. Sequential vs Parallel visualiser ---------- */
  let spTimer = null;
  function renderSeqPar() {
    const p = parseInt($("sp-p").value, 10);
    const t = parseInt($("sp-t").value, 10);
    const timePer = parseInt($("sp-time").value, 10);

    $("sp-p-val").textContent = p;
    $("sp-t-val").textContent = t;
    $("sp-time-val").textContent = timePer;

    const seqTime = t * timePer;
    const parTime = Math.ceil(t / p) * timePer;
    const speedup = parTime === 0 ? 0 : (seqTime / parTime).toFixed(2);

    $("sp-seq").textContent = seqTime;
    $("sp-par").textContent = parTime;
    $("sp-up").textContent = speedup;

    const svg = $("sp-visual");
    clear(svg);
    const w = svg.clientWidth || 560;
    const h = svg.clientHeight || 260;

    const svgNS = "http://www.w3.org/2000/svg";
    const canvas = document.createElementNS(svgNS, "svg");
    canvas.setAttribute("width", w); canvas.setAttribute("height", h);
    canvas.style.width = "100%"; canvas.style.height = "100%";
    canvas.style.display = "block";

    const rowH = (h - 60) / 2;
    // sequential row
    canvas.appendChild(text(w * 0.5, 30, "Sequential — one worker", { size: 14, fill: "#a63a37", weight: "700" }));
    let cx = 60;
    const taskW = Math.min(40, (w - 120) / Math.max(t, 1));
    for (let i = 0; i < t; i++) {
      canvas.appendChild(rect(cx, rowH * 0.45, taskW, rowH * 0.5, { fill: "#f6faf7", stroke: "#a63a37" }));
      canvas.appendChild(text(cx + taskW / 2, rowH * 0.45 + rowH * 0.28, `T${i + 1}`, { size: 9, fill: "#a63a37" }));
      cx += taskW + 6;
    }
    // parallel rows
    canvas.appendChild(text(w * 0.5, rowH + 40, `Parallel — ${p} workers`, { size: 14, fill: "#145f43", weight: "700" }));
    const rows = p;
    const prowH = (h - rowH - 80) / rows;
    for (let r = 0; r < rows; r++) {
      const start = r * Math.ceil(t / p);
      const end = Math.min(start + Math.ceil(t / p), t);
      const baseY = rowH + 60 + r * prowH + 10;
      let px = 60;
      for (let i = start; i < end; i++) {
        canvas.appendChild(rect(px, baseY, taskW, prowH * 0.6, { fill: "#eaf6f0", stroke: "#145f43" }));
        canvas.appendChild(text(px + taskW / 2, baseY + prowH * 0.34, `T${i + 1}`, { size: 9, fill: "#145f43" }));
        px += taskW + 6;
      }
    }
    svg.appendChild(canvas);
  }

  function startSeqPar() {
    renderSeqPar();
    ["sp-p", "sp-t", "sp-time"].forEach((id) => {
      $(id).addEventListener("input", renderSeqPar);
    });
  }

  /* ---------- 2. Amdahl's Law ---------- */
  let amdahlChartTimer = null;
  function renderAmdahl() {
    const P = parseInt($("amdahl-p").value, 10) / 100;
    const n = parseInt($("amdahl-n").value, 10);
    $("amdahl-p-val").textContent = (P * 100).toFixed(0) + "%";
    $("amdahl-n-val").textContent = n;

    const svg = $("amdahl-visual");
    clear(svg);
    const w = svg.clientWidth || 560;
    const h = svg.clientHeight || 260;
    const svgNS = "http://www.w3.org/2000/svg";
    const canvas = document.createElementNS(svgNS, "svg");
    canvas.setAttribute("width", w); canvas.setAttribute("height", h);
    canvas.style.width = "100%"; canvas.style.height = "100%";

    const pad = 40;
    const plotW = w - pad * 2;
    const plotH = h - pad * 2 - 24;
    const maxP = Math.max(n, 8);

    // axis
    canvas.appendChild(line(pad, h - pad - 12, pad, pad, { stroke: "#93b8a6" }));
    canvas.appendChild(line(pad, h - pad - 12, w - pad, h - pad - 12, { stroke: "#93b8a6" }));
    canvas.appendChild(text(w / 2, h - 6, "Processors (p)", { size: 11, fill: "#5c7568" }));
    canvas.appendChild(text(12, pad - 4, "Speedup", { size: 11, fill: "#5c7568", anchor: "start" }));

    const asymptote = 1 / (1 - P);
    const points = [];
    for (let p = 1; p <= maxP; p++) {
      points.push({ x: p, y: 1 / ((1 - P) + P / p) });
    }
    const maxY = Math.max(asymptote * 1.1, points[points.length - 1].y);

    // asymptote line
    const ax = pad + (maxP / maxP) * plotW;
    canvas.appendChild(line(ax, pad, ax, h - pad - 12, { stroke: "#a63a37", strokeWidth: 1, dash: "4,2" }));
    canvas.appendChild(text(ax + 4, pad + 10, `Limit: ${asymptote.toFixed(2)}×`, { size: 10, fill: "#a63a37", anchor: "start" }));

    // curve
    let path = "";
    points.forEach((pt, i) => {
      const x = pad + (pt.x / maxP) * plotW;
      const y = h - pad - 12 - (pt.y / maxY) * plotH;
      path += (i === 0 ? "M" : "L") + x + "," + y + " ";
    });
    const pth = document.createElementNS(svgNS, "path");
    pth.setAttribute("d", path.trim());
    pth.setAttribute("fill", "none");
    pth.setAttribute("stroke", "#1b7f5a");
    pth.setAttribute("stroke-width", "3");
    canvas.appendChild(pth);

    // current point marker
    const cur = 1 / ((1 - P) + P / n);
    const cx = pad + (n / maxP) * plotW;
    const cy = h - pad - 12 - (cur / maxY) * plotH;
    canvas.appendChild(circ(cx, cy, 5, { fill: "#1b7f5a" }));
    canvas.appendChild(text(cx, cy - 10, `S(${n}) = ${cur.toFixed(2)}×`, { size: 11, fill: "#1b7f5a" }));

    svg.appendChild(canvas);
  }

  function startAmdahl() {
    renderAmdahl();
    $("amdahl-p").addEventListener("input", renderAmdahl);
    $("amdahl-n").addEventListener("input", renderAmdahl);
  }

  /* ---------- 3. Flynn's Taxonomy ---------- */
  const flynnData = {
    sisd: {
      title: "SISD — Single Instruction, Single Data",
      desc: "One processor, one instruction stream, one data stream. The classic sequential von Neumann computer. Example: a simple microcontroller or early single-core PC.",
      flow: [
        { label: "Control Unit", fill: "#f6faf7" },
        { label: "ALU", fill: "#f6faf7" },
        { label: "Memory", fill: "#f6faf7" },
      ],
      arrows: ["instr", "data"],
    },
    simd: {
      title: "SIMD — Single Instruction, Multiple Data",
      desc: "One instruction broadcast to many processing elements; each operates on its own data. Example: GPU pixel shaders, CPU SIMD (AVX/SSE).",
      flow: [
        { label: "Instruction\nBroadcast", fill: "#eaf6f0" },
        { label: "PE 1", fill: "#b9d4c6" },
        { label: "PE 2", fill: "#b9d4c6" },
        { label: "PE 3", fill: "#b9d4c6" },
        { label: "PE n", fill: "#b9d4c6" },
      ],
      arrows: ["one→many"],
    },
    misd: {
      title: "MISD — Multiple Instruction, Single Data",
      desc: "Multiple instruction streams operate on the same data stream. Rare; used in fault-tolerant redundancy checking.",
      flow: [
        { label: "Data", fill: "#fbf5df" },
        { label: "Processor A", fill: "#e8c45a" },
        { label: "Processor B", fill: "#e8c45a" },
        { label: "Voter / Compare", fill: "#e8c45a" },
      ],
      arrows: ["many instr, one data"],
    },
    mimd: {
      title: "MIMD — Multiple Instruction, Multiple Data",
      desc: "Multiple independent processors, each with its own instruction and data stream. Most common today: multicore CPUs, clusters, cloud servers.",
      flow: [
        { label: "Core 1", fill: "#eaf6f0" },
        { label: "Core 2", fill: "#eaf6f0" },
        { label: "Core 3", fill: "#eaf6f0" },
        { label: "Core n", fill: "#eaf6f0" },
      ],
      arrows: ["independent"],
    },
  };

  function setFlynn(cls) {
    const d = flynnData[cls];
    $("flynn-desc").textContent = d.desc;
    // activate buttons
    ["sisd", "simd", "misd", "mimd"].forEach((c) => {
      const b = $("flynn-" + c);
      if (c === cls) {
        b.classList.remove("btn-outline");
        b.classList.add("btn-primary");
      } else {
        b.classList.remove("btn-primary");
        b.classList.add("btn-outline");
      }
    });

    const svg = $("flynn-visual");
    clear(svg);
    const w = svg.clientWidth || 560;
    const h = svg.clientHeight || 260;
    const svgNS = "http://www.w3.org/2000/svg";
    const canvas = document.createElementNS(svgNS, "svg");
    canvas.setAttribute("width", w); canvas.setAttribute("height", h);
    canvas.style.width = "100%"; canvas.style.height = "100%";
    canvas.style.display = "block";

    canvas.appendChild(text(w / 2, 26, d.title, { size: 14, weight: "800" }));

    const flow = d.flow;
    const n = flow.length;
    const gap = (w - 120) / Math.max(n - 1, 1);
    const cy = h / 2;

    // draw arrows between
    for (let i = 0; i < n - 1; i++) {
      canvas.appendChild(line(60 + i * gap + 44, cy, 60 + (i + 1) * gap - 44, cy, { stroke: "#93b8a6", strokeWidth: 2, markerEnd: "url(#arrow)" }));
    }
    // marker
    const defs = document.createElementNS(svgNS, "defs");
    const marker = document.createElementNS(svgNS, "marker");
    marker.setAttribute("id", "arrow"); marker.setAttribute("markerWidth", "10"); marker.setAttribute("markerHeight", "10");
    marker.setAttribute("refX", "9"); marker.setAttribute("refY", "5");
    marker.setAttribute("orient", "auto");
    const mpoly = document.createElementNS(svgNS, "polygon");
    mpoly.setAttribute("points", "0,0 10,5 0,10");
    mpoly.setAttribute("fill", "#93b8a6");
    marker.appendChild(mpoly);
    defs.appendChild(marker);
    canvas.insertBefore(defs, canvas.firstChild);

    flow.forEach((f, i) => {
      const x = 60 + i * gap;
      canvas.appendChild(rect(x - 44, cy - 24, 88, 48, { fill: f.fill, stroke: "#294438" }));
      const lines = f.label.split("\n");
      lines.forEach((ln, j) => {
        canvas.appendChild(text(x, cy - 10 + j * 14, ln, { size: 10, fill: "#294438" }));
      });
    });

    svg.appendChild(canvas);
  }

  /* ---------- 4. Client-Server ---------- */
  const csData = {
    client: {
      role: "Client",
      details: [
        "Initiates requests (e.g., HTTP GET/POST).",
        "Presents the user interface (browser / app).",
        "Waits for and displays the server's response.",
        "Typically a thin client in web architectures.",
      ],
      comm: "Sends requests over the network to the application server; receives responses.",
    },
    appserver: {
      role: "Application Server",
      details: [
        "Runs business logic and application code.",
        "Receives client requests, processes them.",
        "May query the database server for data.",
        "Returns responses (HTML/JSON) to the client.",
      ],
      comm: "Talks to the client (requests) and the database server (queries).",
    },
    dbserver: {
      role: "Database Server",
      details: [
        "Stores persistent data.",
        "Executes queries (SQL/NoSQL) from the application server.",
        "Returns query results.",
        "Ensures data durability and consistency.",
      ],
      comm: "Receives queries from and sends results to the application server only.",
    },
    network: {
      role: "Network",
      details: [
        "Carries requests and responses between components.",
        "Uses protocols such as TCP/IP, HTTP, HTTPS.",
        "Introduces latency and possible packet loss.",
        "May include load balancers and firewalls.",
      ],
      comm: "The medium for all client-server and server-server communication.",
    },
  };

  function selectCS(comp) {
    const d = csData[comp];
    $("cs-role").innerHTML = `<div style="font-size:0.85rem;color:var(--color-text-2);"><strong>${d.role}</strong><br>${d.comm}</div><ul style="margin-top:0.5rem;font-size:0.8rem;color:var(--color-text-2);padding-left:1.1rem;">${d.details.map((x) => `<li>${x}</li>`).join("")}</ul>`;
    ["client", "appserver", "dbserver", "network"].forEach((c) => {
      const b = $("cs-" + c);
      if (c === comp) { b.classList.remove("btn-outline"); b.classList.add("btn-secondary"); }
      else { b.classList.remove("btn-secondary"); b.classList.add("btn-outline"); }
    });
    drawCS(comp);
  }

  function drawCS(highlight) {
    const svg = $("cs-visual");
    clear(svg);
    const w = svg.clientWidth || 560;
    const h = svg.clientHeight || 300;
    const svgNS = "http://www.w3.org/2000/svg";
    const canvas = document.createElementNS(svgNS, "svg");
    canvas.setAttribute("width", w); canvas.setAttribute("height", h);
    canvas.style.width = "100%"; canvas.style.height = "100%";
    canvas.style.display = "block";

    const nodes = [
      { id: "client", label: "Client", x: 120, y: h / 2, color: "#eaf6f0", active: highlight === "client" },
      { id: "network", label: "Network", x: w / 2, y: h * 0.3, color: "#fbf5df", active: highlight === "network" },
      { id: "appserver", label: "App Server", x: w / 2, y: h / 2, color: "#eaf6f0", active: highlight === "appserver" },
      { id: "dbserver", label: "DB Server", x: w - 120, y: h / 2, color: "#fbeeed", active: highlight === "dbserver" },
    ];

    // edges
    const edges = [
      ["client", "network"], ["network", "appserver"], ["appserver", "dbserver"],
    ];
    edges.forEach(([a, b]) => {
      const na = nodes.find((n) => n.id === a);
      const nb = nodes.find((n) => n.id === b);
      canvas.appendChild(line(na.x, na.y, nb.x, nb.y, { stroke: "#93b8a6", strokeWidth: 2, markerEnd: "url(#csarrow)" }));
    });

    const defs = document.createElementNS(svgNS, "defs");
    const marker = document.createElementNS(svgNS, "marker");
    marker.setAttribute("id", "csarrow"); marker.setAttribute("markerWidth", "10"); marker.setAttribute("markerHeight", "10");
    marker.setAttribute("refX", "8"); marker.setAttribute("refY", "5"); marker.setAttribute("orient", "auto");
    const mpoly = document.createElementNS(svgNS, "polygon");
    mpoly.setAttribute("points", "0,0 10,5 0,10"); mpoly.setAttribute("fill", "#5c7568");
    marker.appendChild(mpoly);
    defs.appendChild(marker);
    canvas.insertBefore(defs, canvas.firstChild);

    nodes.forEach((n) => {
      canvas.appendChild(rect(n.x - 50, n.y - 28, 100, 56, { fill: n.color, stroke: n.active ? "#145f43" : "#294438", strokeWidth: n.active ? 3 : 2 }));
      canvas.appendChild(text(n.x, n.y + 4, n.label, { size: 11, weight: "700", fill: n.active ? "#1b7f5a" : "#294438" }));
    });

    svg.appendChild(canvas);
  }

  /* ---------- 5. P2P ---------- */
  let p2pPeers = [];
  let p2pMsgId = 0;

  function p2pAddPeer() {
    const svg = $("p2p-visual");
    const w = svg.clientWidth || 560;
    const h = svg.clientHeight || 300;
    const id = "p" + p2pPeers.length;
    const angle = (p2pPeers.length * 137.5) * Math.PI / 180;
    const r = Math.min(w, h) * 0.35;
    const x = w / 2 + Math.cos(angle) * r;
    const y = h / 2 + Math.sin(angle) * r;
    p2pPeers.push({ id, x, y, msgs: 0 });
    renderP2P();
    $("p2p-stat").textContent = `Peers: ${p2pPeers.length} · Messages: 0`;
  }

  function p2pSend() {
    if (p2pPeers.length < 2) return;
    const src = p2pPeers[Math.floor(Math.random() * p2pPeers.length)];
    let dst = p2pPeers[Math.floor(Math.random() * p2pPeers.length)];
    while (dst === src) dst = p2pPeers[Math.floor(Math.random() * p2pPeers.length)];
    const msg = { id: "m" + p2pMsgId++, src, dst, t: 0, path: [] };
    // compute shortest path on complete graph = direct, but visualise gossip: forward through one random peer if >2
    if (p2pPeers.length > 3 && Math.random() < 0.5) {
      const mid = p2pPeers.find((p) => p.id !== src.id && p.id !== dst.id);
      msg.path = [mid];
    }
    p2pAnimate(msg);
  }

  function p2pAnimate(msg) {
    const svg = $("p2p-visual");
    const seq = [msg.src, ...msg.path, msg.dst];
    let step = 0;
    function tick() {
      if (step >= seq.length - 1) {
        msg.dst.msgs++;
        renderP2P();
        $("p2p-stat").textContent = `Peers: ${p2pPeers.length} · Messages: ${p2pPeers.reduce((a, p) => a + p.msgs, 0)}`;
        return;
      }
      renderP2P({ active: [seq[step], seq[step + 1]] });
      step++;
      setTimeout(tick, 600);
    }
    tick();
  }

  function p2pReset() {
    p2pPeers = [];
    p2pMsgId = 0;
    for (let i = 0; i < 3; i++) p2pAddPeerInit();
    renderP2P();
    $("p2p-stat").textContent = `Peers: ${p2pPeers.length} · Messages: 0`;
  }

  function p2pAddPeerInit() {
    const svg = $("p2p-visual");
    const w = svg.clientWidth || 560;
    const h = svg.clientHeight || 300;
    const id = "p" + p2pPeers.length;
    const angle = (p2pPeers.length * 137.5) * Math.PI / 180;
    const r = Math.min(w, h) * 0.35;
    p2pPeers.push({ id, x: w / 2 + Math.cos(angle) * r, y: h / 2 + Math.sin(angle) * r, msgs: 0 });
  }

  function renderP2P(opts = {}) {
    const svg = $("p2p-visual");
    clear(svg);
    const w = svg.clientWidth || 560;
    const h = svg.clientHeight || 300;
    const svgNS = "http://www.w3.org/2000/svg";
    const canvas = document.createElementNS(svgNS, "svg");
    canvas.setAttribute("width", w); canvas.setAttribute("height", h);
    canvas.style.width = "100%"; canvas.style.height = "100%";

    const active = opts.active || [];
    const isActive = (id) => active.some((a) => a.id === id);

    // edges (complete graph, subtle)
    for (let i = 0; i < p2pPeers.length; i++) {
      for (let j = i + 1; j < p2pPeers.length; j++) {
        const a = p2pPeers[i], b = p2pPeers[j];
        const bothActive = isActive(a.id) && isActive(b.id);
        canvas.appendChild(line(a.x, a.y, b.x, b.y, { stroke: bothActive ? "#145f43" : "#f6faf7", strokeWidth: bothActive ? 3 : 1 }));
      }
    }
    // nodes
    p2pPeers.forEach((p) => {
      canvas.appendChild(circ(p.x, p.y, 20, { fill: isActive(p.id) ? "#1b7f5a" : "#fff", stroke: isActive(p.id) ? "#145f43" : "#93b8a6", strokeWidth: isActive(p.id) ? 3 : 2 }));
      canvas.appendChild(text(p.x, p.y + 4, p.id.replace("p", "P"), { size: 10, weight: "800", fill: isActive(p.id) ? "#1b7f5a" : "#294438" }));
      if (p.msgs > 0) {
        canvas.appendChild(circ(p.x + 14, p.y - 14, 8, { fill: "#c9a227" }));
        canvas.appendChild(text(p.x + 14, p.y - 11, p.msgs, { size: 9, fill: "#fff", weight: "800" }));
      }
    });
    svg.appendChild(canvas);
  }

  /* ---------- 6. Hadoop ---------- */
  const hadoopData = {
    namenode: {
      role: "NameNode (Master)",
      details: [
        "Stores the HDFS namespace (directory tree).",
        "Stores metadata: file → block mapping and block locations.",
        "Does NOT store actual file data.",
        "Receives heartbeats and block reports from DataNodes.",
        "Single point of failure (unless HDFS HA is configured).",
      ],
      failure: "If it fails, HDFS becomes unavailable until restored from a Secondary NameNode checkpoint or standby.",
    },
    datanode: {
      role: "DataNode (Worker)",
      details: [
        "Stores actual HDFS data blocks on local disk.",
        "Serves read/write requests from clients.",
        "Sends regular heartbeats to the NameNode.",
        "Reports its block inventory via block reports.",
        "Replicates blocks to other DataNodes as instructed.",
      ],
      failure: "If it fails, the NameNode detects the missing heartbeat and re-replicates its blocks from other replicas.",
    },
    snn: {
      role: "Secondary NameNode",
      details: [
        "Not a hot standby for the NameNode.",
        "Periodically downloads the namespace image and edit log.",
        "Merges them into a new checkpoint image.",
        "Reduces NameNode restart time.",
      ],
      failure: "Failure does not stop HDFS operation, but slows NameNode restarts.",
    },
    client: {
      role: "HDFS Client",
      details: [
        "Contacts the NameNode for block locations.",
        "Reads/writes blocks directly to DataNodes.",
        "Never reads file data through the NameNode.",
      ],
      failure: "Client failure affects only that client's operations.",
    },
  };

  function selectHadoop(comp) {
    const d = hadoopData[comp];
    $("hd-role").innerHTML = `<div style="font-size:0.85rem;color:var(--color-text-2);"><strong>${d.role}</strong></div><ul style="margin-top:0.4rem;font-size:0.8rem;color:var(--color-text-2);padding-left:1.1rem;">${d.details.map((x) => `<li>${x}</li>`).join("")}</ul><div style="margin-top:0.5rem;font-size:0.8rem;color:var(--color-danger);"><strong>Failure:</strong> ${d.failure}</div>`;
    ["namenode", "datanode", "snn", "client"].forEach((c) => {
      const b = $("hd-" + c);
      if (c === comp) { b.classList.remove("btn-outline"); b.classList.add("btn-secondary"); }
      else { b.classList.remove("btn-secondary"); b.classList.add("btn-outline"); }
    });
    drawHadoop(comp);
  }

  function drawHadoop(highlight) {
    const svg = $("hd-visual");
    clear(svg);
    const w = svg.clientWidth || 560;
    const h = svg.clientHeight || 300;
    const svgNS = "http://www.w3.org/2000/svg";
    const canvas = document.createElementNS(svgNS, "svg");
    canvas.setAttribute("width", w); canvas.setAttribute("height", h);
    canvas.style.width = "100%"; canvas.style.height = "100%";

    const nodes = [
      { id: "client", label: "Client", x: w * 0.14, y: h * 0.5, color: "#eaf6f0" },
      { id: "namenode", label: "NameNode", x: w * 0.5, y: h * 0.28, color: "#fbf5df" },
      { id: "snn", label: "Secondary NN", x: w * 0.5, y: h * 0.72, color: "#fbeeed" },
      { id: "datanode", label: "DataNodes", x: w * 0.86, y: h * 0.5, color: "#eaf6f0" },
    ];

    const edges = [
      ["client", "namenode"], ["namenode", "datanode"], ["datanode", "datanode"],
      ["namenode", "snn"],
    ];
    edges.forEach(([a, b]) => {
      const na = nodes.find((n) => n.id === a);
      const nb = nodes.find((n) => n.id === b);
      canvas.appendChild(line(na.x, na.y, nb.x, nb.y, { stroke: "#93b8a6", strokeWidth: 2, markerEnd: "url(#hdarrow)" }));
    });

    const defs = document.createElementNS(svgNS, "defs");
    const marker = document.createElementNS(svgNS, "marker");
    marker.setAttribute("id", "hdarrow"); marker.setAttribute("markerWidth", "10"); marker.setAttribute("markerHeight", "10");
    marker.setAttribute("refX", "8"); marker.setAttribute("refY", "5"); marker.setAttribute("orient", "auto");
    const mpoly = document.createElementNS(svgNS, "polygon");
    mpoly.setAttribute("points", "0,0 10,5 0,10"); mpoly.setAttribute("fill", "#5c7568");
    marker.appendChild(mpoly);
    defs.appendChild(marker);
    canvas.insertBefore(defs, canvas.firstChild);

    nodes.forEach((n) => {
      const active = highlight === n.id;
      canvas.appendChild(rect(n.x - 55, n.y - 26, 110, 52, { fill: n.color, stroke: active ? "#145f43" : "#294438", strokeWidth: active ? 3 : 2 }));
      canvas.appendChild(text(n.x, n.y + 4, n.label, { size: 10, weight: "700", fill: active ? "#1b7f5a" : "#294438" }));
    });

    // datanode cluster indicator
    canvas.appendChild(text(w * 0.86, h * 0.62, "× N nodes (rack-aware)", { size: 9, fill: "#5c7568" }));

    svg.appendChild(canvas);
  }

  let hdfsBlocks = [];
  function hdfsDistribute() {
    const rf = parseInt($("hdfs-rf").value, 10);
    $("hdfs-rf-val").textContent = rf;
    const svg = $("hdfs-visual");
    const w = svg.clientWidth || 560;
    const h = svg.clientHeight || 300;

    const nBlocks = 4;
    const nDatanodes = 5;
    hdfsBlocks = [];
    // create datanode positions
    const dnPos = [];
    const cols = 3, rows = 2;
    for (let i = 0; i < nDatanodes; i++) {
      const cx = 120 + (i % cols) * ((w - 240) / (cols - 1));
      const cy = h * 0.55 + Math.floor(i / cols) * 70;
      dnPos.push({ x: cx, y: cy });
    }
    // blocks placed on source at top
    for (let b = 0; b < nBlocks; b++) {
      const copies = [];
      const shuffled = [...dnPos].sort(() => 0.5 - Math.random());
      for (let c = 0; c < Math.min(rf, nDatanodes); c++) copies.push(shuffled[c]);
      hdfsBlocks.push({ id: "B" + (b + 1), x: w * 0.12 + b * 70, y: h * 0.25, copies });
    }
    renderHdfsDist();
    $("hdfs-stat").textContent = `Blocks: ${nBlocks} · Copies: ${nBlocks * Math.min(rf, nDatanodes)}`;
  }

  function renderHdfsDist() {
    const svg = $("hdfs-visual");
    clear(svg);
    const w = svg.clientWidth || 560;
    const h = svg.clientHeight || 300;
    const svgNS = "http://www.w3.org/2000/svg";
    const canvas = document.createElementNS(svgNS, "svg");
    canvas.setAttribute("width", w); canvas.setAttribute("height", h);
    canvas.style.width = "100%"; canvas.style.height = "100%";

    // datanodes
    const nDatanodes = 5;
    const cols = 3, rows = 2;
    for (let i = 0; i < nDatanodes; i++) {
      const cx = 120 + (i % cols) * ((w - 240) / (cols - 1));
      const cy = h * 0.55 + Math.floor(i / cols) * 70;
      canvas.appendChild(circ(cx, cy, 18, { fill: "#f6faf7", stroke: "#294438" }));
      canvas.appendChild(text(cx, cy + 4, "DN" + (i + 1), { size: 9, fill: "#294438" }));
    }
    // name node
    canvas.appendChild(rect(w * 0.5 - 50, h * 0.12 - 18, 100, 36, { fill: "#fbf5df", stroke: "#8a6d1d" }));
    canvas.appendChild(text(w * 0.5, h * 0.12, "NameNode (metadata)", { size: 10, weight: "700", fill: "#8a6d1d" }));

    // blocks & copies
    hdfsBlocks.forEach((b) => {
      canvas.appendChild(rect(b.x - 16, b.y - 12, 32, 24, { fill: "#eaf6f0", stroke: "#1b7f5a" }));
      canvas.appendChild(text(b.x, b.y + 3, b.id, { size: 9, weight: "800", fill: "#1b7f5a" }));
      b.copies.forEach((c) => {
        canvas.appendChild(line(b.x + 16, b.y + 12, c.x, c.y - 18, { stroke: "#93b8a6", strokeWidth: 1, dash: "3,2", markerEnd: "url(#blkarrow)" }));
        canvas.appendChild(rect(c.x - 10, c.y - 24, 20, 16, { fill: "#eaf6f0", stroke: "#145f43" }));
        canvas.appendChild(text(c.x, c.y - 16, "✓", { size: 10, fill: "#1b7f5a", weight: "800" }));
      });
    });

    const defs = document.createElementNS(svgNS, "defs");
    const marker = document.createElementNS(svgNS, "marker");
    marker.setAttribute("id", "blkarrow"); marker.setAttribute("markerWidth", "8"); marker.setAttribute("markerHeight", "8");
    marker.setAttribute("refX", "7"); marker.setAttribute("refY", "4"); marker.setAttribute("orient", "auto");
    const mpoly = document.createElementNS(svgNS, "polygon");
    mpoly.setAttribute("points", "0,0 8,4 0,8"); mpoly.setAttribute("fill", "#5c7568");
    marker.appendChild(mpoly);
    defs.appendChild(marker);
    canvas.insertBefore(defs, canvas.firstChild);

    svg.appendChild(canvas);
  }

  /* ---------- 7. Parallel algorithm simulator ---------- */
  function runAlgo() {
    const W = parseInt($("pa-w").value, 10);
    const P = parseInt($("pa-p").value, 10);
    $("pa-w-val").textContent = W;
    $("pa-p-val").textContent = P;
    $("pa-stat").textContent = "Stage: Decomposing task";

    const svg = $("pa-visual");
    const w = svg.clientWidth || 560;
    const h = svg.clientHeight || 300;

    // clear then draw stages with simple animation via stages
    const stages = ["Decompose", "Distribute", "Execute", "Synchronise", "Combine"];
    const per = Math.ceil(W / P);

    // Draw static diagram
    clear(svg);
    const svgNS = "http://www.w3.org/2000/svg";
    const canvas = document.createElementNS(svgNS, "svg");
    canvas.setAttribute("width", w); canvas.setAttribute("height", h);
    canvas.style.width = "100%"; canvas.style.height = "100%";

    canvas.appendChild(text(w * 0.5, 28, `Problem of ${W} units across ${P} processors`, { size: 13, weight: "800" }));

    // original problem
    canvas.appendChild(rect(40, h * 0.22, 120, 44, { fill: "#f6faf7", stroke: "#1b7f5a" }));
    canvas.appendChild(text(100, h * 0.22 + 26, "Whole problem", { size: 10, weight: "700", fill: "#1b7f5a" }));
    canvas.appendChild(text(100, h * 0.22 + 8, W + " units", { size: 9, fill: "#294438" }));

    // decomposition arrow
    canvas.appendChild(line(160, h * 0.22 + 22, 190, h * 0.22 + 22, { stroke: "#93b8a6", strokeWidth: 2, markerEnd: "url(#paarrow)" }));

    // subtasks
    const subW = 44;
    let sx = 210;
    for (let i = 0; i < P; i++) {
      canvas.appendChild(rect(sx, h * 0.22, subW, 44, { fill: "#eaf6f0", stroke: "#1b7f5a" }));
      canvas.appendChild(text(sx + subW / 2, h * 0.22 + 26, `S${i + 1}`, { size: 10, weight: "700", fill: "#1b7f5a" }));
      canvas.appendChild(text(sx + subW / 2, h * 0.22 + 8, per + " u", { size: 8, fill: "#294438" }));
      sx += subW + 8;
    }

    // processors below
    canvas.appendChild(text(w * 0.5, h * 0.5, "Processors execute simultaneously", { size: 12, weight: "700", fill: "#145f43" }));
    let px = 80;
    const procH = h * 0.62;
    for (let i = 0; i < P; i++) {
      canvas.appendChild(rect(px, procH, 70, 60, { fill: "#eaf6f0", stroke: "#145f43" }));
      canvas.appendChild(text(px + 35, procH + 18, `CPU ${i + 1}`, { size: 10, weight: "700", fill: "#1b7f5a" }));
      canvas.appendChild(text(px + 35, procH + 34, "running", { size: 9, fill: "#294438" }));
      canvas.appendChild(text(px + 35, procH + 48, `S${i + 1}`, { size: 10, weight: "700", fill: "#145f43" }));
      px += 80;
    }

    // barrier / synchronise
    canvas.appendChild(line(w * 0.5, procH + 70, w * 0.5, h * 0.86, { stroke: "#8a6d1d", strokeWidth: 2, dash: "4,2" }));
    canvas.appendChild(rect(w * 0.5 - 30, h * 0.86 - 12, 60, 24, { fill: "#fbf5df", stroke: "#8a6d1d" }));
    canvas.appendChild(text(w * 0.5, h * 0.86, "Barrier", { size: 10, weight: "700", fill: "#8a6d1d" }));

    // final result
    canvas.appendChild(rect(w * 0.5 - 55, h * 0.94, 110, 34, { fill: "#eaf6f0", stroke: "#145f43" }));
    canvas.appendChild(text(w * 0.5, h * 0.94 + 20, "Final result combined", { size: 10, weight: "700", fill: "#1b7f5a" }));

    const defs = document.createElementNS(svgNS, "defs");
    const marker = document.createElementNS(svgNS, "marker");
    marker.setAttribute("id", "paarrow"); marker.setAttribute("markerWidth", "10"); marker.setAttribute("markerHeight", "10");
    marker.setAttribute("refX", "8"); marker.setAttribute("refY", "5"); marker.setAttribute("orient", "auto");
    const mpoly = document.createElementNS(svgNS, "polygon");
    mpoly.setAttribute("points", "0,0 10,5 0,10"); mpoly.setAttribute("fill", "#5c7568");
    marker.appendChild(mpoly);
    defs.appendChild(marker);
    canvas.insertBefore(defs, canvas.firstChild);

    svg.appendChild(canvas);
    $("pa-stat").textContent = `Stage: Complete · Ideal time ≈ ${Math.ceil(W / P)} units`;
  }

  /* ---------- 8. Race condition ---------- */
  function runRace(locked = false) {
    const svg = $("race-visual");
    clear(svg);
    const w = svg.clientWidth || 560;
    const h = svg.clientHeight || 300;
    const svgNS = "http://www.w3.org/2000/svg";
    const canvas = document.createElementNS(svgNS, "svg");
    canvas.setAttribute("width", w); canvas.setAttribute("height", h);
    canvas.style.width = "100%"; canvas.style.height = "100%";

    canvas.appendChild(text(w * 0.5, 28, locked ? "Synchronised (lock protected)" : "Unsynchronised race condition", { size: 13, weight: "800", fill: locked ? "#145f43" : "#a63a37" }));

    // shared counter
    canvas.appendChild(rect(w * 0.5 - 60, h * 0.3 - 26, 120, 52, { fill: "#f6faf7", stroke: "#294438" }));
    canvas.appendChild(text(w * 0.5, h * 0.3 - 10, "Shared counter", { size: 11, weight: "700" }));
    const counterText = text(w * 0.5, h * 0.3 + 10, "0", { size: 22, weight: "800", fill: "#1b7f5a" });
    canvas.appendChild(counterText);

    // threads
    canvas.appendChild(rect(60, h * 0.55, 140, 70, { fill: "#fbeeed", stroke: "#a63a37" }));
    canvas.appendChild(text(130, h * 0.55 + 18, "Thread A", { size: 11, weight: "700", fill: "#7d2b29" }));
    canvas.appendChild(text(130, h * 0.55 + 36, "read → inc → write", { size: 9, fill: "#294438" }));

    canvas.appendChild(rect(w - 200, h * 0.55, 140, 70, { fill: "#eaf6f0", stroke: "#1b7f5a" }));
    canvas.appendChild(text(w - 130, h * 0.55 + 18, "Thread B", { size: 11, weight: "700", fill: "#1b7f5a" }));
    canvas.appendChild(text(w - 130, h * 0.55 + 36, "read → inc → write", { size: 9, fill: "#294438" }));

    // animation
    let step = 0;
    const timeline = locked
      ? [
          ["A acquires lock", 0],
          ["A: read 0, write 1", 1],
          ["A releases lock", 1],
          ["B acquires lock, write 2", 2],
          ["B releases lock", 2],
          ["Final: 2 — no lost update", 2],
        ]
      : [
          ["A reads 0", 0],
          ["B reads 0", 0],
          ["A writes 1", 1],
          ["B writes 1 ← lost update!", 1],
          ["Final: 1 (should be 2)", 1],
          ["Race condition! Interleaving corrupted the result", 1],
        ];

    function tick() {
      if (step >= timeline.length) return;
      const [status, value] = timeline[step];
      counterText.textContent = value;
      $("race-stat").textContent = status;
      step++;
      setTimeout(tick, 900);
    }
    tick();
    svg.appendChild(canvas);
  }

  /* ---------- 9. Failure simulator ---------- */
  let ftServers = [];
  function ftToggle() {
    const n = parseInt($("ft-r").value, 10);
    $("ft-r-val").textContent = n;
    if (ftServers.length === 0 || ftServers.length !== n) {
      ftServers = [];
      for (let i = 0; i < n; i++) ftServers.push({ id: i, up: true });
    } else {
      // toggle a random down server up or a random up server down
      const up = ftServers.filter((s) => s.up);
      const down = ftServers.filter((s) => !s.up);
      const target = (Math.random() < 0.5 && down.length) ? down : up;
      if (target.length) target[Math.floor(Math.random() * target.length)].up = !target[0].up;
    }
    renderFT();
  }

  function ftReset() {
    const n = parseInt($("ft-r").value, 10);
    ftServers = [];
    for (let i = 0; i < n; i++) ftServers.push({ id: i, up: true });
    renderFT();
  }

  function renderFT() {
    const svg = $("ft-visual");
    clear(svg);
    const w = svg.clientWidth || 560;
    const h = svg.clientHeight || 300;
    const svgNS = "http://www.w3.org/2000/svg";
    const canvas = document.createElementNS(svgNS, "svg");
    canvas.setAttribute("width", w); canvas.setAttribute("height", h);
    canvas.style.width = "100%"; canvas.style.height = "100%";

    const upCount = ftServers.filter((s) => s.up).length;
    const total = ftServers.length;
    $("ft-stat").textContent = `Available: ${upCount}/${total}`;

    // arrange circle
    const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.3;
    ftServers.forEach((s, i) => {
      const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      // links to neighbours
      const j = (i + 1) % total;
      const x2 = cx + Math.cos((j / total) * 2 * Math.PI - Math.PI / 2) * r;
      const y2 = cy + Math.sin((j / total) * 2 * Math.PI - Math.PI / 2) * r;
      if (s.up && ftServers[j].up) {
        canvas.appendChild(line(x, y, x2, y2, { stroke: "#93b8a6", strokeWidth: 2 }));
      }
      canvas.appendChild(circ(x, y, 22, { fill: s.up ? "#eaf6f0" : "#fbeeed", stroke: s.up ? "#145f43" : "#a63a37", strokeWidth: 3 }));
      canvas.appendChild(text(x, y + 4, "S" + (i + 1), { size: 10, weight: "800", fill: s.up ? "#1b7f5a" : "#7d2b29" }));
      if (!s.up) {
        canvas.appendChild(text(x, y - 32, "OFF", { size: 10, weight: "800", fill: "#a63a37" }));
      }
    });

    // client request
    canvas.appendChild(rect(40, 40, 100, 34, { fill: "#eaf6f0", stroke: "#1b7f5a" }));
    canvas.appendChild(text(90, 62, "Client", { size: 10, weight: "700", fill: "#1b7f5a" }));
    if (upCount > 0) {
      const target = ftServers.find((s) => s.up);
      const angle = (target.id / total) * 2 * Math.PI - Math.PI / 2;
      const tx = cx + Math.cos(angle) * r;
      const ty = cy + Math.sin(angle) * r;
      canvas.appendChild(line(140, 57, tx - 22, ty, { stroke: "#145f43", strokeWidth: 2, markerEnd: "url(#ftarrow)" }));
    }

    const defs = document.createElementNS(svgNS, "defs");
    const marker = document.createElementNS(svgNS, "marker");
    marker.setAttribute("id", "ftarrow"); marker.setAttribute("markerWidth", "8"); marker.setAttribute("markerHeight", "8");
    marker.setAttribute("refX", "7"); marker.setAttribute("refY", "4"); marker.setAttribute("orient", "auto");
    const mpoly = document.createElementNS(svgNS, "polygon");
    mpoly.setAttribute("points", "0,0 8,4 0,8"); mpoly.setAttribute("fill", "#145f43");
    marker.appendChild(mpoly);
    defs.appendChild(marker);
    canvas.insertBefore(defs, canvas.firstChild);

    svg.appendChild(canvas);
  }

  /* ---------- 10. Scaling ---------- */
  function scAuto() {
    const req = parseInt($("sc-r").value, 10);
    const ideal = Math.ceil(req / 60);
    $("sc-s").value = Math.min(10, Math.max(1, ideal));
    $("sc-s-val").textContent = $("sc-s").value;
    renderSC();
  }

  function renderSC() {
    const req = parseInt($("sc-r").value, 10);
    const s = parseInt($("sc-s").value, 10);
    $("sc-r-val").textContent = req;
    $("sc-s-val").textContent = s;

    const perServer = req / s;
    const response = Math.max(50, 50 + (perServer - 60) * 1.2); // ms model
    $("sc-stat").textContent = `Avg response: ${response.toFixed(0)} ms · Load/server: ${perServer.toFixed(0)} req/s`;

    const svg = $("sc-visual");
    clear(svg);
    const w = svg.clientWidth || 560;
    const h = svg.clientHeight || 300;
    const svgNS = "http://www.w3.org/2000/svg";
    const canvas = document.createElementNS(svgNS, "svg");
    canvas.setAttribute("width", w); canvas.setAttribute("height", h);
    canvas.style.width = "100%"; canvas.style.height = "100%";

    // load balancer
    canvas.appendChild(rect(w * 0.5 - 50, 40, 100, 40, { fill: "#1b7f5a", rx: 6 }));
    canvas.appendChild(text(w * 0.5, 64, "Load Balancer", { size: 11, weight: "800", fill: "#fff" }));

    let bx = 60;
    for (let i = 0; i < s; i++) {
      const overloaded = perServer > 100;
      canvas.appendChild(rect(bx, h * 0.55, 100, 90, { fill: overloaded ? "#fbeeed" : "#eaf6f0", stroke: overloaded ? "#a63a37" : "#145f43", rx: 6 }));
      canvas.appendChild(text(bx + 50, h * 0.55 + 30, `S${i + 1}`, { size: 11, weight: "800", fill: overloaded ? "#7d2b29" : "#1b7f5a" }));
      canvas.appendChild(text(bx + 50, h * 0.55 + 50, perServer.toFixed(0) + " req/s", { size: 9, fill: "#294438" }));
      canvas.appendChild(line(w * 0.5, 80, bx + 50, h * 0.55, { stroke: "#93b8a6", strokeWidth: 1, markerEnd: "url(#scarrow)" }));
      bx += 110;
      if (bx > w - 100) { bx = 60; /* wrap */ }
    }

    const defs = document.createElementNS(svgNS, "defs");
    const marker = document.createElementNS(svgNS, "marker");
    marker.setAttribute("id", "scarrow"); marker.setAttribute("markerWidth", "8"); marker.setAttribute("markerHeight", "8");
    marker.setAttribute("refX", "7"); marker.setAttribute("refY", "4"); marker.setAttribute("orient", "auto");
    const mpoly = document.createElementNS(svgNS, "polygon");
    mpoly.setAttribute("points", "0,0 8,4 0,8"); mpoly.setAttribute("fill", "#5c7568");
    marker.appendChild(mpoly);
    defs.appendChild(marker);
    canvas.insertBefore(defs, canvas.firstChild);

    svg.appendChild(canvas);
  }

  /* ---------- 11. MapReduce ---------- */
  const mrInput = "The cat eats fish. The cat likes fish.";
  let mrStep = 0;
  let mrFailed = false;
  const mrSteps = 6;

  function mrNext() {
    mrFailed = false;
    if (mrStep < mrSteps - 1) mrStep++;
    renderMR();
  }
  function mrPrev() {
    if (mrStep > 0) mrStep--;
    renderMR();
  }
  function mrFail() {
    mrFailed = true;
    mrStep = 2;
    renderMR();
  }

  function renderMR() {
    $("mr-step").textContent = `Step: ${mrStep + 1} / ${mrSteps}`;
    if ($("mr-desc")) {
      $("mr-desc").textContent = mrFailed
        ? "Worker failure — completed map output is lost and the split is recomputed"
        : ["Input", "Input splits", "Map output", "Shuffle & sort", "Reduce", "Final output"][mrStep];
    }
    const svg = $("mr-visual");
    clear(svg);
    const w = svg.clientWidth || 560;
    const h = svg.clientHeight || 340;
    const svgNS = "http://www.w3.org/2000/svg";
    const canvas = document.createElementNS(svgNS, "svg");
    canvas.setAttribute("width", w); canvas.setAttribute("height", h);
    canvas.style.width = "100%"; canvas.style.height = "100%";

    const titleTexts = [
      "Step 1 — Input",
      "Step 2 — Splitting",
      "Step 3 — Mapping",
      "Step 4 — Shuffle & Sort",
      "Step 5 — Reducing",
      "Step 6 — Final Output",
    ];
    canvas.appendChild(text(w * 0.5, 28, titleTexts[mrStep], { size: 14, weight: "800" }));

    const words = ["The", "cat", "eats", "fish", "The", "cat", "likes", "fish"];
    const wc = { the: 2, cat: 2, eats: 1, fish: 2, likes: 1 };
    const workerEl = $("mr-w");
    const workers = workerEl ? parseInt(workerEl.value, 10) : 3;
    if ($("mr-w-val")) $("mr-w-val").textContent = workers;
    const chunk = Math.ceil(words.length / workers);
    const blocks = [];
    for (let i = 0; i < words.length; i += chunk) blocks.push(words.slice(i, i + chunk));
    const failedWorker = Math.min(1, Math.max(0, workers - 1));

    if (mrStep === 0) {
      canvas.appendChild(rect(w * 0.5 - 130, h * 0.35 - 30, 260, 60, { fill: "#f6faf7", stroke: "#1b7f5a" }));
      canvas.appendChild(text(w * 0.5, h * 0.35, `"${mrInput}"`, { size: 12, weight: "700", fill: "#1b7f5a" }));
    } else if (mrStep === 1) {
      // split into data blocks, one per worker
      const cols = Math.min(blocks.length, 4);
      const cellW = (w - 80) / cols;
      blocks.forEach((b, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const bw = Math.min(170, cellW - 12);
        const x = 40 + col * cellW;
        const y = h * 0.27 + row * 74;
        const failed = mrFailed && i === failedWorker;
        canvas.appendChild(rect(x, y - 24, bw, 48, { fill: failed ? "#fbeeed" : "#eaf6f0", stroke: failed ? "#a63a37" : "#1b7f5a" }));
        canvas.appendChild(text(x + bw / 2, y - 8, `Block ${i + 1} → Worker ${i + 1}`, { size: 9, weight: "800", fill: failed ? "#7d2b29" : "#1b7f5a" }));
        canvas.appendChild(text(x + bw / 2, y + 10, b.join(" "), { size: 8, fill: "#294438" }));
        if (failed) canvas.appendChild(text(x + bw / 2, y + 32, "FAILED → reassigned", { size: 8, weight: "800", fill: "#a63a37" }));
      });
    } else if (mrStep === 2) {
      // mapping: show key-value pairs, coloured by the worker that produced them
      const pairWorker = [];
      blocks.forEach((b, wi) => b.forEach(() => pairWorker.push(wi)));
      const colors = ["#eaf6f0", "#eaf6f0", "#fbf5df", "#fbeeed", "#e3efe9", "#eaf6f0", "#fbeeed", "#fbf5df"];
      let y = h * 0.26;
      words.forEach((wrd, i) => {
        const col = i % 2;
        const x = w * (0.22 + col * 0.56);
        const failed = mrFailed && pairWorker[i] === failedWorker;
        canvas.appendChild(rect(x - 78, y - 14, 156, 28, { fill: failed ? "#fbeeed" : colors[pairWorker[i] % colors.length], stroke: failed ? "#a63a37" : "#294438" }));
        canvas.appendChild(text(x, y, `(${wrd}, 1)  · W${pairWorker[i] + 1}`, { size: 9, weight: "700", fill: failed ? "#7d2b29" : "#1b7f5a" }));
        y += col === 1 ? 36 : 0;
      });
      if (mrFailed) {
        canvas.appendChild(rect(w * 0.5 - 130, h * 0.9 - 14, 260, 28, { fill: "#fbeeed", stroke: "#a63a37" }));
        canvas.appendChild(text(w * 0.5, h * 0.9 + 5, `Worker ${failedWorker + 1} failed → its split is re-executed`, { size: 9, weight: "800", fill: "#7d2b29" }));
      }
    } else if (mrStep === 3) {
      // shuffle: group keys and assign reducers
      const groups = [
        { key: "the", vals: [1, 1], x: w * 0.25, y: h * 0.28 },
        { key: "cat", vals: [1, 1], x: w * 0.5, y: h * 0.28 },
        { key: "eats", vals: [1], x: w * 0.75, y: h * 0.28 },
        { key: "fish", vals: [1, 1], x: w * 0.25, y: h * 0.52 },
        { key: "likes", vals: [1], x: w * 0.5, y: h * 0.52 },
      ];
      groups.forEach((g, i) => {
        canvas.appendChild(rect(g.x - 72, g.y - 14, 144, 30, { fill: "#eaf6f0", stroke: "#145f43" }));
        canvas.appendChild(text(g.x, g.y - 2, `(${g.key}, [${g.vals.join(",")}])`, { size: 9, weight: "700", fill: "#1b7f5a" }));
        canvas.appendChild(text(g.x, g.y + 11, `→ Reducer ${(i % 3) + 1}`, { size: 8, fill: "#145f43" }));
      });
      canvas.appendChild(text(w * 0.5, h * 0.75, "Hash(key) chooses a reducer — equal keys always meet at the same reducer.", { size: 9, fill: "#5c7568" }));
      if (mrFailed) {
        canvas.appendChild(text(w * 0.5, h * 0.85, "Failure recovery: completed map output on the failed node is lost, so the split is recomputed.", { size: 9, weight: "700", fill: "#a63a37" }));
      }
    } else if (mrStep === 4) {
      // reducing
      const results = [
        { key: "the", sum: 2, x: w * 0.3 },
        { key: "cat", sum: 2, x: w * 0.5 },
        { key: "eats", sum: 1, x: w * 0.7 },
      ];
      results.forEach((r) => {
        canvas.appendChild(rect(r.x - 60, h * 0.35 - 20, 120, 40, { fill: "#eaf6f0", stroke: "#145f43" }));
        canvas.appendChild(text(r.x, h * 0.35, `reduce("${r.key}", [1,1...]) → ${r.sum}`, { size: 10, weight: "700", fill: "#1b7f5a" }));
      });
    } else {
      // final output
      const entries = Object.entries(wc);
      let y = h * 0.3;
      entries.forEach(([k, v]) => {
        canvas.appendChild(rect(w * 0.5 - 70, y - 14, 140, 28, { fill: "#f6faf7", stroke: "#1b7f5a" }));
        canvas.appendChild(text(w * 0.5, y, `${k}: ${v}`, { size: 12, weight: "800", fill: "#1b7f5a" }));
        y += 40;
      });
    }
    svg.appendChild(canvas);
  }

  /* ---------- 12. Shared vs distributed memory ---------- */
  let sdmMode = "shared";

  function selectSDM(mode) {
    sdmMode = mode === "distributed" ? "distributed" : "shared";
    const shared = sdmMode === "shared";
    const sb = $("sdm-shared");
    const db = $("sdm-distributed");
    if (sb) {
      sb.classList.toggle("btn-primary", shared);
      sb.classList.toggle("btn-outline", !shared);
    }
    if (db) {
      db.classList.toggle("btn-primary", !shared);
      db.classList.toggle("btn-outline", shared);
    }
    if ($("sdm-desc")) {
      $("sdm-desc").textContent = shared
        ? "All processors share one physical address space. Communication is an ordinary load or store."
        : "Each node has private memory. Nodes communicate by explicit messages over a network.";
    }
    if ($("sdm-stat")) {
      $("sdm-stat").textContent = shared
        ? "UMA · load/store · OpenMP threads"
        : "NORMA · message passing · MPI processes";
    }
    renderSDM();
  }

  function renderSDM() {
    const svg = $("sdm-visual");
    if (!svg) return;
    clear(svg);
    const w = svg.clientWidth || 560;
    const h = svg.clientHeight || 320;
    const svgNS = "http://www.w3.org/2000/svg";
    const canvas = document.createElementNS(svgNS, "svg");
    canvas.setAttribute("width", w);
    canvas.setAttribute("height", h);
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const shared = sdmMode === "shared";
    const green = shared ? "#145f43" : "#0b3d2e";
    const blockFill = shared ? "#eaf6f0" : "#eaf6f0";
    const softFill = shared ? "#ffffff" : "#f6faf7";

    canvas.appendChild(text(w / 2, 26, shared ? "Shared memory (UMA)" : "Distributed memory (NORMA)", {
      size: 14, weight: "800", fill: green,
    }));

    if (shared) {
      const cpuCount = 4;
      const cpuW = 88;
      const gap = 18;
      const totalW = cpuCount * cpuW + (cpuCount - 1) * gap;
      const startX = w / 2 - totalW / 2;

      for (let i = 0; i < cpuCount; i++) {
        const x = startX + i * (cpuW + gap);
        canvas.appendChild(rect(x, 62, cpuW, 48, { fill: blockFill, stroke: green }));
        canvas.appendChild(text(x + cpuW / 2, 82, `CPU ${i + 1}`, { size: 10, weight: "800", fill: green }));
        canvas.appendChild(text(x + cpuW / 2, 99, "core / thread", { size: 8, fill: "#294438" }));
        canvas.appendChild(line(x + cpuW / 2, 110, x + cpuW / 2, 158, { stroke: green, strokeWidth: 2 }));
      }

      canvas.appendChild(line(42, 158, w - 42, 158, { stroke: green, strokeWidth: 5 }));
      canvas.appendChild(rect(w / 2 - 72, 172, 144, 24, { fill: softFill, stroke: green, rx: 4, ry: 4 }));
      canvas.appendChild(text(w / 2, 188, "System bus / interconnect", { size: 9, weight: "700", fill: green }));
      canvas.appendChild(line(w / 2, 196, w / 2, 226, { stroke: green, strokeWidth: 3 }));

      canvas.appendChild(rect(w / 2 - 150, 226, 300, 54, { fill: blockFill, stroke: green }));
      canvas.appendChild(text(w / 2, 249, "Global memory — one address space", { size: 11, weight: "800", fill: green }));
      canvas.appendChild(text(w / 2, 267, "all CPUs read and write the same variables", { size: 9, fill: "#294438" }));

      canvas.appendChild(text(w / 2, h - 16, "Low latency · cache coherence · bus contention limits scale", {
        size: 9, fill: "#5c7568",
      }));
    } else {
      const nodes = [0.2, 0.5, 0.8];
      nodes.forEach((frac, i) => {
        const cx = w * frac;
        const nx = cx - 62;
        canvas.appendChild(rect(nx, 54, 124, 108, { fill: softFill, stroke: green }));
        canvas.appendChild(text(cx, 72, `Node ${i + 1}`, { size: 10, weight: "800", fill: green }));
        canvas.appendChild(rect(cx - 50, 82, 100, 30, { fill: blockFill, stroke: green, rx: 4, ry: 4 }));
        canvas.appendChild(text(cx, 101, "CPU", { size: 10, weight: "800", fill: green }));
        canvas.appendChild(rect(cx - 50, 120, 100, 30, { fill: blockFill, stroke: green, rx: 4, ry: 4 }));
        canvas.appendChild(text(cx, 139, "Private memory", { size: 9, weight: "700", fill: green }));
        canvas.appendChild(line(cx, 162, cx, 198, { stroke: green, strokeWidth: 2, dash: "5 4" }));
      });

      canvas.appendChild(line(48, 198, w - 48, 198, { stroke: green, strokeWidth: 4 }));
      canvas.appendChild(text(w / 2, 222, "Network — explicit message passing (MPI)", {
        size: 10, weight: "800", fill: green,
      }));
      canvas.appendChild(text(w / 2, 240, "send / receive · no shared variables", { size: 9, fill: "#294438" }));
      canvas.appendChild(text(w / 2, h - 16, "Private address spaces · higher latency · scales to thousands of nodes", {
        size: 9, fill: "#5c7568",
      }));
    }

    svg.appendChild(canvas);
  }

  /* ---------- Public API ---------- */
  const api = {
    init() {
      const run = (name, fn, needed) => {
        const ok = needed.every((id) => document.getElementById(id));
        if (!ok) return;
        try { fn(); } catch (e) { console.warn("Simulator '" + name + "' init failed:", e); }
      };

      run("seq-par", startSeqPar, ["sp-p", "sp-t", "sp-time", "sp-visual"]);
      run("amdahl", startAmdahl, ["amdahl-p", "amdahl-n", "amdahl-visual"]);
      run("flynn", () => setFlynn("sisd"), ["flynn-sisd", "flynn-visual"]);
      run("client-server", () => selectCS("client"), ["cs-client", "cs-visual"]);
      run("p2p", () => p2pReset(), ["p2p-visual"]);
      run("hadoop", () => selectHadoop("namenode"), ["hd-namenode", "hd-visual"]);
      run("hdfs", () => hdfsDistribute(), ["hdfs-rf", "hdfs-visual"]);
      run("algo", () => {
        $("pa-w").value = 24; $("pa-p").value = 4;
        $("pa-w-val").textContent = "24"; $("pa-p-val").textContent = "4";
        runAlgo();
      }, ["pa-w", "pa-p", "pa-visual"]);
      run("race", () => {}, ["race-visual"]);
      run("failure", () => {
        const n = 3;
        $("ft-r").value = n; $("ft-r-val").textContent = n;
        ftServers = [];
        for (let i = 0; i < n; i++) ftServers.push({ id: i, up: true });
        renderFT();
      }, ["ft-r", "ft-visual"]);
      run("scaling", () => renderSC(), ["sc-r", "sc-s", "sc-visual"]);
      run("mapreduce", () => { mrStep = 0; renderMR(); }, ["mr-visual"]);
      run("shared-dist", () => selectSDM("shared"), ["sdm-visual"]);
      const mrw = $("mr-w");
      if (mrw) mrw.oninput = () => renderMR();
    },
    setFlynn,
    selectCS,
    p2pAddPeer,
    p2pSend,
    p2pReset,
    selectHadoop,
    hdfsDistribute,
    runAlgo,
    runRace,
    ftToggle,
    ftReset,
    scAuto,
    mrNext,
    mrPrev,
    mrFail,
    mrRender: renderMR,
    selectSDM,
  };
  return api;
})();
