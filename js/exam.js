/*
 * ============================================================================
 * EXAMINATION ENGINE
 * Builds a normalised question bank from Section A/B content and module
 * knowledge checks, runs timed exams, auto-marks objective questions, and
 * provides model answers + marking guidance for written questions.
 * ============================================================================
 */

const ExamEngine = (() => {
  /* ---------- Written question bank (curated, module-topic linked) ---------- */
  const WRITTEN_BANK = [
    { id: "wb-intro-1", moduleId: "intro", type: "short", difficulty: "beginner",
      question: "Distinguish between parallel computing and distributed computing.",
      modelAnswer: "Parallel computing executes multiple computations simultaneously, typically on multiple processors within one system sharing memory. Distributed computing coordinates independent networked computers with private memory via message passing, aiming at resource sharing, scalability, and fault tolerance.",
      keywords: ["simultaneous", "processors", "shared memory", "networked", "message passing", "private memory"],
      structure: "Define both, then give two contrasting points (memory model, communication mechanism)." },
    { id: "wb-intro-2", moduleId: "intro", type: "long", difficulty: "intermediate",
      question: "State and explain Amdahl's Law. A program has a 75% parallelisable portion. Calculate the speedup on 8 processors and the theoretical maximum speedup.",
      modelAnswer: "S(p) = 1 / ((1−P) + P/p). With P = 0.75, p = 8: S = 1 / (0.25 + 0.09375) = 1 / 0.34375 ≈ 2.91×. Maximum as p→∞ = 1/(1−0.75) = 4×.",
      keywords: ["S(p) = 1/((1-P)+P/p)", "2.91", "4x", "serial fraction", "limit"],
      structure: "Formula; substitution; calculated result; asymptote explanation." },
    { id: "wb-arch-1", moduleId: "arch", type: "short", difficulty: "beginner",
      question: "Classify a GPU and a multicore CPU under Flynn's Taxonomy, giving reasons.",
      modelAnswer: "A GPU is SIMD (single instruction applied to many data items — many pixels/threads). A multicore CPU is MIMD (each core executes its own instruction stream on its own data). Note CUDA calls the GPU model SIMT, a refinement of SIMD.",
      keywords: ["SIMD", "MIMD", "GPU", "multicore", "instruction stream", "data stream"],
      structure: "Classification + justification for each." },
    { id: "wb-arch-2", moduleId: "arch", type: "long", difficulty: "intermediate",
      question: "Compare shared-memory and distributed-memory architectures, including communication, programming model, and scalability.",
      modelAnswer: "Shared memory: single address space, load/store communication, threads/OpenMP, low latency, limited scalability due to contention and cache coherence. Distributed memory: private memory per node, message passing (MPI), higher latency, scales to thousands of nodes, explicit programming.",
      keywords: ["address space", "load/store", "message passing", "OpenMP", "MPI", "scalability", "cache coherence"],
      structure: "Dimension-by-dimension comparison table/bullets." },
    { id: "wb-dist-1", moduleId: "dist", type: "short", difficulty: "beginner",
      question: "Compare client-server and peer-to-peer architectures.",
      modelAnswer: "Client-server: central server provides services, clients request; simple but central server is a bottleneck/SPOF. P2P: all nodes are both clients and servers, no central coordinator; resilient and scalable but harder to secure/manage.",
      keywords: ["central server", "request-response", "peers", "no central server", "single point of failure", "scalable"],
      structure: "Two paragraphs or a table; finish with a use-case sentence." },
    { id: "wb-dist-2", moduleId: "dist", type: "long", difficulty: "intermediate",
      question: "Explain the seven types of transparency in distributed systems, with one example each.",
      modelAnswer: "Access (same interface local/remote), location (unknown resource location), migration (resource moves), replication (copies hidden), concurrency (shared access hidden), failure (faults hidden), persistence (memory vs disk hidden).",
      keywords: ["access", "location", "migration", "replication", "concurrency", "failure", "persistence"],
      structure: "List all seven with a one-line definition and example each." },
    { id: "wb-algo-1", moduleId: "algo", type: "short", difficulty: "intermediate",
      question: "Distinguish task parallelism from data parallelism.",
      modelAnswer: "Task parallelism runs different tasks concurrently on different data (e.g., audio + video processing). Data parallelism applies the same operation to many data items (e.g., adding 5 to every array element).",
      keywords: ["different tasks", "same operation", "data items", "example"],
      structure: "Definition pair + example pair." },
    { id: "wb-algo-2", moduleId: "algo", type: "long", difficulty: "advanced",
      question: "Define work and span for a parallel algorithm and explain how they bound speedup. Use a tree reduction of n elements as an example.",
      modelAnswer: "Work T₁ = total time on one processor = O(n). Span T∞ = critical path = O(log n). Parallelism = T₁/T∞ = O(n/log n), the maximum speedup. Brent's theorem bounds Tₚ between T∞ and T₁/p + T∞.",
      keywords: ["work", "span", "critical path", "O(n)", "O(log n)", "parallelism", "Brent"],
      structure: "Definitions → tree example → parallelism → bound." },
    { id: "wb-mr-1", moduleId: "mapreduce", type: "long", difficulty: "intermediate",
      question: "Trace the MapReduce word-count job for the input 'the cat eats fish the cat likes fish'. Show map output, shuffle grouping, and reduce output.",
      modelAnswer: "Map emits (the,1),(cat,1),(eats,1),(fish,1),(the,1),(cat,1),(likes,1),(fish,1). Shuffle groups: the→[1,1], cat→[1,1], eats→[1], fish→[1,1], likes→[1]. Reduce: the→2, cat→2, eats→1, fish→2, likes→1.",
      keywords: ["map", "key-value", "shuffle", "group", "reduce", "frequencies"],
      structure: "Input → map pairs → grouped pairs → reduced counts." },
    { id: "wb-mr-2", moduleId: "mapreduce", type: "short", difficulty: "intermediate",
      question: "Describe what happens when a MapReduce worker fails during execution.",
      modelAnswer: "The master detects the failure via missed heartbeats/timeouts, reschedules the worker's completed and in-progress map tasks on healthy workers, and restarts reduce tasks as needed because map outputs were stored locally on the failed node.",
      keywords: ["master", "heartbeat", "reschedule", "map tasks", "local output", "retry"],
      structure: "Detection → rescheduling → why re-execution is safe." },
    { id: "wb-hadoop-1", moduleId: "hadoop", type: "long", difficulty: "intermediate",
      question: "Draw and explain the HDFS architecture. What happens when the NameNode fails?",
      modelAnswer: "NameNode stores namespace/metadata and block locations; DataNodes store replicated blocks (default ×3) and send heartbeats. Client asks NameNode for block locations, then reads/writes directly to DataNodes. If the NameNode fails, HDFS is unavailable until recovery from checkpoint/standby (single point of failure pre-HA).",
      keywords: ["NameNode", "metadata", "DataNode", "blocks", "replication 3", "heartbeat", "single point of failure"],
      structure: "Diagram description → roles → failure impact." },
    { id: "wb-hadoop-2", moduleId: "hadoop", type: "short", difficulty: "intermediate",
      question: "Explain the roles of ResourceManager, NodeManager, and ApplicationMaster in YARN.",
      modelAnswer: "ResourceManager: cluster-wide resource arbitration. NodeManager: per-node agent that launches/monitors containers. ApplicationMaster: per-application coordinator that negotiates containers from the RM and runs tasks via NMs.",
      keywords: ["ResourceManager", "NodeManager", "ApplicationMaster", "containers", "per node", "per application"],
      structure: "Three roles, one sentence each." },
    { id: "wb-fault-1", moduleId: "fault", type: "short", difficulty: "beginner",
      question: "Distinguish fault tolerance from fault prevention, and replication from backup.",
      modelAnswer: "Fault tolerance keeps a system operating despite failures; fault prevention tries to stop failures occurring. Replication keeps live synchronised copies for availability; backup keeps archived copies for disaster recovery.",
      keywords: ["continue operating", "prevent", "live copies", "archive", "availability", "recovery"],
      structure: "Two contrast pairs, one sentence each." },
    { id: "wb-fault-2", moduleId: "fault", type: "long", difficulty: "intermediate",
      question: "Compare horizontal and vertical scaling with examples. Explain the role of load balancing and bottlenecks.",
      modelAnswer: "Vertical: add CPU/RAM to one server; simple but capped and often needs downtime. Horizontal: add servers; scalable and live but adds coordination/consistency cost. Load balancers spread requests across servers; the bottleneck (database, network, lock) limits overall throughput regardless of added servers.",
      keywords: ["vertical", "horizontal", "load balancer", "bottleneck", "throughput", "coordination"],
      structure: "Comparison table → load balancing → bottleneck caveat." },
    { id: "wb-trends-1", moduleId: "trends", type: "short", difficulty: "beginner",
      question: "Define serverless computing and state two advantages and two disadvantages.",
      modelAnswer: "Serverless: provider-managed execution of event-triggered functions billed per use. Advantages: no server management, automatic scaling, pay-per-use. Disadvantages: cold starts, vendor lock-in, execution limits, harder debugging.",
      keywords: ["event-driven", "FaaS", "provider-managed", "automatic scaling", "cold start", "vendor lock-in"],
      structure: "Definition → 2 advantages → 2 disadvantages." },
    { id: "wb-trends-2", moduleId: "trends", type: "long", difficulty: "intermediate",
      question: "Compare cloud, edge, and fog computing, and relate each to parallel/distributed systems.",
      modelAnswer: "Cloud: centralised data-centre resources on demand. Edge: processing at/near the data source for low latency. Fog: intermediate layer between edge and cloud for regional aggregation. All are distributed systems relying on network coordination, scalability, and fault tolerance; edge/fog move computation closer to users.",
      keywords: ["cloud", "edge", "fog", "latency", "distributed", "scalability"],
      structure: "Definitions → comparison table → relation to distributed principles." },
    { id: "wb-week5-1", moduleId: "dist", type: "short", difficulty: "intermediate",
      question: "Why is remote communication fundamentally harder than local procedure calls?",
      modelAnswer: "Latency, partial failure, marshaling/serialisation, lack of shared memory, timeouts/retries, and non-idempotent operations make remote calls unreliable and complex.",
      keywords: ["latency", "partial failure", "marshaling", "timeout", "retry", "idempotency"],
      structure: "List at least three distinct challenges with brief explanation." },
    { id: "wb-week7-1", moduleId: "arch", type: "long", difficulty: "advanced",
      question: "Describe Open MPI's communication model (point-to-point, collective, communicators) and CUDA's execution hierarchy (thread, block, grid).",
      modelAnswer: "MPI: processes in communicators exchange messages; point-to-point uses send/recv; collectives (bcast, reduce, barrier) involve groups. CUDA: host launches kernels on device; grid contains blocks; blocks contain threads; threads share block-level shared memory and all can access global memory.",
      keywords: ["communicator", "point-to-point", "collective", "MPI_Bcast", "kernel", "thread", "block", "grid"],
      structure: "MPI part → CUDA part → one-line comparison." },
    { id: "wb-hadoop-3", moduleId: "hadoop", type: "diagram", difficulty: "intermediate",
      question: "Draw and label the HDFS architecture, showing the client, NameNode, DataNodes, and replicated blocks. Explain the read path for a file.",
      modelAnswer: "Diagram: Client → NameNode (namespace + block map); NameNode → DataNodes (block locations, heartbeats); each block replicated (default ×3) across DataNodes. Read path: client asks the NameNode for block locations, receives the replica list sorted by network distance, then reads each block directly from the nearest healthy DataNode. DataNodes stream the block; if one fails, the client retries another replica.",
      keywords: ["NameNode", "DataNode", "metadata", "block locations", "replication 3", "heartbeat", "client", "nearest replica"],
      structure: "Labelled diagram → roles of each component → numbered read path → failure fallback." },
    { id: "wb-mr-3", moduleId: "mapreduce", type: "diagram", difficulty: "intermediate",
      question: "Draw the six-stage MapReduce word-count pipeline for 'the cat eats fish the cat likes fish'. Label input splits, map output, shuffle/sort, reduce, and final output, and mark where data crosses the network.",
      modelAnswer: "Pipeline: input file → input splits (one per map task) → map emits (word,1) pairs → partition + shuffle/sort groups equal keys at reducers → reduce sums each group → final output. Data crosses the network mainly during the shuffle: map outputs are written to local disk, fetched by reducers, and sorted by key. Example: the→2, cat→2, eats→1, fish→2, likes→1.",
      keywords: ["input split", "map", "key-value", "partition", "shuffle", "sort", "reduce", "network"],
      structure: "Numbered six-stage diagram → annotate map/reduce functions → mark shuffle as the network boundary." },
    { id: "wb-hadoop-4", moduleId: "hadoop", type: "compare", difficulty: "intermediate",
      question: "Compare Hadoop MapReduce and Apache Spark across execution model, latency, fault tolerance, and typical workloads.",
      modelAnswer: "Hadoop MapReduce: disk-based two-phase batch execution; high latency; fault tolerance via task retries and HDFS replication; best for large one-pass ETL over cold data. Spark: in-memory DAG execution with lazy transformations; much lower latency, especially for iterative jobs; fault tolerance via lineage/RDD recomputation plus checkpointing; best for iterative ML, graph processing, interactive analytics, and streaming. Both run on YARN/Kubernetes and read HDFS.",
      keywords: ["disk-based", "in-memory", "DAG", "latency", "lineage", "RDD", "batch", "iterative", "fault tolerance"],
      structure: "Dimension-by-dimension table (execution, latency, fault tolerance, workloads) → one-line recommendation." },
    { id: "wb-fault-3", moduleId: "fault", type: "scenario", difficulty: "advanced",
      question: "Scenario: an e-commerce site runs on one database server at 90% CPU and response times are rising. Propose a scaling plan using horizontal scaling, load balancing, caching, and replication. Identify the next likely bottleneck and the consistency trade-off.",
      modelAnswer: "Add stateless application servers behind a load balancer, move sessions to a shared store, and cache read-heavy catalogue data (CDN/Redis) to cut database load. Scale the database with a primary plus read replicas for read traffic; consider sharding only when a single primary is exhausted. The next bottleneck is likely writes to the primary, cache invalidation, or cross-service network latency. Replicas introduce replication lag, so reads may be stale; choose strong consistency only where required (orders/payments) and eventual consistency for catalogue/feeds. Add monitoring, health checks, and retry/idempotency for partial failures.",
      keywords: ["load balancer", "stateless", "cache", "read replica", "sharding", "write bottleneck", "replication lag", "eventual consistency", "idempotency"],
      structure: "Diagnose → application tier → data tier → bottleneck → consistency trade-off → resilience measures." },
    { id: "wb-trends-3", moduleId: "trends", type: "scenario", difficulty: "advanced",
      question: "Scenario: 5,000 IoT cameras must detect anomalies in under 100 ms, but a round trip to the central cloud takes 180 ms. Recommend where computation should run (edge, fog, cloud) and justify the placement. Discuss failure handling and consistency.",
      modelAnswer: "Run latency-critical inference at the edge (camera or local gateway) to meet the 100 ms budget; use a fog layer for regional aggregation, filtering, and coordination across cameras; use the cloud for model training, long-term storage, dashboards, and fleet management. This hybrid placement reduces WAN traffic and keeps alerts local. If connectivity fails, edge nodes should buffer events and continue local detection (store-and-forward, fail-safe mode). Cloud and edge views may be temporarily inconsistent, so use event time, idempotent event IDs, and eventual consistency; reserve strong consistency for configuration/security actions. Secure the edge, sign model updates, and support OTA rollback.",
      keywords: ["edge", "fog", "cloud", "latency", "local inference", "store-and-forward", "eventual consistency", "OTA updates", "security"],
      structure: "Latency calculation → three-tier placement → justification → failure handling → consistency and security." },
  ];

  /* ---------- Normalisation helpers ---------- */
  function normaliseExamQuestion(q, sectionId, weekId, weekTitle) {
    let answer = q.answer;
    // True/false questions are stored as booleans in content; the UI uses 0/1.
    if ((q.type || "mcq") === "tf" && typeof answer === "boolean") {
      answer = answer ? 0 : 1;
    }
    return {
      id: q.id,
      source: sectionId,
      section: sectionId,
      week: weekId,
      topic: weekTitle,
      type: q.type || "mcq",
      difficulty: q.type === "long" ? "advanced" : q.type === "short" ? "intermediate" : "beginner",
      question: q.question,
      options: q.options || [],
      answer,
      explanation: q.explanation || "",
      modelAnswer: q.modelAnswer || "",
      keywords: q.keywords || [],
      structure: q.structure || "",
    };
  }

  function buildBank() {
    const bank = [];

    // Exam content sections
    EXAM_CONTENT.sections.forEach((sec) => {
      sec.weeks.forEach((wk) => {
        (wk.questions || []).forEach((q) => {
          bank.push(normaliseExamQuestion(q, sec.id, wk.id, wk.title));
        });
      });
    });

    // Module knowledge checks (objective)
    CONTENT.modules.forEach((m) => {
      m.lessons.forEach((lesson) => {
        (lesson.knowledgeCheck || []).forEach((kc, idx) => {
          if (kc.type === "tf") {
            bank.push({
              id: `${lesson.id}-tf-${idx}`, source: "modules", section: "modules",
              week: m.id, topic: m.title, type: "tf", difficulty: "beginner",
              question: kc.q, options: ["True", "False"], answer: kc.correct === true ? 0 : 1,
              explanation: `Correct answer: ${kc.correct}.`,
            });
          } else if (kc.type === "fill") {
            bank.push({
              id: `${lesson.id}-fill-${idx}`, source: "modules", section: "modules",
              week: m.id, topic: m.title, type: "fill", difficulty: "beginner",
              question: kc.q, options: [], answer: kc.correct, explanation: `Expected: ${kc.correct}`,
            });
          } else {
            bank.push({
              id: `${lesson.id}-mcq-${idx}`, source: "modules", section: "modules",
              week: m.id, topic: m.title, type: "mcq", difficulty: "beginner",
              question: kc.q, options: kc.options, answer: kc.answer, explanation: "",
            });
          }
        });
      });
    });

    // Curated written bank
    WRITTEN_BANK.forEach((q) => {
      const mod = CONTENT.modules.find((m) => m.id === q.moduleId);
      bank.push({
        id: q.id, source: "modules", section: "modules", week: q.moduleId,
        topic: mod ? mod.title : q.moduleId, type: q.type, difficulty: q.difficulty,
        question: q.question, options: [], answer: null,
        modelAnswer: q.modelAnswer, keywords: q.keywords, structure: q.structure,
        explanation: "",
      });
    });

    return bank;
  }

  const BANK = buildBank();

  /* ---------- Engine state ---------- */
  let state = null; // { config, questions, answers, startTime, endTime, timerId }

  const isObjective = (t) => t === "mcq" || t === "tf" || t === "fill";

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ---------- Start ---------- */
  function start(config) {
    let pool = BANK.slice();

    // Filter by source/section/week
    if (config.source === "section-a") {
      pool = pool.filter((q) => q.source === "section-a");
    } else if (config.source === "section-b") {
      pool = pool.filter((q) => q.source === "section-b");
    } else if (config.source === "week" && config.week) {
      pool = pool.filter((q) => q.week === config.week);
    } else if (config.source === "module" && config.moduleId) {
      pool = pool.filter((q) => q.week === config.moduleId && q.source === "modules");
    }

    // Filter by formats
    if (config.formats && config.formats.length) {
      pool = pool.filter((q) => config.formats.includes(q.type));
    }

    // Difficulty
    if (config.difficulty && config.difficulty !== "all") {
      if (config.difficulty === "university") {
        // "University examination standard" = intermediate + advanced
        pool = pool.filter((q) => q.difficulty === "intermediate" || q.difficulty === "advanced");
      } else {
        pool = pool.filter((q) => q.difficulty === config.difficulty);
      }
    }

    // Shuffle and limit
    pool = shuffle(pool);
    const n = config.count === "all" ? pool.length : Math.min(parseInt(config.count, 10), pool.length);
    const questions = pool.slice(0, n);

    state = {
      config,
      questions,
      answers: {},
      startTime: Date.now(),
      endTime: config.duration && config.duration !== "none"
        ? Date.now() + parseInt(config.duration, 10) * 60 * 1000
        : null,
      timerId: null,
      finished: false,
    };

    return state;
  }

  /* ---------- Answer recording ---------- */
  function setAnswer(qid, value) {
    if (!state) return;
    state.answers[qid] = value;
  }

  /* ---------- Marking ---------- */
  function markObjective(q, answer) {
    if (answer === undefined || answer === null || answer === "") return false;
    if (q.type === "mcq") return parseInt(answer, 10) === q.answer;
    if (q.type === "tf") return parseInt(answer, 10) === q.answer;
    if (q.type === "fill") {
      const norm = (s) => s.toLowerCase().trim().replace(/[.,;:!?]+$/, "").replace(/→/g, " ").replace(/\s+/g, " ").replace(/^(the|a|an)\s+/, "");
      const expected = String(q.answer).toLowerCase().split("/").map(norm).filter(Boolean);
      const given = norm(String(answer));
      const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return expected.some((e) => given === e || new RegExp(`(^|\\W)${esc(e)}(\\W|$)`).test(given));
    }
    return false;
  }

  function computeResults() {
    const results = { objective: [], written: [], correct: 0, totalObjective: 0, total: state.questions.length };
    state.questions.forEach((q) => {
      if (isObjective(q.type)) {
        results.totalObjective++;
        const given = state.answers[q.id];
        const ok = markObjective(q, given);
        if (ok) results.correct++;
        results.objective.push({ q, given, ok });
      } else {
        results.written.push({ q, given: state.answers[q.id] || "" });
      }
    });
    return results;
  }

  function finish() {
    if (state) {
      state.finished = true;
      if (state.timerId) clearInterval(state.timerId);
    }
  }

  /* ---------- Timer helpers ---------- */
  function timeLeft() {
    if (!state || !state.endTime) return null;
    return Math.max(0, state.endTime - Date.now());
  }

  function fmtTime(ms) {
    if (ms === null) return "No limit";
    const total = Math.floor(ms / 1000);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  return {
    BANK,
    getState: () => state,
    start,
    setAnswer,
    computeResults,
    finish,
    timeLeft,
    fmtTime,
    isObjective,
    markObjective,
    reset: () => { if (state && state.timerId) clearInterval(state.timerId); state = null; },
  };
})();
