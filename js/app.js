/*
 * ============================================================================
 * MAIN APPLICATION — router, page rendering, exam UI, progress UI
 * ============================================================================
 */

const App = (() => {
  const $ = (id) => document.getElementById(id);

  /* ---------- Course helpers ---------- */
  const moduleTotals = () => {
    const o = {};
    CONTENT.modules.forEach((m) => (o[m.id] = m.lessons.length));
    return o;
  };

  const findModule = (id) => CONTENT.modules.find((m) => m.id === id);

  const overallPercent = () => Progress.overallPercent(moduleTotals());

  const completedCount = () => {
    let n = 0;
    CONTENT.modules.forEach((m) => {
      n += (Progress.get().completedLessons[m.id] || []).length;
    });
    return n;
  };

  const totalLessons = () => CONTENT.modules.reduce((a, m) => a + m.lessons.length, 0);

  const recommended = () => {
    for (const m of CONTENT.modules) {
      for (const l of m.lessons) {
        if (!Progress.isLessonCompleted(m.id, l.id)) return { module: m, lesson: l };
      }
    }
    return { module: CONTENT.modules[0], lesson: CONTENT.modules[0].lessons[0] };
  };

  /* ---------- Header + nav ---------- */
  const NAV = [
    { id: "dashboard", label: "Dashboard", icon: "▦", hash: "#/dashboard" },
    { id: "course", label: "Course Content", icon: "▤", hash: "#/course", section: "Learn" },
    { id: "lab", label: "Interactive Learning Lab", icon: "⚙", hash: "#/lab" },
    { id: "examples", label: "Practical Examples", icon: "◈", hash: "#/examples" },
    { id: "videos", label: "Video Resources", icon: "▶", hash: "#/videos" },
    { id: "revision", label: "Revision Centre", icon: "◫", hash: "#/revision" },
    { id: "exam", label: "Examination Centre", icon: "✎", hash: "#/exam" },
    { id: "progress", label: "My Progress", icon: "◔", hash: "#/progress" },
  ];

  function setActiveNav(pageId) {
    document.querySelectorAll(".nav-link").forEach((a) => {
      a.classList.toggle("active", a.dataset.page === pageId);
    });
    const pct = overallPercent();
    const t = $("side-progress");
    if (t) t.textContent = pct + "%";
    const sp = $("side-progress-bar");
    if (sp) sp.style.width = pct + "%";
  }

  /* ---------- Reusable render fragments ---------- */
  function callout(type, label, body) {
    return `<div class="callout callout-${type}"><strong>${label}</strong><p>${body}</p></div>`;
  }

  function moduleCard(m) {
    const done = (Progress.get().completedLessons[m.id] || []).length;
    const pct = Math.round((done / m.lessons.length) * 100);
    return `
      <a href="#/module/${m.id}" class="module-card">
        <div class="module-top" style="background:linear-gradient(135deg, ${m.color}, #0b3d2e);">
          <div class="module-gradient"><h3>${m.title}</h3></div>
        </div>
        <div class="module-body">
          <p>${m.description}</p>
          <div class="flex items-center justify-between" style="font-size:0.75rem;color:var(--color-muted);">
            <span>${m.lessons.length} lessons</span>
            <span class="badge ${done === m.lessons.length ? "badge-completed" : "badge-pending"}">${done === m.lessons.length ? "Completed" : pct + "% done"}</span>
          </div>
          <div class="progress-wrap"><div class="progress-bar" style="width:${pct}%"></div></div>
        </div>
      </a>`;
  }

  function statCard(label, value, iconClass, icon, delta) {
    return `
      <div class="stat-card">
        <div class="stat-icon ${iconClass}">${icon}</div>
        <div class="stat-label">${label}</div>
        <div class="stat-value">${value}</div>
        ${delta ? `<div class="stat-delta ${delta.up ? "up" : "down"}">${delta.text}</div>` : ""}
      </div>`;
  }

  /* ========================================================================
     DASHBOARD
     ======================================================================== */
  function renderDashboard() {
    const pct = overallPercent();
    const done = completedCount();
    const total = totalLessons();
    const rec = recommended();
    const last = Progress.get().lastViewed;
    const exams = Progress.getExams();
    const scoredExams = exams.filter((e) => e.totalObjective > 0 && typeof e.pct === "number");
    const avgExam = scoredExams.length
      ? Math.round(scoredExams.reduce((a, e) => a + e.pct, 0) / scoredExams.length)
      : 0;
    const bestExam = scoredExams.length ? Math.max(...scoredExams.map((e) => e.pct)) : 0;
    // Study-readiness indicator: course coverage + best exam performance. Not a predicted grade.
    const readiness = Math.round(pct * 0.6 + bestExam * 0.4);

    const recentHtml = last.length
      ? last.slice(0, 4).map((e) => {
          const mod = findModule(e.moduleId);
          return `<a class="flex items-center gap-1" href="#/module/${e.moduleId}" style="padding:0.6rem 0;border-bottom:1px solid var(--color-border);text-decoration:none;">
            <div style="width:8px;height:8px;border-radius:50%;background:${mod ? mod.color : "#1b7f5a"};flex-shrink:0;"></div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:0.85rem;font-weight:600;color:var(--color-text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${e.title}</div>
              <div style="font-size:0.72rem;color:var(--color-muted);">${mod ? mod.title : ""} · ${UI.fmtDate(e.date)}</div>
            </div>
            <span style="color:var(--color-muted);">›</span>
          </a>`;
        }).join("")
      : `<div class="empty-state" style="padding:1.5rem;"><p>No lessons viewed yet. Start with the recommended lesson below.</p></div>`;

    return `
      <div class="page-header">
        <div class="breadcrumb">Home / Dashboard</div>
        <h1>Welcome back — let's build deep understanding</h1>
        <p>Your progress across Parallel and Distributed Systems.</p>
      </div>

      <div class="stat-grid">
        ${statCard("Course completion", pct + "%", "primary", "◔")}
        ${statCard("Topics completed", done + " / " + total, "secondary", "✓")}
        ${statCard("Topics remaining", total - done, "accent", "◷")}
        ${statCard("Avg. exam score", scoredExams.length ? avgExam + "%" : "—", "info", "✎", scoredExams.length ? { up: true, text: scoredExams.length + " attempt(s)" } : null)}
      </div>

      <div class="reading-layout">
        <div>
          <div class="card" style="margin-bottom:1.5rem;">
            <div class="card-header">
              <div class="card-title">▶ Continue learning</div>
              <span class="badge badge-module">${rec.module.title}</span>
            </div>
            <div class="card-body">
              <h3 style="font-size:1.15rem;font-weight:800;margin-bottom:0.4rem;">${rec.lesson.title}</h3>
              <p style="color:var(--color-muted);font-size:0.9rem;margin-bottom:1rem;">Next lesson in your path · ${rec.module.title}</p>
              <div class="btn-group">
                <a class="btn btn-primary" href="#/module/${rec.module.id}">Open lesson →</a>
                <a class="btn btn-outline" href="#/lab">Open Learning Lab</a>
              </div>
            </div>
          </div>

          <div class="card" style="margin-bottom:1.5rem;">
            <div class="card-header">
              <div class="card-title">Course modules</div>
              <a href="#/course" class="btn btn-ghost btn-sm">View all →</a>
            </div>
            <div class="card-body" style="display:flex;flex-direction:column;gap:0.75rem;">
              ${CONTENT.modules.map((m) => {
                const d = (Progress.get().completedLessons[m.id] || []).length;
                const p = Math.round((d / m.lessons.length) * 100);
                return `<a href="#/module/${m.id}" style="display:block;text-decoration:none;">
                  <div class="flex items-center justify-between" style="margin-bottom:0.25rem;">
                    <span style="font-size:0.85rem;font-weight:600;color:var(--color-text);">${m.icon}. ${m.title}</span>
                    <span style="font-size:0.75rem;color:var(--color-muted);">${d}/${m.lessons.length}</span>
                  </div>
                  <div class="progress-wrap" style="margin-top:0;"><div class="progress-bar" style="width:${p}%"></div></div>
                </a>`;
              }).join("")}
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">Examination preparation</div>
              <a href="#/exam" class="btn btn-ghost btn-sm">Start exam →</a>
            </div>
            <div class="card-body">
              <p style="font-size:0.85rem;color:var(--color-muted);margin-bottom:1rem;">
                Section A (serverless, Hadoop) and Section B (weeks 1–2, 3–4, 5–6, 7–8, 13–14) are fully covered.
              </p>
              <div style="margin-bottom:1.25rem;">
                <div class="flex items-center justify-between" style="font-size:0.82rem;margin-bottom:0.35rem;">
                  <span style="font-weight:600;color:var(--color-text);">Study readiness</span>
                  <strong style="color:var(--color-primary);">${readiness}%</strong>
                </div>
                <div class="progress-wrap" style="margin-top:0;height:10px;"><div class="progress-bar" style="width:${readiness}%"></div></div>
                <p style="font-size:0.72rem;color:var(--color-muted);margin-top:0.45rem;">
                  Course completion (60%) + best exam score (40%). A study aid — not a predicted university grade.
                </p>
              </div>
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:0.75rem;">
                <a href="#/exam?section=section-a" class="stat-card" style="text-decoration:none;padding:0.9rem;">
                  <span class="stat-label">Section A</span>
                  <span style="font-weight:800;color:var(--color-primary);">Compulsory</span>
                </a>
                <a href="#/exam?section=section-b" class="stat-card" style="text-decoration:none;padding:0.9rem;">
                  <span class="stat-label">Section B</span>
                  <span style="font-weight:800;color:var(--color-secondary);">Weekly</span>
                </a>
                <a href="#/exam" class="stat-card" style="text-decoration:none;padding:0.9rem;">
                  <span class="stat-label">Full course</span>
                  <span style="font-weight:800;color:var(--color-accent);">Mixed</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="side-rail">
          <div class="sticky-card">
            <div class="sticky-card-header">◔ Overall progress</div>
            <div class="sticky-card-body">
              <div style="display:flex;align-items:baseline;gap:0.4rem;">
                <span style="font-size:2rem;font-weight:800;color:var(--color-primary);">${pct}%</span>
                <span style="font-size:0.75rem;color:var(--color-muted);">complete</span>
              </div>
              <div class="progress-wrap"><div class="progress-bar" style="width:${pct}%"></div></div>
              <p style="font-size:0.78rem;color:var(--color-muted);margin-top:0.6rem;">${done} of ${total} topics completed</p>
            </div>
          </div>

          <div class="sticky-card">
            <div class="sticky-card-header">🕘 Recently studied</div>
            <div class="sticky-card-body" style="padding:0.5rem 1rem;">
              ${recentHtml}
            </div>
          </div>

          <div class="sticky-card">
            <div class="sticky-card-header">★ Quick actions</div>
            <div class="sticky-card-body" style="display:flex;flex-direction:column;gap:0.5rem;">
              <a class="btn btn-outline btn-sm btn-full" href="#/lab">Open Learning Lab</a>
              <a class="btn btn-outline btn-sm btn-full" href="#/revision">Revision Centre</a>
              <a class="btn btn-outline btn-sm btn-full" href="#/progress">View my progress</a>
            </div>
          </div>
        </div>
      </div>`;
  }

  /* ========================================================================
     COURSE
     ======================================================================== */
  function renderCourse() {
    return `
      <div class="page-header">
        <div class="breadcrumb">Home / Course Content</div>
        <h1>Course Content</h1>
        <p>Eight modules covering the full Parallel and Distributed Systems syllabus.</p>
      </div>

      <div class="course-grid">
        ${CONTENT.modules.map(moduleCard).join("")}
      </div>

      <div class="callout callout-tech" style="margin-top:2rem;">
        <strong>How to use this course</strong>
        <p>Each module contains detailed university-standard notes, definitions, worked explanations, interactive demonstrations, real-world applications, examination points and knowledge checks. Use the Learning Lab for hands-on simulators and the Examination Centre to test yourself under timed conditions.</p>
      </div>`;
  }

  /* ========================================================================
     MODULE
     ======================================================================== */
  function renderModule(moduleId) {
    const m = findModule(moduleId);
    if (!m) return `<div class="empty-state"><h2>Module not found</h2><a class="btn btn-primary" href="#/course">Back to course</a></div>`;

    const done = (Progress.get().completedLessons[m.id] || []).length;
    const pct = Math.round((done / m.lessons.length) * 100);

    const lessonsHtml = m.lessons.map((lesson, idx) => {
      const completed = Progress.isLessonCompleted(m.id, lesson.id);
      const bookmarked = Progress.isBookmarked(m.id, lesson.id);
      const objectives = lesson.objectives && lesson.objectives.length
        ? `<div class="objectives" style="margin-bottom:1.5rem;">
            <h2>Learning objectives</h2>
            <ul>${lesson.objectives.map((o) => `<li>${o}</li>`).join("")}</ul>
          </div>` : "";

      const defs = lesson.definitions && lesson.definitions.length
        ? `<div class="sticky-card" style="margin:1.5rem 0;">
            <div class="sticky-card-header">📘 Key definitions</div>
            <div class="sticky-card-body">
              ${lesson.definitions.map((d) => `<div class="quick-def"><strong>${d.term}:</strong> ${d.definition}</div>`).join("")}
            </div>
          </div>` : "";

      const checks = lesson.knowledgeCheck && lesson.knowledgeCheck.length
        ? renderKnowledgeChecks(lesson)
        : "";

      const resources = lesson.resources && lesson.resources.length
        ? `<div class="sticky-card" style="margin:1.5rem 0;">
            <div class="sticky-card-header">▶ Further learning</div>
            <div class="sticky-card-body">
              ${lesson.resources.map((r) => `<a href="${r.url}" target="_blank" rel="noopener" class="quick-def" style="display:block;"><strong>${r.title}</strong><br><span style="color:var(--color-muted);font-size:0.78rem;">${r.source}</span> ↗</a>`).join("")}
            </div>
          </div>` : "";

      const examPoints = lesson.examPoints && lesson.examPoints.length
        ? `<div class="callout callout-exam">
            <strong>Exam Alert</strong>
            <ul style="margin:0.25rem 0 0 1.1rem;font-size:0.87rem;">${lesson.examPoints.map((e) => `<li style="margin-bottom:0.25rem;">${e}</li>`).join("")}</ul>
          </div>` : "";

      return `
        <section class="section-content" id="lesson-${lesson.id}" style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius);padding:2rem;margin-bottom:2rem;">
          <div class="flex items-center justify-between" style="margin-bottom:1rem;flex-wrap:wrap;gap:0.5rem;">
            <span class="badge badge-module">Lesson ${idx + 1}</span>
            <div class="flex items-center gap-1" style="gap:0.5rem;">
              <button class="icon-btn" title="${bookmarked ? "Remove bookmark" : "Bookmark this lesson"}" onclick="App.toggleBookmark('${m.id}','${lesson.id}')">${bookmarked ? "★" : "☆"}</button>
              <button class="btn ${completed ? "btn-secondary" : "btn-outline"} btn-sm" onclick="App.toggleLessonComplete('${m.id}','${lesson.id}')">${completed ? "✓ Completed" : "Mark complete"}</button>
            </div>
          </div>
          <h2 style="margin-top:0;">${lesson.title}</h2>
          ${objectives}
          ${lesson.content}
          ${defs}
          ${examPoints}
          ${checks}
          ${resources}
        </section>`;
    }).join("");

    const prevNext = (() => {
      const i = CONTENT.modules.findIndex((x) => x.id === m.id);
      const prev = CONTENT.modules[i - 1];
      const next = CONTENT.modules[i + 1];
      return `<div class="flex justify-between" style="margin-top:2rem;gap:1rem;flex-wrap:wrap;">
        ${prev ? `<a class="btn btn-outline" href="#/module/${prev.id}">← ${prev.title}</a>` : "<span></span>"}
        ${next ? `<a class="btn btn-primary" href="#/module/${next.id}">${next.title} →</a>` : `<a class="btn btn-primary" href="#/exam">Go to Examination Centre →</a>`}
      </div>`;
    })();

    return `
      <div class="breadcrumb"><a href="#/dashboard">Home</a> / <a href="#/course">Course Content</a> / Module ${m.icon}</div>

      <div class="lesson-hero" style="background:linear-gradient(135deg, ${m.color}, #0b3d2e);">
        <div class="lesson-meta">
          <span>MODULE ${m.icon}</span><span>·</span><span>${m.lessons.length} lessons</span><span>·</span><span>${pct}% complete</span>
        </div>
        <h1>${m.title}</h1>
        <p class="lead">${m.description}</p>
        <div class="progress-wrap" style="max-width:360px;margin-top:1.25rem;background:rgba(255,255,255,0.2);"><div class="progress-bar" style="width:${pct}%;background:var(--color-gold);box-shadow:0 0 12px rgba(201,162,39,0.5);"></div></div>
      </div>

      ${lessonsHtml}

      ${prevNext}`;
  }

  /* ---------- Knowledge checks ---------- */
  let checkCounter = 0;
  function renderKnowledgeChecks(lesson) {
    const items = lesson.knowledgeCheck.map((kc, idx) => {
      const id = `kc-${lesson.id}-${idx}`;
      if (kc.type === "tf") {
        return `<div class="card" style="margin-bottom:0.75rem;" id="${id}">
          <div class="card-body">
            <p style="font-weight:600;margin-bottom:0.75rem;">${idx + 1}. ${kc.q}</p>
            <div class="exam-options">
              <label class="exam-option"><input type="radio" name="${id}" value="true"><span>True</span></label>
              <label class="exam-option"><input type="radio" name="${id}" value="false"><span>False</span></label>
            </div>
            <button class="btn btn-outline btn-sm" style="margin-top:0.75rem;" onclick="App.checkQuiz('${id}', ${kc.correct ? "true" : "false"}, 'tf')">Check answer</button>
            <div class="exam-feedback" style="display:none;"></div>
          </div>
        </div>`;
      }
      if (kc.type === "fill") {
        return `<div class="card" style="margin-bottom:0.75rem;" id="${id}">
          <div class="card-body">
            <p style="font-weight:600;margin-bottom:0.75rem;">${idx + 1}. ${kc.q}</p>
            <input type="text" class="exam-option" style="width:100%;padding:0.7rem 1rem;" placeholder="Type your answer…">
            <button class="btn btn-outline btn-sm" style="margin-top:0.75rem;" onclick="App.checkQuiz('${id}', '${String(kc.correct).replace(/'/g, "\\'")}', 'fill')">Check answer</button>
            <div class="exam-feedback" style="display:none;"></div>
          </div>
        </div>`;
      }
      return `<div class="card" style="margin-bottom:0.75rem;" id="${id}">
        <div class="card-body">
          <p style="font-weight:600;margin-bottom:0.75rem;">${idx + 1}. ${kc.q}</p>
          <div class="exam-options">
            ${kc.options.map((opt, oi) => `<label class="exam-option"><input type="radio" name="${id}" value="${oi}"><span>${opt}</span></label>`).join("")}
          </div>
          <button class="btn btn-outline btn-sm" style="margin-top:0.75rem;" onclick="App.checkQuiz('${id}', ${kc.answer}, 'mcq')">Check answer</button>
          <div class="exam-feedback" style="display:none;"></div>
        </div>
      </div>`;
    }).join("");

    return `<div class="sticky-card" style="margin:1.5rem 0;">
      <div class="sticky-card-header">✓ Knowledge check</div>
      <div class="sticky-card-body">${items}</div>
    </div>`;
  }

  function checkQuiz(id, correct, type) {
    const card = $(id);
    if (!card) return;
    const feedback = card.querySelector(".exam-feedback");
    let isCorrect = false;
    if (type === "mcq") {
      const sel = card.querySelector(`input[name="${id}"]:checked`);
      if (!sel) { UI.toast("Select an answer first"); return; }
      isCorrect = parseInt(sel.value, 10) === correct;
      card.querySelectorAll(".exam-option").forEach((opt) => {
        const input = opt.querySelector("input");
        if (parseInt(input.value, 10) === correct) opt.classList.add("correct");
        else if (input.checked) opt.classList.add("incorrect");
      });
    } else if (type === "tf") {
      const sel = card.querySelector(`input[name="${id}"]:checked`);
      if (!sel) { UI.toast("Select an answer first"); return; }
      isCorrect = (sel.value === "true") === correct;
    } else {
      const input = card.querySelector("input[type=text]");
      const norm = (s) => s.toLowerCase().trim().replace(/[.,;:!?]+$/, "").replace(/→/g, " ").replace(/\s+/g, " ").replace(/^(the|a|an)\s+/, "");
      const given = norm(input.value);
      const expectedList = String(correct).toLowerCase().split("/").map(norm).filter(Boolean);
      const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      isCorrect = given.length > 0 && expectedList.some((e) => given === e || new RegExp(`(^|\\W)${esc(e)}(\\W|$)`).test(given));
      input.classList.toggle("correct", isCorrect);
      input.classList.toggle("incorrect", !isCorrect);
    }
    let correctDisplay = correct;
    if (type === "mcq") {
      const spans = card.querySelectorAll(".exam-option span");
      if (spans[correct]) correctDisplay = spans[correct].textContent;
    }
    feedback.style.display = "block";
    feedback.className = "exam-feedback " + (isCorrect ? "correct" : "incorrect");
    feedback.textContent = isCorrect ? "Correct — well done." : `Not quite. Correct answer: ${correctDisplay}`;
    // disable the check button
    const btn = card.querySelector("button");
    if (btn) { btn.disabled = true; btn.style.opacity = "0.6"; }
    Progress.recordQuiz(id, isCorrect ? 1 : 0, 1);
  }

  /* ========================================================================
     LAB
     ======================================================================== */
  function renderLab() {
    const sim = (title, body) => `<div class="sim-panel"><div class="sim-header">${title}</div>${body}</div>`;

    const seqPar = `
      <div class="sim-body">
        <div class="sim-controls">
          <div class="sim-control"><label>Processors <span id="sp-p-val">4</span></label><input type="range" id="sp-p" min="1" max="16" value="4"></div>
          <div class="sim-control"><label>Tasks <span id="sp-t-val">8</span></label><input type="range" id="sp-t" min="1" max="40" value="8"></div>
          <div class="sim-control"><label>Time per task (s) <span id="sp-time-val">2</span></label><input type="range" id="sp-time" min="1" max="10" value="2"></div>
          <div style="margin-top:auto;font-family:var(--font-mono);font-size:0.8rem;color:var(--color-primary);font-weight:700;">
            Sequential: <span id="sp-seq">—</span> s | Parallel: <span id="sp-par">—</span> s | Speedup: <span id="sp-up">—</span>×
          </div>
        </div>
        <div class="sim-visual" id="sp-visual" style="min-height:300px;"><div class="sim-stage">Adjust parameters</div></div>
      </div>`;

    const amdahl = `
      <div class="sim-body">
        <div class="sim-controls">
          <div class="sim-control"><label>Parallelisable portion <span id="amdahl-p-val">60%</span></label><input type="range" id="amdahl-p" min="0" max="100" value="60"></div>
          <div class="sim-control"><label>Processors <span id="amdahl-n-val">16</span></label><input type="range" id="amdahl-n" min="1" max="128" value="16"></div>
          <div class="callout callout-tech" style="font-size:0.8rem;"><strong>Formula</strong> S(p) = 1 / ((1−P) + P/p)</div>
        </div>
        <div class="sim-visual" id="amdahl-visual" style="min-height:300px;"><div class="sim-stage">Adjust sliders</div></div>
      </div>`;

    const algo = `
      <div class="sim-body">
        <div class="sim-controls">
          <div class="sim-control"><label>Work units <span id="pa-w-val">24</span></label><input type="range" id="pa-w" min="4" max="96" value="24"></div>
          <div class="sim-control"><label>Processors <span id="pa-p-val">4</span></label><input type="range" id="pa-p" min="1" max="16" value="4"></div>
          <button class="btn btn-primary btn-sm btn-full" onclick="Lab.runAlgo()">Run / Reset simulation</button>
          <div style="margin-top:auto;font-family:var(--font-mono);font-size:0.8rem;color:var(--color-muted);" id="pa-stat">Stage: Idle</div>
        </div>
        <div class="sim-visual" id="pa-visual" style="min-height:300px;"><div class="sim-stage">Configure and press Run</div></div>
      </div>`;

    const race = `
      <div class="sim-body">
        <div class="sim-controls">
          <button class="btn btn-primary btn-sm btn-full" onclick="Lab.runRace()">Run (unsynchronised)</button>
          <button class="btn btn-secondary btn-sm btn-full" onclick="Lab.runRace(true)">Run (synchronised)</button>
          <div style="margin-top:auto;font-family:var(--font-mono);font-size:0.8rem;color:var(--color-muted);" id="race-stat">Final counter: —</div>
        </div>
        <div class="sim-visual" id="race-visual" style="min-height:300px;"><div class="sim-stage">Press Run</div></div>
      </div>`;

    const mr = `
      <div class="sim-body">
        <div class="sim-controls">
          <div class="sim-control"><label>Workers <span id="mr-w-val">3</span></label><input type="range" id="mr-w" min="1" max="8" value="3" oninput="Lab.mrRender()"></div>
          <button class="btn btn-outline btn-sm btn-full" onclick="Lab.mrPrev()">← Previous Step</button>
          <button class="btn btn-primary btn-sm btn-full" onclick="Lab.mrNext()">Next Step →</button>
          <button class="btn btn-outline btn-sm btn-full" onclick="Lab.mrFail()" style="color:var(--color-danger);border-color:var(--color-danger);">⚠ Simulate worker failure</button>
          <div style="margin-top:auto;font-family:var(--font-mono);font-size:0.8rem;color:var(--color-muted);" id="mr-step">Step: 1 / 6</div>
        </div>
        <div class="sim-visual" id="mr-visual" style="min-height:340px;"><div class="sim-stage">Press Next Step</div></div>
      </div>`;

    const hdfs = `
      <div class="sim-body">
        <div class="sim-controls">
          <div class="sim-control"><label>Replication factor <span id="hdfs-rf-val">3</span></label><input type="range" id="hdfs-rf" min="1" max="5" value="3"></div>
          <button class="btn btn-primary btn-sm btn-full" onclick="Lab.hdfsDistribute()">Redistribute blocks</button>
          <div style="margin-top:auto;font-family:var(--font-mono);font-size:0.8rem;color:var(--color-muted);" id="hdfs-stat">Blocks: — · Copies: —</div>
        </div>
        <div class="sim-visual" id="hdfs-visual" style="min-height:300px;"><div class="sim-stage">Redistribute</div></div>
      </div>`;

    const ft = `
      <div class="sim-body">
        <div class="sim-controls">
          <div class="sim-control"><label>Replicas <span id="ft-r-val">3</span></label><input type="range" id="ft-r" min="1" max="5" value="3"></div>
          <button class="btn btn-primary btn-sm btn-full" onclick="Lab.ftToggle()">Toggle server state</button>
          <button class="btn btn-outline btn-sm btn-full" onclick="Lab.ftReset()">Reset all</button>
          <div style="margin-top:auto;font-family:var(--font-mono);font-size:0.8rem;color:var(--color-muted);" id="ft-stat">Available: 3/3</div>
        </div>
        <div class="sim-visual" id="ft-visual" style="min-height:300px;"><div class="sim-stage">Servers healthy</div></div>
      </div>`;

    const scale = `
      <div class="sim-body">
        <div class="sim-controls">
          <div class="sim-control"><label>Requests/sec <span id="sc-r-val">50</span></label><input type="range" id="sc-r" min="10" max="300" value="50"></div>
          <div class="sim-control"><label>Servers <span id="sc-s-val">2</span></label><input type="range" id="sc-s" min="1" max="10" value="2"></div>
          <button class="btn btn-outline btn-sm btn-full" onclick="Lab.scAuto()">Auto-scale</button>
          <div style="margin-top:auto;font-family:var(--font-mono);font-size:0.8rem;color:var(--color-muted);" id="sc-stat">Avg response: — ms</div>
        </div>
        <div class="sim-visual" id="sc-visual" style="min-height:300px;"><div class="sim-stage">Configure load</div></div>
      </div>`;

    const p2p = `
      <div class="sim-body">
        <div class="sim-controls">
          <button class="btn btn-primary btn-sm btn-full" onclick="Lab.p2pAddPeer()">Add peer</button>
          <button class="btn btn-secondary btn-sm btn-full" onclick="Lab.p2pSend()">Send message</button>
          <button class="btn btn-outline btn-sm btn-full" onclick="Lab.p2pReset()">Reset</button>
          <div style="margin-top:auto;font-family:var(--font-mono);font-size:0.8rem;color:var(--color-muted);" id="p2p-stat">Peers: 3 · Messages: 0</div>
        </div>
        <div class="sim-visual" id="p2p-visual" style="min-height:300px;"><div class="sim-stage">Add peers</div></div>
      </div>`;

    const flynn = `
      <div class="sim-body" style="grid-template-columns:260px 1fr;">
        <div class="sim-controls">
          <div style="display:flex;flex-direction:column;gap:0.5rem;">
            <button class="btn btn-outline btn-sm btn-full" onclick="Lab.setFlynn('sisd')" id="flynn-sisd">SISD</button>
            <button class="btn btn-outline btn-sm btn-full" onclick="Lab.setFlynn('simd')" id="flynn-simd">SIMD</button>
            <button class="btn btn-outline btn-sm btn-full" onclick="Lab.setFlynn('misd')" id="flynn-misd">MISD</button>
            <button class="btn btn-outline btn-sm btn-full" onclick="Lab.setFlynn('mimd')" id="flynn-mimd">MIMD</button>
          </div>
          <div class="callout callout-tech" style="font-size:0.8rem;"><strong id="flynn-desc"></strong></div>
        </div>
        <div class="sim-visual" id="flynn-visual" style="min-height:300px;"><div class="sim-stage">Select architecture</div></div>
      </div>`;

    const sdm = `
      <div class="sim-body" style="grid-template-columns:280px 1fr;">
        <div class="sim-controls">
          <div style="display:flex;flex-direction:column;gap:0.5rem;">
            <button class="btn btn-primary btn-sm btn-full" onclick="Lab.selectSDM('shared')" id="sdm-shared">Shared memory</button>
            <button class="btn btn-outline btn-sm btn-full" onclick="Lab.selectSDM('distributed')" id="sdm-distributed">Distributed memory</button>
          </div>
          <div class="callout callout-tech" style="font-size:0.8rem;"><strong id="sdm-desc">All processors share one physical address space.</strong></div>
          <div style="margin-top:auto;font-family:var(--font-mono);font-size:0.78rem;color:var(--color-muted);" id="sdm-stat">UMA · load/store · OpenMP threads</div>
        </div>
        <div class="sim-visual" id="sdm-visual" style="min-height:320px;"><div class="sim-stage">Select a memory model</div></div>
      </div>`;

    const cs = `
      <div class="sim-body" style="grid-template-columns:300px 1fr;">
        <div class="sim-controls">
          <div style="display:flex;flex-direction:column;gap:0.5rem;">
            <button class="btn btn-outline btn-sm btn-full" onclick="Lab.selectCS('client')" id="cs-client">Client</button>
            <button class="btn btn-outline btn-sm btn-full" onclick="Lab.selectCS('appserver')" id="cs-appserver">Application Server</button>
            <button class="btn btn-outline btn-sm btn-full" onclick="Lab.selectCS('dbserver')" id="cs-dbserver">Database Server</button>
            <button class="btn btn-outline btn-sm btn-full" onclick="Lab.selectCS('network')" id="cs-network">Network</button>
          </div>
          <div class="callout callout-tech" style="font-size:0.8rem;"><strong id="cs-role"></strong></div>
        </div>
        <div class="sim-visual" id="cs-visual" style="min-height:300px;"><div class="sim-stage">Click a component</div></div>
      </div>`;

    const hadoop = `
      <div class="sim-body" style="grid-template-columns:300px 1fr;">
        <div class="sim-controls">
          <div style="display:flex;flex-direction:column;gap:0.5rem;">
            <button class="btn btn-outline btn-sm btn-full" onclick="Lab.selectHadoop('namenode')" id="hd-namenode">NameNode</button>
            <button class="btn btn-outline btn-sm btn-full" onclick="Lab.selectHadoop('datanode')" id="hd-datanode">DataNode</button>
            <button class="btn btn-outline btn-sm btn-full" onclick="Lab.selectHadoop('snn')" id="hd-snn">Secondary NameNode</button>
            <button class="btn btn-outline btn-sm btn-full" onclick="Lab.selectHadoop('client')" id="hd-client">Client</button>
          </div>
          <div class="callout callout-tech" style="font-size:0.8rem;"><strong id="hd-role"></strong></div>
        </div>
        <div class="sim-visual" id="hd-visual" style="min-height:300px;"><div class="sim-stage">Click a component</div></div>
      </div>`;

    return `
      <div class="page-header">
        <div class="breadcrumb">Home / Interactive Learning Lab</div>
        <h1>Interactive Learning Lab</h1>
        <p>Do not just read about systems — operate them. Adjust parameters and observe the consequences.</p>
      </div>

      <div class="lab-tabs" style="display:flex;gap:0.5rem;margin-bottom:1.5rem;flex-wrap:wrap;">
        <button class="btn btn-primary btn-sm" onclick="App.labTab(this,'arch')">Architecture Explorer</button>
        <button class="btn btn-outline btn-sm" onclick="App.labTab(this,'sims')">Process Simulators</button>
        <button class="btn btn-outline btn-sm" onclick="App.labTab(this,'compare')">Concept Comparisons</button>
        <button class="btn btn-outline btn-sm" onclick="App.labTab(this,'cases')">Case Studies</button>
      </div>

      <div id="lab-arch" class="lab-panel">
        <h2 style="font-size:1.3rem;font-weight:800;margin-bottom:1rem;">Architecture Explorer</h2>
        <div style="display:grid;gap:1.5rem;">
          ${sim("Flynn's Taxonomy", flynn)}
          ${sim("Shared vs Distributed Memory", sdm)}
          ${sim("Client–Server Architecture", cs)}
          ${sim("Hadoop Architecture", hadoop)}
        </div>
      </div>

      <div id="lab-sims" class="lab-panel" style="display:none;">
        <h2 style="font-size:1.3rem;font-weight:800;margin-bottom:1rem;">Process Simulators</h2>
        <div style="display:grid;gap:1.5rem;">
          ${sim("Sequential vs Parallel Processing", seqPar)}
          ${sim("Amdahl's Law", amdahl)}
          ${sim("Parallel Algorithm Simulator", algo)}
          ${sim("Race Condition & Synchronisation", race)}
          ${sim("MapReduce Word Count", mr)}
          ${sim("HDFS Block Distribution", hdfs)}
          ${sim("Failure Simulator", ft)}
          ${sim("Server Scaling & Load Balancing", scale)}
          ${sim("Peer-to-Peer Network", p2p)}
        </div>
      </div>

      <div id="lab-compare" class="lab-panel" style="display:none;">
        <h2 style="font-size:1.3rem;font-weight:800;margin-bottom:1rem;">Concept Comparisons</h2>
        ${comparisonsHtml()}
      </div>

      <div id="lab-cases" class="lab-panel" style="display:none;">
        <h2 style="font-size:1.3rem;font-weight:800;margin-bottom:1rem;">Real-World Case Studies</h2>
        ${casesHtml()}
      </div>`;
  }

  function comparisonsHtml() {
    const comps = [
      {
        title: "Parallel vs Distributed Computing",
        rows: [
          ["Communication", "Shared memory / bus", "Message passing over network"],
          ["Memory", "Often shared", "Private per node"],
          ["Failure", "Whole machine fails together", "Partial failure is normal"],
          ["Goal", "Reduce time of one problem", "Resource sharing + availability + scale"],
        ],
      },
      {
        title: "Concurrency vs Parallelism",
        rows: [
          ["Definition", "Overlapping tasks in time", "Simultaneous execution"],
          ["Hardware", "Can run on one core", "Requires multiple units"],
          ["Focus", "Structure / design", "Execution / speedup"],
        ],
      },
      {
        title: "Shared Memory vs Distributed Memory",
        rows: [
          ["Communication", "Load/store", "Send/receive messages"],
          ["Programming", "Threads, OpenMP", "MPI"],
          ["Scalability", "Limited", "High"],
          ["Latency", "Low", "Higher"],
        ],
      },
      {
        title: "CPU vs GPU",
        rows: [
          ["Cores", "Few, powerful", "Thousands, simple"],
          ["Optimised for", "Latency, control flow", "Throughput, data parallelism"],
          ["Use case", "General code, OS, branchy logic", "Graphics, AI, arrays"],
        ],
      },
      {
        title: "Horizontal vs Vertical Scaling",
        rows: [
          ["Method", "Add nodes", "Add CPU/RAM to one node"],
          ["Limit", "Complexity, consistency", "Hardware ceiling"],
          ["Downtime", "Usually none", "Often required"],
          ["Cost", "Linear-ish", "Steeply increasing"],
        ],
      },
      {
        title: "Hadoop vs Spark",
        rows: [
          ["Processing", "Disk-based MapReduce", "In-memory"],
          ["Latency", "High (batch)", "Lower (interactive/iterative)"],
          ["Best for", "Large batch ETL", "ML, iterative analytics"],
          ["Runs on", "YARN", "YARN, standalone, Kubernetes"],
        ],
      },
      {
        title: "Fault Tolerance vs Reliability",
        rows: [
          ["Definition", "Continue working despite failure", "Probability of correct operation over time"],
          ["Focus", "Recovery/redundancy", "Failure rate (MTBF)"],
        ],
      },
    ];
    return `<div style="display:grid;gap:1.25rem;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));">
      ${comps.map((c) => `<div class="card">
        <div class="card-header"><div class="card-title" style="font-size:1rem;">${c.title}</div></div>
        <div class="card-body" style="padding:0;overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:0.8rem;">
            <tbody>${c.rows.map((r, i) => `<tr style="border-bottom:1px solid var(--color-border);${i === 0 ? "background:var(--color-surface-2);" : ""}">
              <td style="padding:0.6rem 0.75rem;font-weight:600;color:var(--color-muted);width:35%;">${r[0]}</td>
              <td style="padding:0.6rem 0.75rem;">${r[1]}</td>
              <td style="padding:0.6rem 0.75rem;">${r[2] || ""}</td>
            </tr>`).join("")}</tbody>
          </table>
        </div>
      </div>`).join("")}
    </div>`;
  }

  function casesHtml() {
    const cases = [
      { title: "Google Search", icon: "🔍", principle: "Massive distributed indexing across thousands of machines; MapReduce built the index; queries hit thousands of replicas for low latency.", link: "mapreduce" },
      { title: "Netflix Content Delivery", icon: "🎬", principle: "CDN edge servers cache video near users; replication and load balancing provide availability during peak demand.", link: "trends" },
      { title: "Banking Systems", icon: "🏦", principle: "Distributed transactions require consistency and fault tolerance; replication and checkpointing protect balances; strong consistency over availability in core ledgers.", link: "fault" },
      { title: "Cloud Infrastructure", icon: "☁", principle: "Data centres are distributed systems: virtualisation, horizontal scaling, load balancing, replication across availability zones.", link: "trends" },
      { title: "Weather Forecasting", icon: "🌦", principle: "Numerical models split the atmosphere into a grid; MPI distributes grid patches across a supercomputer; results combined at synchronisation points.", link: "arch" },
      { title: "Scientific Simulation", icon: "⚛", principle: "Particle/molecular simulations are embarrassingly parallel or domain-decomposed; HPC clusters with fast interconnects; checkpointing for long runs.", link: "algo" },
      { title: "Large-Scale Data Analytics", icon: "📊", principle: "Hadoop/Spark process terabytes across clusters; HDFS replication + YARN scheduling; MapReduce/Spark transformations.", link: "hadoop" },
      { title: "Online Shopping", icon: "🛒", principle: "Microservices (catalog, cart, payments) scale independently; load balancers distribute requests; databases replicated for read availability.", link: "dist" },
    ];
    return `<div style="display:grid;gap:1.25rem;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));">
      ${cases.map((c) => `<div class="card">
        <div class="card-body">
          <div style="font-size:1.5rem;margin-bottom:0.5rem;">${c.icon}</div>
          <h3 style="font-size:1.05rem;font-weight:700;margin-bottom:0.5rem;">${c.title}</h3>
          <p style="font-size:0.85rem;color:var(--color-muted);line-height:1.55;">${c.principle}</p>
          <a href="#/module/${c.link}" class="btn btn-ghost btn-sm" style="margin-top:0.5rem;padding-left:0;">Related module →</a>
        </div>
      </div>`).join("")}
    </div>`;
  }

  function labTab(btn, id) {
    document.querySelectorAll(".lab-panel").forEach((p) => (p.style.display = "none"));
    const panel = $("lab-" + id);
    if (panel) panel.style.display = "block";
    document.querySelectorAll(".lab-tabs .btn").forEach((b) => {
      b.classList.remove("btn-primary");
      b.classList.add("btn-outline");
    });
    btn.classList.remove("btn-outline");
    btn.classList.add("btn-primary");
    initSims();
  }

  /* ========================================================================
     PRACTICAL EXAMPLES
     ======================================================================== */
  function renderExamples() {
    return `
      <div class="page-header">
        <div class="breadcrumb">Home / Practical Examples</div>
        <h1>Practical Examples</h1>
        <p>How the principles you study power real systems used every day.</p>
      </div>
      ${casesHtml()}
      <div class="callout callout-real" style="margin-top:2rem;">
        <strong>Real-World Application</strong>
        <p>Every case above combines the same core ideas: divide the work, communicate efficiently, replicate for availability, and remove bottlenecks before adding machines.</p>
      </div>`;
  }

  /* ========================================================================
     VIDEOS
     ======================================================================== */
  function renderVideos() {
    const perModule = [
      { id: "intro", title: "Introduction to Parallel and Distributed Systems", items: [
        ["Introduction to Parallel Computing", "Neso Academy", "https://www.youtube.com/results?search_query=neso+academy+introduction+to+parallel+computing"],
        ["Amdahl's Law explained", "Neso Academy / university lecture", "https://www.youtube.com/results?search_query=amdahl%27s+law+neso+academy"],
        ["What is distributed computing?", "IBM Technology", "https://www.youtube.com/results?search_query=IBM+Technology+what+is+distributed+computing"],
      ]},
      { id: "arch", title: "Parallel Processing Architectures", items: [
        ["Flynn's Taxonomy", "Neso Academy", "https://www.youtube.com/results?search_query=flynn%27s+taxonomy+neso+academy"],
        ["Shared memory vs distributed memory", "Neso Academy", "https://www.youtube.com/results?search_query=shared+memory+vs+distributed+memory+neso+academy"],
        ["CPU vs GPU architecture", "NVIDIA / IBM Technology", "https://www.youtube.com/results?search_query=CPU+vs+GPU+architecture+IBM+Technology"],
      ]},
      { id: "dist", title: "Distributed Systems Architecture", items: [
        ["Client-server architecture", "Neso Academy", "https://www.youtube.com/results?search_query=client+server+architecture+neso+academy"],
        ["Microservices explained", "Google Cloud Tech", "https://www.youtube.com/results?search_query=microservices+explained+google+cloud"],
        ["RPC and RMI", "University lecture", "https://www.youtube.com/results?search_query=RPC+RMI+distributed+systems+lecture"],
      ]},
      { id: "algo", title: "Parallel Algorithms", items: [
        ["Parallel programming models", "University lecture", "https://www.youtube.com/results?search_query=parallel+programming+models+lecture"],
        ["Race conditions and locks", "freeCodeCamp", "https://www.youtube.com/results?search_query=race+condition+freecodecamp"],
      ]},
      { id: "mapreduce", title: "MapReduce", items: [
        ["MapReduce explained", "IBM Technology", "https://www.youtube.com/results?search_query=IBM+Technology+MapReduce+explained"],
        ["MapReduce word count example", "freeCodeCamp / lecture", "https://www.youtube.com/results?search_query=mapreduce+word+count+example"],
        ["Original MapReduce paper", "Google Research", "https://research.google/pubs/pub62/"],
      ]},
      { id: "hadoop", title: "Apache Hadoop", items: [
        ["HDFS architecture", "Apache Hadoop docs", "https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html"],
        ["Hadoop ecosystem explained", "IBM Technology", "https://www.youtube.com/results?search_query=IBM+Technology+Hadoop+ecosystem"],
        ["YARN architecture", "Apache Hadoop docs", "https://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-site/YARN.html"],
      ]},
      { id: "fault", title: "Fault Tolerance and Scalability", items: [
        ["Fault tolerance explained", "IBM Technology", "https://www.youtube.com/results?search_query=fault+tolerance+distributed+systems+IBM"],
        ["Horizontal vs vertical scaling", "AWS / Google Cloud", "https://www.youtube.com/results?search_query=horizontal+vs+vertical+scaling+aws"],
      ]},
      { id: "trends", title: "Emerging Trends", items: [
        ["What is serverless computing?", "IBM Technology", "https://www.youtube.com/results?search_query=IBM+Technology+serverless+computing"],
        ["Kubernetes explained", "Google Cloud Tech", "https://www.youtube.com/results?search_query=kubernetes+explained+google+cloud"],
        ["Edge computing explained", "IBM Technology", "https://www.youtube.com/results?search_query=edge+computing+IBM+Technology"],
      ]},
      { id: "exam", title: "Examination Skills", items: [
        ["How to answer comparison questions", "University study skills", "https://www.youtube.com/results?search_query=how+to+answer+comparison+exam+questions+university"],
        ["Revision techniques for computer science", "University study skills", "https://www.youtube.com/results?search_query=computer+science+revision+techniques+university"],
      ]},
    ];

    return `
      <div class="page-header">
        <div class="breadcrumb">Home / Video Resources</div>
        <h1>Video Resources</h1>
        <p>Curated external learning material. Links open YouTube search results or authoritative documentation so you always reach current content.</p>
      </div>
      <div class="callout callout-tech" style="margin-bottom:1.5rem;">
        <strong>How links work</strong>
        <p>Video links use targeted searches on reputable channels/libraries (Neso Academy, IBM Technology, freeCodeCamp, Google Cloud, Apache, NVIDIA). This avoids stale or broken specific-video links. Documentation links go directly to official sources.</p>
      </div>
      <div style="display:grid;gap:1.5rem;">
        ${perModule.map((m) => `<div class="card">
          <div class="card-header"><div class="card-title">${m.title}</div><a class="btn btn-ghost btn-sm" href="#/module/${m.id}">Module →</a></div>
          <div class="card-body">
            <div style="display:grid;gap:0.75rem;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));">
              ${m.items.map((it) => `<a href="${it[2]}" target="_blank" rel="noopener" style="display:flex;gap:0.75rem;padding:0.75rem;border:1px solid var(--color-border);border-radius:var(--radius-sm);text-decoration:none;align-items:flex-start;">
                <span style="width:32px;height:32px;border-radius:8px;background:var(--color-primary-light);color:var(--color-primary);display:grid;place-items:center;flex-shrink:0;">▶</span>
                <span><span style="display:block;font-size:0.85rem;font-weight:600;color:var(--color-text);">${it[0]}</span><span style="display:block;font-size:0.75rem;color:var(--color-muted);">${it[1]} ↗</span></span>
              </a>`).join("")}
            </div>
          </div>
        </div>`).join("")}
      </div>`;
  }

  /* ========================================================================
     REVISION
     ======================================================================== */
  function renderRevision() {
    const defs = [];
    CONTENT.modules.forEach((m) => {
      m.lessons.forEach((l) => {
        (l.definitions || []).forEach((d) => defs.push({ ...d, module: m.title, moduleId: m.id }));
      });
    });

    const formulas = [
      ["Speedup", "S(p) = T(1) / T(p)"],
      ["Efficiency", "E(p) = S(p) / p"],
      ["Amdahl's Law", "S(p) = 1 / ((1 − P) + P/p)"],
      ["Amdahl limit", "S(max) = 1 / (1 − P)"],
      ["Gustafson's Law", "S(p) = p − (p − 1)s"],
      ["Parallelism", "Π = Work / Span = T₁ / T∞"],
      ["Brent's bound", "T∞ ≤ Tₚ ≤ T₁/p + T∞"],
      ["Parallel runtime (ideal)", "Tₚ ≈ ⌈tasks/processors⌉ × time/task"],
    ];

    const checklists = CONTENT.modules.map((m) => ({
      title: m.title,
      items: m.lessons.map((l) => `${l.title}`),
      link: `#/module/${m.id}`,
      done: (Progress.get().completedLessons[m.id] || []).length,
      total: m.lessons.length,
    }));

    return `
      <div class="page-header">
        <div class="breadcrumb">Home / Revision Centre</div>
        <h1>Revision Centre</h1>
        <p>Condensed definitions, formula sheet, and module checklists for rapid revision.</p>
      </div>

      <div class="reading-layout">
        <div>
          <div class="card" style="margin-bottom:1.5rem;">
            <div class="card-header"><div class="card-title">∑ Formula sheet</div></div>
            <div class="card-body" style="padding:0;overflow-x:auto;">
              <table style="width:100%;border-collapse:collapse;font-size:0.85rem;">
                <thead><tr style="background:var(--color-surface-2);"><th style="text-align:left;padding:0.7rem 1rem;color:var(--color-muted);font-size:0.72rem;text-transform:uppercase;">Quantity</th><th style="text-align:left;padding:0.7rem 1rem;color:var(--color-muted);font-size:0.72rem;text-transform:uppercase;">Formula</th></tr></thead>
                <tbody>${formulas.map((f) => `<tr style="border-bottom:1px solid var(--color-border);"><td style="padding:0.6rem 1rem;font-weight:600;">${f[0]}</td><td style="padding:0.6rem 1rem;font-family:var(--font-mono);font-size:0.8rem;">${f[1]}</td></tr>`).join("")}</tbody>
              </table>
            </div>
          </div>

          <div class="card" style="margin-bottom:1.5rem;">
            <div class="card-header"><div class="card-title">📘 Master glossary</div><span class="badge badge-module">${defs.length} terms</span></div>
            <div class="card-body" style="max-height:520px;overflow-y:auto;">
              ${defs.map((d) => `<div style="padding:0.65rem 0;border-bottom:1px solid var(--color-border);">
                <div style="font-size:0.85rem;font-weight:700;color:var(--color-text);">${d.term}</div>
                <div style="font-size:0.8rem;color:var(--color-muted);margin-top:0.2rem;">${d.definition}</div>
                <a href="${d.moduleId ? '#/module/' + d.moduleId : '#/course'}" style="font-size:0.7rem;color:var(--color-primary);">${d.module}</a>
              </div>`).join("")}
            </div>
          </div>

          <div class="card">
            <div class="card-header"><div class="card-title">✓ Module revision checklists</div></div>
            <div class="card-body" style="display:flex;flex-direction:column;gap:1rem;">
              ${checklists.map((c) => `<div>
                <div class="flex items-center justify-between" style="margin-bottom:0.3rem;">
                  <a href="${c.link}" style="font-size:0.85rem;font-weight:700;color:var(--color-text);">${c.title}</a>
                  <span style="font-size:0.72rem;color:var(--color-muted);">${c.done}/${c.total}</span>
                </div>
                <div style="font-size:0.78rem;color:var(--color-muted);">${c.items.join(" · ")}</div>
                <div class="progress-wrap"><div class="progress-bar" style="width:${Math.round((c.done / c.total) * 100)}%"></div></div>
              </div>`).join("")}
            </div>
          </div>
        </div>

        <div class="side-rail">
          <div class="sticky-card">
            <div class="sticky-card-header">⚡ High-yield exam points</div>
            <div class="sticky-card-body">
              <ul style="font-size:0.82rem;color:var(--color-text-2);padding-left:1.1rem;list-style:disc;">
                <li>Amdahl's Law and its limit 1/(1−P).</li>
                <li>Flynn's Taxonomy with examples.</li>
                <li>Shared vs distributed memory.</li>
                <li>HDFS NameNode/DataNode + replication.</li>
                <li>MapReduce map → shuffle → reduce.</li>
                <li>YARN RM/NM/AM roles.</li>
                <li>Fault tolerance vs prevention; replication vs backup.</li>
                <li>Horizontal vs vertical scaling.</li>
                <li>Serverless: FaaS, BaaS, trade-offs.</li>
                <li>MPI point-to-point vs collective; CUDA thread/block/grid.</li>
              </ul>
            </div>
          </div>
          <div class="sticky-card">
            <div class="sticky-card-header">✎ Test yourself</div>
            <div class="sticky-card-body">
              <p style="font-size:0.82rem;color:var(--color-muted);margin-bottom:0.75rem;">Move from reading to recall — the best revision is answering questions under exam conditions.</p>
              <a class="btn btn-primary btn-sm btn-full" href="#/exam">Open Examination Centre</a>
            </div>
          </div>
        </div>
      </div>`;
  }

  /* ========================================================================
     PROGRESS
     ======================================================================== */
  function renderProgress() {
    const pct = overallPercent();
    const done = completedCount();
    const total = totalLessons();
    const exams = Progress.getExams();
    const bookmarks = [];
    CONTENT.modules.forEach((m) => {
      (Progress.get().bookmarks[m.id] || []).forEach((lid) => {
        const lesson = m.lessons.find((l) => l.id === lid);
        if (lesson) bookmarks.push({ module: m, lesson });
      });
    });
    const savedQs = Progress.get().savedQuestions;
    const quizScores = Object.values(Progress.get().quizScores);
    const quizTotal = quizScores.reduce((a, q) => a + q.total, 0);
    const quizCorrect = quizScores.reduce((a, q) => a + q.score, 0);
    const quizPct = quizTotal ? Math.round((quizCorrect / quizTotal) * 100) : null;
    const wrongByTopic = {};
    exams.forEach((e) => (e.wrong || []).forEach((w) => {
      const topic = w.topic || (ExamEngine.BANK.find((q) => q.id === w.id) || {}).topic || "General";
      if (!wrongByTopic[topic]) wrongByTopic[topic] = { count: 0, week: w.week || null };
      wrongByTopic[topic].count++;
    }));
    const weakTopics = Object.entries(wrongByTopic).sort((a, b) => b[1].count - a[1].count).slice(0, 6);

    return `
      <div class="page-header">
        <div class="breadcrumb">Home / My Progress</div>
        <h1>My Progress</h1>
        <p>Everything you have studied, saved, and scored — stored locally on this device.</p>
      </div>

      <div class="stat-grid">
        ${statCard("Course completion", pct + "%", "primary", "◔")}
        ${statCard("Topics completed", done + " / " + total, "secondary", "✓")}
        ${statCard("Exams taken", exams.length, "accent", "✎")}
        ${statCard("Bookmarks", bookmarks.length, "info", "★")}
      </div>

      <div class="reading-layout">
        <div>
          <div class="card" style="margin-bottom:1.5rem;">
            <div class="card-header"><div class="card-title">Module progress</div></div>
            <div class="card-body" style="display:flex;flex-direction:column;gap:1rem;">
              ${CONTENT.modules.map((m) => {
                const d = (Progress.get().completedLessons[m.id] || []).length;
                const p = Math.round((d / m.lessons.length) * 100);
                return `<div>
                  <div class="flex items-center justify-between" style="margin-bottom:0.25rem;">
                    <a href="#/module/${m.id}" style="font-size:0.85rem;font-weight:600;color:var(--color-text);">${m.icon}. ${m.title}</a>
                    <span style="font-size:0.72rem;color:var(--color-muted);">${d}/${m.lessons.length} · ${p}%</span>
                  </div>
                  <div class="progress-wrap" style="margin-top:0;"><div class="progress-bar" style="width:${p}%"></div></div>
                </div>`;
              }).join("")}
            </div>
          </div>

          <div class="card" style="margin-bottom:1.5rem;">
            <div class="card-header"><div class="card-title">⚠ Weak topics &amp; knowledge checks</div></div>
            <div class="card-body">
              <div class="flex items-center justify-between" style="font-size:0.85rem;margin-bottom:0.35rem;">
                <span style="font-weight:600;color:var(--color-text);">Knowledge-check accuracy</span>
                <strong style="color:var(--color-primary);">${quizPct === null ? "—" : quizPct + "%"}</strong>
              </div>
              <div class="progress-wrap" style="margin-top:0;"><div class="progress-bar" style="width:${quizPct || 0}%"></div></div>
              <p style="font-size:0.75rem;color:var(--color-muted);margin-top:0.45rem;">
                ${quizTotal ? `${quizCorrect} of ${quizTotal} correct on the latest attempt for each knowledge check.` : "No knowledge checks attempted yet — answer one at the end of any lesson."}
              </p>

              <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid var(--color-border);">
                <div style="font-size:0.82rem;font-weight:700;color:var(--color-text);margin-bottom:0.5rem;">Recurring objective mistakes</div>
                ${weakTopics.length ? weakTopics.map(([topic, info]) => {
                  const mod = CONTENT.modules.find((m) => m.id === info.week) || CONTENT.modules.find((m) => m.title === topic);
                  return `<div class="flex items-center justify-between" style="gap:0.75rem;padding:0.45rem 0;border-bottom:1px solid var(--color-border);">
                    <span style="font-size:0.8rem;color:var(--color-text-2);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${UI.escapeHtml(topic)}</span>
                    <span class="badge" style="background:${info.count >= 2 ? "var(--danger-bg)" : "var(--warning-bg)"};color:${info.count >= 2 ? "var(--color-danger)" : "var(--color-warning)"};white-space:nowrap;">${info.count}× wrong</span>
                    ${mod ? `<a href="#/module/${mod.id}" class="btn btn-ghost btn-sm" style="white-space:nowrap;">Revise →</a>` : ""}
                  </div>`;
                }).join("") : `<p style="font-size:0.78rem;color:var(--color-success);font-weight:600;">No objective exam mistakes recorded yet.</p>`}
              </div>
            </div>
          </div>

          <div class="card" style="margin-bottom:1.5rem;">
            <div class="card-header"><div class="card-title">Examination history</div><span class="badge badge-module">${exams.length}</span></div>
            <div class="card-body" style="padding:0;">
              ${exams.length ? `<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:0.82rem;">
                <thead><tr style="background:var(--color-surface-2);"><th style="text-align:left;padding:0.6rem 1rem;color:var(--color-muted);">Date</th><th style="text-align:left;padding:0.6rem 1rem;color:var(--color-muted);">Source</th><th style="text-align:left;padding:0.6rem 1rem;color:var(--color-muted);">Score</th><th style="text-align:left;padding:0.6rem 1rem;color:var(--color-muted);">%</th></tr></thead>
                <tbody>${exams.map((e) => `<tr style="border-bottom:1px solid var(--color-border);">
                  <td style="padding:0.6rem 1rem;">${UI.fmtDate(e.date)}</td>
                  <td style="padding:0.6rem 1rem;">${e.label || e.source}</td>
                  <td style="padding:0.6rem 1rem;">${e.correct}/${e.totalObjective}</td>
                  <td style="padding:0.6rem 1rem;font-weight:700;color:${typeof e.pct !== "number" ? "var(--color-muted)" : e.pct >= 50 ? "var(--color-success)" : "var(--color-danger)"};">${typeof e.pct !== "number" ? "—" : e.pct + "%"}</td>
                </tr>`).join("")}</tbody>
              </table></div>` : `<div class="empty-state" style="padding:2rem;"><p>No exams taken yet. <a href="#/exam" style="color:var(--color-primary);font-weight:600;">Start one →</a></p></div>`}
            </div>
          </div>

          <div class="card">
            <div class="card-header"><div class="card-title">★ Bookmarked lessons</div></div>
            <div class="card-body">
              ${bookmarks.length ? bookmarks.map((b) => `<a href="#/module/${b.module.id}" style="display:block;padding:0.6rem 0;border-bottom:1px solid var(--color-border);text-decoration:none;">
                <div style="font-size:0.85rem;font-weight:600;color:var(--color-text);">${b.lesson.title}</div>
                <div style="font-size:0.72rem;color:var(--color-muted);">${b.module.title}</div>
              </a>`).join("") : `<p style="font-size:0.85rem;color:var(--color-muted);">No bookmarks yet. Use ☆ on any lesson to save it here.</p>`}
            </div>
          </div>

          <div class="card">
            <div class="card-header"><div class="card-title">🔖 Saved examination questions</div><span class="badge badge-module">${savedQs.length}</span></div>
            <div class="card-body">
              ${savedQs.length ? savedQs.slice(0, 12).map((q) => `<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:0.75rem;padding:0.6rem 0;border-bottom:1px solid var(--color-border);">
                <div style="min-width:0;">
                  <div style="font-size:0.82rem;font-weight:600;color:var(--color-text);">${UI.escapeHtml(q.question || q.qIndex)}</div>
                  <div style="font-size:0.7rem;color:var(--color-muted);">${UI.escapeHtml(q.topic || "")}</div>
                </div>
                <button class="btn btn-ghost btn-sm" style="white-space:nowrap;color:var(--color-danger);" onclick="App.removeSavedQuestion('${String(q.qIndex).replace(/'/g, "")}')">Remove</button>
              </div>`).join("") : `<p style="font-size:0.85rem;color:var(--color-muted);">No saved questions. After submitting an exam, use “Save for revision” on a written answer.</p>`}
            </div>
          </div>
        </div>

        <div class="side-rail">
          <div class="sticky-card">
            <div class="sticky-card-header">🕘 Recently viewed</div>
            <div class="sticky-card-body" style="padding:0.5rem 1rem;">
              ${Progress.get().lastViewed.length ? Progress.get().lastViewed.map((e) => `<a href="#/module/${e.moduleId}" style="display:block;padding:0.5rem 0;border-bottom:1px solid var(--color-border);text-decoration:none;">
                <div style="font-size:0.8rem;font-weight:600;color:var(--color-text);">${e.title}</div>
                <div style="font-size:0.7rem;color:var(--color-muted);">${UI.fmtDate(e.date)}</div>
              </a>`).join("") : `<p style="font-size:0.8rem;color:var(--color-muted);padding:0.5rem 0;">Nothing viewed yet.</p>`}
            </div>
          </div>

          <div class="sticky-card">
            <div class="sticky-card-header">⟲ Data</div>
            <div class="sticky-card-body">
              <p style="font-size:0.75rem;color:var(--color-muted);margin-bottom:0.6rem;">Progress is saved in this browser (localStorage).</p>
              <button class="btn btn-outline btn-sm btn-full" onclick="App.resetProgress()" style="color:var(--color-danger);border-color:var(--color-danger);">Reset all progress</button>
            </div>
          </div>
        </div>
      </div>`;
  }

  /* ========================================================================
     EXAM
     ======================================================================== */
  let examTimerId = null;

  function renderExam(query) {
    clearExamTimer();
    if (ExamEngine.getState() && !ExamEngine.getState().finished) {
      return examRunningHtml();
    }
    if (ExamEngine.getState() && ExamEngine.getState().finished) {
      return examResultsHtml();
    }
    return examSettingsHtml(query);
  }

  function clearExamTimer() {
    if (examTimerId) { clearInterval(examTimerId); examTimerId = null; }
  }

  function examSettingsHtml(query = {}) {
    const preselected = query.section || "all";
    return `
      <div class="page-header">
        <div class="breadcrumb">Home / Examination Centre</div>
        <h1>Examination Centre</h1>
        <p>Build a timed paper from Section A, Section B, individual weeks/topics, or the full course.</p>
      </div>

      <div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header"><div class="card-title">Examination structure</div></div>
        <div class="card-body" style="display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));">
          <div style="border:1px solid var(--color-border);border-radius:var(--radius-sm);padding:1rem;">
            <span class="badge badge-module">Section A</span>
            <p style="font-size:0.82rem;color:var(--color-muted);margin-top:0.5rem;">Compulsory: Serverless Computing; Apache Hadoop and Ecosystem.</p>
          </div>
          <div style="border:1px solid var(--color-border);border-radius:var(--radius-sm);padding:1rem;">
            <span class="badge badge-module">Section B</span>
            <p style="font-size:0.82rem;color:var(--color-muted);margin-top:0.5rem;">Weeks 1–2, 3–4, 5–6, 7–8 (MPI/CUDA theory), 13–14.</p>
          </div>
          <div style="border:1px solid var(--color-border);border-radius:var(--radius-sm);padding:1rem;">
            <span class="badge badge-module">Full course</span>
            <p style="font-size:0.82rem;color:var(--color-muted);margin-top:0.5rem;">Mixed questions across all modules and examination sections.</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title">Build your examination</div></div>
        <div class="card-body">
          <div class="exam-settings">
            <div class="settings-group">
              <label for="ex-source">Source</label>
              <select id="ex-source" onchange="App.examSourceChange()">
                <option value="all" ${preselected === "all" ? "selected" : ""}>Full course / mixed</option>
                <option value="section-a" ${preselected === "section-a" ? "selected" : ""}>Section A — Compulsory</option>
                <option value="section-b" ${preselected === "section-b" ? "selected" : ""}>Section B — Weekly</option>
                <option value="week">Specific week</option>
                <option value="module">Specific module / topic</option>
              </select>
            </div>

            <div class="settings-group" id="ex-week-group" style="display:none;">
              <label for="ex-week">Week / question</label>
              <select id="ex-week">
                <optgroup label="Section A">
                  <option value="secA-serverless">Question 1 — Serverless Computing</option>
                  <option value="secA-hadoop">Question 2 — Apache Hadoop</option>
                </optgroup>
                <optgroup label="Section B">
                  <option value="week-1-2">Week 1 & 2 — Introduction</option>
                  <option value="week-3-4">Week 3 & 4 — Architectures</option>
                  <option value="week-5-6">Week 5 & 6 — Server Networks</option>
                  <option value="week-7-8">Week 7 & 8 — Open MPI & CUDA</option>
                  <option value="week-13-14">Week 13 & 14 — Final Topics</option>
                </optgroup>
              </select>
            </div>

            <div class="settings-group" id="ex-module-group" style="display:none;">
              <label for="ex-module">Module / topic</label>
              <select id="ex-module">
                ${CONTENT.modules.map((m) => `<option value="${m.id}">${m.icon}. ${m.title}</option>`).join("")}
              </select>
            </div>

            <div class="settings-group">
              <label for="ex-count">Number of questions</label>
              <select id="ex-count">
                <option value="5">5</option>
                <option value="10" selected>10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="all">All available</option>
              </select>
            </div>

            <div class="settings-group">
              <label for="ex-difficulty">Difficulty</label>
              <select id="ex-difficulty">
                <option value="all">All levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="university">University examination standard</option>
              </select>
            </div>

            <div class="settings-group">
              <label for="ex-duration">Duration</label>
              <select id="ex-duration">
                <option value="10">10 minutes</option>
                <option value="20" selected>20 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="none">No time limit</option>
              </select>
            </div>

            <div class="settings-group" style="grid-column:1/-1;">
              <label>Question formats</label>
              <div style="display:flex;flex-wrap:wrap;gap:1rem;font-size:0.85rem;">
                <label style="display:flex;align-items:center;gap:0.4rem;"><input type="checkbox" class="ex-format" value="mcq" checked> Multiple choice</label>
                <label style="display:flex;align-items:center;gap:0.4rem;"><input type="checkbox" class="ex-format" value="tf" checked> True / false</label>
                <label style="display:flex;align-items:center;gap:0.4rem;"><input type="checkbox" class="ex-format" value="fill" checked> Fill in the blanks</label>
                <label style="display:flex;align-items:center;gap:0.4rem;"><input type="checkbox" class="ex-format" value="short" checked> Short answer</label>
                <label style="display:flex;align-items:center;gap:0.4rem;"><input type="checkbox" class="ex-format" value="long" checked> Long answer</label>
                <label style="display:flex;align-items:center;gap:0.4rem;"><input type="checkbox" class="ex-format" value="diagram" checked> Diagram / draw &amp; label</label>
                <label style="display:flex;align-items:center;gap:0.4rem;"><input type="checkbox" class="ex-format" value="compare" checked> Comparison</label>
                <label style="display:flex;align-items:center;gap:0.4rem;"><input type="checkbox" class="ex-format" value="scenario" checked> Applied scenario</label>
              </div>
            </div>
          </div>

          <div class="callout callout-tech" style="margin-bottom:1.25rem;">
            <strong>Marking note</strong>
            <p>Objective questions (MCQ, true/false, fill-in) are auto-marked. Written answers receive model answers, marking points, keywords, and suggested structure — they are <em>not</em> official examiner marks.</p>
          </div>

          <div class="btn-group">
            <button class="btn btn-primary" onclick="App.startExam()">Start examination →</button>
            <a class="btn btn-outline" href="#/revision">Revise first</a>
          </div>
        </div>
      </div>`;
  }

  function examSourceChange() {
    const src = $("ex-source").value;
    $("ex-week-group").style.display = src === "week" ? "flex" : "none";
    $("ex-module-group").style.display = src === "module" ? "flex" : "none";
  }

  function startExam() {
    const formats = [...document.querySelectorAll(".ex-format:checked")].map((c) => c.value);
    if (!formats.length) { UI.toast("Select at least one question format"); return; }
    const config = {
      source: $("ex-source").value,
      week: $("ex-week") ? $("ex-week").value : null,
      moduleId: $("ex-module") ? $("ex-module").value : null,
      count: $("ex-count").value,
      difficulty: $("ex-difficulty").value,
      duration: $("ex-duration").value,
      formats,
    };
    const state = ExamEngine.start(config);
    if (!state.questions.length) {
      UI.toast("No questions match those filters. Try another combination.");
      ExamEngine.reset();
      return;
    }
    renderRoute();
  }

  function examRunningHtml() {
    const state = ExamEngine.getState();
    if (!state) return examSettingsHtml();
    const answeredCount = Object.keys(state.answers).length;
    const pct = Math.round((answeredCount / state.questions.length) * 100);

    setTimeout(() => {
      clearExamTimer();
      examTimerId = setInterval(() => {
        const left = ExamEngine.timeLeft();
        const t = $("exam-timer");
        if (t) t.textContent = ExamEngine.fmtTime(left);
        if (left === 0) {
          clearExamTimer();
          App.submitExam(true);
        }
      }, 1000);
    }, 50);

    return `
      <div class="flex items-center justify-between" style="margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;">
        <div>
          <div class="breadcrumb">Examination in progress</div>
          <h1 style="font-size:1.6rem;font-weight:800;">Examination</h1>
          <p style="color:var(--color-muted);font-size:0.85rem;">${state.questions.length} questions · ${answeredCount} answered</p>
        </div>
        <div style="display:flex;align-items:center;gap:1rem;">
          <div class="timer-wrap">⏱ <span id="exam-timer">${ExamEngine.fmtTime(ExamEngine.timeLeft())}</span></div>
          <button class="btn btn-primary btn-sm" onclick="App.submitExam()">Submit examination</button>
        </div>
      </div>

      <div class="progress-wrap" style="margin-bottom:2rem;height:10px;"><div class="progress-bar" style="width:${pct}%"></div></div>

      ${state.questions.map((q, i) => examQuestionHtml(q, i)).join("")}

      <div class="exam-actions">
        <button class="btn btn-primary" onclick="App.submitExam()">Submit examination</button>
      </div>`;
  }

  function examQuestionHtml(q, i) {
    const state = ExamEngine.getState();
    const given = state.answers[q.id];
    let inner = "";

    if (q.type === "mcq") {
      inner = `<div class="exam-options">
        ${q.options.map((opt, oi) => `<label class="exam-option">
          <input type="radio" name="q-${q.id}" value="${oi}" ${given === String(oi) ? "checked" : ""} onchange="ExamEngine.setAnswer('${q.id}', this.value)">
          <span>${opt}</span>
        </label>`).join("")}
      </div>`;
    } else if (q.type === "tf") {
      inner = `<div class="exam-options">
        <label class="exam-option"><input type="radio" name="q-${q.id}" value="0" ${given === "0" ? "checked" : ""} onchange="ExamEngine.setAnswer('${q.id}', this.value)"><span>True</span></label>
        <label class="exam-option"><input type="radio" name="q-${q.id}" value="1" ${given === "1" ? "checked" : ""} onchange="ExamEngine.setAnswer('${q.id}', this.value)"><span>False</span></label>
      </div>`;
    } else if (q.type === "fill") {
      inner = `<input type="text" class="exam-option" style="width:100%;padding:0.75rem 1rem;" placeholder="Type your answer…" value="${given || ""}" oninput="ExamEngine.setAnswer('${q.id}', this.value)">`;
    } else {
      const rowsByType = { short: 4, long: 7, diagram: 9, compare: 7, scenario: 7 };
      const placeholders = {
        short: "Write a concise answer…",
        long: "Write a structured answer…",
        diagram: "Describe your diagram: components, connections, direction of data flow, and labels…",
        compare: "Compare across the requested dimensions — a table or clearly separated points works well…",
        scenario: "Apply the concepts to the scenario: diagnosis, recommendation, justification, trade-offs…",
      };
      inner = `<textarea rows="${rowsByType[q.type] || 5}" style="width:100%;padding:0.75rem 1rem;border:1px solid var(--color-border);border-radius:var(--radius-sm);font-family:inherit;font-size:0.9rem;" placeholder="${placeholders[q.type] || "Write your answer…"}" oninput="ExamEngine.setAnswer('${q.id}', this.value)">${given || ""}</textarea>`;
    }

    const formatLabel = {
      mcq: "Multiple choice", tf: "True / false", fill: "Fill in the blank",
      short: "Short answer", long: "Long answer", diagram: "Diagram / draw & label",
      compare: "Comparison", scenario: "Applied scenario",
    }[q.type] || q.type;

    return `<div class="exam-question-card">
      <div class="exam-q-header">
        <span>Question ${i + 1} · ${formatLabel}</span>
        <span class="badge badge-difficulty ${q.difficulty}">${q.difficulty}</span>
      </div>
      <div class="exam-q-body">
        <p>${q.question}</p>
        ${inner}
      </div>
    </div>`;
  }

  function submitExam(auto = false) {
    const state = ExamEngine.getState();
    if (!state) return;
    if (!auto) {
      const answered = Object.keys(state.answers).length;
      if (answered < state.questions.length) {
        if (!confirm(`You have answered ${answered} of ${state.questions.length} questions. Submit anyway?`)) return;
      }
    }
    ExamEngine.finish();
    clearExamTimer();
    const results = ExamEngine.computeResults();
    const pct = results.totalObjective ? Math.round((results.correct / results.totalObjective) * 100) : null;

    const labelMap = {
      all: "Full course", "section-a": "Section A", "section-b": "Section B",
      week: state.config.week || "Specific week", module: state.config.moduleId || "Module",
    };

    Progress.recordExam({
      source: state.config.source,
      label: labelMap[state.config.source] || state.config.source,
      correct: results.correct,
      totalObjective: results.totalObjective,
      totalQuestions: results.total,
      pct,
      wrong: results.objective.filter((o) => !o.ok).map((o) => ({
        id: o.q.id,
        question: o.q.question,
        topic: o.q.topic,
        type: o.q.type,
        week: o.q.week,
      })),
    });

    App.lastResults = results;
    App.lastPct = pct;
    renderRoute();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function examResultsHtml() {
    const state = ExamEngine.getState();
    const results = App.lastResults || ExamEngine.computeResults();
    const pct = App.lastPct !== undefined
      ? App.lastPct
      : (results.totalObjective ? Math.round((results.correct / results.totalObjective) * 100) : null);
    const wrong = results.objective.filter((o) => !o.ok);
    const correct = results.objective.filter((o) => o.ok);

    const weakTopics = [...new Set(wrong.map((w) => w.q.topic))];
    const recommendations = weakTopics.length
      ? weakTopics.map((t) => {
          const mod = CONTENT.modules.find((m) => m.title === t);
          return mod ? `<a class="btn btn-outline btn-sm" href="#/module/${mod.id}">Revise: ${mod.title}</a>` : "";
        }).join("")
      : `<span style="font-size:0.85rem;color:var(--color-success);font-weight:600;">No objective mistakes — excellent.</span>`;

    return `
      <div class="page-header">
        <div class="breadcrumb">Examination Centre / Results</div>
        <h1>Examination Results</h1>
        <p>Objective questions are auto-marked. Written answers are self-assessed using the model answers below.</p>
      </div>

      <div class="results-grid">
        <div class="stat-card"><div class="stat-label">Auto-marked score</div><div class="big-number">${results.correct}<small>out of ${results.totalObjective} objective</small></div></div>
        <div class="stat-card"><div class="stat-label">Percentage</div><div class="big-number" style="color:${pct === null ? "var(--color-muted)" : pct >= 50 ? "var(--color-success)" : "var(--color-danger)"};">${pct === null ? "—" : pct + "%"}<small>${pct === null ? "no objective questions in this paper" : "objective questions only"}</small></div></div>
        <div class="stat-card"><div class="stat-label">Written answers</div><div class="big-number">${results.written.length}<small>self-assessed with model answers</small></div></div>
      </div>

      <div class="callout callout-exam">
        <strong>Examiner's note</strong>
        <p>This percentage reflects auto-marked objective questions only, not written answers. It is a study aid — never an official university mark.</p>
      </div>

      <div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header"><div class="card-title">Topics requiring improvement</div></div>
        <div class="card-body">
          <div class="btn-group">${recommendations}</div>
          <div style="margin-top:1rem;display:flex;gap:1.5rem;font-size:0.85rem;">
            <span style="color:var(--color-success);font-weight:600;">✓ ${correct.length} correct</span>
            <span style="color:var(--color-danger);font-weight:600;">✗ ${wrong.length} incorrect</span>
            <span style="color:var(--color-muted);">${results.total - results.totalObjective - results.written.length >= 0 ? "" : ""}</span>
          </div>
        </div>
      </div>

      ${wrong.length ? `<div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header"><div class="card-title">✗ Review mistakes</div></div>
        <div class="card-body">
          ${wrong.map((w) => `<div class="review-item">
            <h4>${w.q.topic}</h4>
            <div class="q-text">${w.q.question}</div>
            <div style="font-size:0.8rem;"><span style="color:var(--color-danger);">Your answer:</span> ${formatGiven(w.given, w.q)}</div>
            <div style="font-size:0.8rem;margin-top:0.25rem;"><span style="color:var(--color-success);">Correct answer:</span> ${formatCorrect(w.q)}</div>
            ${w.q.explanation ? `<div class="model">${w.q.explanation}</div>` : ""}
          </div>`).join("")}
        </div>
      </div>` : ""}

      ${results.written.length ? `<div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header"><div class="card-title">✎ Written answers — model answers & marking points</div></div>
        <div class="card-body">
          ${results.written.map((w) => `<div class="review-item">
            <h4>${w.q.question}</h4>
            <div class="q-text">Your answer: ${w.given ? w.given.slice(0, 500) + (w.given.length > 500 ? "…" : "") : "<em>No answer given</em>"}</div>
            <div class="model"><strong>Model answer:</strong> ${w.q.modelAnswer || "See the relevant lesson notes."}</div>
            <div style="font-size:0.8rem;margin-top:0.5rem;"><strong>Expected keywords:</strong> ${(w.q.keywords || []).map((k) => `<span class="badge badge-module" style="margin:0.15rem;">${k}</span>`).join(" ")}</div>
            ${w.q.structure ? `<div style="font-size:0.8rem;margin-top:0.4rem;color:var(--color-muted);"><strong>Suggested structure:</strong> ${w.q.structure}</div>` : ""}
            <div style="margin-top:0.6rem;display:flex;align-items:center;gap:0.5rem;">
              <span style="font-size:0.75rem;color:var(--color-muted);">Self-assessment:</span>
              <select style="padding:0.3rem 0.6rem;border:1px solid var(--color-border);border-radius:6px;font-size:0.75rem;">
                <option value="">Select…</option>
                <option>Met most marking points</option>
                <option>Partially met</option>
                <option>Did not meet</option>
              </select>
              <button class="btn btn-ghost btn-sm" onclick="App.saveQuestion('${state.config.source}','${state.config.week || ""}','${w.q.id}')">Save for revision</button>
            </div>
          </div>`).join("")}
        </div>
      </div>` : ""}

      <div class="exam-actions">
        <button class="btn btn-primary" onclick="App.retakeExam()">Retake examination</button>
        <a class="btn btn-outline" href="#/progress">View my progress</a>
        <a class="btn btn-outline" href="#/revision">Revision Centre</a>
      </div>`;
  }

  function formatGiven(given, q) {
    if (given === undefined || given === null || given === "") return "<em>No answer</em>";
    if (q.type === "mcq") return `${q.options[parseInt(given, 10)] || given}`;
    if (q.type === "tf") return given === "0" ? "True" : "False";
    return given;
  }

  function formatCorrect(q) {
    if (q.type === "mcq") return q.options[q.answer] || q.answer;
    if (q.type === "tf") return q.answer === 0 ? "True" : "False";
    return q.answer;
  }

  function retakeExam() {
    ExamEngine.reset();
    App.lastResults = null;
    App.lastPct = undefined;
    renderRoute();
  }

  /* ========================================================================
     SEARCH
     ======================================================================== */
  function renderSearch(q) {
    const query = (q || "").toLowerCase().trim();
    if (!query) {
      return `<div class="empty-state"><h2>Search the course</h2><p>Use the search bar above to find lessons, definitions, and topics.</p></div>`;
    }
    const results = [];
    CONTENT.modules.forEach((m) => {
      m.lessons.forEach((l) => {
        const hay = (m.title + " " + l.title + " " + l.content + " " + (l.definitions || []).map((d) => d.term + " " + d.definition).join(" ")).toLowerCase();
        if (hay.includes(query)) {
          results.push({ m, l });
        }
      });
    });

    return `
      <div class="page-header">
        <div class="breadcrumb">Home / Search</div>
        <h1>Search results</h1>
        <p>${results.length} result(s) for “${UI.escapeHtml(q)}”</p>
      </div>
      ${results.length ? results.map((r) => `<a href="#/module/${r.m.id}" class="card" style="display:block;margin-bottom:0.75rem;text-decoration:none;">
        <div class="card-body">
          <span class="badge badge-module">${r.m.title}</span>
          <h3 style="font-size:1rem;font-weight:700;margin-top:0.5rem;">${r.l.title}</h3>
          <p style="font-size:0.82rem;color:var(--color-muted);margin-top:0.25rem;">Click to open in context →</p>
        </div>
      </a>`).join("") : `<div class="empty-state"><h2>No results</h2><p>Try a broader term, e.g. “HDFS”, “Amdahl”, “MPI”.</p></div>`}`;
  }

  /* ========================================================================
     ROUTER
     ======================================================================== */
  let currentPage = "";

  function parseHash() {
    const raw = location.hash.replace(/^#\/?/, "");
    const [pathPart, queryPart] = raw.split("?");
    const parts = pathPart.split("/").filter(Boolean);
    const query = {};
    if (queryPart) {
      queryPart.split("&").forEach((kv) => {
        const [k, v] = kv.split("=");
        query[decodeURIComponent(k)] = decodeURIComponent(v || "");
      });
    }
    return { parts, query };
  }

  function renderRoute() {
    const { parts, query } = parseHash();
    const page = parts[0] || "dashboard";
    const body = $("page-body");
    if (!body) return;

    clearExamTimer();

    let html = "";
    switch (page) {
      case "dashboard":
        html = renderDashboard(); currentPage = "dashboard"; break;
      case "course":
        html = renderCourse(); currentPage = "course"; break;
      case "module":
        html = renderModule(parts[1]); currentPage = "course"; break;
      case "lab":
        html = renderLab(); currentPage = "lab"; break;
      case "examples":
        html = renderExamples(); currentPage = "examples"; break;
      case "videos":
        html = renderVideos(); currentPage = "videos"; break;
      case "revision":
        html = renderRevision(); currentPage = "revision"; break;
      case "exam":
        html = renderExam(query); currentPage = "exam"; break;
      case "progress":
        html = renderProgress(); currentPage = "progress"; break;
      case "search":
        html = renderSearch(query.q); currentPage = "";
        break;
      default:
        html = renderDashboard(); currentPage = "dashboard";
    }

    body.innerHTML = html;
    setActiveNav(currentPage);
    window.scrollTo(0, 0);
    initSims();

    // If on exam page and running, ensure timer started (renderExamRunning schedules it)
    if (page === "exam") {
      const state = ExamEngine.getState();
      if (state && !state.finished) {
        clearExamTimer();
        examTimerId = setInterval(() => {
          const left = ExamEngine.timeLeft();
          const t = $("exam-timer");
          if (t) t.textContent = ExamEngine.fmtTime(left);
          if (left === 0) {
            clearExamTimer();
            App.submitExam(true);
          }
        }, 1000);
      }
    }
  }

  function initSims() {
    if (typeof Lab === "undefined") return;
    try {
      Lab.init();
    } catch (e) {
      console.warn("Lab init error:", e);
    }
  }

  /* ========================================================================
     PUBLIC ACTIONS
     ======================================================================== */
  function toggleLessonComplete(moduleId, lessonId) {
    if (Progress.isLessonCompleted(moduleId, lessonId)) {
      Progress.reopenLesson(moduleId, lessonId);
      UI.toast("Marked as not completed");
    } else {
      Progress.completeLesson(moduleId, lessonId);
      UI.toast("Lesson completed ✓");
    }
    const mod = findModule(moduleId);
    const lesson = mod && mod.lessons.find((l) => l.id === lessonId);
    if (lesson) Progress.addRecentlyViewed(moduleId, lessonId, lesson.title);
    renderRoute();
  }

  function toggleBookmark(moduleId, lessonId) {
    Progress.toggleBookmark(moduleId, lessonId);
    UI.toast(Progress.isBookmarked(moduleId, lessonId) ? "Bookmarked ★" : "Bookmark removed");
    renderRoute();
  }

  function resetProgress() {
    if (!confirm("Reset all progress, bookmarks, and exam history on this device?")) return;
    Progress.reset();
    ExamEngine.reset();
    UI.toast("Progress reset");
    renderRoute();
  }

  function saveQuestion(section, week, qid) {
    const q = ExamEngine.BANK.find((x) => x.id === qid);
    if (q) {
      Progress.saveQuestion({ section, week, qIndex: qid, question: q.question, topic: q.topic });
      UI.toast("Question saved for revision");
    }
  }

  function removeSavedQuestion(qid) {
    Progress.removeSavedQuestion(qid);
    UI.toast("Removed from saved questions");
    renderRoute();
  }

  function search(value) {
    const q = value.trim();
    if (!q) return;
    location.hash = "#/search?q=" + encodeURIComponent(q);
  }

  /* ---------- Theme ---------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("pds_theme", theme); } catch (e) {}
    document.querySelectorAll(".theme-toggle").forEach((b) => {
      b.textContent = theme === "dark" ? "☀" : "☾";
      b.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
      b.setAttribute("title", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    });
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(current);
    UI.toast(current === "dark" ? "Dark mode on" : "Light mode on");
  }

  /* ---------- Init ---------- */
  function init() {
    applyTheme(document.documentElement.getAttribute("data-theme") || "light");
    window.addEventListener("hashchange", renderRoute);

    const searchInput = $("global-search");
    if (searchInput) {
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") search(searchInput.value);
      });
    }

    // mobile menu
    const menuBtn = $("menu-btn");
    if (menuBtn) {
      menuBtn.addEventListener("click", () => {
        $("sidebar").classList.toggle("open");
        $("overlay").classList.toggle("open");
      });
    }
    const overlay = $("overlay");
    if (overlay) {
      overlay.addEventListener("click", () => {
        $("sidebar").classList.remove("open");
        overlay.classList.remove("open");
      });
    }

    if (!location.hash) location.hash = "#/dashboard";
    renderRoute();
  }

  const App = {
    init,
    renderRoute,
    toggleLessonComplete,
    toggleBookmark,
    resetProgress,
    checkQuiz,
    labTab,
    examSourceChange,
    startExam,
    submitExam,
    retakeExam,
    saveQuestion,
    removeSavedQuestion,
    search,
    toggleTheme,
    lastResults: null,
    lastPct: undefined,
  };
  return App;
})();

document.addEventListener("DOMContentLoaded", () => App.init());
