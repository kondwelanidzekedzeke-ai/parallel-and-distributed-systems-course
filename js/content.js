/*
 * ============================================================================
 * COURSE CONTENT — Parallel & Distributed Systems (University Level)
 * Structured data for the learning platform. All content is academically
 * focused: definitions, technical detail, examples, exam points, knowledge checks.
 * ============================================================================
 */

const CONTENT = {
  courseTitle: "Parallel and Distributed Systems",
  courseCode: "PDS 301",
  level: "Undergraduate (Year 3)",
  modules: [

  /* ========================================================================
     MODULE 1 — INTRODUCTION TO PARALLEL AND DISTRIBUTED SYSTEMS
     ======================================================================== */
  {
    id: "intro",
    title: "Introduction to Parallel and Distributed Systems",
    short: "Foundations, definitions, and performance laws",
    icon: "1",
    color: "#1b7f5a",
    description:
      "Definitions of parallel and distributed computing, evolution of systems, why they are needed, " +
      "parallelism vs concurrency, Amdahl's Law and Gustafson's Law.",
    totalLessons: 4,
    lessons: [
      {
        id: "m1-definitions",
        title: "Definitions and Evolution",
        type: "notes",
        objectives: [
          "Define parallel computing and distributed computing precisely.",
          "Trace the evolution from sequential to parallel and distributed systems.",
          "Distinguish parallelism from concurrency.",
          "Distinguish distributed systems from centralised systems.",
        ],
        content: `
<h2>1.1 What is Parallel Computing?</h2>
<p><strong>Parallel computing</strong> is a form of computation in which many calculations or processes are carried out <em>simultaneously</em>. A large problem is divided into smaller sub-problems that can be solved concurrently, typically on multiple processors within a single computer or closely coupled system.</p>
<p class="lead">Operating principle: divide a task into independent pieces and execute them at the same time to reduce wall-clock time.</p>

<div class="callout callout-def">
  <strong>Important Definition</strong>
  Parallel computing is the simultaneous execution of multiple computations, usually by decomposing a problem into parts that can be solved at the same time on multiple processors.
</div>

<h2>1.2 What is Distributed Computing?</h2>
<p><strong>Distributed computing</strong> is a model in which components located on networked computers communicate and coordinate their actions only by passing messages to achieve a common goal. The computers (nodes) are autonomous, physically separate, and do not share memory.</p>
<p>The key distinguishing feature is that <em>each node has its own private memory and fails independently</em>. There is no global clock and no shared memory.</p>

<div class="callout callout-def">
  <strong>Important Definition</strong>
  A distributed system is a collection of independent computers that appears to its users as a single coherent system — communication occurs exclusively via message passing over a network.
</div>

<h2>1.3 Evolution of Computing Systems</h2>
<ul>
  <li><strong>Sequential (von Neumann) era:</strong> One instruction executes at a time on a single processor. Performance scaled via higher clock speeds.</li>
  <li><strong>Parallel era:</strong> Clock speeds hit power/heat limits (~2005). Manufacturers added multiple cores per chip to keep performance scaling.</li>
  <li><strong>Distributed era:</strong> Networking and the Internet connected independent machines; services now span data centres worldwide.</li>
</ul>

<div class="callout callout-exam">
  <strong>Exam Alert</strong>
  Examiners often ask: "Explain why clock speed alone can no longer drive performance." Answer: power density, heat dissipation, and the memory wall — adding cores (parallelism) and machines (distribution) became necessary.
</div>

<h2>1.4 Why Parallel and Distributed Computing Are Necessary</h2>
<ul>
  <li><strong>Physical limits:</strong> Single-processor clock frequency cannot increase indefinitely (power wall, thermal wall).</li>
  <li><strong>Problem scale:</strong> Weather forecasting, protein folding, and web-scale search exceed one machine's memory and compute.</li>
  <li><strong>Cost:</strong> Many commodity machines are cheaper than one equivalent supercomputer.</li>
  <li><strong>Reliability:</strong> Distributed systems can tolerate node failure without total outage.</li>
  <li><strong>Geography:</strong> Users and data are geographically distributed; computation must be too.</li>
</ul>

<div class="callout callout-real">
  <strong>Real-World Application</strong>
  Google Search answers a query in under a second by distributing the work across thousands of machines — no single server could scan the web index fast enough.
</div>

<h2>1.5 Sequential vs Parallel Computing</h2>
<table>
  <thead><tr><th>Aspect</th><th>Sequential</th><th>Parallel</th></tr></thead>
  <tbody>
    <tr><td>Execution</td><td>One instruction at a time</td><td>Multiple instructions at the same time</td></tr>
    <tr><td>Processors</td><td>One CPU/core</td><td>Multiple cores or processors</td></tr>
    <tr><td>Scaling limit</td><td>Clock frequency (power wall)</td><td>Number of processors + communication overhead</td></tr>
    <tr><td>Example</td><td>Summing an array in one loop</td><td>Dividing array into chunks, summing each chunk on a core</td></tr>
  </tbody>
</table>

<h2>1.6 Parallelism vs Concurrency</h2>
<div class="callout callout-confusion">
  <strong>Common Confusion</strong>
  <strong>Concurrency</strong> is about <em>structure</em> — dealing with multiple things at once (overlapping in time). <strong>Parallelism</strong> is about <em>execution</em> — doing multiple things at the same instant. A concurrent program may run on one processor (interleaved); a parallel program requires multiple execution units to run simultaneously.
</div>
<p>Analogy: A chef cooking one dish step-by-step is sequential. A chef managing several dishes that overlap (concurrent) on one stove is concurrent. Two chefs cooking different dishes at the same time is parallel.</p>

<h2>1.7 Distributed vs Centralised Systems</h2>
<table>
  <thead><tr><th>Aspect</th><th>Centralised</th><th>Distributed</th></tr></thead>
  <tbody>
    <tr><td>Control</td><td>One central server</td><td>No single point of control</td></tr>
    <tr><td>Failure</td><td>Server failure = total outage</td><td>Node failure tolerated via redundancy</td></tr>
    <tr><td>Memory</td><td>Shared, central</td><td>Private, per node</td></tr>
    <tr><td>Communication</td><td>Local bus/memory</td><td>Network messages</td></tr>
  </tbody>
</table>

<h2>1.8 Characteristics</h2>
<h3>Parallel systems</h3>
<ul><li>Tight coupling; processors usually share memory or are closely connected.</li><li>Goal: reduce execution time of a single problem (speedup).</li><li>Low-latency communication between processors.</li></ul>
<h3>Distributed systems</h3>
<ul><li>Loose coupling; autonomous nodes with independent failure.</li><li>Goal: resource sharing, availability, scalability, transparency.</li><li>No shared memory, no global clock.</li></ul>

<h2>1.9 Applications</h2>
<ul><li>Weather forecasting and climate modelling</li><li>Scientific simulation (particle physics, molecular dynamics)</li><li>Web search and large-scale data analytics</li><li>Banking and financial transaction processing</li><li>Computer graphics and rendering</li></ul>

<div class="callout callout-tech">
  <strong>Technical Detail</strong>
  Transparency in distributed systems means hiding distribution details (location, replication, failure) from users and applications. Seven forms exist — see Module 3.
</div>

<div class="callout callout-remember">
  <strong>Remember This</strong>
  Parallel computing ≠ distributed computing. Parallel: multiple processors attacking one problem, often shared memory. Distributed: independent networked machines coordinating by messages, private memory.
</div>
`,
        definitions: [
          { term: "Parallel computing", definition: "Simultaneous execution of multiple computations on multiple processors." },
          { term: "Distributed computing", definition: "Computation across networked autonomous nodes coordinating via message passing." },
          { term: "Concurrency", definition: "Dealing with multiple tasks at once by interleaving; a structural property." },
          { term: "Parallelism", definition: "Simultaneous execution of multiple tasks; an execution property requiring multiple units." },
        ],
        examPoints: [
          "Define parallel and distributed computing and give one difference.",
          "Explain why sequential clock scaling ended (power/thermal wall).",
          "Distinguish concurrency from parallelism with an analogy.",
          "Describe two characteristics of distributed systems.",
        ],
        knowledgeCheck: [
          { q: "Which of the following best defines distributed computing?", options: ["One processor runs many programs", "Multiple networked computers coordinate via messages", "One computer with multiple cores", "A program that runs slowly"], answer: 1 },
          { q: "True or false: Parallelism requires multiple processors executing at the same instant.", options: [], answer: null, type: "tf", correct: true },
          { q: "The ______ wall refers to limits on increasing processor clock frequency due to power and heat.", options: [], answer: null, type: "fill", correct: "power/thermal" },
        ],
        resources: [
          { title: "Introduction to Parallel Computing", source: "Neso Academy", url: "https://www.youtube.com/results?search_query=neso+academy+introduction+to+parallel+computing" },
          { title: "What is Distributed Computing?", source: "IBM Technology", url: "https://www.youtube.com/results?search_query=IBM+Technology+distributed+computing" },
        ],
      },
      {
        id: "m1-performance",
        title: "Performance Metrics and Scaling Laws",
        type: "notes",
        objectives: [
          "Define speedup, efficiency, throughput, and latency.",
          "State and apply Amdahl's Law.",
          "State and apply Gustafson's Law.",
          "Explain the difference between the two laws.",
        ],
        content: `
<h2>1.10 Performance Metrics</h2>
<p>To judge whether parallelisation helps, we measure:</p>
<ul>
  <li><strong>Speedup (S):</strong> ratio of sequential execution time to parallel execution time. <span class="font-mono">S(p) = T(1) / T(p)</span>, where <span class="font-mono">p</span> is the number of processors.</li>
  <li><strong>Efficiency (E):</strong> speedup per processor. <span class="font-mono">E(p) = S(p) / p</span>. Ideal efficiency is 1 (100%).</li>
  <li><strong>Throughput:</strong> number of tasks completed per unit time.</li>
  <li><strong>Latency:</strong> time from start to completion of one task.</li>
</ul>

<div class="callout callout-def">
  <strong>Important Definition</strong>
  Speedup measures how many times faster the parallel version is than the sequential version. Efficiency measures how well the processors are utilised.
</div>

<h2>1.11 Amdahl's Law</h2>
<p><strong>Amdahl's Law</strong> gives the theoretical maximum speedup of a program using multiple processors, limited by the serial fraction.</p>
<div class="callout callout-tech">
  <strong>Technical Detail</strong>
  Formula: <span class="font-mono">S(p) = 1 / ((1 − P) + P/p)</span><br>
  where <span class="font-mono">P</span> is the parallelisable portion and <span class="font-mono">(1 − P)</span> is the inherently serial portion.
</div>
<p><strong>Key insight:</strong> As <span class="font-mono">p → ∞</span>, speedup is bounded by <span class="font-mono">1 / (1 − P)</span>. If 10% of a program is serial, maximum speedup is only 10×, no matter how many processors you add. This is the <strong>law of diminishing returns</strong>.</p>
<h3>Worked example</h3>
<p>If 80% of a program can be parallelised (<span class="font-mono">P = 0.8</span>) and we use 4 processors:</p>
<p><span class="font-mono">S(4) = 1 / (0.2 + 0.8/4) = 1 / (0.2 + 0.2) = 1 / 0.4 = 2.5×</span></p>
<p>Even with 4 processors, we only get 2.5× speedup because the serial 20% dominates.</p>

<h2>1.12 Gustafson's Law</h2>
<p><strong>Gustafson's Law</strong> addresses Amdahl's pessimism by assuming the <em>problem size grows</em> with the number of processors (scaled speedup).</p>
<div class="callout callout-tech">
  <strong>Technical Detail</strong>
  Formula: <span class="font-mono">S(p) = P × p + (1 − P)</span> or equivalently <span class="font-mono">S(p) = p − (p − 1) × s</span> where <span class="font-mono">s</span> is the serial fraction.
</div>
<p><strong>Key insight:</strong> With larger problems, more of the work is parallelisable, so speedup can remain close to linear. Gustafson's Law is more optimistic for large-scale problems (e.g., weather models, big data).</p>

<table>
  <thead><tr><th></th><th>Amdahl's Law</th><th>Gustafson's Law</th></tr></thead>
  <tbody>
    <tr><td>Problem size</td><td>Fixed</td><td>Scales with processors</td></tr>
    <tr><td>Speedup limit</td><td>Bounded by serial fraction</td><td>Near-linear for large problems</td></tr>
    <tr><td>Best for</td><td>Fixed workloads</td><td>Scalable workloads (big data, simulation)</td></tr>
  </tbody>
</table>

<div class="callout callout-exam">
  <strong>Exam Alert</strong>
  You may be asked to calculate speedup for a given parallel fraction and processor count using Amdahl's Law, and to explain why Gustafson's Law predicts better scaling for large problems.
</div>

<h2>1.13 Amdahl's Law — Interactive Explanation</h2>
<p>Use the simulator below (Amdahl's Law calculator) to adjust the parallelisable portion of a program and see how speedup changes as processor count grows. Observe that the curve flattens — this is the serial bottleneck.</p>

<div class="sim-panel">
  <div class="sim-header">Amdahl's Law Speedup Simulator</div>
  <div class="sim-body">
    <div class="sim-controls">
      <div class="sim-control">
        <label>Parallelisable portion <span id="amdahl-p-val">60%</span></label>
        <input type="range" id="amdahl-p" min="0" max="100" value="60">
      </div>
      <div class="sim-control">
        <label>Processors <span id="amdahl-n-val">16</span></label>
        <input type="range" id="amdahl-n" min="1" max="128" value="16">
      </div>
      <div class="callout callout-tech" style="margin-top:1rem; font-size:0.85rem;">
        <strong>Formula</strong> S(p) = 1 / ((1−P) + P/p)
      </div>
    </div>
    <div class="sim-visual" id="amdahl-visual">
      <div class="sim-stage">Adjust the sliders to plot the speedup curve</div>
    </div>
  </div>
  <div style="padding:0.75rem 1.25rem; border-top:1px solid var(--color-border); font-size:0.85rem; color:var(--color-muted); text-align:center;">
    Watch the curve: as processors increase, speedup plateaus at 1/(1−P).
  </div>
</div>
`,
        definitions: [
          { term: "Speedup", definition: "T(1)/T(p): ratio of sequential to parallel execution time." },
          { term: "Efficiency", definition: "Speedup divided by number of processors; measures processor utilisation." },
          { term: "Amdahl's Law", definition: "Bounds speedup by the serial fraction of a program." },
          { term: "Gustafson's Law", definition: "Scaled speedup assuming problem size grows with processor count." },
        ],
        examPoints: [
          "State Amdahl's Law formula and explain its implication.",
          "Calculate speedup given P and p.",
          "Contrast Amdahl's and Gustafson's Laws.",
          "Explain why speedup cannot exceed 1/(1−P).",
        ],
        knowledgeCheck: [
          { q: "According to Amdahl's Law, if 50% of a program is serial, the maximum possible speedup is:", options: ["2×", "4×", "8×", "Unlimited"], answer: 0 },
          { q: "Gustafson's Law assumes problem size grows as processors are added. True or false?", options: [], answer: null, type: "tf", correct: true },
          { q: "Efficiency = Speedup ÷ ______.", options: [], answer: null, type: "fill", correct: "number of processors" },
        ],
        resources: [
          { title: "Amdahl's Law Explained", source: "Neso Academy", url: "https://www.youtube.com/results?search_query=amdahls+law+neso+academy" },
          { title: "Gustafson's Law", source: "Wikipedia", url: "https://en.wikipedia.org/wiki/Gustafson%27s_law" },
        ],
      },
      {
        id: "m1-challenges",
        title: "Applications, Advantages, Disadvantages, Challenges",
        type: "notes",
        objectives: [
          "List applications of parallel and distributed computing.",
          "State advantages and disadvantages of each paradigm.",
          "Identify key challenges (synchronisation, load balancing, etc.).",
        ],
        content: `
<h2>1.14 Applications</h2>
<ul>
  <li>Scientific computing: weather prediction, crash simulation, drug discovery.</li>
  <li>Graphics: rendering, GPU-accelerated visualisation.</li>
  <li>Web services: search engines, social media feeds, recommendation systems.</li>
  <li>Finance: high-frequency trading, risk modelling, fraud detection.</li>
  <li>Enterprise: distributed databases, cloud infrastructure, content delivery networks.</li>
</ul>

<h2>1.15 Advantages and Disadvantages</h2>
<h3>Parallel computing</h3>
<table>
  <thead><tr><th>Advantages</th><th>Disadvantages</th></tr></thead>
  <tbody>
    <tr><td>Reduced execution time (speedup)</td><td>Limited by Amdahl's Law (serial fraction)</td></tr>
    <tr><td>Cost-effective via multicore chips</td><td>Requires parallel programming expertise</td></tr>
    <tr><td>Low communication latency (shared memory)</td><td>Synchronisation overhead; race conditions</td></tr>
  </tbody>
</table>

<h3>Distributed computing</h3>
<table>
  <thead><tr><th>Advantages</th><th>Disadvantages</th></tr></thead>
  <tbody>
    <tr><td>Scalability — add nodes as needed</td><td>Network latency and partial failures</td></tr>
    <tr><td>Fault tolerance — no single point of failure</td><td>Complexity: consistency, replication, synchronisation</td></tr>
    <tr><td>Geographic distribution</td><td>Harder to debug and secure</td></tr>
  </tbody>
</table>

<h2>1.16 Key Challenges</h2>
<ul>
  <li><strong>Synchronisation:</strong> coordinating access to shared resources.</li>
  <li><strong>Communication overhead:</strong> time spent sending data can exceed computation saved.</li>
  <li><strong>Load balancing:</strong> keeping all processors busy.</li>
  <li><strong>Fault tolerance:</strong> handling node or link failure.</li>
  <li><strong>Consistency:</strong> keeping replicated data identical.</li>
  <li><strong>Debugging:</strong> non-deterministic bugs (race conditions, deadlocks).</li>
</ul>

<div class="callout callout-real">
  <strong>Real-World Application</strong>
  Netflix delivers video globally by distributing copies of content to edge servers near users — reducing latency and avoiding a single central bottleneck.
</div>

<div class="callout callout-remember">
  <strong>Remember This</strong>
  Adding processors does not linearly reduce time: communication, synchronisation, and serial sections erode gains. Measure speedup and efficiency, not just core count.
</div>
`,
        definitions: [
          { term: "Throughput", definition: "Tasks completed per unit time." },
          { term: "Latency", definition: "Time from start to finish of a single task." },
          { term: "Load balancing", definition: "Distributing work evenly so no processor is idle while others are overloaded." },
        ],
        examPoints: [
          "List two advantages and two disadvantages of parallel computing.",
          "List two advantages and two disadvantages of distributed computing.",
          "Explain two key challenges in parallel/distributed systems.",
        ],
        knowledgeCheck: [
          { q: "Which challenge refers to keeping all processors busy with comparable work?", options: ["Synchronisation", "Load balancing", "Consistency", "Fault tolerance"], answer: 1 },
          { q: "True or false: Distributed systems have no single point of failure by default.", options: [], answer: null, type: "tf", correct: false },
          { q: "______ overhead is the time spent sending data between processors rather than computing.", options: [], answer: null, type: "fill", correct: "Communication" },
        ],
        resources: [
          { title: "Challenges in Parallel Computing", source: "University Lecture", url: "https://www.youtube.com/results?search_query=parallel+computing+challenges+lecture" },
        ],
      },
      {
        id: "m1-simulator",
        title: "Interactive Lab: Sequential vs Parallel",
        type: "simulator",
        simulator: "seq-par",
        objectives: [
          "Observe execution time for sequential vs parallel processing.",
          "Experiment with processor count, task count, and processing time.",
          "Connect observations to speedup and Amdahl's Law.",
        ],
        content: `
<h2>1.17 Interactive: Sequential vs Parallel Processing</h2>
<p>Imagine four workers and four independent tasks (e.g., washing four dishes). <strong>Sequentially</strong>, one worker washes each dish one after another. <strong>In parallel</strong>, four workers wash four dishes at the same time.</p>
<p>Use the controls to adjust the number of processors (workers), number of tasks, and time per task. The timeline shows how execution time changes.</p>

<div class="sim-panel">
  <div class="sim-header">Parallel Processing Visualiser</div>
  <div class="sim-body">
    <div class="sim-controls">
      <div class="sim-control">
        <label>Processors <span id="sp-p-val">4</span></label>
        <input type="range" id="sp-p" min="1" max="16" value="4">
      </div>
      <div class="sim-control">
        <label>Tasks <span id="sp-t-val">8</span></label>
        <input type="range" id="sp-t" min="1" max="40" value="8">
      </div>
      <div class="sim-control">
        <label>Time per task (s) <span id="sp-time-val">2</span></label>
        <input type="range" id="sp-time" min="1" max="10" value="2">
      </div>
      <div style="margin-top:auto;">
        <div style="font-size:0.8rem; color:var(--color-muted); margin-bottom:0.4rem;">Results</div>
        <div style="font-family:var(--font-mono); font-weight:700; color:var(--color-primary);">
          Sequential: <span id="sp-seq">—</span> s &nbsp;|&nbsp; Parallel: <span id="sp-par">—</span> s &nbsp;|&nbsp; Speedup: <span id="sp-up">—</span>×
        </div>
      </div>
    </div>
    <div class="sim-visual" id="sp-visual">
      <div class="sim-stage">Set the parameters to see workers process tasks</div>
    </div>
  </div>
  <div style="padding:0.75rem 1.25rem; border-top:1px solid var(--color-border); font-size:0.85rem; color:var(--color-muted); text-align:center;">
    Parallel time ≈ ⌈tasks / processors⌉ × time per task (ignoring overhead).
  </div>
</div>

<div class="callout callout-exam">
  <strong>Exam Alert</strong>
  Be able to compute parallel execution time as ceiling(tasks/processors) × time-per-task and derive speedup from sequential vs parallel time.
</div>
`,
        definitions: [],
        examPoints: [],
        knowledgeCheck: [],
        resources: [],
      },
    ],
  },

  /* ========================================================================
     MODULE 2 — PARALLEL PROCESSING ARCHITECTURES AND MODELS
     ======================================================================== */
  {
    id: "arch",
    title: "Parallel Processing Architectures and Models",
    short: "Flynn's Taxonomy, memory architectures, CPU vs GPU",
    icon: "2",
    color: "#145f43",
    description:
      "Flynn's Taxonomy (SISD, SIMD, MISD, MIMD), shared vs distributed memory, multicore, multiprocessor, GPU, interconnection networks.",
    totalLessons: 4,
    lessons: [
      {
        id: "m2-flynn",
        title: "Flynn's Taxonomy",
        type: "notes",
        objectives: [
          "Explain Flynn's Taxonomy and its two dimensions (instruction stream, data stream).",
          "Describe SISD, SIMD, MISD, and MIMD with examples.",
          "Identify real-world systems for each class.",
        ],
        content: `
<h2>2.1 Flynn's Taxonomy (1966)</h2>
<p>Michael Flynn classified computer architectures by two independent dimensions:</p>
<ul>
  <li><strong>Instruction stream:</strong> the sequence of instructions executed — one (single) or many (multiple).</li>
  <li><strong>Data stream:</strong> the data operated on — one (single) or many (multiple).</li>
</ul>
<p>This yields four classes: <strong>SISD, SIMD, MISD, MIMD</strong>.</p>

<div class="callout callout-def">
  <strong>Important Definition</strong>
  Flynn's Taxonomy classifies architectures by the number of instruction streams and data streams: Single/Multiple Instruction, Single/Multiple Data.
</div>

<h3>SISD — Single Instruction, Single Data</h3>
<p>One processor executes one instruction stream operating on one data stream. This is the classic sequential von Neumann computer.</p>
<ul><li><strong>Example:</strong> A simple microcontroller, early single-core PC.</li><li><strong>Use case:</strong> Sequential programs, control logic.</li></ul>

<h3>SIMD — Single Instruction, Multiple Data</h3>
<p>One instruction is broadcast to many processing elements, each operating on its own data item simultaneously.</p>
<ul><li><strong>Example:</strong> GPU pixel shaders, vector processors, SSE/AVX instructions on CPUs.</li><li><strong>Use case:</strong> Image processing, multimedia, scientific arrays where the same operation applies to many data elements.</li></ul>

<h3>MISD — Multiple Instruction, Single Data</h3>
<p>Many processors execute different instructions on the same data stream. Rare in practice.</p>
<ul><li><strong>Example:</strong> Redundant fault-tolerant systems (same sensor data processed by different algorithms for cross-checking), systolic arrays in some implementations.</li><li><strong>Use case:</strong> Safety-critical redundancy, cryptography.</li></ul>

<div class="callout callout-confusion">
  <strong>Common Confusion</strong>
  SIMD: one instruction, many data (e.g., "add 5 to every pixel"). MIMD: many instructions, many data (each core runs its own program on its own data). MISD is rarely used — do not confuse it with SIMD.
</div>

<h3>MIMD — Multiple Instruction, Multiple Data</h3>
<p>Multiple processors, each executing its own instruction stream on its own data. This is the most general and common parallel class today.</p>
<ul><li><strong>Example:</strong> Multicore CPUs, computer clusters, cloud servers.</li><li><strong>Use case:</strong> General-purpose parallel computing, databases, servers.</li></ul>

<table>
  <thead><tr><th>Class</th><th>Instructions</th><th>Data</th><th>Example</th><th>Typical Use</th></tr></thead>
  <tbody>
    <tr><td>SISD</td><td>Single</td><td>Single</td><td>Classic PC (single core)</td><td>Sequential programs</td></tr>
    <tr><td>SIMD</td><td>Single</td><td>Multiple</td><td>GPU shader, AVX vector</td><td>Image/video processing</td></tr>
    <tr><td>MISD</td><td>Multiple</td><td>Single</td><td>Fault-tolerant redundant checker</td><td>Safety-critical systems</td></tr>
    <tr><td>MIMD</td><td>Multiple</td><td>Multiple</td><td>Multicore CPU, cluster</td><td>General parallel computing</td></tr>
  </tbody>
</table>

<div class="callout callout-exam">
  <strong>Exam Alert</strong>
  Be ready to draw Flynn's 2×2 matrix, define each cell, and give an example. A very common exam question: "Classify a GPU" → answer: SIMD (or SIMT in CUDA terminology).
</div>

<h2>2.2 Interactive: Flynn's Taxonomy Explorer</h2>
<p>Select an architecture class to see how instructions and data flow through the system.</p>
<div class="sim-panel">
  <div class="sim-header">Flynn's Taxonomy Flow Explorer</div>
  <div class="sim-body" style="grid-template-columns: 260px 1fr;">
    <div class="sim-controls">
      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        <div style="font-weight:600;font-size:var(--fs-sm);color:var(--color-text);margin-bottom:0.5rem;">Select architecture</div>
        <button class="btn btn-outline btn-sm btn-full" onclick="Lab.setFlynn('sisd')" id="flynn-sisd">SISD</button>
        <button class="btn btn-outline btn-sm btn-full" onclick="Lab.setFlynn('simd')" id="flynn-simd">SIMD</button>
        <button class="btn btn-outline btn-sm btn-full" onclick="Lab.setFlynn('misd')" id="flynn-misd">MISD</button>
        <button class="btn btn-outline btn-sm btn-full" onclick="Lab.setFlynn('mimd')" id="flynn-mimd">MIMD</button>
      </div>
      <div class="callout callout-tech" style="margin-top:1.5rem; font-size:0.8rem;">
        <strong id="flynn-desc"></strong>
      </div>
    </div>
    <div class="sim-visual" id="flynn-visual" style="min-height:260px;">
      <div class="sim-stage">Select an architecture to view its flow</div>
    </div>
  </div>
  <div style="padding:0.75rem 1.25rem;border-top:1px solid var(--color-border);font-size:0.85rem;color:var(--color-muted);text-align:center;">
    Instruction stream →  Data stream →  Processing elements
  </div>
</div>
`,
        definitions: [
          { term: "SISD", definition: "Single Instruction, Single Data — sequential von Neumann architecture." },
          { term: "SIMD", definition: "Single Instruction, Multiple Data — one instruction applied to many data items." },
          { term: "MISD", definition: "Multiple Instruction, Single Data — multiple instructions on the same data (rare)." },
          { term: "MIMD", definition: "Multiple Instruction, Multiple Data — independent processors, general-purpose parallel." },
        ],
        examPoints: [
          "Draw and explain Flynn's Taxonomy matrix.",
          "Define SISD, SIMD, MISD, MIMD with examples.",
          "Classify a GPU and a multicore CPU.",
        ],
        knowledgeCheck: [
          { q: "A GPU applying the same shader to millions of pixels is an example of:", options: ["SISD", "SIMD", "MISD", "MIMD"], answer: 1 },
          { q: "True or false: MIMD is the most common parallel architecture in modern servers.", options: [], answer: null, type: "tf", correct: true },
          { q: "MISD stands for Multiple Instruction, ______ Data.", options: [], answer: null, type: "fill", correct: "Single" },
        ],
        resources: [
          { title: "Flynn's Taxonomy", source: "Neso Academy", url: "https://www.youtube.com/results?search_query=flynn+taxonomy+neso+academy" },
        ],
      },
      {
        id: "m2-memory",
        title: "Memory Architectures: Shared, Distributed, Hybrid",
        type: "notes",
        objectives: [
          "Compare shared-memory, distributed-memory, and hybrid architectures.",
          "Explain UMA and NUMA.",
          "Describe multicore, multiprocessor, and MPP systems.",
        ],
        content: `
<h2>2.3 Shared-Memory Architecture</h2>
<p>All processors access a single, common memory space. Processors communicate by reading and writing shared variables.</p>
<ul>
  <li><strong>UMA (Uniform Memory Access):</strong> All processors have equal access time to all memory. Typical of symmetric multiprocessors.</li>
  <li><strong>NUMA (Non-Uniform Memory Access):</strong> Each processor has local memory it accesses faster; remote memory is slower. Scales better than UMA.</li>
</ul>
<div class="callout callout-def">
  <strong>Important Definition</strong>
  Shared-memory architecture: processors share a single address space and communicate through memory reads/writes rather than explicit messages.
</div>
<h3>Pros / Cons</h3>
<table>
  <thead><tr><th>Advantages</th><th>Disadvantages</th></tr></thead>
  <tbody>
    <tr><td>Simple programming model (load/store)</td><td>Contention on shared memory; scalability limited</td></tr>
    <tr><td>Fast communication via memory</td><td>Cache coherence complexity</td></tr>
  </tbody>
</table>

<h2>2.4 Distributed-Memory Architecture</h2>
<p>Each processor has its own private memory. Processors communicate only by passing messages over a network. No processor can directly access another's memory.</p>
<ul><li><strong>Example:</strong> Computer clusters, cloud data centres.</li><li><strong>Programming model:</strong> Message Passing Interface (MPI).</li></ul>
<h3>Pros / Cons</h3>
<table>
  <thead><tr><th>Advantages</th><th>Disadvantages</th></tr></thead>
  <tbody>
    <tr><td>Scales to thousands of nodes</td><td>Higher latency; explicit message passing</td></tr>
    <tr><td>No memory contention</td><td>Harder to program; partial failures</td></tr>
  </tbody>
</table>

<h2>2.5 Hybrid-Memory Architecture</h2>
<p>Combines shared-memory nodes (e.g., multicore CPUs) connected by a network. Within a node, threads share memory; between nodes, processes pass messages. This is the dominant design in modern supercomputers.</p>

<h2>2.6 Multicore, Multiprocessor, MPP</h2>
<ul>
  <li><strong>Multicore:</strong> Multiple cores on one chip, sharing caches and memory.</li>
  <li><strong>Multiprocessor (SMP):</strong> Multiple processor chips/cores sharing memory via a bus; symmetric (all equal).</li>
  <li><strong>Massively Parallel Processing (MPP):</strong> Many nodes, each with its own processor and memory, connected by a high-speed network.</li>
</ul>

<div class="callout callout-confusion">
  <strong>Common Confusion</strong>
  A <strong>multicore</strong> chip is one processor with several cores. A <strong>multiprocessor</strong> system has several processor chips. Modern servers are often both: multiple multicore chips (NUMA).
</div>

<h2>2.7 GPU Computing</h2>
<p>Graphics Processing Units contain thousands of small, efficient cores designed for data-parallel work. CPUs have a few powerful cores optimised for sequential, branch-heavy code.</p>
<table>
  <thead><tr><th>Feature</th><th>CPU</th><th>GPU</th></tr></thead>
  <tbody>
    <tr><td>Cores</td><td>Few (2–64), powerful</td><td>Thousands, simple</td></tr>
    <tr><td>Optimised for</td><td>Latency, complex control</td><td>Throughput, data parallelism</td></tr>
    <tr><td>Threads</td><td>Heavyweight</td><td>Lightweight</td></tr>
    <tr><td>Memory</td><td>Large cache, low latency</td><td>High bandwidth, high latency</td></tr>
  </tbody>
</table>
<div class="callout callout-real">
  <strong>Real-World Application</strong>
  GPUs train deep-learning models (matrix multiplications) and render video game frames — both are data-parallel workloads.
</div>

<div class="callout callout-exam">
  <strong>Exam Alert</strong>
  Contrast shared vs distributed memory (communication: load/store vs message passing), and CPU vs GPU (latency-optimised vs throughput-optimised).
</div>

<h2>2.8 Memory Hierarchy and Interconnection Networks</h2>
<ul>
  <li><strong>Hierarchy:</strong> registers → L1/L2/L3 cache → RAM → disk. Parallel systems add cache coherence protocols (MESI) to keep caches consistent.</li>
  <li><strong>Interconnection networks:</strong> buses, crossbars, meshes, toruses, fat trees, InfiniBand — connect processors and memory; bandwidth and latency determine scalability.</li>
</ul>
`,
        definitions: [
          { term: "UMA", definition: "Uniform Memory Access — equal memory access time from all processors." },
          { term: "NUMA", definition: "Non-Uniform Memory Access — local memory faster than remote." },
          { term: "SMP", definition: "Symmetric Multiprocessing — multiple processors sharing memory equally." },
          { term: "MPP", definition: "Massively Parallel Processing — many nodes, private memory, network-connected." },
          { term: "Cache coherence", definition: "Keeping multiple caches consistent when they share memory." },
        ],
        examPoints: [
          "Compare shared-memory vs distributed-memory architecture.",
          "Explain UMA and NUMA.",
          "Compare CPU vs GPU architecture.",
          "Describe multicore, SMP, and MPP.",
        ],
        knowledgeCheck: [
          { q: "In which architecture do processors communicate only by message passing?", options: ["Shared memory", "Distributed memory", "Hybrid memory", "SMP"], answer: 1 },
          { q: "True or false: NUMA gives every processor equal memory access time.", options: [], answer: null, type: "tf", correct: false },
          { q: "A GPU is optimised for ______ rather than low latency on complex control flow.", options: [], answer: null, type: "fill", correct: "throughput" },
        ],
        resources: [
          { title: "Shared vs Distributed Memory", source: "Neso Academy", url: "https://www.youtube.com/results?search_query=shared+memory+vs+distributed+memory+neso+academy" },
          { title: "CPU vs GPU", source: "NVIDIA", url: "https://www.nvidia.com/en-us/glossary/graphics-processing-unit/" },
        ],
      },
      {
        id: "m2-interconnect",
        title: "Interconnection Networks",
        type: "notes",
        objectives: [
          "Describe common interconnection network topologies.",
          "Explain how network choice affects parallel performance.",
        ],
        content: `
<h2>2.9 Interconnection Networks</h2>
<p>The network that connects processors, memory, and I/O in a parallel system. Its bandwidth, latency, and bisection width determine how well the system scales.</p>
<h3>Common topologies</h3>
<table>
  <thead><tr><th>Topology</th><th>Description</th><th>Pros</th><th>Cons</th></tr></thead>
  <tbody>
    <tr><td>Bus</td><td>All nodes share one communication line</td><td>Simple, cheap</td><td>Contention; does not scale</td></tr>
    <tr><td>Crossbar</td><td>Any input can connect to any output simultaneously</td><td>High bandwidth, non-blocking</td><td>Expensive (N² switches)</td></tr>
    <tr><td>Mesh</td><td>Nodes in a grid, each connected to neighbours</td><td>Scalable, simple wiring</td><td>Diameter grows with network size</td></tr>
    <tr><td>Fat tree</td><td>Hierarchical tree with higher bandwidth near root</td><td>Good scalability, used in HPC</td><td>Complex cabling</td></tr>
  </tbody>
</table>

<div class="callout callout-tech">
  <strong>Technical Detail</strong>
  <strong>Bisection bandwidth</strong> is the minimum bandwidth between two halves of the network. It upper-bounds how much data can move between processor groups simultaneously — a key scalability metric.
</div>

<h2>2.10 Summary Comparison: Shared vs Distributed Memory</h2>
<table>
  <thead><tr><th></th><th>Shared Memory</th><th>Distributed Memory</th></tr></thead>
  <tbody>
    <tr><td>Communication</td><td>Load/store (memory)</td><td>Message passing (network)</td></tr>
    <tr><td>Programming model</td><td>Threads / OpenMP</td><td>MPI</td></tr>
    <tr><td>Scalability</td><td>Limited (contention, coherence)</td><td>High (thousands of nodes)</td></tr>
    <tr><td>Latency</td><td>Low</td><td>Higher</td></tr>
  </tbody>
</table>

<div class="callout callout-remember">
  <strong>Remember This</strong>
  Choose shared memory for tightly coupled, low-latency work on one machine; choose distributed memory (clusters/cloud) when you need to scale beyond a single system.
</div>

<h2>2.11 Interactive: Shared vs Distributed Memory</h2>
<p>Switch between the two dominant memory models and compare how processors communicate, what the programmer must manage, and where each model stops scaling.</p>
<div class="sim-panel">
  <div class="sim-header">Memory Architecture Explorer</div>
  <div class="sim-body" style="grid-template-columns:280px 1fr;">
    <div class="sim-controls">
      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        <button class="btn btn-primary btn-sm btn-full" onclick="Lab.selectSDM('shared')" id="sdm-shared">Shared memory</button>
        <button class="btn btn-outline btn-sm btn-full" onclick="Lab.selectSDM('distributed')" id="sdm-distributed">Distributed memory</button>
      </div>
      <div class="callout callout-tech" style="font-size:0.78rem;">
        <strong id="sdm-desc">All processors share one physical address space. Communication is an ordinary load or store.</strong>
      </div>
      <div style="margin-top:auto;font-family:var(--font-mono);font-size:0.78rem;color:var(--color-muted);" id="sdm-stat">UMA · load/store · OpenMP threads</div>
    </div>
    <div class="sim-visual" id="sdm-visual" style="min-height:320px;">
      <div class="sim-stage">Select a memory model</div>
    </div>
  </div>
</div>
`,
        definitions: [
          { term: "Bisection bandwidth", definition: "Minimum bandwidth across a network cut; bounds parallel scalability." },
          { term: "Fat tree", definition: "Tree topology with increased bandwidth near the root to reduce congestion." },
        ],
        examPoints: [
          "Name and compare three interconnection topologies.",
          "Explain bisection bandwidth and why it matters.",
          "Compare shared vs distributed memory in a table.",
        ],
        knowledgeCheck: [
          { q: "Which topology connects every input to every output simultaneously but is expensive (N²)?", options: ["Bus", "Crossbar", "Mesh", "Fat tree"], answer: 1 },
          { q: "True or false: Bisection bandwidth upper-bounds parallel scalability.", options: [], answer: null, type: "tf", correct: true },
          { q: "OpenMP is typically used with ______ memory systems.", options: [], answer: null, type: "fill", correct: "shared" },
        ],
        resources: [
          { title: "Interconnection Networks", source: "University Lecture", url: "https://www.youtube.com/results?search_query=interconnection+networks+parallel+computing+lecture" },
        ],
      },
    ],
  },

  /* ========================================================================
     MODULE 3 — DISTRIBUTED SYSTEMS ARCHITECTURE
     ======================================================================== */
  {
    id: "dist",
    title: "Distributed Systems Architecture",
    short: "Client-server, P2P, tiers, SOA, microservices, transparency",
    icon: "3",
    color: "#0b3d2e",
    description:
      "Client-server, peer-to-peer, three-tier, N-tier, SOA, microservices, RPC/RMI, middleware, transparency types.",
    totalLessons: 4,
    lessons: [
      {
        id: "m3-client-server",
        title: "Client-Server Architecture",
        type: "notes",
        objectives: [
          "Describe client-server architecture and component roles.",
          "Explain the request-response cycle.",
          "Compare thin vs thick clients.",
        ],
        content: `
<h2>3.1 Client-Server Architecture</h2>
<p>A distributed application structure that partitions tasks between <strong>servers</strong> (resource providers) and <strong>clients</strong> (service requesters). Clients initiate requests; servers listen and respond.</p>
<div class="callout callout-def">
  <strong>Important Definition</strong>
  Client-server architecture: clients request services and servers provide them; communication is request-response, usually over a network.
</div>
<h3>Components</h3>
<table>
  <thead><tr><th>Component</th><th>Responsibility</th></tr></thead>
  <tbody>
    <tr><td><strong>Client</strong></td><td>Initiates requests, presents the user interface, handles user input.</td></tr>
    <tr><td><strong>Server</strong></td><td>Stores data/logic, processes requests, returns responses; typically always-on.</td></tr>
    <tr><td><strong>Network</strong></td><td>Carries requests and responses (e.g., TCP/IP, HTTP).</td></tr>
  </tbody>
</table>

<h3>Request-response cycle</h3>
<ol>
  <li>Client sends a request (e.g., HTTP GET) to the server.</li>
  <li>Server receives, processes, and may query a database.</li>
  <li>Server returns a response (e.g., HTML/JSON + status code).</li>
  <li>Client renders the response for the user.</li>
</ol>

<h3>Thin vs Thick client</h3>
<table>
  <thead><tr><th></th><th>Thin client</th><th>Thick (fat) client</th></tr></thead>
  <tbody>
    <tr><td>Processing</td><td>Mostly on server</td><td>Significant logic on client</td></tr>
    <tr><td>Deployment</td><td>Browser — easy to update</td><td>Installed app — harder to update</td></tr>
    <tr><td>Example</td><td>Webmail</td><td>Desktop video editor</td></tr>
  </tbody>
</table>

<div class="callout callout-real">
  <strong>Real-World Application</strong>
  A website: your browser (client) requests pages from a web server, which may query a database server and return HTML.
</div>

<div class="callout callout-exam">
  <strong>Exam Alert</strong>
  Draw a labelled client-server diagram: client, network, application server, database server. Explain each component's role and the request-response flow.
</div>

<h2>3.2 Interactive: Client-Server Explorer</h2>
<p>Click a component to see its responsibilities and how it communicates with the others.</p>
<div class="sim-panel">
  <div class="sim-header">Client-Server Architecture Explorer</div>
  <div class="sim-body" style="grid-template-columns: 300px 1fr;">
    <div class="sim-controls">
      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        <div style="font-weight:600;font-size:var(--fs-sm);color:var(--color-text);margin-bottom:0.5rem;">Select component</div>
        <button class="btn btn-outline btn-sm btn-full" onclick="Lab.selectCS('client')" id="cs-client">Client</button>
        <button class="btn btn-outline btn-sm btn-full" onclick="Lab.selectCS('appserver')" id="cs-appserver">Application Server</button>
        <button class="btn btn-outline btn-sm btn-full" onclick="Lab.selectCS('dbserver')" id="cs-dbserver">Database Server</button>
        <button class="btn btn-outline btn-sm btn-full" onclick="Lab.selectCS('network')" id="cs-network">Network</button>
      </div>
      <div class="callout callout-tech" style="margin-top:1.5rem;font-size:0.8rem;">
        <strong id="cs-role"></strong>
      </div>
    </div>
    <div class="sim-visual" id="cs-visual" style="min-height:300px;">
      <div class="sim-stage">Click a component to view its role</div>
    </div>
  </div>
  <div style="padding:0.75rem 1.25rem;border-top:1px solid var(--color-border);font-size:0.85rem;color:var(--color-muted);text-align:center;">
    Client ↔ Network ↔ Application Server ↔ Database Server
  </div>
</div>
`,
        definitions: [
          { term: "Client", definition: "Process that initiates requests for services." },
          { term: "Server", definition: "Process that provides services, usually always-on." },
          { term: "Thin client", definition: "Client with little logic; server does most processing." },
        ],
        examPoints: [
          "Draw and label a client-server architecture diagram.",
          "Explain roles of client, server, and network.",
          "Compare thin and thick clients.",
        ],
        knowledgeCheck: [
          { q: "Which component initiates requests in client-server architecture?", options: ["Server", "Client", "Database", "Network"], answer: 1 },
          { q: "True or false: Thin clients do most processing locally.", options: [], answer: null, type: "tf", correct: false },
          { q: "The ______ carries requests and responses between client and server.", options: [], answer: null, type: "fill", correct: "network" },
        ],
        resources: [
          { title: "Client-Server Architecture", source: "Neso Academy", url: "https://www.youtube.com/results?search_query=client+server+architecture+neso+academy" },
        ],
      },
      {
        id: "m3-p2p-tiers",
        title: "Peer-to-Peer, Multi-Tier, SOA, Microservices",
        type: "notes",
        objectives: [
          "Describe peer-to-peer architecture and contrast with client-server.",
          "Explain three-tier and N-tier architecture.",
          "Compare SOA and microservices.",
        ],
        content: `
<h2>3.3 Peer-to-Peer (P2P) Architecture</h2>
<p>Every node (peer) can act as both client and server. There is no central server; peers share resources directly with each other.</p>
<div class="callout callout-def">
  <strong>Important Definition</strong>
  Peer-to-peer architecture: a decentralised model in which each node functions as both client and server, sharing resources without a central coordinator.
</div>
<h3>Pure vs Hybrid P2P</h3>
<table>
  <thead><tr><th></th><th>Pure P2P</th><th>Hybrid P2P</th></tr></thead>
  <tbody>
    <tr><td>Central server</td><td>None</td><td>Used for indexing/discovery only</td></tr>
    <tr><td>Example</td><td>Early Gnutella</td><td>Napster (central index), BitTorrent (tracker)</td></tr>
    <tr><td>Resilience</td><td>High — no single point of failure</td><td>Moderate — index server can fail</td></tr>
  </tbody>
</table>
<h3>Pros / Cons</h3>
<table>
  <thead><tr><th>Advantages</th><th>Disadvantages</th></tr></thead>
  <tbody>
    <tr><td>No single point of failure</td><td>Harder to secure and manage</td></tr>
    <tr><td>Scalable — each peer adds capacity</td><td>Quality and availability of content vary</td></tr>
    <tr><td>Cheap — no central infrastructure</td><td>Legal/copyright issues (file sharing)</td></tr>
  </tbody>
</table>

<div class="callout callout-real">
  <strong>Real-World Application</strong>
  BitTorrent: peers download pieces of a file from many other peers simultaneously, then upload pieces to others — no central server holds the whole file.
</div>

<h2>3.4 Three-Tier and N-Tier Architecture</h2>
<h3>Three-tier</h3>
<ol>
  <li><strong>Presentation tier:</strong> client UI (browser or app).</li>
  <li><strong>Application tier:</strong> business logic (application server).</li>
  <li><strong>Data tier:</strong> database server.</li>
</ol>
<h3>N-tier</h3>
<p>Extends three-tier by splitting application logic into more layers (e.g., web server, application server, services, database) for greater flexibility and scalability.</p>
<table>
  <thead><tr><th>Tier</th><th>Responsibility</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>Presentation</td><td>User interface</td><td>Browser, mobile app</td></tr>
    <tr><td>Application / business logic</td><td>Processing rules</td><td>Application server</td></tr>
    <tr><td>Data</td><td>Storage</td><td>Database server</td></tr>
  </tbody>
</table>

<div class="callout callout-exam">
  <strong>Exam Alert</strong>
  Be able to draw a three-tier diagram and explain why separating tiers improves maintainability and scalability (e.g., upgrade the database without changing the UI).
</div>

<h2>3.5 SOA and Microservices</h2>
<h3>Service-Oriented Architecture (SOA)</h3>
<p>Applications built as reusable services that communicate over a network, often via SOAP/ESB (Enterprise Service Bus). Services are coarse-grained and shared across applications.</p>
<h3>Microservices</h3>
<p>Applications decomposed into small, independent, loosely coupled services, each with its own database, communicating via lightweight protocols (HTTP/REST, gRPC).</p>
<table>
  <thead><tr><th></th><th>SOA</th><th>Microservices</th></tr></thead>
  <tbody>
    <tr><td>Service size</td><td>Coarse-grained</td><td>Fine-grained</td></tr>
    <tr><td>Communication</td><td>ESB, SOAP</td><td>REST/gRPC, lightweight</td></tr>
    <tr><td>Database</td><td>Often shared</td><td>One per service</td></tr>
    <tr><td>Deployment</td><td>Monolithic-ish</td><td>Independent per service</td></tr>
  </tbody>
</table>

<div class="callout callout-confusion">
  <strong>Common Confusion</strong>
  SOA services are often enterprise-wide and share an ESB; microservices are application-scoped, independently deployable, and avoid a central bus ("smart endpoints, dumb pipes").
</div>

<h2>3.6 Communication: Message Passing, RPC, RMI</h2>
<h3>Message passing</h3>
<p>Processes send explicit messages to each other over a network. The sender and receiver must agree on a message format.</p>
<h3>Remote Procedure Call (RPC)</h3>
<p>A client calls a procedure on a remote machine as if it were local. A stub marshals arguments, sends them over the network, and unmarshals the result.</p>
<h3>Remote Method Invocation (RMI)</h3>
<p>The Java-specific equivalent of RPC: invoking methods on remote objects.</p>
<table>
  <thead><tr><th></th><th>Message Passing</th><th>RPC / RMI</th></tr></thead>
  <tbody>
    <tr><td>Style</td><td>Explicit send/receive</td><td>Procedure/method call abstraction</td></tr>
    <tr><td>Coupling</td><td>Loose</td><td>Tighter (client stub depends on server interface)</td></tr>
    <tr><td>Example</td><td>MPI, sockets</td><td>gRPC, Java RMI</td></tr>
  </tbody>
</table>

<div class="callout callout-tech">
  <strong>Technical Detail</strong>
  <strong>Middleware</strong> is software between the OS and applications that enables communication and coordination in distributed systems (e.g., message queues, RPC frameworks, transaction monitors).
</div>

<h2>3.7 Interactive: Peer-to-Peer Demo</h2>
<p>Observe multiple computers exchanging messages directly, without a central server. Click "Add peer" to grow the network and "Send message" to watch gossip-style dissemination.</p>
<div class="sim-panel">
  <div class="sim-header">Peer-to-Peer Network Demo</div>
  <div class="sim-body" style="grid-template-columns: 300px 1fr;">
    <div class="sim-controls">
      <button class="btn btn-primary btn-sm btn-full" onclick="Lab.p2pAddPeer()">Add peer</button>
      <button class="btn btn-secondary btn-sm btn-full" onclick="Lab.p2pSend()">Send message</button>
      <button class="btn btn-outline btn-sm btn-full" onclick="Lab.p2pReset()">Reset</button>
      <div style="margin-top:auto;font-family:var(--font-mono);font-size:0.8rem;color:var(--color-muted);" id="p2p-stat">Peers: 3 · Messages: 0</div>
    </div>
    <div class="sim-visual" id="p2p-visual" style="min-height:300px;">
      <div class="sim-stage">Add peers to build the network</div>
    </div>
  </div>
  <div style="padding:0.75rem 1.25rem;border-top:1px solid var(--color-border);font-size:0.85rem;color:var(--color-muted);text-align:center;">
    No central server — peers forward messages to neighbours until all receive them.
  </div>
</div>
`,
        definitions: [
          { term: "Peer-to-peer", definition: "Decentralised model where nodes are both clients and servers." },
          { term: "RPC", definition: "Remote Procedure Call — calling a procedure on a remote machine as if local." },
          { term: "RMI", definition: "Remote Method Invocation — Java's remote object method call mechanism." },
          { term: "Middleware", definition: "Software layer enabling distributed communication and coordination." },
        ],
        examPoints: [
          "Compare client-server vs peer-to-peer architecture.",
          "Draw a three-tier architecture and label each tier.",
          "Compare SOA vs microservices.",
          "Explain RPC and how it differs from raw message passing.",
        ],
        knowledgeCheck: [
          { q: "In a pure P2P network there is:", options: ["A central server", "No central server", "Exactly two servers", "A database only"], answer: 1 },
          { q: "True or false: In microservices, each service usually has its own database.", options: [], answer: null, type: "tf", correct: true },
          { q: "RPC lets a client call a procedure on a remote machine as if it were ______.", options: [], answer: null, type: "fill", correct: "local" },
        ],
        resources: [
          { title: "Peer-to-Peer Architecture", source: "IBM Technology", url: "https://www.youtube.com/results?search_query=peer+to+peer+architecture+IBM+Technology" },
          { title: "Microservices vs SOA", source: "Google Cloud", url: "https://cloud.google.com/learn/microservices-vs-monolithic" },
        ],
      },
      {
        id: "m3-transparency",
        title: "Transparency in Distributed Systems",
        type: "notes",
        objectives: [
          "Define transparency in distributed systems.",
          "List and explain the seven types of transparency.",
          "Explain why transparency matters.",
        ],
        content: `
<h2>3.8 Transparency in Distributed Systems</h2>
<p><strong>Transparency</strong> means hiding the distributed nature of the system from users and applications — the system should appear as a single coherent whole.</p>
<div class="callout callout-def">
  <strong>Important Definition</strong>
  Transparency: the degree to which distribution details (location, replication, failure, concurrency) are concealed from users and application programs.
</div>

<h3>The seven transparencies</h3>
<table>
  <thead><tr><th>Type</th><th>What is hidden</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td><strong>Access</strong></td><td>Differences in data representation and access methods</td><td>Same interface for local and remote files</td></tr>
    <tr><td><strong>Location</strong></td><td>Where a resource is physically located</td><td>Accessing a file without knowing its server</td></tr>
    <tr><td><strong>Migration</strong></td><td>That a resource may move to another node</td><td>Print job moved to a less busy printer</td></tr>
    <tr><td><strong>Replication</strong></td><td>That resources are copied on several nodes</td><td>Reading from any replica without knowing copies exist</td></tr>
    <tr><td><strong>Concurrency</strong></td><td>That multiple users share resources simultaneously</td><td>File locking so edits don't clash</td></tr>
    <tr><td><strong>Failure</strong></td><td>Faults and recovery of nodes</td><td>Retrying transparently after a server restarts</td></tr>
    <tr><td><strong>Persistence</strong></td><td>Whether a resource is in memory or on disk</td><td>Opening a file without knowing its storage medium</td></tr>
  </tbody>
</table>

<div class="callout callout-exam">
  <strong>Exam Alert</strong>
  You may be asked to list all seven transparencies with one-sentence explanations and examples. Learn them as a set.
</div>

<h2>3.9 Distributed Nodes and Communication</h2>
<p>A <strong>node</strong> is an independent computing element (machine, VM, container) in the system. Nodes communicate via message passing over network protocols (TCP/IP, UDP, HTTP).</p>
<p><strong>Synchronisation</strong> coordinates actions across nodes (e.g., logical clocks, Lamport timestamps) because there is no global clock.</p>
<p><strong>Consistency</strong> ensures that replicas of data agree; models range from strong consistency (linearizability) to eventual consistency.</p>

<div class="callout callout-remember">
  <strong>Remember This</strong>
  Transparency is a spectrum — perfect transparency is impossible (the CAP theorem reminds us network partitions force trade-offs between consistency and availability).
</div>
`,
        definitions: [
          { term: "Transparency", definition: "Hiding distribution details from users and applications." },
          { term: "Location transparency", definition: "Accessing resources without knowing where they are." },
          { term: "Failure transparency", definition: "Hiding faults and recovery from users." },
        ],
        examPoints: [
          "Define transparency and list the seven types with examples.",
          "Explain location transparency vs replication transparency.",
          "Explain why no global clock exists in distributed systems.",
        ],
        knowledgeCheck: [
          { q: "Hiding the physical location of a resource is ______ transparency.", options: ["Access", "Location", "Migration", "Failure"], answer: 1 },
          { q: "True or false: Failure transparency hides node crashes and restarts from users.", options: [], answer: null, type: "tf", correct: true },
          { q: "The ______ transparency hides that a resource has copies on several nodes.", options: [], answer: null, type: "fill", correct: "replication" },
        ],
        resources: [
          { title: "Transparency in Distributed Systems", source: "University Lecture", url: "https://www.youtube.com/results?search_query=transparency+distributed+systems+lecture" },
        ],
      },
    ],
  },

  /* ========================================================================
     MODULE 4 — PARALLEL ALGORITHMS AND PROGRAMMING MODELS
     ======================================================================== */
  {
    id: "algo",
    title: "Parallel Algorithms and Programming Models",
    short: "Algorithm design, performance analysis, MPI, OpenMP and CUDA",
    icon: "4",
    color: "#155239",
    description:
      "Parallel algorithm design, decomposition, synchronisation, performance analysis, and the MPI, OpenMP and CUDA programming models.",
    totalLessons: 7,
    lessons: [
      {
        id: "m4-decomposition",
        title: "Algorithm Design: Decomposition and Parallelism",
        type: "notes",
        objectives: [
          "Compare sequential vs parallel algorithms.",
          "Explain task decomposition and data decomposition.",
          "Distinguish task parallelism from data parallelism.",
          "Analyze dependency analysis.",
        ],
        content: `
<h2>4.1 Sequential vs Parallel Algorithms</h2>
<p>A <strong>sequential algorithm</strong> specifies steps executed one after another. A <strong>parallel algorithm</strong> specifies steps that can execute simultaneously on multiple processors, plus the synchronisation needed between them.</p>
<table>
  <thead><tr><th></th><th>Sequential algorithm</th><th>Parallel algorithm</th></tr></thead>
  <tbody>
    <tr><td>Execution</td><td>One step at a time</td><td>Multiple steps simultaneously</td></tr>
    <tr><td>Focus</td><td>Correctness, minimising operations</td><td>Correctness + minimising critical path (span)</td></tr>
    <tr><td>Example</td><td>Binary search on a sorted array</td><td>Parallel sum / parallel prefix sum</td></tr>
  </tbody>
</table>

<div class="callout callout-def">
  <strong>Important Definition</strong>
  Task decomposition: breaking a problem into separate tasks that can be executed in parallel. Data decomposition: breaking data into chunks and applying the same operation to each chunk.
</div>

<h2>4.2 Task Parallelism vs Data Parallelism</h2>
<table>
  <thead><tr><th></th><th>Task parallelism</th><th>Data parallelism</th></tr></thead>
  <tbody>
    <tr><td>Idea</td><td>Different tasks run concurrently</td><td>Same operation on many data items</td></tr>
    <tr><td>Example</td><td>One core decodes video, another encodes audio</td><td>Adding 5 to every element of an array</td></tr>
    <tr><td>Granularity</td><td>Coarse (whole functions)</td><td>Fine (array elements)</td></tr>
  </tbody>
</table>

<h2>4.3 Dependency Analysis</h2>
<p>Before parallelising, determine which steps depend on others. If step B needs step A's result, B cannot start until A finishes — this limits parallelism. Dependencies form a <strong>directed acyclic graph (DAG)</strong> of tasks.</p>
<ul>
  <li><strong>Independent tasks:</strong> can run in parallel (embarrassingly parallel).</li>
  <li><strong>Dependent tasks:</strong> must be ordered; define the critical path.</li>
</ul>

<div class="callout callout-tech">
  <strong>Technical Detail</strong>
  <strong>Work</strong> = total operations across all processors. <strong>Span</strong> = length of the longest chain of dependencies (critical path). Ideal parallel time ≈ span; speedup ≤ work / span.
</div>

<h2>4.4 Synchronisation, Communication Overhead, Load Balancing</h2>
<ul>
  <li><strong>Synchronisation:</strong> coordinating threads/processes (locks, barriers, atomic operations). Costs time — must be minimised.</li>
  <li><strong>Communication overhead:</strong> time spent sending data between processors. If it exceeds computation saved, parallelisation hurts.</li>
  <li><strong>Load balancing:</strong> distributing work evenly so no processor idles while others are overloaded.</li>
</ul>

<div class="callout callout-confusion">
  <strong>Common Confusion</strong>
  Parallelism is not always faster: spawning threads, synchronising, and communicating have costs. For tiny tasks, sequential execution can win.
</div>

<h2>4.5 Race Conditions and Deadlocks</h2>
<h3>Race condition</h3>
<p>When the outcome depends on the unpredictable timing of concurrent threads accessing shared data.</p>
<h3>Deadlock</h3>
<p>Two or more processes block forever, each waiting for a resource held by the other (e.g., Thread A holds Lock 1 and waits for Lock 2; Thread B holds Lock 2 and waits for Lock 1).</p>
<h3>Prevention</h3>
<ul>
  <li>Lock ordering (always acquire locks in the same sequence).</li>
  <li>Timeouts and lock-free data structures.</li>
  <li>Avoid nested locks where possible.</li>
</ul>

<div class="callout callout-exam">
  <strong>Exam Alert</strong>
  Define race condition and deadlock, give an example of each, and name one prevention technique. Draw a resource-allocation graph if asked.
</div>

<h2>4.6 Interactive: Parallel Algorithm Simulator</h2>
<p>Watch a problem move through six stages: original problem → task decomposition → distribution → simultaneous execution → synchronisation → final result.</p>
<div class="sim-panel">
  <div class="sim-header">Parallel Algorithm Simulator</div>
  <div class="sim-body" style="grid-template-columns: 300px 1fr;">
    <div class="sim-controls">
      <div class="sim-control">
        <label>Work units <span id="pa-w-val">24</span></label>
        <input type="range" id="pa-w" min="4" max="96" value="24">
      </div>
      <div class="sim-control">
        <label>Processors <span id="pa-p-val">4</span></label>
        <input type="range" id="pa-p" min="1" max="16" value="4">
      </div>
      <button class="btn btn-primary btn-sm btn-full" onclick="Lab.runAlgo()">Run / Reset simulation</button>
      <div style="margin-top:auto;font-family:var(--font-mono);font-size:0.8rem;color:var(--color-muted);" id="pa-stat">Stage: Idle</div>
    </div>
    <div class="sim-visual" id="pa-visual" style="min-height:300px;">
      <div class="sim-stage">Configure and press Run</div>
    </div>
  </div>
  <div style="padding:0.75rem 1.25rem;border-top:1px solid var(--color-border);font-size:0.85rem;color:var(--color-muted);text-align:center;">
    Stages: decompose → distribute → execute → synchronise → combine.
  </div>
</div>

<h2>4.7 Interactive: Race Condition Demo</h2>
<p>Two threads increment a shared counter without synchronisation. Run repeatedly to observe lost updates — the classic race condition.</p>
<div class="sim-panel">
  <div class="sim-header">Race Condition Demonstration</div>
  <div class="sim-body" style="grid-template-columns: 300px 1fr;">
    <div class="sim-controls">
      <button class="btn btn-primary btn-sm btn-full" onclick="Lab.runRace()">Run (unsynchronised)</button>
      <button class="btn btn-secondary btn-sm btn-full" onclick="Lab.runRace(true)">Run (synchronised / locked)</button>
      <div style="margin-top:auto;font-family:var(--font-mono);font-size:0.8rem;color:var(--color-muted);" id="race-stat">Final counter: —</div>
    </div>
    <div class="sim-visual" id="race-visual" style="min-height:300px;">
      <div class="sim-stage">Press Run to observe thread interleaving</div>
    </div>
  </div>
  <div style="padding:0.75rem 1.25rem;border-top:1px solid var(--color-border);font-size:0.85rem;color:var(--color-muted);text-align:center;">
    Unsynchronised reads/writes interleave → lost updates. A lock serialises access → correct result.
  </div>
</div>
`,
        definitions: [
          { term: "Task decomposition", definition: "Splitting a problem into separate tasks that can run in parallel." },
          { term: "Data decomposition", definition: "Splitting data into chunks on which the same operation runs." },
          { term: "Race condition", definition: "Outcome depends on unpredictable timing of concurrent access." },
          { term: "Deadlock", definition: "Processes block forever waiting for resources held by each other." },
          { term: "Span", definition: "Length of the longest dependency chain (critical path)." },
        ],
        examPoints: [
          "Compare task and data parallelism with examples.",
          "Explain dependency analysis and the DAG of tasks.",
          "Define work and span.",
          "Define race condition and deadlock; give prevention techniques.",
        ],
        knowledgeCheck: [
          { q: "Adding 5 to every element of an array in parallel is ______ parallelism.", options: ["Task", "Data", "Pipeline", "None"], answer: 1 },
          { q: "True or false: A race condition's outcome depends on thread timing.", options: [], answer: null, type: "tf", correct: true },
          { q: "Two threads each waiting for a lock held by the other is a ______.", options: [], answer: null, type: "fill", correct: "deadlock" },
        ],
        resources: [
          { title: "Task vs Data Parallelism", source: "Neso Academy", url: "https://www.youtube.com/results?search_query=task+parallelism+vs+data+parallelism" },
          { title: "Race Conditions", source: "FreeCodeCamp", url: "https://www.youtube.com/results?search_query=race+conditions+programming+freecodecamp" },
        ],
      },
      {
        id: "m4-models",
        title: "Programming Models: Shared Memory, Message Passing, Data/Task/Hybrid",
        type: "notes",
        objectives: [
          "Describe shared-memory programming (threads/OpenMP).",
          "Describe message-passing programming (MPI).",
          "Describe data-parallel, task-parallel, and hybrid models.",
          "Explain granularity, communication costs, scalability.",
        ],
        content: `
<h2>4.8 Parallel Programming Models</h2>
<table>
  <thead><tr><th>Model</th><th>Communication style</th><th>Typical API / example</th><th>Best for</th></tr></thead>
  <tbody>
    <tr><td><strong>Shared memory</strong></td><td>Loads/stores to shared address space</td><td>Threads, OpenMP, Pthreads</td><td>Multicore, low-latency</td></tr>
    <tr><td><strong>Message passing</strong></td><td>Explicit send/receive messages</td><td>MPI</td><td>Clusters, distributed memory</td></tr>
    <tr><td><strong>Data-parallel</strong></td><td>Same operation on data partitions</td><td>GPU kernels, SIMD, Spark</td><td>Large regular data (images, arrays)</td></tr>
    <tr><td><strong>Task-parallel</strong></td><td>Different tasks on different data</td><td>OpenMP tasks, Cilk</td><td>Irregular, functional work</td></tr>
    <tr><td><strong>Hybrid</strong></td><td>MPI between nodes + threads inside node</td><td>MPI + OpenMP</td><td>Supercomputers (NUMA clusters)</td></tr>
  </tbody>
</table>

<div class="callout callout-def">
  <strong>Important Definition</strong>
  Granularity: the ratio of computation to communication in a parallel task. Coarse-grained = more computation per communication (better for distribution); fine-grained = more communication relative to computation.
</div>

<h2>4.9 Communication Costs and Scalability</h2>
<ul>
  <li><strong>Communication cost:</strong> latency + bandwidth cost of moving data. It often dominates as processor count grows.</li>
  <li><strong>Scalability:</strong> ability to maintain efficiency as resources increase. Strong scaling = fixed problem, more processors; weak scaling = fixed problem per processor, more processors.</li>
</ul>

<div class="callout callout-exam">
  <strong>Exam Alert</strong>
  Compare the five programming models in a table, and define granularity. Explain hybrid MPI+OpenMP for clusters of multicore nodes.
</div>
`,
        definitions: [
          { term: "Message passing", definition: "Processes coordinate by explicitly sending and receiving messages." },
          { term: "Hybrid programming", definition: "Combining models, e.g., MPI across nodes and OpenMP within a node." },
          { term: "Strong scaling", definition: "Fixed total problem size, more processors." },
          { term: "Weak scaling", definition: "Fixed problem size per processor, more processors." },
        ],
        examPoints: [
          "List five parallel programming models and their communication styles.",
          "Define granularity and coarse vs fine-grained.",
          "Contrast strong scaling and weak scaling.",
        ],
        knowledgeCheck: [
          { q: "MPI is a ______ programming model.", options: ["Shared memory", "Message passing", "Data parallel", "Hybrid only"], answer: 1 },
          { q: "True or false: Hybrid MPI+OpenMP is common on clusters of multicore nodes.", options: [], answer: null, type: "tf", correct: true },
          { q: "Coarse-grained tasks have a high ratio of ______ to communication.", options: [], answer: null, type: "fill", correct: "computation" },
        ],
        resources: [
          { title: "Open MPI Introduction", source: "Open MPI", url: "https://www.open-mpi.org/" },
          { title: "Parallel Programming Models", source: "University Lecture", url: "https://www.youtube.com/results?search_query=parallel+programming+models+lecture" },
        ],
      },
      {
        id: "m4-efficiency",
        title: "Work, Span, Speedup and Efficiency in Parallel Algorithms",
        type: "notes",
        objectives: [
          "Define work, span, and parallelism (work/span).",
          "Compute parallel speedup and efficiency.",
          "Discuss scalability of parallel algorithms.",
        ],
        content: `
<h2>4.10 Work, Span, and Parallelism</h2>
<p>For a parallel algorithm represented as a DAG:</p>
<ul>
  <li><strong>Work (T₁):</strong> total time if run on one processor = sum of all task times.</li>
  <li><strong>Span (T∞):</strong> time on infinite processors = length of the critical path.</li>
  <li><strong>Parallelism:</strong> T₁ / T∞ = maximum possible speedup.</li>
</ul>
<div class="callout callout-tech">
  <strong>Technical Detail</strong>
  With p processors, runtime Tₚ is bounded: <span class="font-mono">T∞ ≤ Tₚ ≤ T₁/p + T∞</span> (Brent's theorem). Speedup Sₚ = T₁ / Tₚ; efficiency Eₚ = Sₚ / p.
</div>

<h3>Example: Parallel array sum</h3>
<ul>
  <li>Work: O(n) additions.</li>
  <li>Span: O(log n) using a tree reduction.</li>
  <li>Parallelism: O(n / log n) — highly parallel.</li>
</ul>

<h2>4.11 Parallel Speedup and Efficiency</h2>
<ul>
  <li><strong>Speedup S(p) = T(1) / T(p)</strong></li>
  <li><strong>Efficiency E(p) = S(p) / p</strong> — the fraction of peak performance achieved.</li>
  <li><strong>Linear speedup:</strong> S(p) = p (ideal, rare beyond small p due to overhead).</li>
  <li><strong>Superlinear speedup:</strong> S(p) > p — possible due to cache effects, but not from algorithmic gain alone.</li>
</ul>

<div class="callout callout-exam">
  <strong>Exam Alert</strong>
  Calculate work and span for a tree reduction, derive parallelism, and compute speedup/efficiency for given T₁, T∞, p. Use Brent's theorem if asked for a bound.
</div>
`,
        definitions: [
          { term: "Work", definition: "Total execution time on one processor." },
          { term: "Span", definition: "Critical-path length; execution time on infinite processors." },
          { term: "Parallelism", definition: "Work divided by span — theoretical max speedup." },
        ],
        examPoints: [
          "Define work, span, and parallelism.",
          "Compute speedup and efficiency for a parallel algorithm.",
          "Use Brent's theorem to bound parallel runtime.",
        ],
        knowledgeCheck: [
          { q: "Efficiency = Speedup ÷ ______.", options: ["Work", "Span", "Processors (p)", "Parallelism"], answer: 2 },
          { q: "True or false: Superlinear speedup means S(p) > p.", options: [], answer: null, type: "tf", correct: true },
          { q: "For a tree reduction of n items, span is O(______).", options: [], answer: null, type: "fill", correct: "log n" },
        ],
        resources: [
          { title: "Work and Span", source: "Parallel Algorithms course", url: "https://www.youtube.com/results?search_query=work+and+span+parallel+algorithms" },
        ],
      },
      {
        id: "m4-parallel-models",
        title: "Parallel Algorithms and Programming Models: The Complete Picture",
        type: "notes",
        objectives: [
          "Explain what every parallel algorithm must specify.",
          "Apply the PCAM design method: partitioning, communication, agglomeration and mapping.",
          "Use work, span, speedup, efficiency and scalability precisely.",
          "Match shared-memory, message-passing, data-parallel, task-parallel and hybrid models to the right hardware.",
        ],
        content: `
<h2>4.12 Parallel Algorithms and Programming Models — The Complete Picture</h2>
<p class="lead">A parallel algorithm describes which pieces of work may happen at the same time. A parallel programming model describes how the programmer expresses that work, how parallel units communicate, and how the system maps them onto hardware. Strong performance requires the algorithm, the model and the machine to agree.</p>

<div class="callout callout-def">
  <strong>Important Definition</strong>
  A parallel programming model is an abstract machine plus a set of rules for expressing parallelism, communication and synchronisation. It hides low-level hardware details while exposing enough structure for the programmer to reason about correctness and performance.
</div>

<h3>4.12.1 What Every Parallel Algorithm Must Specify</h3>
<ul>
  <li><strong>Decomposition:</strong> how the problem is divided into tasks or data partitions. The decomposition determines the maximum available parallelism.</li>
  <li><strong>Dependencies:</strong> which tasks must wait for others. Dependencies form a directed acyclic graph; the longest dependency chain limits speedup.</li>
  <li><strong>Communication:</strong> what data must move between tasks. Shared-memory tasks exchange data through memory; distributed tasks exchange messages.</li>
  <li><strong>Synchronisation:</strong> where tasks must meet, wait, lock or agree on a value. More synchronisation generally means less concurrency and more overhead.</li>
  <li><strong>Mapping:</strong> which task runs on which processor. A good mapping balances load and keeps communicating tasks close together.</li>
  <li><strong>Granularity:</strong> how much computation each task performs relative to its communication. Coarse tasks reduce overhead but may limit load balance; fine tasks improve balance but increase overhead.</li>
  <li><strong>Termination and correctness:</strong> how the algorithm detects completion and guarantees the same result regardless of thread interleaving.</li>
</ul>

<div class="callout callout-tech">
  <strong>Technical Detail</strong>
  Parallelism is not the same as speed. A parallel algorithm can perform more total work than the best sequential algorithm because of coordination, duplicated computation or communication. The relevant question is whether it reduces wall-clock time while remaining correct and scalable.
</div>

<h3>4.12.2 The PCAM Design Method</h3>
<p>PCAM is a disciplined four-stage method for turning a problem into a parallel program. It separates algorithmic thinking from machine-specific tuning.</p>
<table>
  <thead><tr><th>Stage</th><th>Guiding question</th><th>Typical outcome</th></tr></thead>
  <tbody>
    <tr><td><strong>Partitioning</strong></td><td>What independent pieces of work or data can be identified?</td><td>Fine-grained tasks and data partitions that expose parallelism.</td></tr>
    <tr><td><strong>Communication</strong></td><td>What information must move between those pieces?</td><td>A communication pattern: local exchange, broadcast, reduction, all-to-all or none.</td></tr>
    <tr><td><strong>Agglomeration</strong></td><td>Which small tasks should be grouped to reduce overhead?</td><td>Coarser tasks that fit the machine and amortise message costs.</td></tr>
    <tr><td><strong>Mapping</strong></td><td>Which task should run on which processor?</td><td>A load-balanced assignment with good data locality.</td></tr>
  </tbody>
</table>
<p>The first two stages are primarily algorithmic; the last two are implementation and performance decisions. A common mistake is to skip agglomeration and launch thousands of tiny tasks, so communication and scheduling overhead dominate the useful work.</p>

<h3>4.12.3 Performance Vocabulary You Must Use Precisely</h3>
<table>
  <thead><tr><th>Term</th><th>Meaning</th><th>Why it matters</th></tr></thead>
  <tbody>
    <tr><td><strong>Work</strong></td><td>Total operations performed by the algorithm, equivalent to its runtime on one processor.</td><td>Captures the total cost, including duplicated work.</td></tr>
    <tr><td><strong>Span</strong></td><td>Length of the longest dependency chain, equivalent to runtime on unlimited processors.</td><td>Sets the lower bound on parallel runtime and the maximum possible speedup.</td></tr>
    <tr><td><strong>Speedup</strong></td><td>Sequential runtime divided by parallel runtime.</td><td>Measures the actual benefit of parallelism.</td></tr>
    <tr><td><strong>Efficiency</strong></td><td>Speedup divided by the number of processors.</td><td>Measures how well the processors are used; ideal efficiency is one.</td></tr>
    <tr><td><strong>Overhead</strong></td><td>Time spent on communication, synchronisation, scheduling and duplicated work.</td><td>Explains why real speedup falls short of the ideal.</td></tr>
    <tr><td><strong>Strong scaling</strong></td><td>Fixed problem size, increasing processor count.</td><td>Tests whether a fixed job gets faster as resources are added.</td></tr>
    <tr><td><strong>Weak scaling</strong></td><td>Fixed problem size per processor, increasing both together.</td><td>Tests whether the system can solve larger problems without losing efficiency.</td></tr>
    <tr><td><strong>Cost-optimal</strong></td><td>Parallel work is proportional to sequential work, within a constant factor.</td><td>A theoretical indicator that parallelism is not wasting total effort.</td></tr>
  </tbody>
</table>

<div class="callout callout-confusion">
  <strong>Common Confusion</strong>
  Superlinear speedup — speedup greater than the number of processors — is possible in practice because of cache effects or because the sequential baseline was inefficient. It is not evidence that a parallel algorithm can beat the theoretical work bound in general.
</div>

<h3>4.12.4 What a Programming Model Provides</h3>
<ul>
  <li><strong>A way to express parallelism:</strong> threads, processes, tasks, kernels or data-parallel operations.</li>
  <li><strong>A data-sharing and communication mechanism:</strong> shared address space, explicit messages, distributed data partitions or device memory.</li>
  <li><strong>Synchronisation primitives:</strong> barriers, locks, atomic operations, reductions and completion operations.</li>
  <li><strong>An execution mapping:</strong> how logical parallel units are scheduled onto cores, nodes or GPU streaming multiprocessors.</li>
  <li><strong>Performance control:</strong> thread counts, scheduling policies, affinity, block sizes and communication strategies.</li>
  <li><strong>Portability:</strong> the same conceptual program can run across different machines, often with tuning rather than a full rewrite.</li>
</ul>

<h3>4.12.5 The Five Dominant Models</h3>
<table>
  <thead><tr><th>Model</th><th>What the programmer manages</th><th>Communication</th><th>Natural hardware</th><th>Representative technology</th></tr></thead>
  <tbody>
    <tr><td><strong>Shared memory</strong></td><td>Threads that read and write a common address space.</td><td>Loads and stores; synchronisation protects shared data.</td><td>Multicore CPU, single server.</td><td>OpenMP, POSIX threads.</td></tr>
    <tr><td><strong>Message passing</strong></td><td>Independent processes, each with private memory.</td><td>Explicit send and receive operations.</td><td>Cluster, distributed-memory supercomputer.</td><td>MPI.</td></tr>
    <tr><td><strong>Data parallel</strong></td><td>The same operation applied to many data elements.</td><td>Usually implicit; hardware or runtime moves data.</td><td>SIMD units, GPU, vector processors.</td><td>CUDA, OpenCL, SIMD directives.</td></tr>
    <tr><td><strong>Task parallel</strong></td><td>Different tasks with different code and data.</td><td>Task dependencies, shared data or message passing.</td><td>Multicore and irregular workloads.</td><td>OpenMP tasks, Cilk-style runtimes.</td></tr>
    <tr><td><strong>Hybrid</strong></td><td>More than one model in the same application.</td><td>Messages between nodes; shared memory or kernels inside a node.</td><td>Clusters of multicore CPUs and GPUs.</td><td>MPI plus OpenMP, MPI plus CUDA.</td></tr>
  </tbody>
</table>

<h3>4.12.6 Matching the Model to the Machine</h3>
<table>
  <thead><tr><th>Hardware</th><th>Natural model</th><th>Reason</th><th>Typical example</th></tr></thead>
  <tbody>
    <tr><td>Multicore CPU</td><td>Shared memory</td><td>All cores access the same memory; threads are cheap to create relative to processes.</td><td>Parallel image filter on a laptop.</td></tr>
    <tr><td>Cluster of servers</td><td>Message passing</td><td>Each node has private memory; the network is the only way to exchange data.</td><td>Weather simulation across many nodes.</td></tr>
    <tr><td>GPU</td><td>Data parallel</td><td>Thousands of simple lanes favour the same operation over a large regular data set.</td><td>Matrix multiplication, image processing, neural networks.</td></tr>
    <tr><td>Supercomputer</td><td>Hybrid</td><td>Nodes communicate by messages; cores inside a node share memory or drive accelerators.</td><td>MPI between nodes and OpenMP or CUDA within each node.</td></tr>
    <tr><td>Warehouse-scale data system</td><td>Data parallel with managed distribution</td><td>Large immutable data sets are partitioned and processed in bulk; fault tolerance is built in.</td><td>MapReduce and Spark-style analytics.</td></tr>
  </tbody>
</table>

<h3>4.12.7 Design Trade-offs and Common Pitfalls</h3>
<ul>
  <li><strong>Too fine granularity:</strong> task launch and communication costs exceed the useful work.</li>
  <li><strong>Too coarse granularity:</strong> some processors idle because there are not enough independent tasks.</li>
  <li><strong>Load imbalance:</strong> the slowest task determines completion time; dynamic scheduling or better partitioning helps.</li>
  <li><strong>Communication dominating:</strong> adding processors increases message traffic faster than it increases useful computation.</li>
  <li><strong>Excessive synchronisation:</strong> barriers and locks serialise execution and reduce scalability.</li>
  <li><strong>Poor locality:</strong> data is far from the processor that needs it, so caches and memory bandwidth are wasted.</li>
  <li><strong>Portability versus peak performance:</strong> highly tuned code may depend on a vendor, interconnect or GPU architecture.</li>
</ul>

<div class="callout callout-real">
  <strong>Real-World Application</strong>
  A modern weather model uses a hybrid strategy: the atmosphere is partitioned into regions across cluster nodes, MPI exchanges boundary data between neighbouring regions, and OpenMP threads or GPU kernels accelerate the calculations inside each region.
</div>

<div class="callout callout-exam">
  <strong>Exam Alert</strong>
  Be ready to name the four PCAM stages, distinguish work from span, explain strong versus weak scaling, and justify a programming model for a given architecture. A strong answer links the model to memory organisation, communication cost and scalability — not just to a product name.
</div>
`,
        definitions: [
          { term: "Parallel algorithm", definition: "An algorithm that specifies work which can execute simultaneously, together with the dependencies, communication and synchronisation needed for a correct result." },
          { term: "Programming model", definition: "An abstract machine and set of rules for expressing parallelism, communication and synchronisation on a class of hardware." },
          { term: "PCAM", definition: "Partitioning, Communication, Agglomeration and Mapping — a four-stage method for designing parallel programs." },
          { term: "Granularity", definition: "The amount of computation in a task relative to the communication and coordination it requires." },
          { term: "Cost-optimal", definition: "A parallel algorithm whose total work is within a constant factor of the best sequential work." },
        ],
        examPoints: [
          "List and explain the four PCAM stages with an example.",
          "Define work, span, speedup, efficiency and scalability.",
          "Compare shared-memory, message-passing, data-parallel, task-parallel and hybrid models.",
          "Choose a programming model for multicore, cluster and GPU hardware and justify the choice.",
        ],
        knowledgeCheck: [
          { q: "The four PCAM stages are partitioning, communication, agglomeration and ______.", options: [], answer: null, type: "fill", correct: "mapping" },
          { q: "True or false: a programming model is the same thing as a programming language.", options: [], answer: null, type: "tf", correct: false },
          { q: "A model in which processes exchange explicit messages is called ______ passing.", options: [], answer: null, type: "fill", correct: "message" },
        ],
        resources: [
          { title: "MPI Forum — The MPI Standard", source: "MPI Forum", url: "https://www.mpi-forum.org/" },
          { title: "OpenMP Specifications", source: "OpenMP Architecture Review Board", url: "https://www.openmp.org/specifications/" },
          { title: "CUDA Programming Guide", source: "NVIDIA", url: "https://docs.nvidia.com/cuda/cuda-c-programming-guide/" },
        ],
      },
      {
        id: "m4-mpi",
        title: "The MPI Programming Model",
        type: "notes",
        objectives: [
          "Define MPI and explain why it is used for distributed-memory systems.",
          "Describe the SPMD execution model, ranks and communicators.",
          "Distinguish point-to-point from collective communication.",
          "Explain blocking, non-blocking, deadlock and hybrid MPI plus threads.",
        ],
        content: `
<h2>4.13 The MPI Programming Model</h2>
<p class="lead">MPI — the Message Passing Interface — is the dominant programming model for distributed-memory parallelism. It gives independent processes a portable way to cooperate by explicitly sending and receiving messages, without pretending that they share memory.</p>

<div class="callout callout-def">
  <strong>Important Definition</strong>
  MPI is a standardised specification for message-passing libraries. A program starts multiple processes, each with its own private address space, and those processes coordinate by exchanging messages through a well-defined interface.
</div>

<h3>4.13.1 What MPI Is — and What It Is Not</h3>
<p>MPI is a <em>specification</em>, not a language and not a compiler. Different vendors and open-source projects implement the standard, and the same conceptual program can run on a laptop, a departmental cluster or a leadership-class supercomputer. Bindings exist for C, C++ and Fortran, and MPI is often used from Python through wrapper libraries.</p>
<ul>
  <li><strong>It is explicit:</strong> the programmer decides when data moves and which processes participate.</li>
  <li><strong>It is portable:</strong> the standard hides differences between interconnects and operating systems.</li>
  <li><strong>It is scalable:</strong> implementations are tuned for thousands of nodes and millions of cores.</li>
  <li><strong>It does not provide shared memory:</strong> a process cannot directly load or store another process's variables.</li>
  <li><strong>It does not automatically parallelise code:</strong> the programmer must decompose the problem and insert communication.</li>
</ul>

<div class="callout callout-confusion">
  <strong>Common Confusion</strong>
  MPI is not a language extension and does not require a special syntax. It is a library interface layered on top of an ordinary sequential language. The difficulty lies in designing the decomposition and communication pattern, not in learning a new grammar.
</div>

<h3>4.13.2 The SPMD Execution Model</h3>
<p>Most MPI programs follow <strong>Single Program, Multiple Data</strong> execution. Every process runs the same executable, but each process has a different rank and therefore works on different data or takes a different control path.</p>
<ul>
  <li>All processes start together under a launcher, which decides how many processes to create and where to place them.</li>
  <li>Each process has its own stack, heap, global variables and file descriptors. Nothing is shared by default.</li>
  <li>Control flow can diverge: one process may act as a coordinator while others act as workers.</li>
  <li>Correctness requires every communication operation to be matched by the intended partner or group.</li>
</ul>
<p>SPMD is not the same as data parallelism. The processes execute the same program, but they may execute different branches and may perform entirely different roles. The common program text is an implementation convenience, not a requirement that every process do identical work.</p>

<h3>4.13.3 Ranks, Communicators and Groups</h3>
<ul>
  <li><strong>Rank:</strong> an integer identifier in the range zero to the number of processes minus one, unique within a communicator. It is not a global operating-system process identifier.</li>
  <li><strong>Group:</strong> an ordered set of processes. Order matters because collective operations use it to define roots and result positions.</li>
  <li><strong>Communicator:</strong> a group plus a communication context. The context isolates messages so that operations in different communicators cannot accidentally match.</li>
  <li><strong>World communicator:</strong> the default communicator containing every process started by the job.</li>
  <li><strong>Sub-communicators:</strong> smaller communication domains created by splitting the world communicator. They are essential when different groups perform independent collectives.</li>
  <li><strong>Topology:</strong> an optional description of the process arrangement, such as a grid or graph, used by the runtime to improve mapping and communication.</li>
</ul>
<p>Communicators are more than a convenience. Without them, two independent libraries running in the same job could issue collectives in different orders and corrupt each other's communication. A private communicator gives each library its own context.</p>

<h3>4.13.4 Point-to-Point Communication</h3>
<p>Point-to-point communication involves exactly one sender and one receiver. A message consists of an <strong>envelope</strong> and a <strong>payload</strong>. The envelope identifies the source, destination, communicator and a programmer-defined tag. The payload describes the number and type of data elements.</p>
<ul>
  <li><strong>Matching:</strong> a receive matches a send when the source, tag and communicator agree. The destination is implied by the receiving process.</li>
  <li><strong>Blocking send:</strong> returns when the send buffer may be reused. Depending on the implementation and message size, the data may already be copied into a system buffer or may not return until the receiver has taken it.</li>
  <li><strong>Blocking receive:</strong> returns only after the incoming message has been stored in the receive buffer.</li>
  <li><strong>Non-blocking operations:</strong> initiate communication and return immediately, allowing computation to overlap with data movement. The programmer must later test or wait for completion before reusing the buffer.</li>
  <li><strong>Ordering:</strong> messages from the same source, with the same tag and communicator, are received in the order they were sent. Messages with different tags have no ordering guarantee.</li>
</ul>

<div class="callout callout-tech">
  <strong>Technical Detail</strong>
  Implementations often use an eager protocol for small messages, copying the data into a buffer so the send can complete quickly. Large messages may use a rendezvous protocol, where the sender waits until the receiver is ready. This is why message size changes latency and why a program that works for small tests can deadlock at scale.
</div>

<h3>4.13.5 Deadlock in Message Passing</h3>
<p>Deadlock occurs when processes wait forever for events that can never happen. A classic MPI mistake is for every process to issue a blocking receive before any process sends, or for two processes to send large messages to each other with no matching receives. Another pattern is a ring in which every process waits for its neighbour before forwarding data.</p>
<ul>
  <li><strong>Prevention by ordering:</strong> make communication follow a consistent direction, such as even ranks send before odd ranks receive.</li>
  <li><strong>Prevention by non-blocking operations:</strong> start sends and receives together, then complete them, so no process blocks prematurely.</li>
  <li><strong>Prevention by matching:</strong> ensure every send has a corresponding receive with compatible source, tag and communicator.</li>
  <li><strong>Avoid relying on buffering:</strong> a program that works only because messages happen to fit in internal buffers is fragile.</li>
</ul>

<h3>4.13.6 Collective Communication</h3>
<p>A collective operation involves every process in a communicator. Collectives express common patterns at a high level, allowing the implementation to choose efficient tree or ring algorithms based on message size and network topology.</p>
<table>
  <thead><tr><th>Collective</th><th>Meaning</th><th>Typical use</th></tr></thead>
  <tbody>
    <tr><td><strong>Broadcast</strong></td><td>One root sends the same data to every process.</td><td>Distributing configuration, parameters or a shared input.</td></tr>
    <tr><td><strong>Scatter</strong></td><td>The root sends a different chunk to each process.</td><td>Distributing rows of a matrix or slices of an array.</td></tr>
    <tr><td><strong>Gather</strong></td><td>Every process sends a chunk to the root, which collects them in rank order.</td><td>Collecting partial results for output or checking.</td></tr>
    <tr><td><strong>All-gather</strong></td><td>Every process receives every process's chunk.</td><td>Distributed tables, neighbour discovery, replicated metadata.</td></tr>
    <tr><td><strong>Reduce</strong></td><td>Values from all processes are combined at the root using an operation such as sum, maximum or logical and.</td><td>Global sums, norms, maximum error and convergence tests.</td></tr>
    <tr><td><strong>All-reduce</strong></td><td>A reduction whose result is delivered to every process.</td><td>Updating a shared model or a global gradient in machine learning.</td></tr>
    <tr><td><strong>Scan or prefix</strong></td><td>Each process receives the combination of values from all lower-ranked processes up to itself.</td><td>Parallel prefix sums, compaction and load offsets.</td></tr>
    <tr><td><strong>All-to-all</strong></td><td>Every process sends a distinct piece of data to every other process.</td><td>Transposing a distributed matrix and all-pairs exchange.</td></tr>
    <tr><td><strong>Barrier</strong></td><td>No process proceeds until every process in the communicator has arrived.</td><td>Separating phases and measuring elapsed time.</td></tr>
  </tbody>
</table>
<p>Collective calls must be executed by all members of the communicator, in the same order, with compatible argument types. A mismatch can hang the job or produce silently incorrect results. Collectives are not necessarily synchronising in the barrier sense: they coordinate the operation, but a process may continue once its part is complete.</p>

<h3>4.13.7 Synchronisation and Consistency</h3>
<p>MPI has no shared variables to protect, so the usual shared-memory race conditions do not apply across processes. However, ordering still matters. A receive observes data only after the matching send has completed. Collective operations establish a group-wide ordering point. Barriers are used when the algorithm needs all processes to finish a phase before any begins the next one.</p>
<p>Within a single process, ordinary threads may still race on local memory. When MPI is combined with threads or GPU work, the programmer must reason about both message ordering and local shared-memory synchronisation.</p>

<h3>4.13.8 Datatypes, Heterogeneity and Derived Types</h3>
<ul>
  <li><strong>Basic datatypes:</strong> MPI defines portable descriptions of integers, floating-point values, characters and logical values so that processes with different machine representations can communicate.</li>
  <li><strong>Derived datatypes:</strong> describe non-contiguous or mixed layouts, such as a column of a matrix or a structure with padding. They avoid manual packing and copying.</li>
  <li><strong>Heterogeneous systems:</strong> when nodes have different architectures, MPI can convert data representations, although conversion costs performance.</li>
  <li><strong>Type matching:</strong> sender and receiver must agree on the amount and type of data; a mismatch is a programming error even if the byte count happens to match.</li>
</ul>

<h3>4.13.9 One-Sided Communication, Parallel I/O and Topologies</h3>
<p>Modern MPI includes <strong>remote memory access</strong>, often called one-sided communication. A process exposes a region of memory in a window, and other processes can put data into it, get data from it or accumulate updates. This is useful for sparse, irregular and graph-based computations where the receiver cannot predict when a message will arrive.</p>
<p>MPI also defines <strong>parallel I/O</strong>, allowing many processes to read and write a shared file cooperatively. The runtime can aggregate small accesses into large ones and avoid every process opening the same file independently. This is important for checkpoints and scientific data sets that are too large for one node.</p>
<p><strong>Topologies</strong> describe the logical arrangement of processes. A Cartesian topology tells the runtime that processes form a multidimensional grid, which helps map ranks to neighbouring hardware and simplifies boundary exchange in stencil computations.</p>

<h3>4.13.10 Hybrid MPI Plus Threads or Accelerators</h3>
<p>On a cluster of multicore nodes, a common design uses one MPI process per node or socket, with threads inside each process. MPI handles communication between nodes; OpenMP or GPU kernels handle parallelism inside a node. This reduces the number of MPI ranks, lowers message traffic and allows each rank to exploit local shared memory.</p>
<p>Hybrid programming introduces its own concerns: the MPI implementation must support the required level of thread safety, shared data inside a rank must be protected, and the runtime must avoid oversubscribing cores. The reward is better locality and fewer messages at extreme scale.</p>

<h3>4.13.11 Performance and Scalability</h3>
<ul>
  <li><strong>Latency:</strong> the fixed cost of starting a message; dominant for small messages.</li>
  <li><strong>Bandwidth:</strong> the rate at which large messages move; dominant for bulk data.</li>
  <li><strong>Network topology:</strong> the cost of a message depends on the route between ranks and on congestion.</li>
  <li><strong>Collective algorithms:</strong> trees reduce the number of steps for broadcast and reduce; ring algorithms can be efficient for very large messages.</li>
  <li><strong>Load imbalance:</strong> one slow rank forces every collective to wait, so the fastest processors idle.</li>
  <li><strong>Communication and computation overlap:</strong> non-blocking operations and careful scheduling hide message latency behind useful work.</li>
  <li><strong>Scalability limit:</strong> as ranks increase, the problem size per rank may shrink until communication dominates.</li>
</ul>

<h3>4.13.12 Advantages and Limitations</h3>
<table>
  <thead><tr><th>Advantages</th><th>Limitations</th></tr></thead>
  <tbody>
    <tr><td>Portable across clusters, vendors and interconnects.</td><td>Explicit communication makes programs verbose and complex.</td></tr>
    <tr><td>Scales to thousands of nodes and millions of cores.</td><td>No shared memory: all data movement must be designed by the programmer.</td></tr>
    <tr><td>Gives precise control over data placement and communication.</td><td>Deadlocks, message mismatches and collective ordering errors are easy to introduce.</td></tr>
    <tr><td>Mature ecosystem, debuggers, profilers and collective libraries.</td><td>Performance tuning depends on message size, topology and implementation.</td></tr>
    <tr><td>Supports hybrid designs with threads, GPUs and parallel I/O.</td><td>Fault tolerance is not automatic; a failed process normally aborts the job.</td></tr>
  </tbody>
</table>

<div class="callout callout-exam">
  <strong>Exam Alert</strong>
  A high-scoring MPI answer defines the model, explains SPMD and communicators, contrasts point-to-point with collective communication, gives one deadlock scenario with a prevention strategy, and explains why MPI suits distributed memory. Mention that MPI is a specification and that collectives are group operations, not ordinary function calls.
</div>
`,
        definitions: [
          { term: "MPI", definition: "A standardised message-passing interface for portable parallel programming on distributed-memory systems." },
          { term: "SPMD", definition: "Single Program, Multiple Data: every process runs the same executable but works on different data or control paths." },
          { term: "Rank", definition: "A process identifier within a communicator, used to address communication partners." },
          { term: "Communicator", definition: "A group of processes plus an isolated communication context that prevents messages from different operations matching incorrectly." },
          { term: "Collective operation", definition: "A communication operation involving every process in a communicator, such as broadcast, reduce or barrier." },
          { term: "Non-blocking communication", definition: "An operation that starts a message transfer without waiting for completion, enabling overlap with computation." },
        ],
        examPoints: [
          "Define MPI and explain the distributed-memory model.",
          "Explain SPMD, ranks, groups and communicators.",
          "Contrast point-to-point and collective communication with examples.",
          "Explain blocking versus non-blocking operations and one deadlock scenario.",
          "State the advantages and limitations of MPI and describe hybrid MPI plus OpenMP.",
        ],
        knowledgeCheck: [
          { q: "In MPI, every process has its own private ______.", options: [], answer: null, type: "fill", correct: "memory" },
          { q: "True or false: every process in a communicator must participate in a collective operation.", options: [], answer: null, type: "tf", correct: true },
          { q: "A process's identifier within a communicator is called its ______.", options: [], answer: null, type: "fill", correct: "rank" },
          { q: "Which of these is a collective operation?", options: ["Point-to-point send", "Broadcast", "Private computation", "Local memory copy"], answer: 1 },
        ],
        resources: [
          { title: "MPI Forum — Standard and Documents", source: "MPI Forum", url: "https://www.mpi-forum.org/" },
          { title: "MPI Tutorial", source: "Lawrence Livermore National Laboratory", url: "https://hpc-tutorials.llnl.gov/mpi/" },
          { title: "Open MPI Documentation", source: "Open MPI Project", url: "https://www.open-mpi.org/doc/" },
        ],
      },
      {
        id: "m4-openmp",
        title: "The OpenMP Programming Model",
        type: "notes",
        objectives: [
          "Define OpenMP and explain the shared-memory model.",
          "Describe the fork-join execution pattern and parallel regions.",
          "Explain worksharing, scheduling and the data environment.",
          "Identify synchronisation costs, false sharing and scalability limits.",
        ],
        content: `
<h2>4.14 The OpenMP Programming Model</h2>
<p class="lead">OpenMP is the standard programming model for shared-memory parallelism on multicore CPUs. It lets a programmer add parallelism incrementally to an existing sequential program, using compiler directives, a small runtime interface and environment settings rather than an entirely new language.</p>

<div class="callout callout-def">
  <strong>Important Definition</strong>
  OpenMP is a portable shared-memory programming interface consisting of compiler directives, runtime routines and environment variables. Threads within a team share the process address space and cooperate through shared variables and explicit synchronisation.
</div>

<h3>4.14.1 What OpenMP Is</h3>
<ul>
  <li><strong>Shared-memory model:</strong> all threads can read and write the same variables. There is no message passing inside a process.</li>
  <li><strong>Directive-based:</strong> the programmer marks regions, loops or sections for parallel execution; the compiler generates the thread management code.</li>
  <li><strong>Incremental:</strong> a sequential program can be parallelised one region at a time, which makes OpenMP popular for legacy scientific code.</li>
  <li><strong>Portable:</strong> the same directives work across compilers and operating systems, although performance and scheduling details vary.</li>
  <li><strong>Supports more than loops:</strong> modern OpenMP includes tasks, SIMD vectorisation, thread affinity and offloading to accelerators.</li>
  <li><strong>Ignores unsupported directives:</strong> a compiler that does not recognise a directive should still compile the program as sequential code, preserving correctness.</li>
</ul>

<h3>4.14.2 The Fork-Join Execution Model</h3>
<p>An OpenMP program begins with a single <strong>master thread</strong>. When execution reaches a parallel region, the master <em>forks</em> a team of threads. The threads execute the region concurrently, then <em>join</em> at the end, and the master continues alone until the next parallel region.</p>
<ul>
  <li><strong>Parallel region:</strong> a block of code executed by every thread in the team.</li>
  <li><strong>Team:</strong> the group of threads created for that region. The number of threads can be fixed, requested by the program or controlled by the environment.</li>
  <li><strong>Thread identity:</strong> each thread has a team rank, allowing it to select a different portion of the work.</li>
  <li><strong>Fork-join overhead:</strong> creating and disbanding teams is not free; parallel regions should contain enough work to amortise the cost.</li>
  <li><strong>Nested parallelism:</strong> a thread inside a parallel region may create another team, although this is often disabled or limited in practice.</li>
</ul>

<h3>4.14.3 Worksharing Constructs</h3>
<p>Once a team exists, worksharing constructs divide the work among its threads. The threads still share the same address space, but each receives a different portion of the iteration space or a different section.</p>
<table>
  <thead><tr><th>Construct</th><th>What it divides</th><th>Typical use</th></tr></thead>
  <tbody>
    <tr><td><strong>Loop worksharing</strong></td><td>Iterations of a loop with independent iterations.</td><td>Array updates, stencil sweeps, Monte Carlo trials.</td></tr>
    <tr><td><strong>Sections</strong></td><td>Different structured blocks assigned to different threads.</td><td>A small number of independent tasks, such as reading two files concurrently.</td></tr>
    <tr><td><strong>Single</strong></td><td>One thread executes a block while the others skip it.</td><td>Initialisation, printing a summary or updating a shared counter once.</td></tr>
    <tr><td><strong>Master</strong></td><td>The master thread executes a block; no implicit barrier follows.</td><td>Lightweight coordination or output that only the master should perform.</td></tr>
  </tbody>
</table>

<h3>4.14.4 Loop Scheduling</h3>
<p>Scheduling decides how loop iterations are assigned to threads. The best choice depends on whether iterations take equal time and whether cache locality matters.</p>
<table>
  <thead><tr><th>Schedule</th><th>Assignment pattern</th><th>Strengths and weaknesses</th></tr></thead>
  <tbody>
    <tr><td><strong>Static</strong></td><td>Iterations are divided into fixed chunks at the start.</td><td>Low overhead and predictable locality; poor balance when iteration costs vary.</td></tr>
    <tr><td><strong>Dynamic</strong></td><td>Threads take chunks from a queue as they finish.</td><td>Good load balance for irregular work; scheduling overhead and less locality.</td></tr>
    <tr><td><strong>Guided</strong></td><td>Chunk sizes start large and shrink over time.</td><td>Balances locality and load balance; still has some scheduling overhead.</td></tr>
    <tr><td><strong>Runtime</strong></td><td>The schedule is chosen by an environment setting.</td><td>Allows tuning without recompiling; performance depends on the deployment.</td></tr>
  </tbody>
</table>
<p>A small chunk size improves balance but increases scheduling traffic. A large chunk size reduces overhead but can leave threads idle at the end of the loop. The final imbalance is sometimes called the tail effect.</p>

<h3>4.14.5 The Data Environment</h3>
<p>Because threads share memory, the programmer must state which variables are shared and which are private to each thread. Getting this wrong is the most common source of incorrect OpenMP programs.</p>
<table>
  <thead><tr><th>Classification</th><th>Meaning</th><th>Important consequence</th></tr></thead>
  <tbody>
    <tr><td><strong>Shared</strong></td><td>One copy visible to every thread.</td><td>Concurrent writes need synchronisation; shared reads are cheap.</td></tr>
    <tr><td><strong>Private</strong></td><td>A separate uninitialised copy in each thread.</td><td>Useful for loop counters and temporaries; the original value is not inherited.</td></tr>
    <tr><td><strong>Firstprivate</strong></td><td>A private copy initialised from the value before the region.</td><td>Preserves an input value without sharing updates.</td></tr>
    <tr><td><strong>Lastprivate</strong></td><td>A private copy whose final value is copied back after the region.</td><td>Useful when the last loop iteration must publish a result.</td></tr>
    <tr><td><strong>Reduction</strong></td><td>Each thread accumulates a private partial result, then the partials are combined.</td><td>Eliminates a shared-update bottleneck for sums, products, maxima and minima.</td></tr>
    <tr><td><strong>Threadprivate</strong></td><td>Storage that persists across parallel regions for each thread.</td><td>Useful for thread-local state; requires careful lifetime management.</td></tr>
  </tbody>
</table>

<div class="callout callout-confusion">
  <strong>Common Confusion</strong>
  A private variable is not automatically initialised, and a shared loop counter is usually a bug. Each thread needs its own iteration variable, while the data being updated may still need to be shared or reduced. Declaring a variable private does not make concurrent access to a shared data structure safe.
</div>

<h3>4.14.6 Synchronisation and Memory Consistency</h3>
<ul>
  <li><strong>Barrier:</strong> every thread in the team waits until all have arrived. Worksharing constructs usually end with an implicit barrier unless the programmer explicitly removes it.</li>
  <li><strong>Critical section:</strong> a block that only one thread may execute at a time. Correct but potentially serialising.</li>
  <li><strong>Atomic operation:</strong> a single indivisible update to a memory location. Cheaper than a critical section for simple counters, but not a substitute for protecting a whole data structure.</li>
  <li><strong>Locks:</strong> explicit mutual exclusion with lock and unlock operations. Flexible but prone to deadlock and forgotten unlocks.</li>
  <li><strong>Ordered region:</strong> forces iterations to execute a block in sequential order, which severely limits parallelism.</li>
  <li><strong>Memory consistency:</strong> without synchronisation, threads may observe stale or reordered values. Barriers, atomics, locks and flush operations establish the required ordering.</li>
</ul>

<h3>4.14.7 Tasks and Irregular Parallelism</h3>
<p>Loop worksharing assumes a predictable iteration space. Many problems are irregular: recursive traversals, graph searches, adaptive meshes and event-driven workloads. OpenMP tasks address these by creating units of work dynamically.</p>
<ul>
  <li>A task captures its data environment when it is created and can execute later on any thread in the team.</li>
  <li>Task dependencies can express ordering between tasks without forcing a global barrier.</li>
  <li>Task groups allow a parent to wait for a set of child tasks.</li>
  <li>Tasks improve load balance for irregular work but add creation, scheduling and memory overhead.</li>
</ul>

<h3>4.14.8 Thread Count, Affinity and NUMA Effects</h3>
<p>More threads do not always mean more speed. Oversubscribing cores causes context switching; binding threads to the wrong cores can destroy cache locality. On non-uniform memory access systems, a thread should ideally use memory allocated on its local node.</p>
<ul>
  <li><strong>Thread count:</strong> choose it from the available cores, the problem size and the memory bandwidth requirement, not simply the maximum.</li>
  <li><strong>Affinity:</strong> pin threads to cores or sockets so the operating system does not migrate them unpredictably.</li>
  <li><strong>First touch:</strong> the thread that first writes a page often determines where the memory is placed; initialise data in parallel to improve locality.</li>
  <li><strong>Nested teams:</strong> oversubscription can occur when every outer thread creates an inner team; limit nesting or use a runtime that manages it.</li>
</ul>

<h3>4.14.9 Performance Pitfalls</h3>
<ul>
  <li><strong>False sharing:</strong> two threads update different variables that happen to lie on the same cache line. The cache coherency protocol bounces the line between cores even though the variables are logically independent.</li>
  <li><strong>Load imbalance:</strong> one thread receives much more work, so the team waits at the next barrier.</li>
  <li><strong>Serial bottlenecks:</strong> a large critical section or ordered region can dominate runtime.</li>
  <li><strong>Too many barriers:</strong> frequent synchronisation prevents threads from overlapping useful work.</li>
  <li><strong>Poor cache locality:</strong> an unfortunate iteration-to-thread mapping causes cores to compete for the same cache lines or memory channels.</li>
  <li><strong>Thread startup cost:</strong> a parallel region that contains only a few operations costs more than it saves.</li>
</ul>

<h3>4.14.10 OpenMP Versus MPI</h3>
<table>
  <thead><tr><th>Aspect</th><th>OpenMP</th><th>MPI</th></tr></thead>
  <tbody>
    <tr><td>Memory model</td><td>Shared memory within one process.</td><td>Distributed memory across processes.</td></tr>
    <tr><td>Parallel unit</td><td>Threads.</td><td>Processes.</td></tr>
    <tr><td>Communication</td><td>Implicit through shared variables.</td><td>Explicit messages.</td></tr>
    <tr><td>Programming effort</td><td>Incremental and relatively compact.</td><td>More verbose; decomposition and messages must be designed.</td></tr>
    <tr><td>Scaling range</td><td>One multicore node, possibly a large shared-memory server.</td><td>Clusters and supercomputers.</td></tr>
    <tr><td>Main correctness risk</td><td>Data races, false sharing and missing synchronisation.</td><td>Deadlock, message mismatch and collective ordering.</td></tr>
    <tr><td>Typical combination</td><td>Inside a node.</td><td>Between nodes.</td></tr>
  </tbody>
</table>

<h3>4.14.11 Advantages and Limitations</h3>
<table>
  <thead><tr><th>Advantages</th><th>Limitations</th></tr></thead>
  <tbody>
    <tr><td>Easy incremental parallelisation of existing code.</td><td>Limited to shared-memory systems; does not scale across nodes by itself.</td></tr>
    <tr><td>Portable across compilers and operating systems.</td><td>Data races and false sharing are easy to introduce and hard to reproduce.</td></tr>
    <tr><td>Low-level control over scheduling, affinity and data sharing.</td><td>Performance depends heavily on the compiler and runtime implementation.</td></tr>
    <tr><td>Supports tasks, SIMD and accelerator offload in modern versions.</td><td>Complex nested or task-based programs can be difficult to debug and tune.</td></tr>
    <tr><td>No explicit message-passing code for a single node.</td><td>Scaling is bounded by memory bandwidth and cache coherence on the node.</td></tr>
  </tbody>
</table>

<div class="callout callout-exam">
  <strong>Exam Alert</strong>
  Define OpenMP as a shared-memory directive-based model, draw or describe the fork-join pattern, explain worksharing and scheduling, distinguish shared from private and reduction variables, and name false sharing as a performance pitfall. A strong comparison with MPI must mention memory model, communication style and scaling range.
</div>
`,
        definitions: [
          { term: "OpenMP", definition: "A portable shared-memory programming interface based on compiler directives, runtime routines and environment variables." },
          { term: "Fork-join", definition: "The execution pattern in which a master thread creates a team for a parallel region and the team joins afterwards." },
          { term: "Worksharing", definition: "A construct that distributes the iterations or sections of a region among the threads of a team." },
          { term: "False sharing", definition: "Performance loss caused by threads updating different variables that occupy the same cache line." },
          { term: "Reduction", definition: "A pattern in which each thread accumulates a private partial result that is later combined into a single result." },
          { term: "Task", definition: "A dynamically created unit of work that can be scheduled on any thread in the team, useful for irregular parallelism." },
        ],
        examPoints: [
          "Define OpenMP and explain the shared-memory model.",
          "Describe the fork-join execution pattern and parallel regions.",
          "Explain loop worksharing and compare static, dynamic and guided scheduling.",
          "Distinguish shared, private, firstprivate, lastprivate and reduction variables.",
          "Explain false sharing, load imbalance and the limits of shared-memory scaling.",
        ],
        knowledgeCheck: [
          { q: "OpenMP is designed for ______-memory multiprocessors.", options: [], answer: null, type: "fill", correct: "shared" },
          { q: "True or false: a reduction combines private partial results into one final result.", options: [], answer: null, type: "tf", correct: true },
          { q: "The OpenMP execution pattern is called the ______ model.", options: [], answer: null, type: "fill", correct: "fork-join / fork join" },
          { q: "Two threads updating different variables on the same cache line cause ______ sharing.", options: [], answer: null, type: "fill", correct: "false" },
        ],
        resources: [
          { title: "OpenMP — The OpenMP API Specification", source: "OpenMP Architecture Review Board", url: "https://www.openmp.org/" },
          { title: "OpenMP Tutorial", source: "Lawrence Livermore National Laboratory", url: "https://hpc-tutorials.llnl.gov/openmp/" },
          { title: "OpenMP Technical Reports", source: "OpenMP Architecture Review Board", url: "https://www.openmp.org/specifications/" },
        ],
      },
      {
        id: "m4-cuda",
        title: "The CUDA Programming Model",
        type: "notes",
        objectives: [
          "Define CUDA and explain heterogeneous CPU-GPU computing.",
          "Describe kernels and the thread-block-grid hierarchy.",
          "Explain warps, SIMT execution and the GPU memory hierarchy.",
          "Evaluate occupancy, memory coalescing, divergence and data-transfer costs.",
        ],
        content: `
<h2>4.15 The CUDA Programming Model</h2>
<p class="lead">CUDA is NVIDIA's parallel computing platform and programming model for general-purpose computation on graphics processing units. It exposes the massive data parallelism of a GPU while asking the programmer to manage a separate device memory space and a very different execution model from a multicore CPU.</p>

<div class="callout callout-def">
  <strong>Important Definition</strong>
  CUDA is a heterogeneous computing model in which a host CPU launches kernels that execute across many threads on a GPU device. Threads are organised into blocks, blocks into grids, and the programmer manages movement between host memory and device memory.
</div>

<h3>4.15.1 What CUDA Is</h3>
<ul>
  <li><strong>A platform:</strong> a compiler toolchain, runtime, libraries, debuggers and profilers, not merely a language feature.</li>
  <li><strong>A programming model:</strong> a way to express data-parallel work as kernels executed by many threads.</li>
  <li><strong>A vendor-specific ecosystem:</strong> CUDA is designed by NVIDIA for NVIDIA GPUs. Portable alternatives exist, but CUDA benefits from deep hardware integration.</li>
  <li><strong>General-purpose:</strong> despite the graphics origin, CUDA is used for scientific simulation, machine learning, image processing, cryptography and data analytics.</li>
  <li><strong>Explicit about memory:</strong> the programmer decides what data resides on the host, what resides on the device and when transfers occur.</li>
</ul>

<h3>4.15.2 The Heterogeneous Host-Device Model</h3>
<p>A CUDA application has two kinds of execution: sequential or moderately parallel code on the <strong>host</strong> CPU, and massively parallel code on the <strong>device</strong> GPU. The host coordinates the computation, allocates device memory, transfers data and launches kernels.</p>
<ul>
  <li><strong>Separate address spaces:</strong> host and device memory are distinct by default. Data must be copied across the interconnect before the GPU can use it.</li>
  <li><strong>Kernel launch:</strong> the host launches a kernel with a chosen grid and block configuration. The launch is asynchronous with respect to the host, so the CPU can perform other work.</li>
  <li><strong>Synchronisation:</strong> the host must wait for completion before reading results that the device produced.</li>
  <li><strong>Streams:</strong> independent queues of work allow transfers and kernels from different streams to overlap.</li>
  <li><strong>Unified memory:</strong> some systems provide a single virtual address space that migrates pages on demand, simplifying programming at the cost of unpredictable transfer performance.</li>
  <li><strong>Interconnect:</strong> PCI Express or NVLink determines transfer bandwidth; the link can easily become the bottleneck for data-intensive kernels.</li>
</ul>

<h3>4.15.3 GPU Architecture and SIMT Execution</h3>
<p>A GPU contains many <strong>streaming multiprocessors</strong>. Each multiprocessor contains many simple execution lanes, registers, shared memory and schedulers. The GPU is designed for throughput: it hides memory latency by keeping a large number of warps ready to execute.</p>
<ul>
  <li><strong>Warp:</strong> a group of 32 threads that the hardware schedules together. On NVIDIA GPUs, the warp is the basic unit of execution.</li>
  <li><strong>SIMT:</strong> Single Instruction, Multiple Threads. Threads in a warp usually execute the same instruction on different data, similar to SIMD but with independent per-thread state.</li>
  <li><strong>Latency hiding:</strong> when one warp waits for memory, the scheduler switches to another ready warp. High occupancy helps keep the execution units busy.</li>
  <li><strong>Throughput versus latency:</strong> a CPU is optimised to finish one thread quickly; a GPU is optimised to finish many threads with high aggregate throughput.</li>
</ul>

<h3>4.15.4 The Thread Hierarchy</h3>
<table>
  <thead><tr><th>Level</th><th>Meaning</th><th>Key properties</th></tr></thead>
  <tbody>
    <tr><td><strong>Thread</strong></td><td>The smallest unit of execution.</td><td>Has private registers and local state; executes the kernel body.</td></tr>
    <tr><td><strong>Block</strong></td><td>A group of threads that cooperate.</td><td>Threads in a block can share data through shared memory and synchronise at a block barrier.</td></tr>
    <tr><td><strong>Grid</strong></td><td>All blocks launched by one kernel invocation.</td><td>Blocks are independent and may execute in any order; there is no safe grid-wide barrier in an ordinary launch.</td></tr>
    <tr><td><strong>Warp</strong></td><td>A hardware scheduling group of 32 threads.</td><td>Threads in a warp are most efficient when they follow the same control path.</td></tr>
  </tbody>
</table>
<p>The programmer chooses the number of blocks and the number of threads per block. That choice affects occupancy, shared-memory usage, scheduling granularity and the amount of parallelism exposed. A block must be small enough for several blocks to reside on a multiprocessor, but large enough to amortise scheduling and share data effectively.</p>

<h3>4.15.5 The Memory Hierarchy</h3>
<table>
  <thead><tr><th>Memory</th><th>Scope</th><th>Relative speed</th><th>Typical use</th></tr></thead>
  <tbody>
    <tr><td><strong>Registers</strong></td><td>One thread.</td><td>Fastest.</td><td>Scalar variables, indices and intermediate values.</td></tr>
    <tr><td><strong>Local memory</strong></td><td>One thread, physically in device memory.</td><td>Slow; used when registers spill.</td><td>Large per-thread arrays or excessive register pressure.</td></tr>
    <tr><td><strong>Shared memory</strong></td><td>One block, on chip.</td><td>Very fast, but limited in size.</td><td>Reusing data between threads, stencil tiles, reductions.</td></tr>
    <tr><td><strong>Global memory</strong></td><td>All threads and the host.</td><td>High latency, high bandwidth when coalesced.</td><td>Main input and output arrays.</td></tr>
    <tr><td><strong>Constant memory</strong></td><td>All threads, read-only cache.</td><td>Fast for uniform reads.</td><td>Kernel parameters and small constant tables.</td></tr>
    <tr><td><strong>Texture memory</strong></td><td>All threads, read-only cache with spatial locality.</td><td>Good for neighbouring accesses.</td><td>Image processing and interpolation.</td></tr>
    <tr><td><strong>L1 and L2 caches</strong></td><td>Multiprocessor and device.</td><td>Automatic caching.</td><td>Transparent reuse of global data.</td></tr>
  </tbody>
</table>

<div class="callout callout-tech">
  <strong>Technical Detail</strong>
  Global memory is most efficient when adjacent threads access adjacent addresses. This is called <strong>coalescing</strong>: the hardware combines the requests into a small number of memory transactions. Strided or scattered access multiplies transactions and wastes bandwidth. Shared memory is divided into banks; if threads in a warp access different words in the same bank, a bank conflict serialises those accesses.
</div>

<h3>4.15.6 Synchronisation and Execution Ordering</h3>
<ul>
  <li><strong>Block barrier:</strong> threads within one block can wait until all have reached a point, making shared-memory cooperation safe.</li>
  <li><strong>No ordinary grid barrier:</strong> blocks are scheduled independently, so one block cannot safely wait for another block to finish inside the same kernel. Algorithms that need global phases must use separate kernel launches or a cooperative launch mechanism.</li>
  <li><strong>Atomics:</strong> indivisible updates to global or shared memory, useful for counters and accumulated results but potentially expensive under contention.</li>
  <li><strong>Memory fences:</strong> constrain the ordering of memory operations so that other threads observe writes in the intended order.</li>
  <li><strong>Streams:</strong> operations in one stream execute in order; operations in different streams may overlap. The host uses stream ordering to coordinate kernels and transfers.</li>
  <li><strong>Host-device synchronisation:</strong> the host must wait for device work before using results copied back to host memory.</li>
</ul>

<h3>4.15.7 The CUDA Performance Model</h3>
<ul>
  <li><strong>Data-transfer overhead:</strong> moving data across the interconnect can dominate runtime. A fast kernel cannot compensate for excessive copying.</li>
  <li><strong>Arithmetic intensity:</strong> the ratio of computation to bytes moved. High intensity sustains GPU throughput; low intensity makes the kernel memory-bound.</li>
  <li><strong>Occupancy:</strong> the number of active warps relative to the maximum supported by a multiprocessor. Low occupancy can leave execution units idle; excessively high occupancy is not automatically better if each warp does little useful work.</li>
  <li><strong>Occupancy limiters:</strong> registers per thread, shared memory per block and block size determine how many blocks can reside simultaneously.</li>
  <li><strong>Warp divergence:</strong> when threads in a warp take different branches, the hardware serialises the paths. Divergence wastes execution slots and is especially harmful in inner loops.</li>
  <li><strong>Memory coalescing:</strong> adjacent accesses reduce transactions; uncoalesced patterns waste bandwidth.</li>
  <li><strong>Shared-memory bank conflicts:</strong> poor access patterns serialise shared-memory requests.</li>
  <li><strong>Launch overhead and tail effect:</strong> many tiny kernels or a grid with too few blocks leaves part of the GPU idle at the end.</li>
  <li><strong>Roofline reasoning:</strong> compare achieved performance with the lower of the memory-bandwidth limit and the peak-compute limit for the kernel's arithmetic intensity.</li>
</ul>

<h3>4.15.8 When CUDA Fits — and When It Does Not</h3>
<table>
  <thead><tr><th>Good fit</th><th>Poor fit</th></tr></thead>
  <tbody>
    <tr><td>Large, regular data sets with the same operation applied to many elements.</td><td>Small data sets where transfer overhead exceeds computation.</td></tr>
    <tr><td>High arithmetic intensity and abundant data parallelism.</td><td>Irregular, pointer-chasing or branch-heavy workloads with little parallelism.</td></tr>
    <tr><td>Matrix operations, image processing, simulation and neural-network training.</td><td>Latency-sensitive tasks that require a fast response from a single thread.</td></tr>
    <tr><td>Throughput-oriented batch work that can keep thousands of threads busy.</td><td>Algorithms that require frequent global synchronisation between blocks.</td></tr>
    <tr><td>Workloads that can overlap transfers with computation using streams.</td><td>Applications dominated by host-device copies and small kernel launches.</td></tr>
  </tbody>
</table>

<h3>4.15.9 CUDA Compared with OpenMP and MPI</h3>
<table>
  <thead><tr><th>Aspect</th><th>CUDA</th><th>OpenMP</th><th>MPI</th></tr></thead>
  <tbody>
    <tr><td>Hardware</td><td>NVIDIA GPU plus host CPU.</td><td>Shared-memory multicore CPU.</td><td>Distributed-memory cluster.</td></tr>
    <tr><td>Parallel unit</td><td>Threads grouped into warps, blocks and grids.</td><td>Threads in a team.</td><td>Processes with private memory.</td></tr>
    <tr><td>Memory</td><td>Separate host and device memory with a detailed device hierarchy.</td><td>One shared address space.</td><td>Private address space per process.</td></tr>
    <tr><td>Communication</td><td>Explicit host-device transfers; shared memory within a block.</td><td>Implicit through shared variables.</td><td>Explicit messages.</td></tr>
    <tr><td>Strength</td><td>Massive throughput for regular data-parallel work.</td><td>Incremental parallelism on multicore CPUs.</td><td>Scalability across nodes.</td></tr>
    <tr><td>Main risk</td><td>Transfer overhead, divergence and low occupancy.</td><td>Data races and false sharing.</td><td>Deadlock and communication overhead.</td></tr>
  </tbody>
</table>

<h3>4.15.10 Advantages and Limitations</h3>
<table>
  <thead><tr><th>Advantages</th><th>Limitations</th></tr></thead>
  <tbody>
    <tr><td>Very high throughput for regular data-parallel workloads.</td><td>Vendor lock-in to NVIDIA hardware and tooling.</td></tr>
    <tr><td>Mature libraries, profilers and debugging tools.</td><td>Separate memory space makes data movement a first-class design problem.</td></tr>
    <tr><td>Fine control over thread grouping, memory use and occupancy.</td><td>Warp divergence and poor coalescing can erase the theoretical speedup.</td></tr>
    <tr><td>Strong ecosystem for machine learning and scientific computing.</td><td>Complex programming model with a long tuning cycle.</td></tr>
    <tr><td>Can be combined with MPI and OpenMP in hybrid applications.</td><td>Not suitable for small, irregular or latency-sensitive problems.</td></tr>
  </tbody>
</table>

<div class="callout callout-exam">
  <strong>Exam Alert</strong>
  Define CUDA as a heterogeneous host-device model, draw the thread-block-grid hierarchy, explain warp and SIMT execution, compare the memory spaces, and discuss coalescing, divergence, occupancy and transfer overhead. A good answer explains when a GPU is the wrong choice, not only why it is fast.
</div>
`,
        definitions: [
          { term: "CUDA", definition: "NVIDIA's parallel computing platform and programming model for general-purpose computation on GPUs." },
          { term: "Kernel", definition: "A device function launched by the host and executed by many GPU threads in parallel." },
          { term: "Warp", definition: "A group of 32 threads that an NVIDIA GPU schedules together as the basic execution unit." },
          { term: "SIMT", definition: "Single Instruction, Multiple Threads: many threads execute the same instruction on different data while keeping independent state." },
          { term: "Occupancy", definition: "The number of active warps on a multiprocessor relative to the maximum it supports." },
          { term: "Coalescing", definition: "Combining adjacent thread memory accesses into efficient memory transactions." },
        ],
        examPoints: [
          "Define CUDA and explain the host-device heterogeneous model.",
          "Draw and explain the thread, block, grid and warp hierarchy.",
          "Compare registers, shared, global and constant memory.",
          "Explain SIMT, warp divergence, occupancy and memory coalescing.",
          "State when CUDA is appropriate and when a CPU or cluster is a better choice.",
        ],
        knowledgeCheck: [
          { q: "CUDA is developed by ______.", options: [], answer: null, type: "fill", correct: "NVIDIA" },
          { q: "True or false: threads in the same block can cooperate through shared memory.", options: [], answer: null, type: "tf", correct: true },
          { q: "A group of 32 threads that execute together on an NVIDIA GPU is called a ______.", options: [], answer: null, type: "fill", correct: "warp" },
          { q: "In CUDA terminology, the CPU is called the ______.", options: ["Host", "Device", "Kernel", "Warp"], answer: 0 },
        ],
        resources: [
          { title: "CUDA C++ Programming Guide", source: "NVIDIA", url: "https://docs.nvidia.com/cuda/cuda-c-programming-guide/" },
          { title: "CUDA Toolkit Documentation", source: "NVIDIA", url: "https://docs.nvidia.com/cuda/" },
          { title: "CUDA Zone — Developer Resources", source: "NVIDIA", url: "https://developer.nvidia.com/cuda-zone" },
        ],
      },
    ],
  },

  /* ========================================================================
     MODULE 5 — MAPREDUCE
     ======================================================================== */
  {
    id: "mapreduce",
    title: "Google Distribution Model and MapReduce",
    short: "MapReduce word-count workflow, shuffle, fault tolerance",
    icon: "5",
    color: "#1b7f5a",
    description:
      "Google's distributed computing model, MapReduce map/reduce, shuffle and sort, fault tolerance, word-count simulator.",
    totalLessons: 4,
    lessons: [
      {
        id: "m5-google",
        title: "Google's Distributed Computing Model",
        type: "notes",
        objectives: [
          "Explain why Google developed distributed processing.",
          "Describe distributed storage and computation at Google scale.",
        ],
        content: `
<h2>5.1 Why Google Needed Distributed Processing</h2>
<p>By the early 2000s, Google indexed billions of web pages. No single machine could store the index or process user queries within tight latency budgets. Failures were routine at that scale (disks die, machines crash). Google therefore built:</p>
<ul>
  <li><strong>Distributed storage:</strong> the Google File System (GFS) — huge files split into chunks replicated across cheap machines.</li>
  <li><strong>Distributed computation:</strong> MapReduce — a programming model and execution framework that runs user functions across thousands of machines automatically.</li>
</ul>
<div class="callout callout-def">
  <strong>Important Definition</strong>
  Google's distribution model: store and compute across clusters of commodity machines, with replication and automatic failure handling, so the system scales and survives routine hardware failures.
</div>

<h2>5.2 Introduction to MapReduce</h2>
<p><strong>MapReduce</strong> is a programming model for processing large datasets in parallel across a cluster. It has two user-defined functions: <strong>Map</strong> and <strong>Reduce</strong>. The runtime handles scheduling, fault tolerance, and data movement.</p>
<p>Data flows as <strong>key-value pairs</strong> through the entire pipeline.</p>

<h2>5.3 The Map Function</h2>
<p>The <strong>map</strong> function processes one input split and emits intermediate key-value pairs.</p>
<p><span class="font-mono">map(key, value) → list of (intermediate_key, intermediate_value)</span></p>
<p>Example (word count): map("doc1", "the cat eats") → ("the",1), ("cat",1), ("eats",1).</p>

<h2>5.4 Shuffle and Sort</h2>
<p>Between map and reduce, the framework <strong>groups all values with the same intermediate key</strong> and delivers them to the same reducer. This network shuffle is often the most expensive phase.</p>

<h2>5.5 The Reduce Function</h2>
<p><span class="font-mono">reduce(intermediate_key, list of values) → list of (final_key, final_value)</span></p>
<p>Example: reduce("cat", [1, 1]) → ("cat", 2).</p>

<div class="callout callout-tech">
  <strong>Technical Detail</strong>
  MapReduce assumes functions are <em>pure</em> (no side effects) so tasks can be retried on failure without corrupting results.
</div>

<h2>5.6 Fault Tolerance</h2>
<ul>
  <li>The master tracks all map/reduce tasks.</li>
  <li>If a worker fails, its tasks are rescheduled on other workers.</li>
  <li>Completed map tasks are re-executed if their output is lost (output stored locally on the failed worker).</li>
  <li>Reduce tasks are idempotent and can restart safely.</li>
</ul>

<div class="callout callout-real">
  <strong>Real-World Application</strong>
  Google used MapReduce to rebuild its entire web index regularly — across thousands of machines, with routine worker failures handled automatically.
</div>

<div class="callout callout-exam">
  <strong>Exam Alert</strong>
  Draw the six-step MapReduce workflow, explain the shuffle, and describe what happens when a worker fails mid-map.
</div>

<h2>5.7 Interactive: MapReduce Word-Count Simulator</h2>
<p>Input: <span class="font-mono">"The cat eats fish. The cat likes fish."</span><br>
Click <strong>Next Step</strong> / <strong>Previous Step</strong> to walk through all six stages.</p>
<div class="sim-panel">
  <div class="sim-header">MapReduce Word-Count Simulator</div>
  <div class="sim-body" style="grid-template-columns: 300px 1fr;">
    <div class="sim-controls">
      <div class="sim-control">
        <label>Workers <span id="mr-w-val">3</span></label>
        <input type="range" id="mr-w" min="1" max="8" value="3" oninput="Lab.mrRender()">
      </div>
      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        <button class="btn btn-outline btn-sm btn-full" onclick="Lab.mrPrev()">← Previous Step</button>
        <button class="btn btn-primary btn-sm btn-full" onclick="Lab.mrNext()">Next Step →</button>
        <button class="btn btn-outline btn-sm btn-full" onclick="Lab.mrFail()" style="color:var(--color-danger);border-color:var(--color-danger);">⚠ Simulate worker failure</button>
      </div>
      <div style="margin-top:auto;font-family:var(--font-mono);font-size:0.8rem;color:var(--color-muted);" id="mr-step">Step: 1 / 6</div>
      <div class="callout callout-tech" style="margin-top:1rem;font-size:0.78rem;">
        <strong id="mr-desc">Input</strong>
      </div>
    </div>
    <div class="sim-visual" id="mr-visual" style="min-height:340px;">
      <div class="sim-stage">Press Next Step to begin</div>
    </div>
  </div>
  <div style="padding:0.75rem 1.25rem;border-top:1px solid var(--color-border);font-size:0.85rem;color:var(--color-muted);text-align:center;">
    Map → Shuffle/Sort → Reduce → Output
  </div>
</div>

<h2>5.8 Advantages and Limitations</h2>
<table>
  <thead><tr><th>Advantages</th><th>Limitations</th></tr></thead>
  <tbody>
    <tr><td>Automatic parallelisation and fault tolerance</td><td>Not suitable for iterative algorithms (e.g., machine learning)</td></tr>
    <tr><td>Simple two-function programming model</td><td>High latency — batch-oriented, not interactive</td></tr>
    <tr><td>Scales to thousands of machines</td><td>Shuffle/sort can be a bottleneck</td></tr>
  </tbody>
</table>
`,
        definitions: [
          { term: "Map function", definition: "Produces intermediate key-value pairs from an input split." },
          { term: "Reduce function", definition: "Merges all values associated with one intermediate key." },
          { term: "Shuffle", definition: "Network phase grouping equal keys together before reduce." },
          { term: "Key-value pair", definition: "The universal data format in MapReduce." },
        ],
        examPoints: [
          "Draw the six-step MapReduce workflow (word count example).",
          "Explain shuffle and sort.",
          "Describe fault tolerance when a worker fails.",
          "List advantages and limitations of MapReduce.",
        ],
        knowledgeCheck: [
          { q: "MapReduce input/output is expressed as:", options: ["Key-value pairs", "Objects", "XML", "SQL rows"], answer: 0 },
          { q: "True or false: If a MapReduce worker fails, its tasks are rescheduled elsewhere.", options: [], answer: null, type: "tf", correct: true },
          { q: "The ______ phase groups identical keys together before reducing.", options: [], answer: null, type: "fill", correct: "shuffle" },
        ],
        resources: [
          { title: "MapReduce — Google Paper", source: "Google Research", url: "https://research.google/pubs/pub62/" },
          { title: "MapReduce Explained", source: "IBM Technology", url: "https://www.youtube.com/results?search_query=mapreduce+explained+IBM+Technology" },
        ],
      },
      {
        id: "m5-workflow",
        title: "MapReduce Workflow — Deep Dive",
        type: "notes",
        objectives: [
          "Trace a MapReduce job end to end (input splits, map, shuffle, reduce, output).",
          "Explain data partitioning.",
        ],
        content: `
<h2>5.9 Complete MapReduce Workflow</h2>
<ol>
  <li><strong>Input:</strong> files in distributed storage (e.g., HDFS).</li>
  <li><strong>Splitting:</strong> input is divided into splits (typically 64–128 MB blocks); one map task per split.</li>
  <li><strong>Mapping:</strong> each map task processes its split and emits (k, v) pairs.</li>
  <li><strong>Partitioning:</strong> a hash function assigns each intermediate key to a reducer.</li>
  <li><strong>Shuffle and sort:</strong> map outputs are transferred to reducers and sorted by key.</li>
  <li><strong>Reducing:</strong> each reducer merges values per key and writes final output.</li>
  <li><strong>Output:</strong> final key-value results written to distributed storage.</li>
</ol>

<div class="callout callout-tech">
  <strong>Technical Detail</strong>
  The number of reducers is often set independently of map tasks. Map outputs are written to local disk and fetched by reducers over the network (the shuffle).
</div>

<h2>5.10 Data Partitioning and Parallel Execution</h2>
<p>The default partitioner hashes the key to choose a reducer, aiming for balanced load. A bad partitioner (e.g., all keys hash to one reducer) causes <strong>skew</strong> — one reducer becomes a straggler.</p>
<p>Map tasks run in parallel on many workers; reducers start only after enough maps finish.</p>

<div class="callout callout-remember">
  <strong>Remember This</strong>
  MapReduce = Map → Shuffle/Sort → Reduce. It favours batch, embarrassingly parallel workloads; it is not ideal for low-latency or iterative algorithms.
</div>
`,
        definitions: [
          { term: "Input split", definition: "A chunk of input data processed by one map task." },
          { term: "Partitioner", definition: "Function assigning intermediate keys to reducers." },
          { term: "Straggler", definition: "A slow task that delays job completion." },
        ],
        examPoints: [
          "Trace MapReduce end-to-end with input splits.",
          "Explain data partitioning and skew.",
          "Describe why reducers wait for map tasks.",
        ],
        knowledgeCheck: [
          { q: "One map task processes one ______.", options: ["Reducer", "Input split", "Block replica", "Cluster"], answer: 1 },
          { q: "True or false: Reducers can start before all map tasks finish.", options: [], answer: null, type: "tf", correct: false },
          { q: "Data ______ occurs when one reducer gets far more keys than others.", options: [], answer: null, type: "fill", correct: "skew" },
        ],
        resources: [
          { title: "Hadoop MapReduce", source: "Apache Hadoop", url: "https://hadoop.apache.org/docs/current/hadoop-mapreduce-client/hadoop-mapreduce-client-core/MapReduceTutorial.html" },
        ],
      },
    ],
  },

  /* ========================================================================
     MODULE 6 — HADOOP ECOSYSTEM
     ======================================================================== */
  {
    id: "hadoop",
    title: "Apache Hadoop and Its Ecosystem",
    short: "HDFS, NameNode, DataNode, YARN, ecosystem components",
    icon: "6",
    color: "#145f43",
    description:
      "Hadoop architecture, HDFS, YARN, MapReduce, Hive, Pig, HBase, Sqoop, Flume, Spark, ZooKeeper, Oozie.",
    totalLessons: 4,
    lessons: [
      {
        id: "m6-hdfs",
        title: "Hadoop Architecture and HDFS",
        type: "notes",
        objectives: [
          "Describe Hadoop's history and purpose.",
          "Explain HDFS architecture: NameNode, DataNode, blocks, replication.",
          "Describe how a file is stored across DataNodes.",
        ],
        content: `
<h2>6.1 Introduction to Apache Hadoop</h2>
<p>Apache Hadoop is an open-source framework for storing and processing large datasets across clusters of commodity hardware. Inspired by Google's GFS and MapReduce papers, Hadoop was created by Doug Cutting and Mike Cafarella (named after Cutting's son's stuffed elephant).</p>
<p>Hadoop provides reliable, scalable, distributed computing on hardware that fails routinely — it handles failure in software.</p>

<h2>6.2 Hadoop Distributed File System (HDFS)</h2>
<p>HDFS is the storage layer: a distributed filesystem that runs on commodity hardware. It stores very large files with streaming access patterns and fault tolerance.</p>
<ul>
  <li><strong>Files are split into blocks</strong> (default 128 MB).</li>
  <li><strong>Blocks are replicated</strong> across multiple DataNodes (default replication factor = 3).</li>
  <li><strong>Write-once-read-many:</strong> optimised for batch workloads, not random writes.</li>
</ul>

<div class="callout callout-def">
  <strong>Important Definition</strong>
  HDFS: a distributed filesystem storing large files as replicated blocks across DataNodes, coordinated by a NameNode.
</div>

<h3>NameNode</h3>
<p>The master. It stores the <strong>namespace</strong> (directory tree) and <strong>metadata</strong> (which blocks belong to which file, and which DataNodes hold them). It does <em>not</em> store file data.</p>
<h3>DataNode</h3>
<p>Workers that store actual data blocks and serve read/write requests. They send regular <strong>heartbeats</strong> to the NameNode.</p>
<h3>Secondary NameNode</h3>
<p>Not a hot standby. It periodically merges the namespace image with the edit log to create checkpoints, reducing NameNode restart time.</p>

<table>
  <thead><tr><th>Component</th><th>Role</th></tr></thead>
  <tbody>
    <tr><td><strong>NameNode</strong></td><td>Master; metadata + namespace; no data blocks</td></tr>
    <tr><td><strong>DataNode</strong></td><td>Worker; stores blocks, heartbeats to NameNode</td></tr>
    <tr><td><strong>Secondary NameNode</strong></td><td>Checkpointing helper; merges edits into image</td></tr>
  </tbody>
</table>

<div class="callout callout-exam">
  <strong>Exam Alert</strong>
  Explain what happens when the NameNode fails (system becomes unavailable until restored from checkpoint — HDFS's single point of failure in versions before HDFS HA).
</div>

<h2>6.3 Interactive: Hadoop Architecture Explorer</h2>
<p>Click any component to see its responsibilities, metadata handling, DataNode communication, and failure behaviour.</p>
<div class="sim-panel">
  <div class="sim-header">Hadoop Architecture Explorer</div>
  <div class="sim-body" style="grid-template-columns: 300px 1fr;">
    <div class="sim-controls">
      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        <div style="font-weight:600;font-size:var(--fs-sm);color:var(--color-text);margin-bottom:0.5rem;">Select component</div>
        <button class="btn btn-outline btn-sm btn-full" onclick="Lab.selectHadoop('namenode')" id="hd-namenode">NameNode</button>
        <button class="btn btn-outline btn-sm btn-full" onclick="Lab.selectHadoop('datanode')" id="hd-datanode">DataNode</button>
        <button class="btn btn-outline btn-sm btn-full" onclick="Lab.selectHadoop('snn')" id="hd-snn">Secondary NameNode</button>
        <button class="btn btn-outline btn-sm btn-full" onclick="Lab.selectHadoop('client')" id="hd-client">Client</button>
      </div>
      <div class="callout callout-tech" style="margin-top:1.5rem;font-size:0.8rem;">
        <strong id="hd-role"></strong>
      </div>
    </div>
    <div class="sim-visual" id="hd-visual" style="min-height:300px;">
      <div class="sim-stage">Click a component</div>
    </div>
  </div>
  <div style="padding:0.75rem 1.25rem;border-top:1px solid var(--color-border);font-size:0.85rem;color:var(--color-muted);text-align:center;">
    NameNode = metadata; DataNodes = blocks; Client = coordinator.
  </div>
</div>

<h2>6.4 Interactive: Block Distribution and Replication</h2>
<p>Watch a file split into blocks and distributed across DataNodes. Adjust the replication factor to see how copies are placed.</p>
<div class="sim-panel">
  <div class="sim-header">HDFS Block Distribution</div>
  <div class="sim-body" style="grid-template-columns: 300px 1fr;">
    <div class="sim-controls">
      <div class="sim-control">
        <label>Replication factor <span id="hdfs-rf-val">3</span></label>
        <input type="range" id="hdfs-rf" min="1" max="5" value="3">
      </div>
      <button class="btn btn-primary btn-sm btn-full" onclick="Lab.hdfsDistribute()">Redistribute blocks</button>
      <div style="margin-top:auto;font-family:var(--font-mono);font-size:0.8rem;color:var(--color-muted);" id="hdfs-stat">Blocks: — · Copies: —</div>
    </div>
    <div class="sim-visual" id="hdfs-visual" style="min-height:300px;">
      <div class="sim-stage">Redistribute to see block placement</div>
    </div>
  </div>
  <div style="padding:0.75rem 1.25rem;border-top:1px solid var(--color-border);font-size:0.85rem;color:var(--color-muted);text-align:center;">
    Rack-aware placement: one copy on a different rack, two on the local rack (default).
  </div>
</div>
`,
        definitions: [
          { term: "HDFS", definition: "Hadoop Distributed File System — distributed storage for large files." },
          { term: "NameNode", definition: "HDFS master storing namespace and block-to-Datanode metadata." },
          { term: "DataNode", definition: "HDFS worker storing actual data blocks." },
          { term: "Replication factor", definition: "Number of copies of each block (default 3)." },
        ],
        examPoints: [
          "Draw HDFS architecture with NameNode and DataNodes.",
          "Explain the NameNode's role and why it is a single point of failure.",
          "Describe block replication and placement.",
        ],
        knowledgeCheck: [
          { q: "HDFS default block size is:", options: ["64 KB", "128 MB", "1 GB", "4 KB"], answer: 1 },
          { q: "True or false: The NameNode stores actual file data blocks.", options: [], answer: null, type: "tf", correct: false },
          { q: "HDFS default replication factor is ___.", options: [], answer: null, type: "fill", correct: "3" },
        ],
        resources: [
          { title: "HDFS Architecture", source: "Apache Hadoop", url: "https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html" },
        ],
      },
      {
        id: "m6-yarn",
        title: "YARN and Resource Management",
        type: "notes",
        objectives: [
          "Explain YARN architecture: ResourceManager, NodeManager, ApplicationMaster.",
          "Describe how YARN schedules applications.",
        ],
        content: `
<h2>6.4 Yet Another Resource Negotiator (YARN)</h2>
<p>YARN is Hadoop's cluster resource management layer (Hadoop 2.x+). It separates resource management from data processing, allowing multiple processing engines (MapReduce, Spark, Tez, Flink) to share one cluster.</p>
<h3>Components</h3>
<table>
  <thead><tr><th>Component</th><th>Role</th></tr></thead>
  <tbody>
    <tr><td><strong>ResourceManager</strong></td><td>Master; arbitrates cluster resources among applications</td></tr>
    <tr><td><strong>NodeManager</strong></td><td>Per-node worker; manages containers, CPU, memory on its node</td></tr>
    <tr><td><strong>ApplicationMaster</strong></td><td>Per-application; negotiates resources from RM, executes tasks via NMs</td></tr>
  </tbody>
</table>

<div class="callout callout-tech">
  <strong>Technical Detail</strong>
  A <strong>container</strong> is YARN's unit of resource allocation (RAM + CPU on a node). The ApplicationMaster requests containers; NodeManager launches tasks inside them.
</div>

<h2>6.5 Hadoop MapReduce and Hadoop Common</h2>
<p>Hadoop MapReduce runs on YARN: the ApplicationMaster coordinates map and reduce tasks as containers across NodeManagers. Hadoop Common provides the libraries and utilities used by all Hadoop modules.</p>

<h2>6.6 Hadoop Ecosystem Components</h2>
<table>
  <thead><tr><th>Component</th><th>What it is</th><th>Problem it solves</th></tr></thead>
  <tbody>
    <tr><td><strong>Hive</strong></td><td>Data warehouse with SQL-like language (HiveQL)</td><td>SQL queries over HDFS without Java</td></tr>
    <tr><td><strong>Pig</strong></td><td>Scripting language (Pig Latin) for data flows</td><td>Easier ETL than raw MapReduce</td></tr>
    <tr><td><strong>HBase</strong></td><td>NoSQL column-store on HDFS</td><td>Random read/write on big data</td></tr>
    <tr><td><strong>Sqoop</strong></td><td>SQL↔Hadoop data transfer</td><td>Import/export relational data</td></tr>
    <tr><td><strong>Flume</strong></td><td>Log collection/aggregation</td><td>Streaming log data into HDFS</td></tr>
    <tr><td><strong>Spark</strong></td><td>Fast in-memory processing engine</td><td>Iterative algorithms, low latency</td></tr>
    <tr><td><strong>ZooKeeper</strong></td><td>Distributed coordination service</td><td>Configuration, naming, locks, leader election</td></tr>
    <tr><td><strong>Oozie</strong></td><td>Workflow scheduler</td><td>Schedule dependent Hadoop jobs</td></tr>
  </tbody>
</table>

<div class="callout callout-real">
  <strong>Real-World Application</strong>
  Yahoo! ran one of the world's largest Hadoop clusters for web indexing and ad analytics, using Hive for reporting and Spark for machine learning.
</div>

<div class="callout callout-exam">
  <strong>Exam Alert</strong>
  For each ecosystem tool, state what it is, what problem it solves, and its relationship to Hadoop. YARN component roles (RM, NM, AM) are frequently examined.
</div>
`,
        definitions: [
          { term: "YARN", definition: "Yet Another Resource Negotiator — Hadoop's cluster resource manager." },
          { term: "Container", definition: "YARN's allocated resource unit (memory + CPU on a node)." },
          { term: "Hive", definition: "SQL-like data warehouse over Hadoop." },
        ],
        examPoints: [
          "Describe YARN's ResourceManager, NodeManager, ApplicationMaster.",
          "For two ecosystem tools: what they are, the problem solved, relation to Hadoop.",
          "Explain how Hadoop MapReduce runs on YARN.",
        ],
        knowledgeCheck: [
          { q: "Which YARN component runs on every node and launches containers?", options: ["ResourceManager", "NodeManager", "ApplicationMaster", "NameNode"], answer: 1 },
          { q: "True or false: Spark is part of the Hadoop ecosystem and can run on YARN.", options: [], answer: null, type: "tf", correct: true },
          { q: "HiveQL is the query language of ______.", options: [], answer: null, type: "fill", correct: "Hive" },
        ],
        resources: [
          { title: "YARN Architecture", source: "Apache Hadoop", url: "https://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-site/YARN.html" },
        ],
      },
    ],
  },

  /* ========================================================================
     MODULE 7 — FAULT TOLERANCE AND SCALABILITY
     ======================================================================== */
  {
    id: "fault",
    title: "Fault Tolerance and Scalability",
    short: "Failures, replication, checkpointing, horizontal vs vertical scaling",
    icon: "7",
    color: "#0b3d2e",
    description:
      "Types of failures, redundancy, replication, checkpointing, failover, horizontal vs vertical scalability, load balancing.",
    totalLessons: 4,
    lessons: [
      {
        id: "m7-failures",
        title: "Failures, Detection, and Fault Tolerance",
        type: "notes",
        objectives: [
          "Classify hardware, software, network, and node failures.",
          "Explain failure detection.",
          "Distinguish fault tolerance from fault prevention.",
        ],
        content: `
<h2>7.1 Introduction to Fault Tolerance</h2>
<p>In distributed systems with hundreds or thousands of nodes, component failure is the norm, not the exception. <strong>Fault tolerance</strong> is the ability of a system to continue operating correctly when some components fail.</p>
<div class="callout callout-def">
  <strong>Important Definition</strong>
  Fault tolerance: the property that enables a system to continue operating properly in the event of the failure of some of its components.
</div>

<h2>7.2 Types of Failures</h2>
<table>
  <thead><tr><th>Type</th><th>Description</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td><strong>Hardware</strong></td><td>Physical component fails</td><td>Disk crash, power supply failure</td></tr>
    <tr><td><strong>Software</strong></td><td>Bugs, crashes, incorrect state</td><td>Null pointer, deadlock, memory leak</td></tr>
    <tr><td><strong>Network</strong></td><td>Links or routers fail</td><td>Packet loss, partition, DNS failure</td></tr>
    <tr><td><strong>Node</strong></td><td>Entire machine fails</td><td>Server power loss, kernel panic</td></tr>
  </tbody>
</table>

<h3>Fail-stop vs Byzantine</h3>
<ul>
  <li><strong>Fail-stop:</strong> a component stops and is detected (easier to handle).</li>
  <li><strong>Byzantine:</strong> a component sends incorrect/conflicting information (harder; needs Byzantine fault tolerance).</li>
</ul>

<h2>7.3 Failure Detection</h2>
<ul>
  <li><strong>Heartbeats:</strong> periodic "I'm alive" messages; absence implies failure.</li>
  <li><strong>Timeouts:</strong> if no response within time T, suspect failure.</li>
  <li><strong>Gossip protocols:</strong> nodes exchange state to disseminate failure news.</li>
</ul>

<h2>7.4 Redundancy and Replication</h2>
<p><strong>Redundancy</strong> = extra components that can take over. <strong>Replication</strong> = keeping copies of data or services on multiple nodes so one failure does not lose data or availability.</p>
<div class="callout callout-confusion">
  <strong>Common Confusion</strong>
  Replication is copying data/services for availability and performance. Backup is copying data for disaster recovery — backups are offline/archival; replicas are live.
</div>

<h2>7.5 Checkpointing and Recovery</h2>
<ul>
  <li><strong>Checkpointing:</strong> periodically saving system state to stable storage so recovery can resume from the last checkpoint rather than restart from scratch.</li>
  <li><strong>Recovery:</strong> rolling back to a checkpoint and replaying logs (rollback recovery) or redoing work from a known state.</li>
  <li><strong>Failover:</strong> automatically switching to a standby replica when the primary fails.</li>
</ul>

<div class="callout callout-exam">
  <strong>Exam Alert</strong>
  Explain checkpointing vs failover; define replication vs backup; explain how a standby takes over (failover) and what state it resumes from (checkpoint/log).
</div>

<h2>7.6 Reliability vs Availability</h2>
<table>
  <thead><tr><th></th><th>Reliability</th><th>Availability</th></tr></thead>
  <tbody>
    <tr><td>Meaning</td><td>Probability of correct operation over time (MTBF)</td><td>Fraction of time system is operational</td></tr>
    <tr><td>Metric</td><td>Mean Time Between Failures</td><td>Uptime % (e.g., "five nines" = 99.999%)</td></tr>
  </tbody>
</table>

<div class="callout callout-remember">
  <strong>Remember This</strong>
  A system can be available but unreliable (frequent short outages) or reliable but unavailable (rare but long outages). Users care about availability; engineers design for both.
</div>

<h2>7.7 Interactive: Failure Simulator</h2>
<p>A small cluster of servers with replicated data. Switch a server off and observe how requests reroute and replicas serve clients.</p>
<div class="sim-panel">
  <div class="sim-header">Distributed System Failure Simulator</div>
  <div class="sim-body" style="grid-template-columns: 300px 1fr;">
    <div class="sim-controls">
      <div class="sim-control">
        <label>Replicas <span id="ft-r-val">3</span></label>
        <input type="range" id="ft-r" min="1" max="5" value="3">
      </div>
      <button class="btn btn-primary btn-sm btn-full" onclick="Lab.ftToggle()">Toggle server state</button>
      <button class="btn btn-outline btn-sm btn-full" onclick="Lab.ftReset()">Reset all</button>
      <div style="margin-top:auto;font-family:var(--font-mono);font-size:0.8rem;color:var(--color-muted);" id="ft-stat">Available: 3/3</div>
    </div>
    <div class="sim-visual" id="ft-visual" style="min-height:300px;">
      <div class="sim-stage">Servers: healthy</div>
    </div>
  </div>
  <div style="padding:0.75rem 1.25rem;border-top:1px solid var(--color-border);font-size:0.85rem;color:var(--color-muted);text-align:center;">
    With N replicas, the system tolerates N−1 simultaneous failures for read availability.
  </div>
</div>
`,
        definitions: [
          { term: "Checkpointing", definition: "Periodically saving state to stable storage for recovery." },
          { term: "Failover", definition: "Switching to a standby replica after primary failure." },
          { term: "Availability", definition: "Fraction of time the system is operational." },
        ],
        examPoints: [
          "Compare hardware, software, network, and node failures.",
          "Explain checkpointing and how recovery uses checkpoints.",
          "Distinguish reliability vs availability.",
          "Compare replication vs backup.",
        ],
        knowledgeCheck: [
          { q: "A node that stops sending heartbeats is suspected of ______.", options: ["Recovery", "Failure", "Replication", "Scaling"], answer: 1 },
          { q: "True or false: Backup and replication mean the same thing.", options: [], answer: null, type: "tf", correct: false },
          { q: "Five nines availability equals ______ % uptime.", options: [], answer: null, type: "fill", correct: "99.999" },
        ],
        resources: [
          { title: "Fault Tolerance", source: "Distributed Systems course", url: "https://www.youtube.com/results?search_query=fault+tolerance+distributed+systems+lecture" },
        ],
      },
      {
        id: "m7-scaling",
        title: "Scalability: Horizontal vs Vertical",
        type: "notes",
        objectives: [
          "Explain horizontal vs vertical scalability.",
          "Describe load balancing and bottlenecks.",
          "Compare replication vs backup and failover vs recovery.",
        ],
        content: `
<h2>7.8 Horizontal vs Vertical Scalability</h2>
<table>
  <thead><tr><th></th><th>Vertical scaling</th><th>Horizontal scaling</th></tr></thead>
  <tbody>
    <tr><td>Approach</td><td>Add CPU/RAM to one machine</td><td>Add more machines to the cluster</td></tr>
    <tr><td>Limit</td><td>Hardware ceiling; expensive</td><td>Complexity, communication, consistency</td></tr>
    <tr><td>Downtime</td><td>Usually required to upgrade</td><td>Can add nodes live</td></tr>
    <tr><td>Example</td><td>Bigger database server</td><td>Add web servers behind a load balancer</td></tr>
  </tbody>
</table>

<div class="callout callout-def">
  <strong>Important Definition</strong>
  Horizontal scalability: adding more nodes to increase capacity. Vertical scalability: upgrading a single node's resources.
</div>

<h2>7.9 Load Balancing and Bottlenecks</h2>
<ul>
  <li><strong>Load balancer:</strong> distributes incoming requests across healthy servers (round-robin, least-connections, weighted).</li>
  <li><strong>Bottleneck:</strong> the component limiting overall throughput (often database, network, or a single lock).</li>
  <li><strong>Performance degradation:</strong> throughput/response time worsens as load increases past capacity.</li>
</ul>

<div class="callout callout-tech">
  <strong>Technical Detail</strong>
  Amdahl's Law applies to scaling too: the serial fraction of your system caps horizontal scalability. Remove bottlenecks and serialise less to scale further.
</div>

<h2>7.10 Comparisons</h2>
<table>
  <thead><tr><th>Pair</th><th>Difference</th></tr></thead>
  <tbody>
    <tr><td>Fault tolerance vs fault prevention</td><td>Tolerance = keep working despite failure; prevention = stop failures occurring</td></tr>
    <tr><td>Reliability vs availability</td><td>Correctness over time vs fraction of time operational</td></tr>
    <tr><td>Horizontal vs vertical scaling</td><td>More nodes vs bigger node</td></tr>
    <tr><td>Replication vs backup</td><td>Live copies vs archived copies</td></tr>
    <tr><td>Failover vs recovery</td><td>Switch to standby vs restore state from checkpoint/log</td></tr>
  </tbody>
</table>

<h2>7.11 Interactive: Scalability Demonstration</h2>
<p>As user requests increase, more servers are added behind a load balancer. Watch queue lengths and response time change.</p>
<div class="sim-panel">
  <div class="sim-header">Server Scaling Demonstration</div>
  <div class="sim-body" style="grid-template-columns: 300px 1fr;">
    <div class="sim-controls">
      <div class="sim-control">
        <label>Requests/sec <span id="sc-r-val">50</span></label>
        <input type="range" id="sc-r" min="10" max="300" value="50">
      </div>
      <div class="sim-control">
        <label>Servers <span id="sc-s-val">2</span></label>
        <input type="range" id="sc-s" min="1" max="10" value="2">
      </div>
      <button class="btn btn-outline btn-sm btn-full" onclick="Lab.scAuto()">Auto-scale</button>
      <div style="margin-top:auto;font-family:var(--font-mono);font-size:0.8rem;color:var(--color-muted);" id="sc-stat">Avg response: — ms</div>
    </div>
    <div class="sim-visual" id="sc-visual" style="min-height:300px;">
      <div class="sim-stage">Configure load and servers</div>
    </div>
  </div>
  <div style="padding:0.75rem 1.25rem;border-top:1px solid var(--color-border);font-size:0.85rem;color:var(--color-muted);text-align:center;">
    Adding servers reduces per-server queue and response time until a new bottleneck appears.
  </div>
</div>
`,
        definitions: [
          { term: "Load balancing", definition: "Distributing requests across multiple servers." },
          { term: "Bottleneck", definition: "The resource limiting system throughput." },
          { term: "Horizontal scalability", definition: "Adding nodes to increase capacity." },
        ],
        examPoints: [
          "Compare vertical and horizontal scaling with examples.",
          "Explain load balancing and how it prevents overload.",
          "Define bottleneck and performance degradation.",
          "Complete the five comparison pairs from the table.",
        ],
        knowledgeCheck: [
          { q: "Adding more servers to a cluster is ______ scaling.", options: ["Vertical", "Horizontal", "Diagonal", "Linear"], answer: 1 },
          { q: "True or false: Vertical scaling usually requires downtime.", options: [], answer: null, type: "tf", correct: true },
          { q: "A ______ distributes incoming requests across healthy servers.", options: [], answer: null, type: "fill", correct: "load balancer" },
        ],
        resources: [
          { title: "Horizontal vs Vertical Scaling", source: "AWS", url: "https://www.youtube.com/results?search_query=horizontal+vs+vertical+scaling+aws" },
        ],
      },
    ],
  },

  /* ========================================================================
     MODULE 8 — EMERGING TRENDS
     ======================================================================== */
  {
    id: "trends",
    title: "Emerging Trends and Future Directions",
    short: "Cloud, serverless, edge, fog, quantum, containers, Kubernetes, green computing",
    icon: "8",
    color: "#155239",
    description:
      "Cloud computing, serverless, edge/fog computing, containers, Kubernetes, quantum, AI, green computing.",
    totalLessons: 4,
    lessons: [
      {
        id: "m8-cloud",
        title: "Cloud, Serverless, Edge and Fog Computing",
        type: "notes",
        objectives: [
          "Define cloud, serverless, edge, and fog computing.",
          "Relate each to parallel and distributed computing.",
          "Give practical examples.",
        ],
        content: `
<h2>8.1 Cloud Computing</h2>
<p>The on-demand delivery of computing resources (servers, storage, databases, networking, software) over the Internet, typically pay-as-you-go. Clouds are massive distributed data centres.</p>
<p><strong>Service models:</strong> IaaS (infrastructure), PaaS (platform), SaaS (software). <strong>Deployment models:</strong> public, private, hybrid.</p>
<div class="callout callout-def">
  <strong>Important Definition</strong>
  Cloud computing: ubiquitous, convenient, on-demand network access to a shared pool of configurable computing resources (NIST definition).
</div>
<h2>8.2 Serverless Computing</h2>
<p>Developers write functions; the cloud provider manages servers, scaling, and patching. You are billed per invocation and duration, not per always-on server.</p>
<div class="callout callout-def">
  <strong>Important Definition</strong>
  Serverless computing: an execution model where the cloud provider dynamically manages server allocation; code runs in response to events (FaaS).
</div>
<h2>8.3 Edge and Fog Computing</h2>
<table>
  <thead><tr><th></th><th>Edge computing</th><th>Fog computing</th></tr></thead>
  <tbody>
    <tr><td>Location</td><td>On the device/sensor itself</td><td>Between edge and cloud (local gateway)</td></tr>
    <tr><td>Goal</td><td>Ultra-low latency, bandwidth saving</td><td>Regional aggregation, scale</td></tr>
    <tr><td>Example</td><td>Smartphone face unlock</td><td>Factory floor gateway</td></tr>
  </tbody>
</table>

<div class="callout callout-real">
  <strong>Real-World Application</strong>
  Autonomous vehicles process sensor data at the edge (millisecond decisions) while sending aggregates to the cloud for training.
</div>

<h2>8.4 Relationship to Parallel & Distributed Computing</h2>
<p>All these are distributed systems: resources are geographically spread, coordinate via network, fail independently, and need scalability and fault tolerance. Cloud = large-scale distributed computing; edge/fog = distributed computing brought close to users; serverless = distributed functions on demand.</p>
`,
        definitions: [
          { term: "Cloud computing", definition: "On-demand network access to a shared pool of configurable computing resources." },
          { term: "Serverless computing", definition: "Provider-managed execution of functions in response to events." },
          { term: "Edge computing", definition: "Processing at or near the data source." },
        ],
        examPoints: [
          "Define cloud, serverless, edge, fog computing.",
          "Compare edge vs fog with examples.",
          "Explain how each relates to distributed computing.",
        ],
        knowledgeCheck: [
          { q: "In serverless computing, the developer manages:", options: ["Servers", "Only functions/code", "Data centres", "Nothing at all"], answer: 1 },
          { q: "True or false: Edge computing reduces latency by processing near the data source.", options: [], answer: null, type: "tf", correct: true },
          { q: "Fog computing sits between ______ and the cloud.", options: [], answer: null, type: "fill", correct: "the edge" },
        ],
        resources: [
          { title: "What is Cloud Computing?", source: "AWS", url: "https://aws.amazon.com/what-is-cloud-computing/" },
        ],
      },
      {
        id: "m8-containers",
        title: "Containers, Kubernetes, GPU and Quantum Computing",
        type: "notes",
        objectives: [
          "Explain containerisation and Kubernetes.",
          "Describe GPU acceleration and heterogeneous computing.",
          "Outline quantum computing basics.",
        ],
        content: `
<h2>8.5 Containerisation</h2>
<p>Containers package an application with its dependencies into a lightweight, portable unit that runs consistently anywhere. Unlike VMs, containers share the host OS kernel.</p>
<h2>8.6 Kubernetes</h2>
<p><strong>Kubernetes (K8s)</strong> automates deployment, scaling, and management of containerised applications across clusters of nodes — self-healing, rollouts, load balancing.</p>
<h2>8.7 GPU Acceleration and Heterogeneous Computing</h2>
<p><strong>Heterogeneous computing</strong> uses different processor types (CPU + GPU + FPGA) for the workloads they suit best. GPUs accelerate data-parallel tasks (AI training, graphics, simulation).</p>
<h2>8.8 Quantum Computing</h2>
<p>Uses quantum bits (qubits) and phenomena (superposition, entanglement) to solve certain problems (factoring, search, simulation) exponentially faster than classical computers. Still emerging; error rates are high.</p>
<h2>8.9 AI/ML in Distributed Systems</h2>
<p>Training large models requires distributed data-parallel computation across GPU clusters; distributed parameter servers synchronise gradients.</p>
<div class="callout callout-real">
  <strong>Real-World Application</strong>
  Large language models (e.g., GPT) are trained on thousands of GPUs in parallel across distributed clusters.
</div>

<h2>8.10 Green and Energy-Efficient Computing</h2>
<p>Data centres consume enormous power. Green computing improves energy efficiency via efficient hardware, workload scheduling, renewable energy, and turning off idle servers. Dynamic voltage/frequency scaling and right-sizing reduce waste.</p>

<div class="callout callout-exam">
  <strong>Exam Alert</strong>
  Define Kubernetes and its role; compare containers vs VMs; explain heterogeneous computing; name one green-computing technique.
</div>
`,
        definitions: [
          { term: "Container", definition: "Lightweight, portable unit packaging app + dependencies." },
          { term: "Kubernetes", definition: "Orchestration platform for containerised clusters." },
          { term: "Heterogeneous computing", definition: "Using mixed processor types (CPU/GPU/FPGA) per workload." },
        ],
        examPoints: [
          "Define containerisation and Kubernetes.",
          "Compare containers vs virtual machines.",
          "Explain heterogeneous computing.",
          "Name green-computing techniques.",
        ],
        knowledgeCheck: [
          { q: "Kubernetes is primarily a ______.", options: ["Programming language", "Container orchestrator", "Database", "Cloud provider"], answer: 1 },
          { q: "True or false: Containers share the host OS kernel.", options: [], answer: null, type: "tf", correct: true },
          { q: "Green computing aims to reduce ______ of computing systems.", options: [], answer: null, type: "fill", correct: "energy/environmental impact" },
        ],
        resources: [
          { title: "What is Kubernetes?", source: "Kubernetes.io", url: "https://kubernetes.io/docs/concepts/overview/" },
        ],
      },
      {
        id: "m8-future",
        title: "Future Directions and Course Synthesis",
        type: "notes",
        objectives: [
          "Synthesise how emerging trends build on parallel/distributed foundations.",
          "Identify open research directions.",
        ],
        content: `
<h2>8.11 Future Directions</h2>
<ul>
  <li><strong>Disaggregated infrastructure:</strong> CPU, memory, and storage as separate networked resources.</li>
  <li><strong>AI-optimised systems:</strong> hardware/software co-design for machine learning at scale.</li>
  <li><strong>Quantum-classical hybrid:</strong> quantum processors used as accelerators alongside classical clusters.</li>
  <li><strong>Sustainable computing:</strong> carbon-aware scheduling, energy-proportional hardware.</li>
  <li><strong>Edge AI:</strong> machine learning inference distributed to edge devices.</li>
</ul>

<div class="callout callout-remember">
  <strong>Remember This</strong>
  Every emerging technology in this module rests on the same foundations: distribution, parallelism, communication, synchronisation, fault tolerance, and scalability. Mastering those foundations lets you learn any new platform quickly.
</div>

<h2>8.12 Course Synthesis</h2>
<p>You have covered: foundations and performance laws (Module 1), parallel architectures (Module 2), distributed architecture (Module 3), parallel algorithms and programming (Module 4), MapReduce (Module 5), Hadoop (Module 6), fault tolerance and scalability (Module 7), and emerging trends (Module 8). Themes recurring throughout: <strong>divide work, communicate efficiently, tolerate failure, scale out.</strong></p>
`,
        definitions: [],
        examPoints: [],
        knowledgeCheck: [],
        resources: [],
      },
    ],
  },
  ],
};

