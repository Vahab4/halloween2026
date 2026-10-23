/* MIND//NIGHT — an offline-friendly, fictional psychological horror experience.
   No accounts, analytics, external APIs, or personal data collection. */
(() => {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const scene = $('#scene');
  const phaseLabel = $('#phase-label');
  const progressValue = $('#progress-value');
  const progressFill = $('#progress-fill');
  const evidenceList = $('#evidence-list');
  const evidenceCount = $('#evidence-count');
  const caseStatus = $('#case-status');
  const transmissionText = $('#transmission-text');
  const toast = $('#toast');
  const soundToggle = $('#sound-toggle');
  const soundLabel = $('#sound-label');

  const evidenceNames = [
    'Observation record',
    'Night-shift note',
    'Incident inference',
    'Patient fragment'
  ];
  const state = {
    screen: 'intro',
    attentionMode: 'ready',
    memoryMode: 'ready',
    selectedAnswer: null,
    answers: { attention: null, memory: null, inference: null },
    evidence: [],
    fragmentFound: false,
    finalChoice: null,
    startedAt: null,
    elapsedSeconds: 0,
    ended: false,
    soundOn: false
  };

  let attentionTimer = null;
  let memoryTimer = null;
  let elapsedTimer = null;
  let toastTimer = null;
  let audioContext = null;
  let ambientNodes = [];

  const screenProgress = {
    intro: 0, briefing: 4, attention: 15, 'attention-feedback': 28,
    memory: 34, 'memory-feedback': 48, inference: 55,
    'inference-feedback': 68, archive: 79, decision: 90, ending: 100
  };
  const phaseNames = {
    intro: 'UNCLASSIFIED EXPERIENCE', briefing: 'SESSION BRIEFING', attention: 'COGNITIVE RECORD // 01',
    'attention-feedback': 'COGNITIVE RECORD // 01', memory: 'COGNITIVE RECORD // 02',
    'memory-feedback': 'COGNITIVE RECORD // 02', inference: 'COGNITIVE RECORD // 03',
    'inference-feedback': 'COGNITIVE RECORD // 03', archive: 'RECOVERED ARCHIVE', decision: 'FINAL DISPOSITION', ending: 'CASE DISPOSITION'
  };
  const transmissions = {
    intro: '“The archive only opens when someone is willing to look again.”',
    briefing: '“You are here to observe. Not to invent an answer.”',
    attention: '“Five marks. One repetition. Look carefully.”',
    'attention-feedback': '“A missed detail is not a character flaw. It is a clue about attention.”',
    memory: '“Read the note. The record will not wait forever.”',
    'memory-feedback': '“Memory preserves meaning, not a perfect recording.”',
    inference: '“A contradiction is not permission to guess.”',
    'inference-feedback': '“Uncertainty is a valid result.”',
    archive: '“Someone edited the report after the last entry.”',
    decision: '“What you do with the evidence is still your choice.”',
    ending: '“The file is closed. The question is not.”'
  };

  function safeText(text) {
    return String(text).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
  }

  function setScreen(screen) {
    clearTimeout(attentionTimer);
    clearTimeout(memoryTimer);
    state.screen = screen;
    state.selectedAnswer = null;
    render();
  }

  function startClock() {
    if (elapsedTimer) clearInterval(elapsedTimer);
    elapsedTimer = setInterval(() => {
      if (!state.startedAt || state.ended) return;
      state.elapsedSeconds = Math.floor((Date.now() - state.startedAt) / 1000);
      updateClock();
    }, 1000);
  }

  function updateClock() {
    const minutes = String(Math.floor(state.elapsedSeconds / 60)).padStart(2, '0');
    const seconds = String(state.elapsedSeconds % 60).padStart(2, '0');
    $('#clock-label').textContent = `LOCAL SESSION // ${minutes}:${seconds}`;
  }

  function updateDossier() {
    const progress = screenProgress[state.screen] ?? 0;
    progressValue.textContent = `${String(progress).padStart(2, '0')}%`;
    progressFill.style.width = `${progress}%`;
    evidenceCount.textContent = `${String(state.evidence.length).padStart(2, '0')}/04`;
    caseStatus.textContent = state.ended ? 'SEALED' : 'UNSEALED';
    caseStatus.className = state.ended ? 'status-closed' : 'status-open';
    evidenceList.innerHTML = evidenceNames.map((name, i) => {
      const found = state.evidence.includes(i);
      return `<li class="${found ? 'found' : 'evidence-pending'}"><span class="evidence-marker">${found ? '◉' : '○'}</span><span>${name}</span><em>${found ? 'RECOVERED' : 'LOCKED'}</em></li>`;
    }).join('');
    transmissionText.textContent = transmissions[state.screen] || transmissions.intro;
    phaseLabel.textContent = phaseNames[state.screen] || 'ARCHIVE NODE 13';
    updateClock();
  }

  function render() {
    updateDossier();
    const renderers = {
      intro: renderIntro,
      briefing: renderBriefing,
      attention: renderAttention,
      'attention-feedback': renderAttentionFeedback,
      memory: renderMemory,
      'memory-feedback': renderMemoryFeedback,
      inference: renderInference,
      'inference-feedback': renderInferenceFeedback,
      archive: renderArchive,
      decision: renderDecision,
      ending: renderEnding
    };
    scene.innerHTML = (renderers[state.screen] || renderIntro)();
    scene.scrollTop = 0;
  }

  function renderIntro() {
    return `
      <div class="micro-label">RESTRICTED ACCESS <span class="file-stamp">FILE 07 / 13</span></div>
      <h1 class="hero-title">MIND<span class="slash">//</span><br><span class="outline">NIGHT</span></h1>
      <p class="hero-subtitle">A psychological horror experience about <strong>attention, memory, and the stories we build when the evidence doesn't fit.</strong></p>
      <div class="hero-rule">ONE CASE. THREE TESTS. NO EASY ANSWERS.</div>
      <p class="content-copy">At 02:17, a sound was recorded in an empty ward. The official report says nobody was there. A second report says the first one was never written.</p>
      <div class="btn-row"><button class="btn-primary" data-action="begin">INITIATE SESSION <span class="button-arrow">↗</span></button><button class="btn-secondary" data-action="show-how">WHAT TO EXPECT <span class="button-arrow">＋</span></button></div>
      <p class="fine-print">HEADPHONES OPTIONAL · APPROX. 5–8 MINUTES · NO SIGN-IN · YOUR CHOICES STAY IN THIS BROWSER</p>
      <div id="how-box" hidden class="notice-box"><strong>CASE NOTE:</strong> You will complete three fictional challenges, inspect a recovered file, and make one final decision. There are no diagnoses, and there is no penalty for an incorrect answer.</div>
    `;
  }

  function renderBriefing() {
    return `
      <div class="section-kicker"><span>PRE-SESSION PROTOCOL</span><span class="step-counter">00 / 04</span></div>
      <h2 class="content-title">Before you enter <span class="accent">the ward.</span></h2>
      <p class="content-copy">The overnight archive belongs to a fictional research clinic. Your task is to reconstruct the final entry without confusing <strong>what was observed</strong> with <strong>what someone believes it means.</strong></p>
      <div class="notice-box"><strong>THE RULE:</strong> Keep contradictions visible. Do not diagnose the fictional subject, and do not assume that an unusual experience proves a supernatural cause.</div>
      <div class="briefing-grid">
        <article class="brief-item"><span class="brief-number">01 / ATTENTION</span><h3>Observe</h3><p>A brief sequence will disappear. Notice the pattern.</p></article>
        <article class="brief-item"><span class="brief-number">02 / MEMORY</span><h3>Recall</h3><p>Read a night-shift note, then answer from memory.</p></article>
        <article class="brief-item"><span class="brief-number">03 / INFERENCE</span><h3>Reason</h3><p>Decide what conflicting records actually prove.</p></article>
      </div>
      <div class="btn-row"><button class="btn-primary" data-action="start-attention">ENTER THE WARD <span class="button-arrow">→</span></button><button class="btn-secondary" data-action="go-intro">NOT YET</button></div>
    `;
  }

  function renderAttention() {
    if (state.attentionMode === 'show') {
      return `
        <div class="section-kicker"><span>TEST 01 / VISUAL ATTENTION</span><span class="step-counter">01 / 03</span></div>
        <h2 class="content-title">Watch the <span class="accent">signal.</span></h2>
        <p class="content-copy">Study the five marks below. One symbol appears exactly twice. The sequence will disappear in a few seconds.</p>
        <div class="challenge-card"><div class="challenge-head"><div><h3>Observation window</h3><p>Keep your eyes on the sequence.</p></div><span class="timer-label" id="attention-countdown">SIGNAL LIVE</span></div>
          <div class="glyph-board" aria-label="Symbol sequence: triangle, circle-like symbol, diamond, wave, circle-like symbol"><span class="glyph">△</span><span class="glyph">◉</span><span class="glyph">◈</span><span class="glyph">⌁</span><span class="glyph">◉</span></div>
          <p class="challenge-note">OBSERVATION WINDOW OPEN // DO NOT TAKE A SCREENSHOT</p>
        </div>
        <p class="fine-print">This is a tiny game challenge, not a clinical measure of attention.</p>
      `;
    }
    return `
      <div class="section-kicker"><span>TEST 01 / VISUAL ATTENTION</span><span class="step-counter">01 / 03</span></div>
      <h2 class="content-title">What did you <span class="accent">notice?</span></h2>
      <p class="content-copy">The signal is gone. Which symbol appeared exactly twice?</p>
      <div class="challenge-card"><div class="challenge-head"><div><h3>Recovered visual trace</h3><p>Choose one answer. Trust what you observed, not what feels familiar.</p></div><span class="timer-label">SIGNAL LOST</span></div>
        <div class="choice-grid" role="group" aria-label="Choose the repeated symbol">
          ${choiceButton('triangle', '△', 'A')}
          ${choiceButton('circle', '◉', 'B')}
          ${choiceButton('diamond', '◈', 'C')}
          ${choiceButton('wave', '⌁', 'D')}
        </div>
        <div class="submit-row"><span class="inline-help">ONE ANSWER REQUIRED TO CONTINUE</span><button class="btn-primary" data-action="answer-attention" id="submit-answer" disabled>CONFIRM RESPONSE <span class="button-arrow">→</span></button></div>
      </div>
    `;
  }

  function choiceButton(value, label, index, text = '') {
    return `<button class="choice-button" type="button" data-answer="${safeText(value)}" aria-pressed="false"><span class="choice-index">${index}</span><span>${label}${text ? ` <span class="choice-detail">${text}</span>` : ''}</span></button>`;
  }

  function renderAttentionFeedback() {
    const correct = state.answers.attention === 'circle';
    return `
      <div class="section-kicker"><span>TEST 01 / OBSERVATION LOGGED</span><span class="step-counter">01 / 03</span></div>
      <h2 class="content-title">Signal <span class="accent">analysis.</span></h2>
      <div class="feedback-card ${correct ? '' : 'incorrect'}"><div class="feedback-icon">${correct ? '✓' : '↗'}</div><div><h3>${correct ? 'Pattern recovered.' : 'Pattern not recovered.'}</h3><p>The ◉ symbol appeared twice. Either response is fine for this story: attention shifts with context, fatigue, and distraction, and one quick puzzle cannot tell you anything clinical about yourself.</p></div></div>
      <div class="record-paper" style="margin-top:20px"><div class="paper-top"><span>OBSERVATION REPORT / 01</span><span>RECOVERED</span></div><p>Sequence integrity: <strong>${correct ? 'CONFIRMED' : 'PARTIAL'}</strong></p><p>Repeated mark: ◉ × 2</p><p>Operator note: a missed detail is not evidence of a disorder.</p></div>
      <div class="btn-row"><button class="btn-primary" data-action="start-memory">OPEN NIGHT-SHIFT NOTE <span class="button-arrow">→</span></button></div>
    `;
  }

  function renderMemory() {
    if (state.memoryMode === 'show') {
      return `
        <div class="section-kicker"><span>TEST 02 / MEMORY TRACE</span><span class="step-counter">02 / 03</span></div>
        <h2 class="content-title">Read the <span class="accent">night note.</span></h2>
        <p class="content-copy">This handwritten log was recovered beside the empty observation room. Read it carefully, then seal it to answer a question from memory.</p>
        <div class="record-paper"><div class="paper-top"><span>WARD 13 / NIGHT-SHIFT LOG</span><span>03 OCT / 02:xx</span></div><p><strong>02:17</strong> — Bell recorded once. No door opening detected.</p><p><strong>02:19</strong> — Brass key found on the inside of the desk drawer.</p><p><strong>02:21</strong> — Patient requested a yellow blanket.</p><p><strong>02:24</strong> — Staff note: “The room was empty when I arrived.”</p><p class="paper-small">HANDWRITING ANALYSIS INCOMPLETE // ORIGINAL COPY</p></div>
        <div class="btn-row"><button class="btn-primary" data-action="seal-memory">SEAL THE NOTE <span class="button-arrow">→</span></button><span class="inline-help">THE NOTE WILL ALSO SEAL AUTOMATICALLY</span></div>
      `;
    }
    return `
      <div class="section-kicker"><span>TEST 02 / MEMORY TRACE</span><span class="step-counter">02 / 03</span></div>
      <h2 class="content-title">What stayed <span class="accent">with you?</span></h2>
      <p class="content-copy">The note has been sealed. At what time did the log say the bell was recorded?</p>
      <div class="challenge-card"><div class="challenge-head"><div><h3>Recall check</h3><p>Choose the time written in the first entry.</p></div><span class="timer-label">FILE SEALED</span></div>
        <div class="choice-grid" role="group" aria-label="Choose the time recorded in the note">
          ${choiceButton('02:17', '02:17 AM', 'A')}
          ${choiceButton('03:10', '03:10 AM', 'B')}
          ${choiceButton('01:42', '01:42 AM', 'C')}
          ${choiceButton('00:17', '00:17 AM', 'D')}
        </div>
        <div class="submit-row"><span class="inline-help">YOU MAY USE YOUR BEST RECOLLECTION</span><button class="btn-primary" data-action="answer-memory" id="submit-answer" disabled>CONFIRM RESPONSE <span class="button-arrow">→</span></button></div>
      </div>
    `;
  }

  function renderMemoryFeedback() {
    const correct = state.answers.memory === '02:17';
    return `
      <div class="section-kicker"><span>TEST 02 / MEMORY LOGGED</span><span class="step-counter">02 / 03</span></div>
      <h2 class="content-title">Record <span class="accent">recovered.</span></h2>
      <div class="feedback-card ${correct ? '' : 'incorrect'}"><div class="feedback-icon">${correct ? '✓' : '↗'}</div><div><h3>${correct ? 'Timestamp recovered.' : 'Timestamp not recovered.'}</h3><p>The note placed the bell at 02:17. Human memory is reconstructive: confidence and accuracy are not always the same thing, and a single recall question does not measure your memory in any clinical sense.</p></div></div>
      <div class="record-paper" style="margin-top:20px"><div class="paper-top"><span>MEMORY TRACE / 02</span><span>ARCHIVED</span></div><p>Recovered timestamp: <strong>02:17 AM</strong></p><p>Secondary note: “No door opening detected.”</p><p>Unresolved discrepancy: bell event vs. door sensor.</p></div>
      <div class="btn-row"><button class="btn-primary" data-action="start-inference">COMPARE THE RECORDS <span class="button-arrow">→</span></button></div>
    `;
  }

  function renderInference() {
    return `
      <div class="section-kicker"><span>TEST 03 / REASONING UNDER UNCERTAINTY</span><span class="step-counter">03 / 03</span></div>
      <h2 class="content-title">What does the file <span class="accent">prove?</span></h2>
      <p class="content-copy">Two records remain. Neither has been verified by an independent source.</p>
      <div class="archive-list">
        <div class="archive-row"><span class="archive-symbol">▤</span><div><strong>Audio event log</strong><span>A single bell sound was recorded at 02:17.</span></div><em>RECORD A</em></div>
        <div class="archive-row"><span class="archive-symbol">⌁</span><div><strong>Door sensor log</strong><span>No door opening was detected between 02:10 and 02:20.</span></div><em>RECORD B</em></div>
      </div>
      <div class="challenge-card"><div class="challenge-head"><div><h3>Choose the most defensible conclusion.</h3><p>Separate the available observations from a possible explanation.</p></div></div>
        <div class="choice-grid" role="group" aria-label="Choose the most defensible conclusion">
          ${choiceButton('lying', 'Someone must be lying.', 'A')}
          ${choiceButton('supernatural', 'A supernatural event occurred.', 'B')}
          ${choiceButton('uncertain', 'The records conflict or are incomplete; the cause is unknown.', 'C')}
          ${choiceButton('patient', 'The patient caused the sound.', 'D')}
        </div>
        <div class="submit-row"><span class="inline-help">CORRELATION IS NOT EXPLANATION</span><button class="btn-primary" data-action="answer-inference" id="submit-answer" disabled>FILE CONCLUSION <span class="button-arrow">→</span></button></div>
      </div>
    `;
  }

  function renderInferenceFeedback() {
    const correct = state.answers.inference === 'uncertain';
    return `
      <div class="section-kicker"><span>TEST 03 / INFERENCE LOGGED</span><span class="step-counter">03 / 03</span></div>
      <h2 class="content-title">Keep the <span class="accent">uncertainty.</span></h2>
      <div class="feedback-card ${correct ? '' : 'incorrect'}"><div class="feedback-icon">${correct ? '✓' : '↗'}</div><div><h3>${correct ? 'Cautious inference recorded.' : 'A conclusion was recorded.'}</h3><p>The strongest conclusion is that the records do not fully explain the event. Missing data, sensor failure, an unlogged sound source, or a mistaken timestamp are all possible. The files alone do not identify a cause.</p></div></div>
      <div class="notice-box"><strong>CLINICAL REASONING PRINCIPLE:</strong> Describe the observation first. Generate possible explanations second. Seek more evidence before treating one explanation as fact.</div>
      <div class="btn-row"><button class="btn-primary" data-action="open-archive">RECOVER THE FINAL FILE <span class="button-arrow">→</span></button></div>
    `;
  }

  function renderArchive() {
    const fragmentMarkup = state.fragmentFound ? `
      <div class="fragment-box"><p class="eyebrow">FRAGMENT 04 / DECRYPTED</p><blockquote>“The door was not the important part. Everyone kept asking what was wrong with me. Nobody asked what had happened.”</blockquote><p class="fine-print">END OF RECOVERED MESSAGE // SOURCE UNVERIFIED</p></div>
    ` : '';
    return `
      <div class="section-kicker"><span>RECOVERED ARCHIVE / FINAL FILE</span><span class="step-counter">04 / 04</span></div>
      <h2 class="content-title">The note beneath <span class="accent">the note.</span></h2>
      <p class="content-copy">The three records do not tell a complete story. A final fragment is hidden inside the incident report. Its origin cannot be verified, but it may change how you read the case.</p>
      <div class="record-paper"><div class="paper-top"><span>INCIDENT SUMMARY / REVISION 3</span><span class="file-stamp">AMENDED</span></div><p>02:17 — Bell sound logged. No door opening recorded.</p><p>02:24 — Room described as empty by arriving staff.</p><p>02:31 — Case closed. Cause: <span class="redacted">UNSPECIFIED</span></p><p>03:03 — Earlier report deleted from active archive.</p><p class="paper-small">EDIT HISTORY INCOMPLETE // REVIEWER UNKNOWN</p></div>
      ${fragmentMarkup}
      ${state.fragmentFound ? `<div class="btn-row"><button class="btn-primary" data-action="to-decision">MAKE YOUR FINAL DECISION <span class="button-arrow">→</span></button></div>` : `<div class="btn-row"><button class="btn-primary" data-action="decrypt-fragment">DECRYPT HIDDEN FRAGMENT <span class="button-arrow">↗</span></button><button class="btn-secondary" data-action="to-decision">SKIP FRAGMENT</button></div>`}
      <p class="fine-print">The fragment is fictional. The story asks what gets lost when a person's account is replaced by an assumption.</p>
    `;
  }

  function renderDecision() {
    return `
      <div class="section-kicker"><span>FINAL DISPOSITION / CHOICE REQUIRED</span><span class="step-counter">LAST DECISION</span></div>
      <h2 class="content-title">How will you close <span class="accent">the case?</span></h2>
      <p class="content-copy">The archive will accept one final report. You cannot prove what happened that night. You can decide what to do with the information you have.</p>
      <div class="choice-stack" role="group" aria-label="Choose how to close the case">
        <button class="choice-button" data-final-choice="witness"><span class="choice-index">A</span><span><strong>Preserve the raw record.</strong><br><span>Keep both accounts, state what remains unknown, and leave the case open to the person's account.</span></span></button>
        <button class="choice-button" data-final-choice="close"><span class="choice-index">B</span><span><strong>Finalize the official report.</strong><br><span>Choose one explanation, seal the file, and let the archive forget the contradiction.</span></span></button>
      </div>
      <p class="fine-print">There is no real patient and no clinical judgment here. This is a narrative choice about evidence, uncertainty, and listening.</p>
    `;
  }

  function calculateEnding() {
    const correctCount = Object.values(state.answers).filter((answer) => answer === true).length;
    // Answers are stored as booleans below, so use that score directly.
    if (state.finalChoice === 'witness' && state.fragmentFound && correctCount === 3) {
      return {
        name: 'THE WITNESS', type: 'secret', mark: '◉',
        subtitle: 'SECRET ENDING / RAW RECORD PRESERVED',
        quote: '“You did not solve a person. You listened to the evidence, left room for uncertainty, and noticed what the report left out.”',
        body: 'The archive records an unusual outcome: no single cause was invented to close the file. The original note is restored alongside the official report. At 02:17, the system logs one final event—not a bell, but a file being reopened.',
        lesson: 'Curiosity without certainty can be an act of care.'
      };
    }
    if (state.finalChoice === 'witness') {
      return {
        name: 'THE OPEN RECORD', type: 'open', mark: '↗',
        subtitle: 'ENDING / FILE LEFT OPEN',
        quote: '“An honest record can contain a question. It does not have to turn a guess into a fact.”',
        body: 'You preserve the contradictory logs and attach a note requesting further review. The archive stays open. Somewhere inside the system, a new entry appears: “Ask what happened before asking what is wrong.”',
        lesson: 'Preserve the observations. Do not confuse a theory with a finding.'
      };
    }
    return {
      name: 'THE CLOSED FILE', type: 'closed', mark: '×',
      subtitle: 'ENDING / OFFICIAL REPORT SEALED',
      quote: '“The case is closed. The contradiction remains.”',
      body: 'The final report is accepted, and the interface returns to its quiet standby screen. The timestamp still does not fit the door log. A small line at the bottom of the file remains unredacted: “Closure is not the same thing as explanation.”',
      lesson: 'A confident conclusion can still leave the most important question unanswered.'
    };
  }

  function renderEnding() {
    const ending = calculateEnding();
    const correctCount = Object.values(state.answers).filter((answer) => answer === true).length;
    return `
      <div class="ending-mark ${ending.type === 'closed' ? 'red' : ''}">${ending.mark}</div>
      <div class="micro-label">${ending.subtitle}</div>
      <h2 class="content-title">${ending.name.split(' ').slice(0, -1).join(' ')} <span class="accent">${ending.name.split(' ').slice(-1)[0]}.</span></h2>
      <p class="content-copy">${ending.body}</p>
      <blockquote class="ending-quote">${ending.quote}</blockquote>
      <div class="ending-stats">
        <div class="stat-tile"><span>RECORDS RECOVERED</span><strong>${String(state.evidence.length).padStart(2, '0')}/04</strong><small>FILES REOPENED</small></div>
        <div class="stat-tile"><span>CHALLENGES</span><strong>${correctCount}/3</strong><small>ANSWERS MATCHED</small></div>
        <div class="stat-tile"><span>SESSION TIME</span><strong>${formatElapsed()}</strong><small>LOCAL ONLY</small></div>
      </div>
      <div class="notice-box"><strong>CASE NOTE:</strong> ${ending.lesson}</div>
      <div class="btn-row"><button class="btn-primary" data-action="share-result">SHARE YOUR ENDING <span class="button-arrow">↗</span></button><button class="btn-secondary" data-action="play-again">REOPEN ARCHIVE ↺</button></div>
      <p class="ending-disclaimer">Your result describes only the route you took through this fictional story. It is not a personality profile, memory test result, psychiatric screen, or medical assessment. Your answers are not sent to a server.</p>
    `;
  }

  function formatElapsed() {
    const minutes = String(Math.floor(state.elapsedSeconds / 60)).padStart(2, '0');
    const seconds = String(state.elapsedSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  function addEvidence(index) {
    if (!state.evidence.includes(index)) state.evidence.push(index);
  }

  function toastMessage(message) {
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 2600);
  }

  function beginSession() {
    state.startedAt = Date.now();
    state.elapsedSeconds = 0;
    state.ended = false;
    startClock();
    setScreen('briefing');
  }

  function startAttention() {
    state.attentionMode = 'show';
    setScreen('attention');
    attentionTimer = setTimeout(() => {
      if (state.screen === 'attention' && state.attentionMode === 'show') {
        state.attentionMode = 'question';
        render();
      }
    }, 6500);
  }

  function startMemory() {
    addEvidence(0);
    state.memoryMode = 'show';
    setScreen('memory');
    memoryTimer = setTimeout(() => {
      if (state.screen === 'memory' && state.memoryMode === 'show') {
        state.memoryMode = 'question';
        render();
      }
    }, 18000);
  }

  function answer(kind) {
    const selected = state.selectedAnswer;
    if (!selected) return;
    const correctAnswers = { attention: 'circle', memory: '02:17', inference: 'uncertain' };
    state.answers[kind] = selected === correctAnswers[kind];
    if (kind === 'memory') addEvidence(1);
    if (kind === 'inference') addEvidence(2);
    setScreen(`${kind}-feedback`);
  }

  function resolveChoice(choice) {
    state.finalChoice = choice;
    state.ended = true;
    if (elapsedTimer) clearInterval(elapsedTimer);
    state.evidence = Array.from(new Set(state.evidence));
    setScreen('ending');
  }

  function restart() {
    clearTimeout(attentionTimer);
    clearTimeout(memoryTimer);
    if (elapsedTimer) clearInterval(elapsedTimer);
    state.screen = 'intro';
    state.attentionMode = 'ready';
    state.memoryMode = 'ready';
    state.selectedAnswer = null;
    state.answers = { attention: null, memory: null, inference: null };
    state.evidence = [];
    state.fragmentFound = false;
    state.finalChoice = null;
    state.startedAt = null;
    state.elapsedSeconds = 0;
    state.ended = false;
    render();
    toastMessage('Archive reset. A new session is ready.');
  }

  function shareResult() {
    const ending = calculateEnding();
    const score = Object.values(state.answers).filter(Boolean).length;
    const text = `I reached “${ending.name}” in MIND//NIGHT — a psychological horror experience about attention, memory, and uncertainty. I recovered ${state.evidence.length}/4 files and matched ${score}/3 challenge answers. Can you uncover the hidden ending?`;
    if (navigator.share) {
      navigator.share({ title: 'MIND//NIGHT — Case 07', text }).catch(() => {});
      return;
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => toastMessage('Ending copied. Paste it into your group chat.')).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed'; field.style.opacity = '0';
    document.body.appendChild(field); field.select();
    try {
      document.execCommand('copy');
      toastMessage('Ending copied. Paste it into your group chat.');
    } catch (_) {
      toastMessage('Your ending is “' + calculateEnding().name + '”.');
    }
    field.remove();
  }

  function startAmbient() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      toastMessage('Ambient sound is not supported in this browser.');
      state.soundOn = false;
      updateSoundButton();
      return;
    }
    try {
      audioContext = audioContext || new AudioCtx();
      if (audioContext.state === 'suspended') audioContext.resume();
      const master = audioContext.createGain();
      master.gain.setValueAtTime(0.0001, audioContext.currentTime);
      master.gain.exponentialRampToValueAtTime(0.018, audioContext.currentTime + 1.2);
      master.connect(audioContext.destination);
      [54, 54.7, 81].forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = index === 2 ? 'sine' : 'triangle';
        oscillator.frequency.value = frequency;
        gain.gain.value = index === 2 ? 0.16 : 0.25;
        oscillator.connect(gain); gain.connect(master);
        oscillator.start();
        ambientNodes.push(oscillator, gain);
      });
      ambientNodes.push(master);
      state.soundOn = true;
      updateSoundButton();
    } catch (_) {
      state.soundOn = false;
      updateSoundButton();
      toastMessage('Could not start ambient sound.');
    }
  }

  function stopAmbient() {
    try {
      if (audioContext) {
        ambientNodes.forEach((node) => {
          if (node instanceof OscillatorNode) { try { node.stop(); } catch (_) {} }
          try { node.disconnect(); } catch (_) {}
        });
      }
    } catch (_) {}
    ambientNodes = [];
    state.soundOn = false;
    updateSoundButton();
  }

  function updateSoundButton() {
    soundLabel.textContent = state.soundOn ? 'SOUND ON' : 'SOUND OFF';
    soundToggle.setAttribute('aria-pressed', String(state.soundOn));
    soundToggle.style.borderColor = state.soundOn ? 'rgba(157,229,199,.45)' : '';
  }

  scene.addEventListener('click', (event) => {
    const answerButton = event.target.closest('[data-answer]');
    if (answerButton) {
      scene.querySelectorAll('[data-answer]').forEach((button) => button.setAttribute('aria-pressed', 'false'));
      answerButton.setAttribute('aria-pressed', 'true');
      state.selectedAnswer = answerButton.dataset.answer;
      const submit = $('#submit-answer');
      if (submit) submit.disabled = false;
      return;
    }

    const finalButton = event.target.closest('[data-final-choice]');
    if (finalButton) {
      resolveChoice(finalButton.dataset.finalChoice);
      return;
    }

    const actionButton = event.target.closest('[data-action]');
    if (!actionButton) return;
    const action = actionButton.dataset.action;
    const actions = {
      begin: beginSession,
      'show-how': () => {
        const box = $('#how-box');
        if (box) { box.hidden = !box.hidden; actionButton.textContent = box.hidden ? 'WHAT TO EXPECT ＋' : 'HIDE DETAILS −'; }
      },
      'start-attention': startAttention,
      'go-intro': () => setScreen('intro'),
      'answer-attention': () => answer('attention'),
      'start-memory': startMemory,
      'seal-memory': () => { clearTimeout(memoryTimer); state.memoryMode = 'question'; render(); },
      'answer-memory': () => answer('memory'),
      'start-inference': () => setScreen('inference'),
      'answer-inference': () => answer('inference'),
      'open-archive': () => setScreen('archive'),
      'decrypt-fragment': () => { state.fragmentFound = true; addEvidence(3); render(); },
      'to-decision': () => setScreen('decision'),
      'share-result': shareResult,
      'play-again': restart
    };
    if (actions[action]) actions[action]();
  });

  soundToggle.addEventListener('click', () => state.soundOn ? stopAmbient() : startAmbient());
  $('#restart-button').addEventListener('click', restart);
  $('#brand-home').addEventListener('click', (event) => { event.preventDefault(); restart(); });
  window.addEventListener('pagehide', () => {
    clearTimeout(attentionTimer); clearTimeout(memoryTimer);
    if (elapsedTimer) clearInterval(elapsedTimer);
    stopAmbient();
  });

  // Make the inference scoring and evidence updates explicit booleans.
  // answer() stores true/false; null indicates a test that has not been completed.
  render();
})();
