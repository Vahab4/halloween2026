/* MIND//NIGHT — The Ward 13 Incident
   Entirely fictional, static-site horror mystery. No analytics, accounts, or remote APIs. */
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const app = $('#app');
  const phaseLabel = $('#phase-label');
  const clockLabel = $('#clock-label');
  const filesReadLabel = $('#files-read');
  const progressFill = $('#progress-fill');
  const progressLabel = $('#progress-label');
  const evidenceTotal = $('#evidence-total');
  const readyLabel = $('#ready-label');
  const suspectStatus = $('#suspect-status');
  const headerStatusText = $('#header-status-text');
  const systemMessage = $('#system-message');
  const tensionLabel = $('#tension-label');
  const tensionCopy = $('#tension-copy');
  const soundToggle = $('#sound-toggle');
  const soundLabel = $('#sound-label');
  const soundSymbol = $('#sound-symbol');
  const toast = $('#toast');

  const patientFiles = [
    {
      id: 1, codename: 'The Bell Witness', age: 26, portrait: 'a',
      summary: 'A patient who reports hearing a bell even when the ward clock is still.',
      history: 'Repeated episodes of poor sleep and an intense awareness of ordinary building sounds. The patient often asks staff to confirm the time before making a statement. The chart uses the word “unreliable” without explaining how any claim was tested.',
      timeline: 'Night of the attack: placed in the north infirmary under observation from 02:08 to 02:26. The observation sheet has two signatures, though the time written by the second signer appears to have been altered.',
      fragment: '“It was not a bell. It was metal striking metal. Then someone said, ‘Mara, you cannot take the ledger.’ I could not see who spoke.”',
      relevance: 'Separates the recorded sound from the name of its source. The statement gives a name fragment, but not a reliable face or identity.',
      tags: ['witness statement', 'time conflict'], clue: 'The witness heard the name Mara near the archive, but could not identify the speaker.'
    },
    {
      id: 2, codename: 'The Ash Collector', age: 31, portrait: 'b',
      summary: 'Keeps scraps of burnt paper and can identify several types of smoke by smell.',
      history: 'A past house fire left the patient distressed by smoke alarms and ash. Staff repeatedly described the collecting habit as “suspicious”; no incident report establishes that the patient set any fire.',
      timeline: 'A dining-room attendant recalls the patient at the west window during the first alarm. A separate, unsigned note claims the patient entered the archive passage, but its ink and paper are from a different date.',
      fragment: '“Vale said the second copy had to burn before morning. He was not talking about the vampires. He was talking about a name.”',
      relevance: 'Could point to the record-destruction motive, but the witness has a history of hearing staff through an old ventilation shaft and did not see a face.',
      tags: ['burned paper', 'unverified witness'], clue: 'A witness recalls Dr. Vale threatening to burn a second copy of an unknown record.'
    },
    {
      id: 3, codename: 'The Glass Guest', age: 22, portrait: 'c',
      summary: 'Writes letters to people who have never received them; several were returned unopened.',
      history: 'The file describes intrusive sexual thoughts that the patient found unwanted and frightening. There is no recorded action toward another person. A staff member added sensational comments that were later challenged by a supervisor.',
      timeline: 'The night nurse recorded the patient speaking with another resident through the common-room partition at 02:14. The nurse remained in the corridor until after the second alarm.',
      fragment: '“I heard someone say, ‘Rhea was not lost. She was entered in a ledger.’ The other voice said, ‘Tell Mara the original is gone.’”',
      relevance: 'The wording may connect a missing person to a suppressed record. The private thoughts in the chart do not establish violence or a link to the murders.',
      tags: ['overheard phrase', 'sensitive note'], clue: 'A second witness connects the names Rhea and Mara to a missing ledger.'
    },
    {
      id: 4, codename: 'The Night Cartographer', age: 38, portrait: 'a',
      summary: 'Draws floor plans from memory, including rooms that are no longer shown on hospital maps.',
      history: 'The patient has worked as a building surveyor. The drawings are technically precise, and the patient insists that the east archive wall has a maintenance void behind it. The current plans omit that space.',
      timeline: 'A dated map of the service passage was found among the patient’s belongings. However, it is copied from a public renovation plan printed twelve years earlier; the small pivot-mark on the recovered map is absent from that public copy.',
      fragment: 'A pencil diagram shows an east-wall service hatch. Beside it: “Old pivot. Lift, do not pull. The door sensor does not cover this passage.”',
      relevance: 'Establishes a route that bypasses the normal door sensor. Another map exists, so access to a floor plan alone is not enough to identify a killer.',
      tags: ['floor plan', 'service route'], clue: 'An old service hatch could bypass the door sensor, but the map in this file is not unique.'
    },
    {
      id: 5, codename: 'The Song Recorder', age: 29, portrait: 'b',
      summary: 'Records short melodies and can reproduce a sound after hearing it once.',
      history: 'A harmless repetitive humming habit is often mentioned in staff notes, as if it were evidence of deception. The actual audio recordings are clearer and more useful than those opinions.',
      timeline: 'An audio cylinder labelled 02:17 contains a low impact followed by a thin metallic rattle. The tower bell’s usual three-note resonance is absent. The cylinder was stored in the music room, outside the attack zone.',
      fragment: '“I heard the bell in the report. I did not hear a bell in the room. Something struck a pipe. A clock can be made to lie.”',
      relevance: 'Supports the idea that the time signal was manufactured or mislabelled. It does not reveal who made the sound.',
      tags: ['audio trace', 'time anomaly'], clue: 'The sound logged as a bell may have been a metal impact, not the tower bell.'
    },
    {
      id: 44, codename: 'The White Hands', age: 24, portrait: 'c',
      summary: 'Washes repeatedly after touching damaged or unfamiliar surfaces.',
      history: 'The patient experiences severe contamination fears and may wash until the skin becomes sore. A redacted staff note calls this “evidence of a clean-up”; no forensic test backs that claim.',
      timeline: 'Two staff members signed the patient into the washroom at 02:11. The drain was examined after the attack; it contained disinfectant, soap, and no material matching the archive latch.',
      fragment: '“The red light came on first. After it, the air moved through the wall. I stayed where the nurse told me.”',
      relevance: 'A dramatic chart label is contradicted by the checkable timeline. The patient’s washing behavior is not proof of destroying evidence.',
      tags: ['forensic red herring', 'verified alibi'], clue: 'A sensational claim about cleaning is not supported by the forensic or observation records.'
    },
    {
      id: 45, codename: 'The Red Room', age: 33, portrait: 'a',
      summary: 'A complicated relationship history was repeatedly copied into notes that were supposed to concern sleep and medication.',
      history: 'Several chart entries focus on consensual adult relationships and private sexual behavior. The wording changes between copies, and none describes a threat to either victim. A later audit marked these details as irrelevant to the patient’s treatment.',
      timeline: 'A ward camera places the patient in the supervised reading room from 02:05 until 02:31. The camera clock is three minutes slow, but the two staff signatures agree on the same interval.',
      fragment: '“Everyone asked what I desired. Nobody asked what I had seen. Vale put a sheet in the furnace room and called it a ‘medical record’.”',
      relevance: 'The file includes sensational details, but its strongest information concerns a paper seen near the furnace room. Its timing remains uncertain.',
      tags: ['sensitive note', 'camera clock conflict'], clue: 'Relationship history is not a violence clue; the useful fragment concerns a paper slated for destruction.'
    },
    {
      id: 46, codename: 'The Locksmith', age: 41, portrait: 'b',
      summary: 'Can repair simple locks and once maintained doors in a theatre.',
      history: 'The patient was asked to assist with a repair project before admission. Staff inventory lists a small file and brass blanks that were returned before the night of the attack. A newer note claims one blank is missing, but the count was copied from an old sheet.',
      timeline: 'Placed in the infirmary isolation room at 02:09 after a fall. Two nurses independently signed the door check at 02:16 and 02:24.',
      fragment: '“There was no keyhole in the old service hatch. The latch was behind the plate. You need to know where to press.”',
      relevance: 'Explains the mechanics of the passage, but a technical ability is not a timeline. The strongest alibi evidence places this patient elsewhere.',
      tags: ['lock mechanism', 'verified alibi'], clue: 'The hidden hatch used a manual pivot, not a copied key; the locksmith has an alibi.'
    },
    {
      id: 47, codename: 'The Watcher', age: 28, portrait: 'vision',
      summary: 'Frequently asks whether the cameras are recording, even when their status lights are off.',
      history: 'The patient is highly anxious about privacy after having personal correspondence read aloud by staff. A file summary labels this “paranoia,” but the correspondence incident itself is documented and the patient never threatened anyone.',
      timeline: 'A chapel volunteer recalls seeing the patient in the glass reflection at 02:18. The chapel clock was working that night. The patient’s clothing is visible again in a different reflection at 02:25.',
      fragment: '“A red light can look like an eye through glass. Sometimes it is only a red light.”',
      relevance: 'The file matches the visual imagery repeated in other stories, but it does not link this person to the hidden passage, the ledger, or either victim.',
      tags: ['camera imagery', 'red herring'], clue: 'The recurring red-light motif is shared across records and does not identify the killer.'
    },
    {
      id: 48, codename: 'The Sleepless One', age: 36, portrait: 'a',
      summary: 'Has stayed awake for long periods and notices changes in the building’s ordinary sounds.',
      history: 'The notes describe exhaustion, startle responses, and difficulty knowing whether a distant sound happened before or after a short sleep. Later notes correct several early time estimates.',
      timeline: 'The patient remembers hearing a scrape from the east wall between the second alarm and the emergency lights. A maintenance team confirms recent scrape marks on the service hatch but cannot date them to a particular minute.',
      fragment: '“Something moved behind the wall. I saw no face, only a shadow that was taller when the red light flashed.”',
      relevance: 'Corroborates activity near the hidden passage but not the identity of the person inside it. The witness explicitly did not see a face.',
      tags: ['service passage', 'unreliable timestamp'], clue: 'A scrape was noticed near the east-wall hatch, but no witness saw who used it.'
    },
    {
      id: 49, codename: 'The Paper Mouth', age: 19, portrait: 'b',
      summary: 'Repeats exact phrases from documents and can remember long passages word for word.',
      history: 'After a head injury, the patient sometimes echoes language heard from others. Staff repeatedly mistook accurate repetition for confession. No independent evidence links the patient to the deaths.',
      timeline: 'A scrap found in the bedding reads “the second copy, not the original.” The phrase appears in a staff meeting transcript written before this patient was admitted.',
      fragment: '“The second copy. The second copy. Not the original. That is what the doctor said when he thought the corridor was empty.”',
      relevance: 'Points toward an important duplicated record, but the phrase was already in staff use. Repeating it is not proof of authorship or action.',
      tags: ['repeated phrase', 'ledger clue'], clue: 'The phrase “second copy” refers to a staff record, not a confession by this patient.'
    },
    {
      id: 50, codename: 'The Pulse', age: 30, portrait: 'c',
      summary: 'A medication change altered sleep, appetite, and the patient’s interest in intimacy.',
      history: 'A poorly written chart reduces several side effects to a stigmatizing phrase about hypersexuality. A pharmacy review confirms the timing of the medication change; there is no report of coercion, assault, or a threat to the victims.',
      timeline: 'The patient was in a monitored treatment room from 02:12 to 02:27 while an alarm panel was being reset. Two staff members and the room’s mechanical recording agree on the interval.',
      fragment: '“They kept asking about desire as if it were a motive. I told them I was afraid of the basement, because that is where the missing file was stored.”',
      relevance: 'Shows how an emotionally charged note can distract from a specific, testable claim about the basement archive. Its sexual detail does not predict violence.',
      tags: ['sensitive note', 'monitored alibi'], clue: 'A medication-related change in libido is not evidence of murder; the useful lead is the basement archive.'
    },
    {
      id: 51, codename: 'The Clockmaker', age: 52, portrait: 'a',
      summary: 'Repaired the ward clocks for years and can hear when a mechanism is out of step.',
      history: 'The patient has a precise sense of mechanical timing. Their wristwatch runs eight minutes slow; several reports mistakenly use it as the reference clock. The tower bell mechanism was disconnected for repair before the attack.',
      timeline: 'At 02:17, the official event log records “bell”. The tower mechanism was already disconnected at 01:50. A nearby audio trace instead captures a metal strike and a pipe resonance.',
      fragment: '“The mechanism was disconnected before two. Yet somebody typed BELL into the event log. A wrong label is still a wrong label.”',
      relevance: 'This file can resolve the strange timestamp and reveal a phrase hidden across the records. It does not say who struck the pipe.',
      tags: ['clock mechanism', 'key contradiction'], clue: 'The tower bell was disconnected: the recorded event label is not a verified source of sound.'
    },
    {
      id: 52, codename: 'The Unindexed', age: 27, portrait: 'b',
      summary: 'A partly burned file about a patient who repeatedly requested access to a record listed as destroyed.',
      history: 'The surviving page describes a former hospital archive runner admitted after repeatedly challenging the official record of a younger relative’s death. Supervisors called the requests “fixation”; a later audit found that the relative’s death certificate was never completed. The patient’s own name is almost entirely burned away.',
      timeline: 'The patient’s regular ward door was found locked from the outside, but a strip of soot on the east passage wall matches the residue on this file’s torn sleeve. A map tucked behind the page includes a tiny pivot-mark missing from the public plan. No verified observation sheet covers the minutes of the attack.',
      fragment: '“I came for the ledger. Vale woke up. He reached for the bell. Pike saw the blood on the page. I could not let them burn another Voss.”',
      relevance: 'This is the only available file that combines a motive to retrieve the suppressed ledger, specific knowledge of the unlisted passage, and a direct connection to the Voss family. The identity fragment is incomplete until matched with other files.',
      tags: ['burned intake', 'missing reference', 'identity fragment'], clue: 'A burned record links the missing ledger, the east-wall passage, and the Voss family. It must be corroborated.'
    },
    {
      id: 53, codename: 'The Rain Collector', age: 25, portrait: 'b',
      summary: 'Counts drips from a ceiling leak and notices when the rhythm changes.',
      history: 'The patient finds repetitive sounds reassuring. In the attack aftermath, staff dismissed the person’s timing notes as “nonsense,” although a facilities report confirms the leak pattern changed when the east service hatch was opened.',
      timeline: 'The patient counts a sequence of four drips, a pause, and two drips shortly after the red emergency light came on. Facilities staff later reproduce the rhythm by opening the hidden hatch.',
      fragment: '“Four. Then nothing. Then two. It only does that when the wall is breathing.”',
      relevance: 'Gives an indirect sign that the service hatch opened. It cannot tell whether the cause was a patient, staff member, or vampire.',
      tags: ['environmental clue', 'service route'], clue: 'The plumbing changed rhythm when the hidden hatch opened, corroborating the east-wall route.'
    },
    {
      id: 54, codename: 'The Mirror Child', age: 18, portrait: 'c',
      summary: 'A young patient who repeats a word or name after hearing it once, sometimes hours later.',
      history: 'Staff describe the repetition as “creepy” but do not record the context. A careful interview shows the patient repeats names exactly as heard and cannot tell which belong to people in the room versus people mentioned in stories.',
      timeline: 'On the morning after the attack, the patient repeated “Mara V—” while looking at a burned identification card. The photograph was gone; the final letters “OSS” remained beneath a melted laminate edge.',
      fragment: '“Mara V—. Rhea’s sister. They told me not to say the name because then the file would remember.”',
      relevance: 'The repeated name becomes meaningful only beside the family entry in Case 55 and the motive fragment in Case 52. Repetition alone is not a confession.',
      tags: ['name fragment', 'family link'], clue: 'The identification card preserves “Mara V—” and the surname ending “OSS”; compare it with the Voss family references elsewhere.'
    },
    {
      id: 55, codename: 'The Empty Cot', age: 44, portrait: 'a',
      summary: 'A file with two admission numbers and no consistent name, discovered beneath an empty cot.',
      history: 'The original identity sheet lists “Rhea Voss” as a relative, then has the word “TRANSFER” written across the line. A later copy calls Rhea “unconfirmed”. No discharge record, body record, or burial certificate has been located.',
      timeline: 'The last audit of the Lullaby research room was signed by Dr. Elias Vale and night orderly Gideon Pike, the two people later found dead. Both signatures appear beside an instruction to destroy the duplicate ledger.',
      fragment: '“Rhea Voss — next of kin: M. V____. Do not close file until the original is found.” The surname field is scorched through.',
      relevance: 'Connects Mara to Rhea, the missing ledger, and both victims. The forged transfer entry suggests an institutional cover-up, rather than a simple missing-person error.',
      tags: ['family record', 'victim signatures'], clue: 'Rhea Voss’s next-of-kin field begins M. V____; the same audit was signed by both victims and ordered the duplicate destroyed.'
    },
    {
      id: 56, codename: 'The Last Passenger', age: 39, portrait: 'b',
      summary: 'A former ambulance driver who remembers routes more clearly than faces.',
      history: 'The patient has a strong memory for turns, doors, and engine sounds, but struggles to recognize people without their voices. The night account describes a vehicle idling near the east service exit while the main gate was blocked.',
      timeline: 'The patient heard Dr. Vale say “If Mara gets the ledger, the whole thing is finished.” Shortly afterward, a vehicle door slammed; the driver did not see who entered it. The gate camera failed during the vampire alarm.',
      fragment: '“There was a person at the service exit. The face was hidden. The voice said, ‘I only came for the record.’ Then the east light went red.”',
      relevance: 'Corroborates the name and the evidence-retrieval motive, though the witness cannot identify the person by appearance. It fits Case 52 more closely than a theory based on shared symptoms.',
      tags: ['name corroboration', 'escape route'], clue: 'An independent witness connects Mara, the ledger, and the east service exit, but cannot identify a face.'
    }
  ];

  const evidenceCatalog = [
    { id: 'E-01', title: 'The 02:17 Signal', unlock: [1, 5, 51], required: 3, body: 'The event log labels a sound as a tower bell at 02:17. The mechanism had been disconnected at 01:50. The audio is a metal strike against a pipe. The record repeats a label, not a verified source.' },
    { id: 'E-02', title: 'The Unlisted Passage', unlock: [4, 48, 52, 53], required: 3, body: 'Scrape marks, pipe rhythm, soot, and the pivot-mark converge on a service hatch behind the east archive wall. It bypasses the ordinary door sensor. Knowledge of a route is suggestive, but the timeline and motive must also fit.' },
    { id: 'E-03', title: 'The Burned Duplicate', unlock: [2, 3, 49, 52, 55], required: 3, body: 'Multiple records refer to a second copy of a ledger. Dr. Elias Vale and Gideon Pike signed an instruction to destroy it. The original appears to concern a person named Rhea Voss and a project labelled Lullaby.' },
    { id: 'E-04', title: 'A Name Across Fragments', unlock: [1, 3, 52, 54, 55, 56], required: 4, body: 'The separate fragments “Mara”, “M. V—”, “OSS”, and “Rhea’s sister” fit together. No one fragment proves the identity; the repeated relationship across files makes the reconstruction more reliable.' },
    { id: 'E-05', title: 'What the Notes Cannot Prove', unlock: [3, 44, 45, 47, 50], required: 3, body: 'The records contain intimate relationship histories, intrusive unwanted thoughts, medication side effects, anxiety, and other sensitive details. They do not link those details to the time, route, or physical evidence of the killings. They should not be treated as evidence of violence.' },
    { id: 'E-06', title: 'The Victims and the Ledger', unlock: [2, 52, 55, 56], required: 3, body: 'The two victims signed the order to destroy the duplicate. One witness remembers Vale fearing that Mara would recover it. Case 52 includes the strongest direct fragment about retrieving the ledger and not allowing another Voss to be erased.' },
    { id: 'E-07', title: 'The Last Margin', unlock: patientFiles.map(file => file.id), body: 'Recovered only after all 18 files are read: “I came for the ledger. Vale woke. He reached for the bell. Pike saw the blood on the page. I could not let them burn another Voss.” The note describes an evidence-retrieval attempt that became two murders; it does not absolve the person responsible.' }
  ];

  const state = {
    screen: 'intro',
    filter: 'all',
    currentCase: 1,
    reviewed: [],
    soundOn: false,
    startedAt: null,
    elapsedSeconds: 0,
    ending: null,
    accusation: null,
    hiddenPhrase: ''
  };

  const phaseNames = {
    intro: 'RESTRICTED ACCESS // LEVEL 4', briefing: 'INCIDENT BRIEFING // 02:17',
    archive: 'RECOVERED PATIENT ARCHIVE', dossier: 'INDIVIDUAL RECORD // DAMAGED',
    evidence: 'CROSS-REFERENCE / EVIDENCE BOARD', accusation: 'FINAL DISPOSITION // AWAITING SIGNATURE',
    ending: 'CASE DISPOSITION / ARCHIVE SEALED'
  };
  let elapsedTimer = null;
  let toastTimer = null;
  let audioContext = null;
  let masterGain = null;
  let droneA = null;
  let droneB = null;
  let highTone = null;
  let noiseSource = null;
  let noiseGain = null;
  let noiseFilter = null;
  let pulseTimer = null;
  let pulseFlip = false;

  const caseById = new Map(patientFiles.map(file => [file.id, file]));
  const safe = (value) => String(value).replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
  const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const has = (id) => state.reviewed.includes(Number(id));
  const isComplete = () => state.reviewed.length === patientFiles.length;
  const stage = () => Math.min(4, Math.floor(state.reviewed.length / 4));

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3000);
  }

  function startClock() {
    if (elapsedTimer) clearInterval(elapsedTimer);
    elapsedTimer = setInterval(() => {
      if (!state.startedAt || state.screen === 'intro' || state.screen === 'ending') return;
      state.elapsedSeconds = Math.floor((Date.now() - state.startedAt) / 1000);
      updateClock();
    }, 1000);
  }

  function updateClock() {
    const m = String(Math.floor(state.elapsedSeconds / 60)).padStart(2, '0');
    const s = String(state.elapsedSeconds % 60).padStart(2, '0');
    clockLabel.textContent = `LOCAL SESSION // ${m}:${s}`;
  }

  function unlockedEvidence() {
    return evidenceCatalog.filter(isEvidenceUnlocked);
  }

  function updateSideRail() {
    const count = state.reviewed.length;
    const percentage = Math.round(count / patientFiles.length * 100);
    filesReadLabel.textContent = String(count).padStart(2, '0');
    progressFill.style.width = `${percentage}%`;
    progressLabel.textContent = `${String(percentage).padStart(2, '0')}%`;
    evidenceTotal.textContent = String(unlockedEvidence().length).padStart(2, '0');
    readyLabel.textContent = count >= 12 ? 'READY' : 'LOCKED';
    readyLabel.style.color = count >= 12 ? '#7fbb9e' : '';
    suspectStatus.textContent = state.ending ? 'RESOLVED' : (count >= 12 ? 'IDENTIFY' : 'UNKNOWN');
    const t = stage();
    document.body.dataset.threat = String(t);
    const labels = ['LOW SIGNAL', 'STATIC RISING', 'SIGNAL BLEED', 'PROXIMITY WARNING', 'INSIDE THE WALL'];
    const copy = [
      'The line is quiet. It is never silent.',
      'A second tone has entered the recording.',
      'The rhythm no longer matches the tower clock.',
      'The sound is closer than the speakers.',
      'Something is answering the sound you make.'
    ];
    tensionLabel.textContent = labels[t];
    tensionCopy.textContent = copy[t];
    headerStatusText.textContent = state.screen === 'intro' ? 'ARCHIVE SEALED' : state.screen === 'ending' ? 'CASE CLOSED' : 'LIVE RECOVERY';
    systemMessage.textContent = state.screen === 'ending' ? 'DISPOSITION FILED LOCALLY' : t >= 3 ? 'SIGNAL INTEGRITY / UNSTABLE' : 'NO EXTERNAL CONNECTION';
    updateClock();
    if (state.soundOn) updateAudioIntensity(t);
    const ready = $('#accusation-link');
    if (ready) ready.setAttribute('aria-disabled', count < 12 ? 'true' : 'false');
  }

  function render() {
    phaseLabel.textContent = phaseNames[state.screen] || 'ARCHIVE NODE 13';
    updateSideRail();
    const renderers = {
      intro: renderIntro, briefing: renderBriefing, archive: renderArchive,
      dossier: renderDossier, evidence: renderEvidence, accusation: renderAccusation, ending: renderEnding
    };
    app.innerHTML = (renderers[state.screen] || renderIntro)();
    app.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  function renderIntro() {
    return `
      <section class="hero">
        <div class="hero-copy">
          <div class="classified"><span class="tiny-red-dot"></span> INTERNAL ARCHIVE // REOPENED WITHOUT AUTHORIZATION</div>
          <h1 class="hero-title">MIND<span>//</span>NIGHT<span>WARD 13</span></h1>
          <p class="hero-subtitle">THE INCIDENT THAT WAS NEVER REPORTED</p>
          <p class="lede">The hospital was attacked by vampires. The names on the surviving files have been mixed or burned away. Two people are dead. One patient escaped. Someone used the chaos to bury a second crime.</p>
          <div class="hero-stats"><div class="hero-stat"><strong>103</strong><span>REGISTERED PATIENTS</span></div><div class="hero-stat"><strong>18</strong><span>SURVIVING FILES</span></div><div class="hero-stat"><strong>02</strong><span>CONFIRMED DEATHS</span></div></div>
          <div class="btn-row"><button type="button" class="btn-primary" data-action="briefing">BREAK THE SEAL <span class="button-arrow">→</span></button><span class="inline-note"><span class="tiny-red-dot"></span> SOUND OPTIONAL / HORROR CONTENT</span></div>
        </div>
        <div class="hero-art" aria-label="A dark corridor inside Ward 13" role="img"></div>
        <div class="hero-bottom"><span>CASE FILES <b>01–05 / 44–56</b></span><span>YOU ARE NOT STAFF</span><span>NO WAY OUT FOUND</span></div>
      </section>`;
  }

  function renderBriefing() {
    return `<section class="scene">
      <div class="section-kicker"><span><span class="kicker-mark">●</span> INCOMING DISPATCH / EAST WING</span><span>31 OCT // 02:17</span></div>
      <h1 class="scene-title">Three things are <span class="red">certain.</span></h1>
      <p class="lede">Most of the archive was destroyed during the attack. The surviving records are not in order, and several names were scraped from the page. Your task is not to diagnose anyone. It is to reconstruct an identity using timeline, access, corroboration, and motive.</p>
      <div class="dispatch"><div class="dispatch-head">URGENT // RECOVERED AUDIO TRANSCRIPT</div><p>“At 02:17 the east bell sounded. The lights went out. When the emergency lamps returned, Dr. Elias Vale and night orderly Gideon Pike were dead. One patient was gone. The service gate was locked from the outside.”</p><p>“The vampire attack is real. So are the murders. The attack does not explain every mark in this room.”</p></div>
      <div class="briefing-layout"><div><ul class="brief-list"><li>Review the surviving case files: patients 1–5 and 44–56. Read at least 12 files to unlock the final accusation.</li><li>Cross-reference the time anomaly, the hidden service route, the damaged identity fragments, and the victims’ records.</li><li>Choose the most likely patient, reconstruct the name, and select the motive best supported by the evidence.</li><li>Psychiatric symptoms and private relationship histories recur across different files. They are not proof of violence; the solution depends on specific corroborated evidence.</li></ul><div class="btn-row"><button class="btn-primary" type="button" data-action="start-investigation">OPEN SURVIVING FILES <span class="button-arrow">→</span></button><button class="btn-secondary" type="button" data-action="intro">SEAL IT AGAIN</button></div><p class="fine-print">Fictional supernatural thriller. Contains non-graphic murder references, disturbing images, and optional ambient horror audio. Sound is off until you enable it.</p></div><aside class="brief-aside" role="img" aria-label="A damaged hospital record in a dim archive"><div class="aside-label">ARCHIVE NOTICE<br>Patient identifiers were stripped from several pages. Treat every report as evidence that must be checked.</div></aside></div>
    </section>`;
  }

  function renderArchive() {
    const files = patientFiles.filter(file => state.filter === 'all' || (state.filter === 'early' ? file.id <= 5 : file.id >= 44));
    const reviewedCount = state.reviewed.length;
    return `<section class="scene">
      <div class="archive-top"><div><div class="section-kicker"><span><span class="kicker-mark">●</span> RECOVERED RECORDS / STORAGE BAY 4</span><span>${String(reviewedCount).padStart(2,'0')} / 18 READ</span></div><h1 class="scene-title">Patient <span class="red">archive.</span></h1><p class="lede">Eighteen records survived out of 103. Some tell the truth badly. Some tell a lie beautifully. Open a file, read every section, then log it back into the evidence board.</p></div></div>
      <div class="archive-controls" role="group" aria-label="Filter patient files"><button type="button" class="filter-tab ${state.filter==='all'?'active':''}" data-action="filter-cases" data-filter="all">ALL SURVIVING FILES / 18</button><button type="button" class="filter-tab ${state.filter==='early'?'active':''}" data-action="filter-cases" data-filter="early">FILES 01–05</button><button type="button" class="filter-tab ${state.filter==='late'?'active':''}" data-action="filter-cases" data-filter="late">FILES 44–56</button></div>
      <div class="archive-grid">${files.map(file => `<button type="button" class="case-tile ${has(file.id)?'reviewed':''}" data-action="open-case" data-id="${file.id}"><div class="tile-image" role="img" aria-label="Distressed recovered patient portrait"></div><span class="tile-stamp">FILE ${String(file.id).padStart(3,'0')}</span><div class="tile-body"><div class="tile-idline"><span>AGE ${file.age} / ID DAMAGED</span><span class="tile-status">${has(file.id)?'✓ LOGGED':'UNREAD'}</span></div><h2 class="tile-title">${safe(file.codename)}</h2><p class="tile-summary">${safe(file.summary)}</p><div class="tile-tags">${file.tags.slice(0,2).map(tag => `<span class="tag ${/route|ledger|name|time|witness/i.test(tag)?'red':''}">${safe(tag)}</span>`).join('')}</div></div></button>`).join('')}</div>
      <div class="divider"></div><div class="btn-row"><button type="button" class="btn-secondary" data-action="evidence">OPEN EVIDENCE BOARD <span class="button-arrow">↗</span></button><button type="button" class="btn-primary" data-action="accusation" ${reviewedCount < 12?'disabled':''}>${reviewedCount < 12 ? `READ ${12-reviewedCount} MORE FILE${12-reviewedCount===1?'':'S'} TO ACCUSE` : 'MAKE FINAL ACCUSATION'} <span class="button-arrow">→</span></button></div>
      <p class="fine-print">You can review files in any order. Reading all 18 reveals a fragment withheld from the official index.</p>
    </section>`;
  }

  function portraitClass(file) {
    if (file.portrait === 'vision') return 'vision';
    if (file.portrait === 'b') return 'portrait-b';
    if (file.portrait === 'c') return 'portrait-c';
    return '';
  }

  function renderDossier() {
    const file = caseById.get(state.currentCase) || patientFiles[0];
    const prev = [...patientFiles].reverse().find(item => item.id < file.id);
    const next = patientFiles.find(item => item.id > file.id);
    return `<section class="scene">
      <div class="section-kicker"><span><span class="kicker-mark">●</span> INDIVIDUAL RECORD / CASE ${String(file.id).padStart(3,'0')}</span><button type="button" class="text-button" data-action="archive">[ BACK TO ARCHIVE ]</button></div>
      <div class="dossier-head"><div class="dossier-portrait ${portraitClass(file)}" role="img" aria-label="Distressed archive photograph associated with case ${file.id}"></div><div><div class="dossier-serial">PATIENT NO. ${String(file.id).padStart(3,'0')} // NAME ${file.id===52?'PARTIALLY BURNED':'MISSING OR CORRUPTED'}</div><h1 class="dossier-title">${safe(file.codename)}</h1><p class="dossier-subtitle">ESTIMATED AGE ${file.age} // ORIGINAL IDENTIFIERS UNVERIFIED</p><span class="file-status">${has(file.id)?'PREVIOUSLY REVIEWED':'REVIEW REQUIRED'} / SOURCE QUALITY: MIXED</span><p class="dossier-summary">${safe(file.summary)}</p><p class="fine-print">File handling note: “Behavior observed” and “meaning inferred” are different things. Preserve that distinction.</p></div></div>
      <div class="file-two-col"><article class="file-block"><h3>01 / CLINICAL & PERSONAL HISTORY</h3><p>${safe(file.history)}</p></article><article class="file-block"><h3>02 / ATTACK-NIGHT TIMELINE</h3><p>${safe(file.timeline)}</p></article></div>
      <blockquote class="fragment-paper">${safe(file.fragment)}</blockquote>
      <div class="analysis-note"><strong>INVESTIGATOR'S NOTE:</strong> ${safe(file.relevance)}</div>
      <div class="btn-row"><button type="button" class="btn-primary" data-action="mark-reviewed" data-id="${file.id}">${has(file.id)?'CONFIRM REVIEW & RETURN':'LOG FILE / RETURN TO ARCHIVE'} <span class="button-arrow">→</span></button><button type="button" class="btn-secondary" data-action="evidence">COMPARE EVIDENCE</button></div>
      <div class="dossier-nav"><button type="button" class="btn-secondary" data-action="open-case" data-id="${prev?prev.id:patientFiles[patientFiles.length-1].id}">← PREVIOUS FILE</button><span class="inline-note">${state.reviewed.length} OF 18 FILES LOGGED</span><button type="button" class="btn-secondary" data-action="open-case" data-id="${next?next.id:patientFiles[0].id}">NEXT FILE →</button></div>
    </section>`;
  }

  function isEvidenceUnlocked(item) {
    if (item.id === 'E-07') return isComplete();
    const matches = item.unlock.filter(id => has(id)).length;
    return matches >= (item.required || item.unlock.length);
  }

  function renderEvidence() {
    const foundCount = evidenceCatalog.filter(isEvidenceUnlocked).length;
    return `<section class="scene">
      <div class="section-kicker"><span><span class="kicker-mark">●</span> CROSS-REFERENCE / BOARD 02</span><span>${String(foundCount).padStart(2,'0')} FRAGMENTS RECOVERED</span></div>
      <h1 class="scene-title">Connect the <span class="red">dots.</span></h1>
      <p class="lede">The archive's first job was to classify people. Your job is to check the records against one another. A clue becomes stronger when independent sources agree about a detail that matters to the event.</p>
      <div class="deduction-banner"><strong>METHOD:</strong> Timeline + access + identity + motive. Do not confuse a dramatic description with corroboration. Some details are locked until you review their source files.</div>
      <div class="evidence-grid">${evidenceCatalog.map(item => {
        const open = isEvidenceUnlocked(item);
        return `<article class="evidence-card ${open?'':'locked'}"><span class="evidence-code">${item.id} / ${open?'RECOVERED':'CORRUPTED'}</span><span class="evidence-status">${open?'OPEN':'LOCKED'}</span><h3>${open?safe(item.title):'████████████'}</h3><p>${open?safe(item.body):'Read at least one source file connected to this fragment. The page is too damaged to infer its contents.'}</p></article>`;
      }).join('')}</div>
      <div class="divider"></div><div class="btn-row"><button type="button" class="btn-secondary" data-action="archive">RETURN TO PATIENT FILES</button><button type="button" class="btn-primary" data-action="accusation" ${state.reviewed.length < 12?'disabled':''}>${state.reviewed.length < 12?'MORE FILES REQUIRED':'PREPARE FINAL ACCUSATION'} <span class="button-arrow">→</span></button></div>
    </section>`;
  }

  function renderAccusation() {
    if (state.reviewed.length < 12) {
      return `<section class="scene"><div class="section-kicker"><span>FINAL DISPOSITION / LOCKED</span></div><h1 class="scene-title">The record is <span class="red">incomplete.</span></h1><p class="lede">At least 12 patient files must be reviewed before the final accusation is accepted. You have read ${state.reviewed.length} of 18.</p><div class="btn-row"><button class="btn-primary" data-action="archive">RETURN TO ARCHIVE <span class="button-arrow">→</span></button></div></section>`;
    }
    return `<section class="scene">
      <div class="section-kicker"><span><span class="kicker-mark">●</span> FINAL DISPOSITION / FORM 13-B</span><span>REVIEWED ${state.reviewed.length}/18</span></div>
      <h1 class="scene-title">Name the <span class="red">one who left.</span></h1>
      <p class="lede">You must name a file, reconstruct the identity, and choose the motive. The interface will not reward confidence by itself. Your conclusion is compared with the strongest surviving evidence.</p>
      <form id="accusation-form">
        <div class="field"><label for="suspect-select">01 / MOST LIKELY SUSPECT FILE</label><select id="suspect-select" name="suspect" required><option value="">Select a case number…</option>${patientFiles.map(file=>`<option value="${file.id}">Case ${String(file.id).padStart(3,'0')} — ${safe(file.codename)}</option>`).join('')}</select><span class="helper">Choose the identity whose timeline, access, and motive best fit the records.</span></div>
        <div class="form-grid" style="margin-top:16px"><div class="field"><label for="identity-input">02 / RECONSTRUCTED NAME</label><input id="identity-input" name="identity" type="text" placeholder="First and last name, if known" autocomplete="off" required><span class="helper">Use the name suggested by the surviving fragments.</span></div><div class="field"><label for="motive-select">03 / MOST LIKELY MOTIVE</label><select id="motive-select" name="motive" required><option value="">Choose a motive…</option><option value="ledger-revenge">Retaliation and recovery of the ledger about a family death</option><option value="escape-only">Escaping during the vampire attack without a personal target</option><option value="relationship">A jealous or sexual fixation on one of the victims</option><option value="delusion">A mistaken belief caused by psychiatric symptoms</option><option value="cover-own-crime">Silencing staff who had uncovered the suspect’s unrelated crime</option><option value="protect-others">Trying to protect another patient from the vampires</option></select><span class="helper">Pick the motive supported by the strongest corroborated evidence, not by a diagnostic label.</span></div></div>
        ${isComplete()?`<div class="field" style="margin-top:16px"><label for="secret-input">BONUS / FINAL MARGIN PHRASE</label><input id="secret-input" name="secret" type="text" placeholder="What did the tower bell actually do?" autocomplete="off"><span class="helper">A hidden ending is available if you can reconstruct the phrase left by the clockmaker.</span></div>`:''}
        <div class="btn-row"><button class="btn-danger" type="submit">SIGN AND SUBMIT FINDINGS <span class="button-arrow">→</span></button><button class="btn-secondary" type="button" data-action="evidence">RE-EXAMINE EVIDENCE</button></div>
      </form>
      <p class="fine-print">This is a fictional mystery, not a clinical exercise. Psychiatric diagnoses, sexual histories, unusual behavior, or intrusive thoughts are not a basis for predicting violence.</p>
    </section>`;
  }

  function renderEnding() {
    const result = state.ending || { kind: 'unresolved', suspect: '', identity: '', motive: '' };
    const allRight = result.kind === 'secret';
    const identityFound = result.identityCorrect;
    const suspectFound = result.suspectCorrect;
    const motiveFound = result.motiveCorrect;
    let stamp = 'DISPOSITION / UNSOLVED';
    let title = 'The archive rejects your conclusion.';
    let intro = 'A vivid note can draw the eye away from a stronger timeline. The record is still open. Revisit the files and compare the route, time anomaly, name fragments, and motive.';
    if (allRight) {
      stamp = 'DISPOSITION / SEALED WITH SUPPLEMENT';
      title = 'Mara Voss. The ledger. The bell that never rang.';
      intro = 'You matched the identity fragments, the east-wall passage, and the motive. The vampire attack gave the escape its cover, but the two deaths were not caused by the vampires. The hidden margin confirms that Mara Voss entered the archive to retrieve the suppressed Lullaby ledger, confronted Dr. Elias Vale, and then killed night orderly Gideon Pike when he witnessed what happened. Her sister Rhea’s death had been erased from the official record. That history explains the motive; it does not excuse the killings.';
    } else if (suspectFound && identityFound && motiveFound) {
      stamp = 'DISPOSITION / PRIMARY FINDING CONFIRMED';
      title = 'The identity is recovered.';
      intro = isComplete() ? 'Your suspect, name, and motive fit the strongest surviving evidence. The core case is solved. All files have been reviewed, but the supplemental margin phrase was not accepted; the final note remains unsealed.' : 'Your suspect, name, and motive fit the strongest surviving evidence. The core case is solved. The full archive may still contain a final margin that changes what can be proved about the exact sequence of events.';
    } else if (suspectFound && identityFound) {
      stamp = 'DISPOSITION / IDENTITY MATCH';
      title = 'You found the person. The reason remains uncertain.';
      intro = 'The identity reconstruction fits the fragments, but the motive you selected does not explain why the victims signed the order to destroy the duplicate ledger or why the suspect used the east service passage.';
    } else if (suspectFound) {
      stamp = 'DISPOSITION / SUBJECT IDENTIFIED, NAME UNVERIFIED';
      title = 'The file is likely right. The name does not fit.';
      intro = 'You found the strongest suspect file, but the identity fragments have not been joined correctly. Return to the card containing the name, the missing relative, and the scorched identification slip.';
    } else {
      stamp = 'DISPOSITION / EVIDENCE INSUFFICIENT';
      title = 'The wrong file was sealed.';
      intro = 'The chosen record has a striking detail, but does not connect the relevant access, timing, and record-destruction motive as strongly as the surviving evidence does. A symptom or intimate history cannot stand in for that connection.';
    }
    return `<section class="scene">
      <div class="section-kicker"><span><span class="kicker-mark">●</span> FINAL DISPOSITION / SESSION ${String(Math.floor(state.elapsedSeconds/60)).padStart(2,'0')}:${String(state.elapsedSeconds%60).padStart(2,'0')}</span><span>ARCHIVE ${allRight?'SUPPLEMENTED':'SEALED'}</span></div>
      <div class="outcome-card"><div class="outcome-stamp">${stamp}</div><h1 class="outcome-title">${safe(title)}</h1><p>${safe(intro)}</p><div class="outcome-receipt"><div class="receipt-item"><span>SUSPECT FILE</span><strong>${suspectFound?'MATCH':'NO MATCH'} / ${safe(result.suspect||'—')}</strong></div><div class="receipt-item"><span>IDENTITY</span><strong>${identityFound?'CORROBORATED':'UNRESOLVED'}</strong></div><div class="receipt-item"><span>MOTIVE</span><strong>${motiveFound?'SUPPORTED':'NOT SUPPORTED'}</strong></div></div></div>
      ${allRight?`<div class="dispatch"><div class="dispatch-head">SUPPLEMENTAL EVIDENCE / PRIVATE NOTE</div><p>“There is a difference between explaining a motive and forgiving an act. Someone erased Rhea Voss from the record. Mara Voss answered that erasure with two deaths. The hospital’s secret is real, the vampire attack is real, and neither truth makes the other disappear.”</p></div>`:''}
      <div class="btn-row"><button type="button" class="btn-primary" data-action="share-result">SHARE CASE RESULT <span class="button-arrow">↗</span></button><button type="button" class="btn-secondary" data-action="evidence">REVIEW EVIDENCE</button><button type="button" class="btn-secondary" data-action="archive">REOPEN ARCHIVE</button></div>
      <p class="fine-print">${allRight?'Secret ending unlocked. You reviewed every surviving file and reconstructed the final margin.':'The archive can be reopened. Files you reviewed remain logged during this session.'} All characters and incidents are fictional. No result is a psychiatric assessment.</p>
    </section>`;
  }

  function openCase(id) {
    const numericId = Number(id);
    if (!caseById.has(numericId)) return;
    state.currentCase = numericId;
    state.screen = 'dossier';
    render();
  }

  function markReviewed(id) {
    const numericId = Number(id ?? state.currentCase);
    if (!caseById.has(numericId)) return;
    const isNew = !has(numericId);
    if (isNew) state.reviewed.push(numericId);
    state.reviewed.sort((a,b) => a-b);
    state.screen = 'archive';
    render();
    if (isNew) {
      const t = stage();
      if ([1,2,3,4].includes(t) && state.reviewed.length % 4 === 0) {
        showToast(['','THE STATIC HAS CHANGED.','A SECOND TONE ENTERS THE RECORDING.','THE SOUND IS CLOSER NOW.','SOMETHING ANSWERS FROM INSIDE THE WALL.'][t]);
      } else {
        showToast(`CASE ${String(numericId).padStart(3,'0')} LOGGED. THE EVIDENCE BOARD HAS BEEN UPDATED.`);
      }
    } else {
      showToast(`CASE ${String(numericId).padStart(3,'0')} ALREADY LOGGED.`);
    }
  }

  function beginSession() {
    if (!state.startedAt) {
      state.startedAt = Date.now();
      startClock();
    }
  }

  function changeScreen(screen) {
    if (screen !== 'intro') beginSession();
    if (screen === 'accusation' && state.reviewed.length < 12) {
      showToast(`FINAL ACCUSATION LOCKED. REVIEW ${12 - state.reviewed.length} MORE FILE${12 - state.reviewed.length === 1 ? '' : 'S'}.`);
      state.screen = 'archive';
      render();
      return;
    }
    state.screen = screen;
    render();
  }

  function resetGame() {
    stopAudio();
    state.screen = 'intro';
    state.filter = 'all';
    state.currentCase = 1;
    state.reviewed = [];
    state.soundOn = false;
    state.startedAt = null;
    state.elapsedSeconds = 0;
    state.ending = null;
    state.accusation = null;
    state.hiddenPhrase = '';
    soundToggle.setAttribute('aria-pressed', 'false');
    soundLabel.textContent = 'SOUND OFF';
    soundSymbol.textContent = '♫';
    render();
    showToast('SESSION RESET. THE ARCHIVE HAS BEEN SEALED AGAIN.');
  }

  function submitAccusation(form) {
    const data = new FormData(form);
    const suspect = Number(data.get('suspect'));
    const identity = String(data.get('identity') || '').trim();
    const motive = String(data.get('motive') || '');
    const phrase = String(data.get('secret') || '').trim();
    const suspectCorrect = suspect === 52;
    const identityCorrect = normalize(identity) === 'mara voss';
    const motiveCorrect = motive === 'ledger-revenge';
    const normalizedPhrase = normalize(phrase);
    const secretCorrect = isComplete() && ['the bell never rang', 'the tower bell never rang', 'bell never rang'].includes(normalizedPhrase);
    let kind = 'unresolved';
    if (suspectCorrect && identityCorrect && motiveCorrect && secretCorrect) kind = 'secret';
    else if (suspectCorrect && identityCorrect && motiveCorrect) kind = 'solved';
    state.accusation = { suspect, identity, motive, phrase };
    state.ending = { kind, suspect, identity, motive, suspectCorrect, identityCorrect, motiveCorrect, secretCorrect };
    state.screen = 'ending';
    render();
    if (kind === 'secret') showToast('SUPPLEMENTAL ENDING RECOVERED. THE FINAL MARGIN IS LEGIBLE.');
    else if (suspectCorrect && identityCorrect && motiveCorrect) showToast('PRIMARY FINDING ACCEPTED. ONE SUPPLEMENT REMAINS SEALED.');
  }

  function shareResult() {
    const result = state.ending || {};
    const text = `I investigated MIND//NIGHT — The Ward 13 Incident. Disposition: ${result.kind === 'secret' ? 'Secret ending unlocked' : result.suspectCorrect ? 'Identity clue found' : 'Case unresolved'}. Can you reconstruct the killer’s identity and motive?`;
    if (navigator.share) {
      navigator.share({ title: 'MIND//NIGHT — The Ward 13 Incident', text, url: location.href }).catch(() => copyText(text));
    } else {
      copyText(`${text} ${location.href}`);
    }
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => showToast('RESULT SUMMARY COPIED. SEND IT TO YOUR FRIENDS.'), () => fallbackCopy(text));
    } else fallbackCopy(text);
  }

  function fallbackCopy(text) {
    const input = document.createElement('textarea');
    input.value = text;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed'; input.style.opacity = '0';
    document.body.appendChild(input); input.select();
    try { document.execCommand('copy'); showToast('RESULT SUMMARY COPIED. SEND IT TO YOUR FRIENDS.'); }
    catch (_) { showToast(text); }
    input.remove();
  }

  // Evolving synthesized ambience: no downloaded music or external audio files.
  function makeNoiseBuffer(context) {
    const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.22;
    return buffer;
  }

  function startAudio() {
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) {
      showToast('THIS BROWSER DOES NOT SUPPORT SYNTHESIZED AMBIENCE. THE GAME WILL CONTINUE SILENTLY.');
      state.soundOn = false;
      renderSoundState();
      return;
    }
    try {
      audioContext = new Context();
      masterGain = audioContext.createGain();
      masterGain.gain.value = 0.0001;
      masterGain.connect(audioContext.destination);

      droneA = audioContext.createOscillator();
      droneA.type = 'sine';
      droneA.frequency.value = 49;
      const gainA = audioContext.createGain(); gainA.gain.value = 0.24;
      droneA.connect(gainA); gainA.connect(masterGain); droneA.start();

      droneB = audioContext.createOscillator();
      droneB.type = 'triangle';
      droneB.frequency.value = 57.2;
      const gainB = audioContext.createGain(); gainB.gain.value = 0.12;
      droneB.connect(gainB); gainB.connect(masterGain); droneB.start();

      highTone = audioContext.createOscillator();
      highTone.type = 'sine'; highTone.frequency.value = 139;
      const highGain = audioContext.createGain(); highGain.gain.value = 0.0001;
      highTone.connect(highGain); highGain.connect(masterGain); highTone.start();
      highTone._level = highGain;

      noiseSource = audioContext.createBufferSource();
      noiseSource.buffer = makeNoiseBuffer(audioContext); noiseSource.loop = true;
      noiseFilter = audioContext.createBiquadFilter(); noiseFilter.type = 'lowpass'; noiseFilter.frequency.value = 270;
      noiseGain = audioContext.createGain(); noiseGain.gain.value = 0.015;
      noiseSource.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(masterGain); noiseSource.start();

      if (audioContext.state === 'suspended') audioContext.resume();
      masterGain.gain.setTargetAtTime(0.15, audioContext.currentTime, 0.8);
      updateAudioIntensity(stage());
      clearInterval(pulseTimer);
      pulseTimer = setInterval(audioPulse, 900);
    } catch (error) {
      stopAudio(); state.soundOn = false; renderSoundState();
      showToast('AMBIENT AUDIO COULD NOT START IN THIS BROWSER.');
    }
  }

  function updateAudioIntensity(level) {
    if (!audioContext || !masterGain) return;
    const now = audioContext.currentTime;
    const stageSettings = [
      {a:49, b:57.2, high:0.0001, noise:0.012, cutoff:270, master:0.12},
      {a:45, b:59.1, high:0.006, noise:0.018, cutoff:420, master:0.14},
      {a:41, b:63.4, high:0.015, noise:0.025, cutoff:760, master:0.15},
      {a:38, b:68.5, high:0.023, noise:0.033, cutoff:1100, master:0.17},
      {a:35, b:73.8, high:0.031, noise:0.04, cutoff:1550, master:0.18}
    ][level];
    droneA.frequency.setTargetAtTime(stageSettings.a, now, 0.7);
    droneB.frequency.setTargetAtTime(stageSettings.b, now, 0.7);
    if (highTone && highTone._level) highTone._level.gain.setTargetAtTime(stageSettings.high, now, 1.0);
    if (noiseGain) noiseGain.gain.setTargetAtTime(stageSettings.noise, now, 0.8);
    if (noiseFilter) noiseFilter.frequency.setTargetAtTime(stageSettings.cutoff, now, 1.0);
    masterGain.gain.setTargetAtTime(stageSettings.master, now, 0.9);
    if (pulseTimer) {
      clearInterval(pulseTimer);
      pulseTimer = setInterval(audioPulse, Math.max(440, 1050 - level * 145));
    }
  }

  function audioPulse() {
    if (!audioContext || !masterGain || !state.soundOn || stage() < 2) return;
    const t = audioContext.currentTime;
    pulseFlip = !pulseFlip;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(pulseFlip ? 42 : 34, t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(stage() >= 4 ? 0.055 : stage() === 3 ? 0.034 : 0.02, t + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    osc.connect(gain); gain.connect(masterGain); osc.start(t); osc.stop(t + 0.24);
    if (stage() >= 3 && pulseFlip) {
      const tick = audioContext.createOscillator(); const tickGain = audioContext.createGain();
      tick.type = 'square'; tick.frequency.setValueAtTime(620 + stage() * 41, t);
      tickGain.gain.setValueAtTime(0.0001, t); tickGain.gain.exponentialRampToValueAtTime(0.009 + stage() * 0.003, t + 0.005); tickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
      tick.connect(tickGain); tickGain.connect(masterGain); tick.start(t); tick.stop(t + 0.08);
    }
  }

  function stopAudio() {
    clearInterval(pulseTimer); pulseTimer = null;
    if (audioContext) {
      try { audioContext.close(); } catch (_) { /* close best-effort */ }
    }
    audioContext = null; masterGain = null; droneA = null; droneB = null; highTone = null; noiseSource = null; noiseGain = null; noiseFilter = null;
  }

  function renderSoundState() {
    soundToggle.setAttribute('aria-pressed', state.soundOn ? 'true' : 'false');
    soundLabel.textContent = state.soundOn ? 'SOUND ON' : 'SOUND OFF';
    soundSymbol.textContent = state.soundOn ? '◖))' : '♫';
    if (!state.soundOn) stopAudio();
    else if (!audioContext) startAudio();
    else updateAudioIntensity(stage());
  }

  function toggleSound() {
    state.soundOn = !state.soundOn;
    renderSoundState();
    if (state.soundOn) showToast('AMBIENCE ENABLED. THE SOUND WILL CHANGE AS YOU READ THE FILES.');
    else showToast('AMBIENCE MUTED. THE INVESTIGATION CONTINUES.');
  }

  document.body.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    switch (action) {
      case 'intro': state.screen = 'intro'; render(); break;
      case 'briefing': beginSession(); state.screen = 'briefing'; render(); break;
      case 'start-investigation': changeScreen('archive'); break;
      case 'archive': changeScreen('archive'); break;
      case 'evidence': changeScreen('evidence'); break;
      case 'accusation': changeScreen('accusation'); break;
      case 'open-case': openCase(button.dataset.id); break;
      case 'mark-reviewed': markReviewed(button.dataset.id); break;
      case 'filter-cases': state.filter = button.dataset.filter || 'all'; state.screen = 'archive'; render(); break;
      case 'toggle-sound': toggleSound(); break;
      case 'share-result': shareResult(); break;
      default: break;
    }
  });

  app.addEventListener('submit', (event) => {
    if (event.target && event.target.id === 'accusation-form') {
      event.preventDefault();
      submitAccusation(event.target);
    }
  });
  soundToggle.addEventListener('click', toggleSound);
  $('#restart-button').addEventListener('click', resetGame);
  $('#home-button').addEventListener('click', event => { event.preventDefault(); changeScreen('intro'); });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state.soundOn && audioContext) {
      masterGain.gain.setTargetAtTime(0.0001, audioContext.currentTime, 0.25);
    } else if (!document.hidden && state.soundOn && audioContext) {
      masterGain.gain.setTargetAtTime([0.12,0.14,0.15,0.17,0.18][stage()], audioContext.currentTime, 0.6);
    }
  });

  render();
})();
