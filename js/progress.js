/*
 * ============================================================================
 * PROGRESS TRACKING — localStorage persistence
 * ============================================================================
 */

const Progress = (() => {
  const KEY = "pds_progress_v1";

  const defaults = {
    completedLessons: {},   // moduleId -> [lessonId, ...]
    quizScores: {},         // quizId -> { score, total, date }
    examAttempts: [],       // [{ section, week, score, total, pct, date, wrong: [...] }]
    bookmarks: {},          // moduleId -> [lessonId, ...]
    savedQuestions: [],     // [{ section, week, qIndex }]
    lastViewed: [],         // [{ moduleId, lessonId, title, date }]
    settings: { theme: "light", fontSize: "base" },
  };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return clone(defaults);
      const data = JSON.parse(raw);
      return merge(defaults, data);
    } catch (e) {
      return clone(defaults);
    }
  }

  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      // Storage may be disabled in private mode — silently degrade.
    }
  }

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function merge(target, source) {
    const out = clone(target);
    for (const k in source) {
      if (source[k] && typeof source[k] === "object" && !Array.isArray(source[k])) {
        out[k] = merge(out[k] || {}, source[k]);
      } else {
        out[k] = source[k];
      }
    }
    return out;
  }

  let state = load();

  const api = {
    get() { return state; },

    reset() {
      state = clone(defaults);
      save(state);
      return state;
    },

    persist() { save(state); },

    // Lessons
    isLessonCompleted(moduleId, lessonId) {
      return !!(state.completedLessons[moduleId] || []).includes(lessonId);
    },

    completeLesson(moduleId, lessonId) {
      if (!state.completedLessons[moduleId]) state.completedLessons[moduleId] = [];
      if (!state.completedLessons[moduleId].includes(lessonId)) {
        state.completedLessons[moduleId].push(lessonId);
      }
      this.addRecentlyViewed(moduleId, lessonId);
      save(state);
    },

    reopenLesson(moduleId, lessonId) {
      const arr = state.completedLessons[moduleId] || [];
      const i = arr.indexOf(lessonId);
      if (i !== -1) arr.splice(i, 1);
      save(state);
    },

    completionPercent(moduleId, totalLessons) {
      const done = (state.completedLessons[moduleId] || []).length;
      if (!totalLessons) return 0;
      return Math.round((done / totalLessons) * 100);
    },

    overallPercent(moduleTotals) {
      let done = 0, total = 0;
      for (const m in moduleTotals) {
        done += (state.completedLessons[m] || []).length;
        total += moduleTotals[m];
      }
      return total ? Math.round((done / total) * 100) : 0;
    },

    // Recently viewed
    addRecentlyViewed(moduleId, lessonId, title) {
      const entry = { moduleId, lessonId, title, date: Date.now() };
      state.lastViewed = state.lastViewed.filter(
        (e) => !(e.moduleId === moduleId && e.lessonId === lessonId)
      );
      state.lastViewed.unshift(entry);
      state.lastViewed = state.lastViewed.slice(0, 8);
      save(state);
    },

    // Quiz
    recordQuiz(quizId, score, total) {
      state.quizScores[quizId] = { score, total, date: Date.now() };
      save(state);
    },

    getQuiz(quizId) { return state.quizScores[quizId]; },

    // Exams
    recordExam(attempt) {
      state.examAttempts.push({ ...attempt, date: Date.now() });
      save(state);
    },

    getExams() { return state.examAttempts.slice().reverse(); },

    // Bookmarks
    isBookmarked(moduleId, lessonId) {
      return !!(state.bookmarks[moduleId] || []).includes(lessonId);
    },

    toggleBookmark(moduleId, lessonId) {
      if (!state.bookmarks[moduleId]) state.bookmarks[moduleId] = [];
      const arr = state.bookmarks[moduleId];
      const i = arr.indexOf(lessonId);
      if (i === -1) arr.push(lessonId);
      else arr.splice(i, 1);
      save(state);
    },

    // Saved questions
    saveQuestion(item) {
      if (!state.savedQuestions.some(
        (q) => q.section === item.section && q.week === item.week && q.qIndex === item.qIndex
      )) {
        state.savedQuestions.push(item);
        save(state);
      }
    },

    unsavedQuestion(item) {
      state.savedQuestions = state.savedQuestions.filter(
        (q) => !(q.section === item.section && q.week === item.week && q.qIndex === item.qIndex)
      );
      save(state);
    },

    removeSavedQuestion(qid) {
      state.savedQuestions = state.savedQuestions.filter((q) => q.qIndex !== qid);
      save(state);
    },

    isSavedQuestion(item) {
      return state.savedQuestions.some(
        (q) => q.section === item.section && q.week === item.week && q.qIndex === item.qIndex
      );
    },
  };

  return api;
})();