/*
 * Examination content — Section A and Section B
 * Structured to match the specified examination structure exactly.
 */
const EXAM_CONTENT = {
  sections: [
    {
      id: "section-a",
      title: "Section A — Compulsory Questions",
      description: "Two compulsory examination questions covering serverless computing and Hadoop.",
      weeks: [
        {
          id: "secA-serverless",
          title: "Question 1: Serverless Computing",
          intro: "Detailed notes and model answers for the compulsory serverless computing question.",
          content: `
<h2>Serverless Computing — Examination Notes</h2>
<div class="callout callout-def">
  <strong>Important Definition</strong>
  Serverless computing is a cloud execution model in which the provider dynamically manages the provisioning and scaling of servers; developers deploy functions that run in response to events and are billed only for actual execution time.
</div>
<h3>How it works</h3>
<ol>
  <li>Developer uploads a function (code) to a FaaS platform.</li>
  <li>An event (HTTP request, file upload, timer, message queue) triggers the function.</li>
  <li>The provider provisions a container, runs the function, and tears it down.</li>
  <li>Billing is per invocation and per millisecond of execution.</li>
</ol>
<h3>FaaS vs BaaS</h3>
<table>
  <thead><tr><th></th><th>FaaS (Function as a Service)</th><th>BaaS (Backend as a Service)</th></tr></thead>
  <tbody>
    <tr><td>Focus</td><td>Running event-driven code</td><td>Managed backend services (auth, database, storage)</td></tr>
    <tr><td>Example</td><td>AWS Lambda, Azure Functions</td><td>Firebase, Auth0</td></tr>
  </tbody>
</table>
<div class="callout callout-exam">
  <strong>Exam Alert</strong>
  Contrast serverless vs traditional cloud: no server management, automatic scaling, pay-per-use vs pay-for-always-on VMs. Draw an event-driven architecture diagram (trigger → function → response).
</div>
<h3>Advantages</h3><ul><li>No server administration</li><li>Automatic scaling</li><li>Cost efficiency (pay per use)</li><li>Faster time to market</li></ul>
<h3>Disadvantages</h3><ul><li>Cold start latency</li><li>Vendor lock-in</li><li>Limited execution time/memory</li><li>Harder to debug and test locally</li></ul>
<h3>Applications</h3><ul><li>Image/video processing on upload</li><li>Webhooks and chatbots</li><li>Data validation and ETL triggers</li><li>IoT backends</li></ul>
<h3>Possible examination questions</h3>
<ol>
  <li>Define serverless computing and explain how it works.</li>
  <li>Compare FaaS and BaaS.</li>
  <li>Compare serverless vs traditional cloud computing (advantages/disadvantages).</li>
  <li>Draw a serverless event-driven architecture and label the components.</li>
</ol>
<h3>Model answer outline (Q1)</h3>
<div class="callout callout-tech">
  <strong>Model answer structure</strong><br>
  1. Definition (FaaS, event-driven, provider-managed servers).<br>
  2. How it works: upload function → event trigger → container provisioning → execution → teardown → pay-per-use.<br>
  3. Diagram: Event source → API Gateway → FaaS platform → Function → Response.<br>
  4. Advantages (scaling, cost, ops) vs disadvantages (cold start, lock-in, limits).<br>
  5. Example: image thumbnail generation on S3 upload.
</div>
`,
          questions: [
            {
              id: "s1-q1",
              type: "mcq",
              question: "In serverless computing, the customer is billed primarily for:",
              options: ["Reserved server capacity", "Actual function execution time and invocations", "Fixed monthly VM cost", "Data centre floor space"],
              answer: 1,
              explanation: "Serverless is pay-per-use: you pay per invocation and per millisecond, not for idle server capacity."
            },
            {
              id: "s1-q2",
              type: "tf",
              question: "Serverless computing means there are no servers at all.",
              answer: false,
              explanation: "Servers still exist; the provider manages them. 'Serverless' means the developer does not manage them."
            },
            {
              id: "s1-q3",
              type: "fill",
              question: "Functions that run in response to events in serverless computing are called ______.",
              answer: "FaaS / functions",
              explanation: "Function as a Service (FaaS) runs event-triggered functions."
            },
            {
              id: "s1-q4",
              type: "short",
              question: "State two advantages and two disadvantages of serverless computing.",
              modelAnswer: "Advantages: no server management, automatic scaling, pay-per-use cost, faster deployment. Disadvantages: cold-start latency, vendor lock-in, limited execution time/memory, harder debugging.",
              keywords: ["no server management", "automatic scaling", "pay-per-use", "cold start", "vendor lock-in"],
              structure: "List two advantages, then two disadvantages, each with a one-sentence explanation."
            },
            {
              id: "s1-q5",
              type: "long",
              question: "Compare serverless computing with traditional cloud computing (IaaS VMs). Include a diagram description.",
              modelAnswer: "Traditional cloud (IaaS): customer provisions and manages VMs, pays while running, responsible for patching/scaling. Serverless: provider manages servers, functions run on events, automatic scaling, pay per invocation. Diagram: client → event source → API gateway → FaaS → function → response; versus client → load balancer → VM → application.",
              keywords: ["event-driven", "pay-per-use", "automatic scaling", "provider-managed", "FaaS"],
              structure: "Introduction; comparison table or bullets; diagram description; conclusion on when to use each."
            },
          ],
        },
        {
          id: "secA-hadoop",
          title: "Question 2: Apache Hadoop and Its Ecosystem",
          intro: "Architecture diagrams, component identification, and model answers for the compulsory Hadoop question.",
          content: `
<h2>Apache Hadoop and Its Ecosystem — Examination Notes</h2>
<h3>Hadoop architecture</h3>
<p>Hadoop = HDFS (storage) + YARN (resource management) + MapReduce (processing) + Hadoop Common (libraries). It runs on clusters of commodity machines and tolerates routine hardware failure.</p>
<h3>HDFS</h3><ul><li>Files split into blocks (default 128 MB), replicated (default ×3) across DataNodes.</li><li>NameNode = metadata/namespace master; DataNodes store blocks and heartbeat.</li><li>Secondary NameNode checkpoints the namespace.</li></ul>
<h3>YARN</h3><ul><li>ResourceManager arbitrates cluster resources.</li><li>NodeManager runs containers on each node.</li><li>ApplicationMaster negotiates resources per application.</li></ul>
<h3>MapReduce</h3><ul><li>Map → shuffle/sort → Reduce; key-value pairs throughout.</li></ul>
<div class="callout callout-exam">
  <strong>Exam Alert</strong>
  Label a Hadoop architecture diagram: client, NameNode, DataNodes, ResourceManager, NodeManagers. Explain data flow: client submits job → YARN → containers → HDFS reads/writes.
</div>
<h3>Ecosystem tools (state what, problem, Hadoop relationship)</h3>
<ul><li>Hive: SQL-like warehouse over HDFS.</li><li>Pig: Pig Latin data-flow scripts.</li><li>HBase: NoSQL random access on HDFS.</li><li>Sqoop: SQL-to-Hadoop transfer.</li><li>Flume: log aggregation into HDFS.</li><li>Spark: fast in-memory processing on YARN.</li><li>ZooKeeper: coordination (config, locks, leader election).</li><li>Oozie: workflow scheduler.</li></ul>
<h3>Possible examination questions</h3>
<ol>
  <li>Draw and label the Hadoop architecture diagram.</li>
  <li>Explain HDFS: NameNode, DataNode, blocks, replication.</li>
  <li>Describe YARN components (RM, NM, AM) and containers.</li>
  <li>For two ecosystem tools: what it is, the problem solved, relation to Hadoop.</li>
  <li>Advantages and disadvantages of Hadoop.</li>
</ol>
<h3>Model answer outline (Q2)</h3>
<div class="callout callout-tech">
  <strong>Model answer structure</strong><br>
  1. Diagram: HDFS (NameNode + DataNodes) + YARN (RM, NM, AM) + MapReduce jobs.<br>
  2. HDFS details: blocks, replication ×3, heartbeats, NameNode as metadata master (SPOF).<br>
  3. YARN: RM assigns resources, NM launches containers, AM per app.<br>
  4. Ecosystem: two tools with what/problem/relationship.<br>
  5. Pros (scalability, fault tolerance, cheap hardware) vs cons (batch latency, complexity, NameNode SPOF).
</div>
`,
          questions: [
            {
              id: "s2-q1",
              type: "mcq",
              question: "Which Hadoop component stores file-system metadata and the namespace?",
              options: ["DataNode", "NameNode", "NodeManager", "ResourceManager"],
              answer: 1,
              explanation: "The NameNode stores the namespace and block mapping; DataNodes store actual data."
            },
            {
              id: "s2-q2",
              type: "tf",
              question: "YARN's ApplicationMaster runs once per node in the cluster.",
              answer: false,
              explanation: "There is one ApplicationMaster per application; NodeManagers run once per node."
            },
            {
              id: "s2-q3",
              type: "fill",
              question: "HDFS default block size is ______ and default replication factor is ____.",
              answer: "128 MB, 3",
              explanation: "Standard Hadoop defaults."
            },
            {
              id: "s2-q4",
              type: "short",
              question: "Name two Hadoop ecosystem tools and state the problem each solves.",
              modelAnswer: "Hive — provides SQL-like querying over HDFS for analysts who don't write Java. Spark — provides fast, in-memory processing for iterative algorithms such as machine learning.",
              keywords: ["Hive", "SQL", "Spark", "in-memory"],
              structure: "Name tool → one-sentence problem statement."
            },
            {
              id: "s2-q5",
              type: "long",
              question: "Describe how the Hadoop components work together when a user runs a MapReduce job.",
              modelAnswer: "Client submits job to YARN ResourceManager. RM allocates containers on NodeManagers. ApplicationMaster coordinates map tasks; maps read input splits from HDFS (DataNodes), write intermediate output locally. Shuffle transfers data to reducers; reducers write final results back to HDFS. NameNode provides block locations; DataNodes serve blocks.",
              keywords: ["ResourceManager", "ApplicationMaster", "NodeManager", "HDFS", "shuffle"],
              structure: "Step-by-step flow: submission → scheduling → map → shuffle → reduce → output; name each component's role."
            },
          ],
        },
      ],
    },
    {
      id: "section-b",
      title: "Section B — Week-by-Week Preparation",
      description: "Focused preparation matched to weeks 1–2, 3–4, 5–6, 7–8, and 13–14.",
      weeks: [
        {
          id: "week-1-2",
          title: "Week 1 & 2 — Introduction to Parallel and Distributed Systems",
          intro: "Modules 1 and 2. Definitions, short answers, long answers, comparisons, diagrams, applications.",
          content: `
<h2>Week 1 & 2 — Introduction to Parallel and Distributed Systems</h2>
<p><strong>Confirmed topics:</strong> parallel computing definition, distributed computing definition, evolution of computing systems, why parallel/distributed are necessary, sequential vs parallel, parallelism vs concurrency, distributed vs centralised, characteristics, applications, advantages/disadvantages, challenges, speedup, efficiency, throughput, latency, Amdahl's Law, Gustafson's Law.</p>
<h3>Key definitions</h3><ul>
  <li>Parallel computing; distributed computing; concurrency vs parallelism.</li>
  <li>Speedup S(p) = T(1)/T(p); efficiency E(p) = S(p)/p.</li>
  <li>Amdahl's Law: S(p) = 1/((1−P)+P/p); Gustafson's Law (scaled speedup).</li>
</ul>
<div class="callout callout-exam">
  <strong>Exam Alert</strong>
  Calculation question: given serial fraction and processor count, compute speedup via Amdahl's Law. Concept question: distinguish concurrency from parallelism with an analogy.
</div>
<h3>Short-answer questions</h3><ol>
  <li>Define parallel computing and distributed computing in one sentence each.</li>
  <li>State Amdahl's Law formula and explain the serial bottleneck.</li>
  <li>Give two differences between concurrent and parallel execution.</li>
  <li>Define throughput and latency.</li>
</ol>
<h3>Long-answer questions</h3><ol>
  <li>Explain why clock-frequency scaling ended and why the industry moved to parallel and distributed systems.</li>
  <li>Compare sequential vs parallel computing with a worked speedup example.</li>
  <li>Describe four challenges in parallel/distributed systems (e.g., synchronisation, load balancing).</li>
</ol>
<h3>Diagram-based questions</h3><ol>
  <li>Draw a timeline of four workers doing four tasks sequentially vs in parallel; label idle time.</li>
  <li>Sketch Amdahl's Law speedup curve and mark the asymptote 1/(1−P).</li>
</ol>
<h3>Application-based questions</h3><ol>
  <li>A weather model takes 100 hours sequentially; 80% parallelises. Compute speedup on 8 processors (Amdahl).</li>
  <li>Choose parallel or distributed for: (a) rendering a film frame on one workstation; (b) serving a global website.</li>
</ol>
`,
          questions: [
            { id: "w1-q1", type: "mcq", question: "Amdahl's Law bounds speedup by:", options: ["Number of processors", "The serial fraction", "Memory size", "Network bandwidth"], answer: 1, explanation: "As p→∞, S → 1/(1−P), set by the serial fraction." },
            { id: "w1-q2", type: "tf", question: "Concurrency and parallelism mean the same thing.", answer: false, explanation: "Concurrency is structure (overlap in time); parallelism is simultaneous execution." },
            { id: "w1-q3", type: "fill", question: "Speedup = T(1) ÷ T(____).", answer: "p", explanation: "T(p) is parallel execution time with p processors." },
            { id: "w1-q4", type: "short", question: "Distinguish parallelism from concurrency using an analogy.", modelAnswer: "Concurrency = one chef switching between dishes over time; parallelism = two chefs cooking dishes at the same instant.", keywords: ["concurrency", "parallelism", "simultaneous", "analogy"], structure: "Define each, then give the chef/worker analogy." },
            { id: "w1-q5", type: "long", question: "Explain why parallel and distributed computing became necessary, citing physical and economic limits.", modelAnswer: "Clock speeds hit power/thermal walls; one processor cannot solve web-scale problems; commodity clusters are cheaper than one supercomputer; distribution adds fault tolerance and geographic reach.", keywords: ["power wall", "thermal wall", "scalability", "fault tolerance", "cost"], structure: "Physical limits → problem scale → cost → reliability → geography." },
          ],
        },
        {
          id: "week-3-4",
          title: "Week 3 & 4 — Parallel and Distributed Architectures",
          intro: "Flynn's Taxonomy, shared/distributed memory, client-server, peer-to-peer, middleware, RPC/RMI.",
          content: `
<h2>Week 3 & 4 — Parallel Processing and Distributed Systems Architecture</h2>
<p><strong>Confirmed topics:</strong> Flynn's Taxonomy (SISD, SIMD, MISD, MIMD); shared-memory vs distributed-memory; multicore, multiprocessor, MPP; CPU vs GPU; client-server; peer-to-peer; distributed communication; middleware; RPC and RMI.</p>
<h3>Key definitions</h3><ul>
  <li>Flynn's four classes by instruction stream × data stream.</li>
  <li>UMA vs NUMA; SMP vs MPP.</li>
  <li>RPC: remote procedure called as if local; RMI: Java remote method invocation.</li>
</ul>
<div class="callout callout-exam">
  <strong>Exam Alert</strong>
  Draw Flynn's 2×2 matrix and classify a GPU (SIMD) and a multicore server (MIMD). Label a client-server diagram with client, application server, database server, and network.
</div>
<h3>Short-answer questions</h3><ol>
  <li>List Flynn's four architecture classes with one example each.</li>
  <li>State one difference between shared-memory and distributed-memory systems.</li>
  <li>What is middleware?</li>
  <li>How does RPC differ from raw message passing?</li>
</ol>
<h3>Long-answer questions</h3><ol>
  <li>Compare client-server vs peer-to-peer architecture (structure, failure, scalability).</li>
  <li>Compare CPU vs GPU architecture (cores, optimisation, use cases).</li>
  <li>Explain UMA and NUMA; when does NUMA help?</li>
</ol>
<h3>Diagram-based questions</h3><ol>
  <li>Draw Flynn's taxonomy matrix; put SISD/SIMD/MISD/MIMD in quadrants.</li>
  <li>Draw client-server: client ↔ network ↔ application server ↔ database server.</li>
</ol>
<h3>Application-based questions</h3><ol>
  <li>Classify: weather simulation on a cluster; pixel shader on GPU; bank ATM network.</li>
  <li>Choose an architecture for a startup needing to scale cheaply.</li>
</ol>
`,
          questions: [
            { id: "w3-q1", type: "mcq", question: "A GPU shader applying one operation to millions of pixels is:", options: ["SISD", "SIMD", "MISD", "MIMD"], answer: 1, explanation: "One instruction, many data → SIMD." },
            { id: "w3-q2", type: "tf", question: "In distributed memory, processors can directly read each other's memory.", answer: false, explanation: "Distributed memory = private memory; communication is by message passing." },
            { id: "w3-q3", type: "fill", question: "MIMD stands for Multiple Instruction, Multiple ______.", answer: "Data", explanation: "Each processor runs its own instruction stream on its own data." },
            { id: "w3-q4", type: "short", question: "Compare shared-memory vs distributed-memory communication.", modelAnswer: "Shared memory: load/store to common address space, fast, limited scalability. Distributed memory: message passing over network, higher latency, scales to thousands of nodes.", keywords: ["load/store", "message passing", "scalability", "latency"], structure: "One sentence each; contrast mechanism and scale." },
            { id: "w3-q5", type: "long", question: "Draw and explain Flynn's Taxonomy. Give a real system for each class.", modelAnswer: "Matrix: instruction stream (single/multiple) × data stream (single/multiple). SISD: classic PC (sequential). SIMD: GPU shader / AVX. MISD: redundant fault-tolerant checkers (rare). MIMD: multicore CPU, clusters, cloud servers.", keywords: ["instruction stream", "data stream", "SISD", "SIMD", "MISD", "MIMD"], structure: "Define axes → four cells with examples → summary table." },
          ],
        },
        {
          id: "week-5-6",
          title: "Week 5 & 6 — Server Networks and Distributed Computing Concepts",
          intro: "Networking and distributed-system principles. Additional supporting material beyond the confirmed course outline is marked.",
          content: `
<h2>Week 5 & 6 — Server Networks and Distributed Computing Concepts</h2>
<div class="callout callout-tech">
  <strong>Supporting material note</strong>
  The exact lecturer-provided topics for these weeks were not supplied. The coverage below follows the stated outline (server architecture, client-server communication, nodes, message passing, protocols, resource sharing, scalability, reliability, communication challenges). Items marked ★ are supporting material.
</div>
<h3>Server architecture and client-server communication</h3><ul>
  <li>Client initiates; server listens; request-response over TCP/IP (★).</li>
  <li>Stateless vs stateful servers (★).</li>
  <li>HTTP/HTTPS as the web application protocol (★).</li>
</ul>
<h3>Distributed nodes and message passing</h3><ul>
  <li>Node = independent computing element with private memory.</li>
  <li>Message passing: explicit send/receive; marshaling of data (★).</li>
  <li>Sockets as the API for network communication (★).</li>
</ul>
<h3>Network protocols and reliability</h3><ul>
  <li>TCP: reliable, ordered delivery; UDP: fast, unreliable (★).</li>
  <li>Distributed resource sharing: file systems, printers, compute across nodes.</li>
  <li>Scalability: adding nodes; reliability: continuing despite failures.</li>
</ul>
<h3>Communication challenges</h3><ul>
  <li>Latency and partial failure (network may drop some messages).</li>
  <li>No global clock; clock synchronisation (★ Lamport logical clocks).</li>
  <li>Bandwidth limits and congestion.</li>
</ul>
<div class="callout callout-exam">
  <strong>Exam Alert</strong>
  Expect definitions (node, message passing, socket), comparisons (TCP vs UDP; stateful vs stateless), and short explanations of why network communication is harder than local calls (latency, partial failure, no shared memory).
</div>
`,
          questions: [
            { id: "w5-q1", type: "mcq", question: "TCP provides:", options: ["Unreliable datagrams", "Reliable, ordered byte stream", "No connection setup", "Multicast only"], answer: 1, explanation: "TCP guarantees reliable, in-order delivery; UDP does not." },
            { id: "w5-q2", type: "tf", question: "A distributed node has its own private memory.", answer: true, explanation: "Nodes do not share memory; they coordinate by messages." },
            { id: "w5-q3", type: "fill", question: "The API most programs use for network communication is ______.", answer: "sockets", explanation: "Sockets are the standard interface to TCP/UDP." },
            { id: "w5-q4", type: "short", question: "State two challenges of network communication in distributed systems.", modelAnswer: "Latency (messages take time) and partial failure (some messages/nodes may fail while others work).", keywords: ["latency", "partial failure", "network"], structure: "Two challenges, one sentence each." },
            { id: "w5-q5", type: "long", question: "Explain why remote procedure calls are harder than local procedure calls.", modelAnswer: "Network latency; partial failure (call may fail without client knowing); serialization/marshaling of parameters; no shared memory; timeouts and retries needed; idempotency concerns.", keywords: ["latency", "partial failure", "marshaling", "timeout", "idempotency"], structure: "Intro → bullet challenges → summary." },
          ],
        },
        {
          id: "week-7-8",
          title: "Week 7 & 8 — Open MPI and CUDA Theory",
          intro: "Theory-focused. Detailed explanations, labelled diagrams, comparisons, examination questions. Programming is not the main focus.",
          content: `
<h2>Week 7 & 8 — Open MPI and CUDA Theory</h2>
<h3>Open MPI — Message Passing Interface</h3>
<ul>
  <li><strong>MPI</strong> is a standardised, portable message-passing library for distributed-memory parallel programming.</li>
  <li>Purpose: coordinate processes on clusters where memory is not shared.</li>
  <li>Program model: multiple independent processes, each with its own address space; they exchange data via send/receive calls.</li>
  <li><strong>Communicator</strong> (e.g., MPI_COMM_WORLD): the group of processes that can communicate.</li>
  <li><strong>Point-to-point:</strong> MPI_Send / MPI_Recv between two processes.</li>
  <li><strong>Collective:</strong> MPI_Bcast (broadcast), MPI_Reduce, MPI_Scatter, MPI_Gather — involve groups.</li>
  <li><strong>Synchronisation:</strong> MPI_Barrier makes all processes wait until everyone reaches it.</li>
</ul>
<div class="callout callout-exam">
  <strong>Exam Alert</strong>
  Contrast point-to-point vs collective communication; name MPI_Bcast, MPI_Reduce, MPI_Barrier; explain a communicator; state MPI pros (portable, scalable) and cons (explicit, verbose).
</div>
<h3>CUDA — Compute Unified Device Architecture</h3>
<ul>
  <li><strong>CUDA</strong> is NVIDIA's parallel computing platform and programming model for GPUs.</li>
  <li><strong>Host</strong> = CPU; <strong>device</strong> = GPU. Data copies between host and device memory.</li>
  <li><strong>Kernel</strong> = function executed in parallel on the device by many threads.</li>
  <li>Execution hierarchy: <strong>thread</strong> → <strong>block</strong> → <strong>grid</strong>.</li>
  <li>Threads in a block cooperate via shared memory; blocks run independently.</li>
  <li>Memory hierarchy: registers, shared memory (block), global memory (all threads).</li>
</ul>
<div class="callout callout-exam">
  <strong>Exam Alert</strong>
  Label the CUDA hierarchy (thread/block/grid) and memory hierarchy; contrast CPU vs GPU; state when CUDA helps (data-parallel, arithmetic-intensive) vs when not (irregular, latency-sensitive).
</div>
<h3>Comparison: Open MPI vs CUDA</h3><table>
  <thead><tr><th></th><th>Open MPI</th><th>CUDA</th></tr></thead>
  <tbody>
    <tr><td>Target</td><td>Distributed-memory clusters (CPUs)</td><td>NVIDIA GPUs (device)</td></tr>
    <tr><td>Memory</td><td>Private per process (messages)</td><td>Host/device; shared + global on GPU</td></tr>
    <tr><td>Parallelism</td><td>Process-level, coarse-grained</td><td>Thread-level, massive data parallelism</td></tr>
  </tbody>
</table>
`,
          questions: [
            { id: "w7-q1", type: "mcq", question: "MPI_Bcast is a ______ operation.", options: ["Point-to-point", "Collective", "Synchronisation only", "One-sided"], answer: 1, explanation: "Broadcast involves all processes in a communicator → collective." },
            { id: "w7-q2", type: "tf", question: "In CUDA, threads share global memory but each thread has private registers.", answer: true, explanation: "Global memory is visible to all threads; registers are per-thread." },
            { id: "w7-q3", type: "fill", question: "CUDA execution order from smallest to largest: thread → ______ → ______.", answer: "block → grid", explanation: "Threads are grouped into blocks; blocks into a grid." },
            { id: "w7-q4", type: "short", question: "Name two MPI collective operations and state what each does.", modelAnswer: "MPI_Bcast — sends one process's data to all processes in the communicator. MPI_Reduce — combines values from all processes (e.g., sum) into one result.", keywords: ["MPI_Bcast", "MPI_Reduce", "collective", "communicator"], structure: "Name each op + one-line function." },
            { id: "w7-q5", type: "long", question: "Describe CUDA's host/device model and execution hierarchy (thread, block, grid).", modelAnswer: "Host (CPU) launches kernels on device (GPU). A grid contains blocks; a block contains threads. Threads execute the same kernel on different data. Blocks run independently and may execute in any order; threads in a block share shared memory.", keywords: ["host", "device", "kernel", "block", "grid", "shared memory"], structure: "Host/device → kernel → hierarchy → memory → execution model." },
          ],
        },
        {
          id: "week-13-14",
          title: "Week 13 & 14 — Final Topics and Comprehensive Revision",
          intro: "Fault tolerance, scalability, recovery, emerging technologies, and whole-course revision questions.",
          content: `
<h2>Week 13 & 14 — Final Course Topics and Revision</h2>
<div class="callout callout-tech">
  <strong>Coverage note</strong>
  Fault tolerance, scalability, distributed recovery, and emerging technologies follow Module 7 and Module 8. If exact week-13/14 lecturer topics are unavailable, this coverage is based on the overall course outline.
</div>
<h3>Fault tolerance and recovery</h3><ul>
  <li>Failure types: hardware, software, network, node.</li>
  <li>Detection: heartbeats, timeouts.</li>
  <li>Redundancy and replication; checkpointing; failover; recovery from logs.</li>
</ul>
<h3>Scalability</h3><ul>
  <li>Vertical vs horizontal scaling; load balancing; bottlenecks; Amdahl's Law as a scalability limit.</li>
</ul>
<h3>Emerging technologies</h3><ul>
  <li>Cloud, serverless, edge/fog, containers, Kubernetes, GPU/heterogeneous, quantum, AI in distributed systems, green computing.</li>
</ul>
<div class="callout callout-exam">
  <strong>Exam Alert</strong>
  Expect integrative questions: "Explain how fault tolerance and scalability interact," or "Choose an architecture (edge vs cloud vs serverless) for a scenario and justify."
</div>
<h3>Comprehensive revision questions (whole course)</h3>
<ol>
  <li>Define parallel vs distributed computing; give one difference.</li>
  <li>Compute speedup with Amdahl's Law (P = 0.9, p = 16).</li>
  <li>Classify a GPU under Flynn's Taxonomy.</li>
  <li>Contrast shared vs distributed memory.</li>
  <li>Draw HDFS; explain NameNode failure impact.</li>
  <li>Trace MapReduce word count: map → shuffle → reduce.</li>
  <li>Compare Hadoop vs Spark.</li>
  <li>Explain checkpointing vs failover.</li>
  <li>Compare vertical vs horizontal scaling.</li>
  <li>Define serverless; give one advantage and one disadvantage.</li>
  <li>Describe CUDA thread/block/grid hierarchy.</li>
</ol>
`,
          questions: [
            { id: "w13-q1", type: "mcq", question: "The NameNode is HDFS's:", options: ["Data store", "Metadata master / single point of failure", "Reduce task", "Load balancer"], answer: 1, explanation: "NameNode stores namespace/metadata; its failure makes HDFS unavailable (without HA)." },
            { id: "w13-q2", type: "tf", question: "Horizontal scaling means adding CPU/RAM to one server.", answer: false, explanation: "That is vertical scaling. Horizontal scaling adds more servers." },
            { id: "w13-q3", type: "fill", question: "MapReduce's middle phase that groups equal keys is called ______.", answer: "shuffle", explanation: "Shuffle and sort groups intermediate key-value pairs by key." },
            { id: "w13-q4", type: "short", question: "State two differences between fault tolerance and fault prevention.", modelAnswer: "Fault tolerance keeps working despite failures; prevention avoids failures entirely. Tolerance assumes failures happen; prevention tries to make them impossible.", keywords: ["tolerance", "prevention", "failure", "assumes"], structure: "Two contrasting sentences." },
            { id: "w13-q5", type: "long", question: "Comprehensive: explain how Amdahl's Law, fault tolerance, and horizontal scaling relate when building a large web service.", modelAnswer: "Amdahl's Law caps speedup from parallelising any one component, so identify and remove serial bottlenecks first. Horizontal scaling adds servers to grow capacity, but only helps the parallelisable part. Fault tolerance (replication, failover, heartbeats) is required because more servers means more failures; replication adds consistency overhead (which itself is serial/coordination work). Balance all three: parallelise, scale out, and tolerate failure without letting coordination become the new bottleneck.", keywords: ["Amdahl's Law", "serial bottleneck", "horizontal scaling", "replication", "fault tolerance", "coordination"], structure: "Three-way relationship: parallelism limits → scaling multiplies → fault tolerance enables reliability at scale." },
          ],
        },
      ],
    },
  ],
};
