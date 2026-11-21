# Parallel & Distributed Systems — Learning Platform

An interactive, browser-based study platform for a university-level **Parallel and Distributed Systems** course. It combines structured lecture notes, hands-on simulators, a timed examination centre, and local progress tracking in a single-page app.

Built with plain HTML, CSS, and JavaScript — no build step, no backend, and no external dependencies beyond Google Fonts.

---

## Quick start

From the project folder:

```bash
python -m http.server 8080 --bind 127.0.0.1
```

Open **http://127.0.0.1:8080/index.html**.

Any static file server works. Opening `index.html` directly also works in most browsers, but serving it over HTTP is recommended.

---

## Features

### Course content — 8 modules

1. Introduction to Parallel and Distributed Systems
2. Parallel Processing Architectures and Models
3. Distributed Systems Architecture
4. Parallel Algorithms and Programming Models
5. Google Distribution Model and MapReduce
6. Apache Hadoop and Its Ecosystem
7. Fault Tolerance and Scalability
8. Emerging Trends and Future Directions

Each module includes detailed notes, definitions, worked examples, comparison tables, advantages and limitations, examination points, knowledge checks, key takeaways, and curated external resources. Module 4 includes dedicated, code-free explanations of parallel algorithm design and the **MPI**, **OpenMP**, and **CUDA** programming models.

### Interactive Learning Lab

**Architecture Explorer**
- Flynn's Taxonomy visualiser (SISD, SIMD, MISD, MIMD)
- Shared vs distributed memory visualiser
- Client–server component explorer
- Hadoop architecture explorer

**Process Simulators**
- Sequential vs parallel execution and speedup
- Amdahl's Law curve and theoretical limit
- Parallel algorithm work distribution
- Race condition vs synchronised execution
- MapReduce word-count stepper, worker count, and worker-failure recovery
- HDFS block distribution and replication factor
- Replica failure simulator
- Server scaling, load, and response time
- Peer-to-peer peer and message simulator

**Concept Comparisons and Case Studies**
- Side-by-side comparison tables for the concepts students most often confuse
- Real-world case studies linking theory to production systems

### Examination Centre

- **Section A:** Serverless Computing, Apache Hadoop
- **Section B:** Weeks 1–2, 3–4, 5–6, 7–8 (MPI/CUDA theory), 13–14
- **Full course / specific module** filters
- Timed papers with question-count, difficulty, and duration controls
- Question formats:
  - Multiple choice
  - True / false
  - Fill in the blank
  - Short answer
  - Long answer
  - Diagram / draw and label
  - Comparison
  - Applied scenario
- Objective questions are auto-marked
- Written answers include model answers, expected keywords, suggested structure, and a self-assessment control
- Mistake review and weak-topic recommendations after submission
- Written marks are **never** presented as official university marks

### Progress tracking

Stored locally in the browser via `localStorage`:

- Completed lessons and overall course completion
- Recently viewed lessons
- Bookmarks
- Knowledge-check accuracy
- Quiz and examination history
- Recurring weak topics
- Saved examination questions
- Study-readiness indicator (course completion + best objective exam score)

Use **My Progress → Reset all progress** to clear local data.

### Design and accessibility

- White background and content surfaces with jungle green as the primary brand colour for navigation, headings and key controls
- Dark forest green used for secondary contrast and emphasis, including the light-mode sidebar
- Gold accents for important information, highlights, progress indicators and selected elements
- Soft red accents for warnings, mistakes and attention states
- Restrained green, gold and red glows on selected, active and focused interactive elements
- Full dark mode with a persistent toggle, using lighter jungle greens and gold/soft-red accents on deep forest surfaces
- Responsive layout for desktop, tablet, and mobile
- Keyboard-friendly native controls with gold focus outlines
- Semantic headings, ARIA labels on icon controls, and visible focus states
- Toast feedback for actions
- Reduced reliance on external links; video resources use topic searches or authoritative documentation

---

## Project structure

```text
.
├── index.html          # App shell, sidebar, header, script/style includes
├── css/
│   └── style.css       # Design tokens, layout, components, dark mode, responsive rules
├── js/
│   ├── content.js      # Modules, lessons, inline simulator markup, Section A/B exam content
│   ├── progress.js     # localStorage persistence and progress API
│   ├── ui.js           # Toasts, escaping, date/percent formatting
│   ├── lab.js          # Simulator rendering and interactions
│   ├── exam.js         # Question bank, filtering, marking, exam state
│   └── app.js          # Hash router, page renderers, exam UI, theme, progress UI
└── README.md
```

---

## Using the platform

- Navigate with the sidebar or the mobile menu.
- Press **Mark complete** on a lesson to advance course progress.
- Use **☆** to bookmark a lesson.
- Answer knowledge checks to build the accuracy record on **My Progress**.
- In the Examination Centre, choose a source, formats, count, difficulty, and duration, then start.
- After submitting, review objective mistakes and compare written answers with the model answers.
- Save written questions for later revision and remove them from **My Progress** when done.

---

## Notes and limitations

- This is a **study aid**, not an accredited assessment system. Auto-marked percentages cover objective questions only.
- Progress is stored in the current browser profile. Clearing browser storage removes it.
- Weeks 5–6 are marked as supporting material where the exact lecturer topic list was unavailable. Weeks 13–14 follow the overall course outline.
- External videos link to YouTube searches or official documentation rather than guessed video IDs, so links stay valid and relevant.
- The platform is intentionally dependency-free; all logic runs client-side.

---

## Customisation

- **Palette / dark mode:** CSS variables at the top of `css/style.css`.
- **Course notes and simulator markup:** `js/content.js`.
- **Question bank:** `EXAM_CONTENT` in `js/content.js` and `WRITTEN_BANK` in `js/exam.js`.
- **Exam rules and marking:** `js/exam.js`.
- **Page layouts and routing:** `js/app.js`.

When changing CSS or JavaScript during development, update the `?v=` query string on the asset links in `index.html` to defeat browser caching.

---

## Credits

Content is written for educational use and draws on standard texts and public documentation, including:

- Patterson & Hennessy, *Computer Organization and Design*
- Tanenbaum & van Steen, *Distributed Systems*
- Dean & Ghemawat, "MapReduce: Simplified Data Processing on Large Clusters"
- Apache Hadoop and HDFS documentation
- Open MPI and NVIDIA CUDA documentation

All trademarks and external resources belong to their respective owners.
