/* hydrate embedded images from assets/js/photos-*.js and media-*.js */
(function(){if(!window.PP_PHOTOS)return;document.querySelectorAll('img[data-photo]').forEach(function(im){var k=im.getAttribute('data-photo');if(window.PP_PHOTOS[k])im.src=window.PP_PHOTOS[k];});})();

/* Absolute navigation guard: even if any later script fails, no internal hash link
   can ever trigger a real navigation (which sandboxed previews surface as an
   "external link" popup). Runs in the capture phase, attached before anything else. */
document.addEventListener('click',function(e){
  var t=e.target;
  while(t&&t.getAttribute){
    if(t.tagName==='A'){
      var href=t.getAttribute('href');
      if(href&&href.charAt(0)==='#')e.preventDefault();
      break;
    }
    t=t.parentNode;
  }
},true);



/* ===== Lead capture: real form delivery =====
   Uses FormSubmit's AJAX endpoint so submissions arrive at the inbox below with no backend.
   NOTE: the first submission triggers a one-time activation email to this address.
   To route into a CRM later, swap PP_FORM_ENDPOINT for your Formspree/HubSpot/webhook URL. */
var PP_FORM_ENDPOINT='https://formsubmit.co/ajax/hello@productprotege.com';
window.__ppSend=function(fields){
  fields._template='table';
  return fetch(PP_FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(fields)})
    .then(function(r){if(!r.ok)throw new Error('send failed');return r.json();});
};

(function(){
  // Auto-discover every .view container by its id (view-home, view-snapshot, ...)
  var views={};
  document.querySelectorAll('.view').forEach(function(v){
    var name=v.id.replace('view-','');
    views[name]=v;
  });
  function show(name){
    if(!views[name])name='home';
    for(var k in views){views[k].style.display=(k===name?'block':'none');}
    document.documentElement.setAttribute('data-current-view',name);
    // highlight the current view in the nav and drawer
    document.querySelectorAll('.nav-links [data-view], .drawer-links [data-view]').forEach(function(a){
      a.classList.toggle('active', a.getAttribute('data-view')===name);
    });
    // safety net: reveal any animated elements in the newly shown view
    var active=views[name];
    if(active){active.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');});}
    window.scrollTo({top:0,behavior:'auto'});
  }
  // expose for other scripts if needed
  window.__ppShow=show;

  var viewNames={home:1,snapshot:1,work:1,advisor:1,course:1,book:1,coaching:1,resources:1,coaches:1,north:1,diagnostic:1};

  // View switching for any element with data-view (no History API; sandbox-safe)
  document.addEventListener('click',function(e){
    if(e.target.closest('summary')||e.target.closest('details'))return;
    var viewTrigger=e.target.closest('a[data-view],button[data-view],[role="button"][data-view]');
    if(viewTrigger){
      e.preventDefault();
      show(viewTrigger.getAttribute('data-view'));
      return;
    }
    // In-page anchor links (e.g. #final, #snapshot-teaser, #who, #builder) that are NOT view triggers:
    // reveal the right view if needed, then smooth-scroll to the target accounting for the sticky nav.
    var anchor=e.target.closest('[data-anchor]');
    if(anchor){
      var id=anchor.getAttribute('data-anchor');
      if(!id){e.preventDefault();return;}
      if(viewNames[id]){e.preventDefault();show(id);return;}
      var el=document.getElementById(id);
      if(el){
        e.preventDefault();
        var host=el.closest('.view');
        if(host&&host.style.display==='none'){
          show(host.id.replace('view-',''));
        }
        setTimeout(function(){
          var navEl=document.querySelector('nav');
          var offset=(navEl?navEl.getBoundingClientRect().height:0)+12;
          var y=el.getBoundingClientRect().top+window.pageYOffset-offset;
          window.scrollTo({top:y<0?0:y,behavior:'smooth'});
        },40);
      }
    }
  });

  show('home');
})();

(function(){

/* persona swap system removed in the editorial rework: sections are static now */

/* drawer */
const burger=document.getElementById('navBurger');
const drawer=document.getElementById('drawer');
const drawerBackdrop=document.getElementById('drawerBackdrop');
const drawerClose=document.getElementById('drawerClose');
function setDrawer(o){drawer.classList.toggle('open',o);drawerBackdrop.classList.toggle('open',o);burger.classList.toggle('open',o);burger.setAttribute('aria-expanded',o);drawer.setAttribute('aria-hidden',!o);document.body.style.overflow=o?'hidden':'';}
if(burger){burger.addEventListener('click',()=>setDrawer(!drawer.classList.contains('open')));drawerClose.addEventListener('click',()=>setDrawer(false));drawerBackdrop.addEventListener('click',()=>setDrawer(false));drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setDrawer(false)));document.addEventListener('keydown',e=>{if(e.key==='Escape')setDrawer(false);});}

/* course preview modal */
(function(){
  var pv=document.getElementById('previewModal');
  if(!pv)return;
  function close(){pv.classList.remove('open');document.body.style.overflow='';}
  document.addEventListener('click',function(e){
    if(e.target.closest('[data-preview]')){e.preventDefault();pv.classList.add('open');document.body.style.overflow='hidden';return;}
    if(pv.classList.contains('open')&&e.target.closest('#previewModal [data-contact]')){close();return;}
  });
  document.getElementById('pvClose').addEventListener('click',close);
  pv.addEventListener('click',function(e){if(e.target===pv)close();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&pv.classList.contains('open'))close();});
})();

/* contact form modal */
(function(){
  var modal=document.getElementById('contactModal');
  if(!modal)return;
  var formWrap=document.getElementById('cmForm'), done=document.getElementById('cmDone');
  var fields={first:document.getElementById('cmFirst'),last:document.getElementById('cmLast'),email:document.getElementById('cmEmail'),reason:document.getElementById('cmReason')};
  var currentKind='advisor';
  function openModal(opts){
    opts=opts||{};
    currentKind=opts.kind||'advisor';
    document.getElementById('cmEyebrow').textContent=opts.eyebrow||'Start the conversation';
    document.getElementById('cmTitle').textContent=opts.title||'Talk to a product advisor';
    document.getElementById('cmIntro').textContent=opts.intro||'Tell us a little about what you are working through and we will be in touch.';
    document.getElementById('cmReasonLabel').innerHTML=(opts.reasonLabel||"What's prompting your interest?")+' <span class="req">*</span>';
    formWrap.style.display='';done.style.display='none';
    document.getElementById('cmError').style.display='none';
    var sb=document.getElementById('cmSubmit');sb.disabled=false;sb.textContent='Send my message';
    // reset
    ['cmFirst','cmLast','cmEmail','cmPhone','cmReason'].forEach(function(id){var el=document.getElementById(id);if(el)el.value='';});
    if(opts.reasonPrefill)document.getElementById('cmReason').value=opts.reasonPrefill;
    Object.keys(fields).forEach(function(k){fields[k].parentElement.classList.remove('err');});
    modal.classList.add('open');document.body.style.overflow='hidden';
    setTimeout(function(){fields.first.focus();},120);
  }
  function closeModal(){modal.classList.remove('open');document.body.style.overflow='';}
  window.__ppContact=openModal;

  document.getElementById('cmClose').addEventListener('click',closeModal);
  document.getElementById('cmDoneClose').addEventListener('click',closeModal);
  modal.addEventListener('click',function(e){if(e.target===modal)closeModal();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&modal.classList.contains('open'))closeModal();});

  // open triggers
  document.addEventListener('click',function(e){
    var t=e.target.closest('a[data-contact],button[data-contact],[role="button"][data-contact]');
    if(!t)return;
    e.preventDefault();
    var kind=t.getAttribute('data-contact');
    if(kind==='coaching'){
      openModal({kind:kind,eyebrow:'Product coaching',title:'Let\u2019s talk about coaching',intro:'Share a bit about your team and what you are hoping to change, and we will be in touch.',reasonLabel:'What would you like coaching to help with?'});
    }else if(kind==='diagnostic'){
      openModal({kind:kind,eyebrow:'Product Thinking Diagnostic',title:'Book the Product Thinking Diagnostic',intro:'The Diagnostic is how most engagements begin. Tell us about your team and we will set up the first conversation.',reasonLabel:'Tell us about your team, your goals, and your timing'});
    }else if(kind==='course'){
      openModal({kind:kind,eyebrow:'Product Management Accelerator',title:'Enroll your team',intro:'Tell us how many seats you need and we will set up enrollment, including volume pricing and a single invoice for cohorts.',reasonLabel:'How many Product Managers, and what timing?'});
    }else if(kind==='north'){
      openModal({kind:kind,eyebrow:'North by Product Prot\u00e9g\u00e9',title:'See North in action',intro:'Tell us about your team and we will set up a walkthrough of North with one of our coaches.',reasonLabel:'What tooling do you use today, and what is prompting the change?'});
    }else if(kind==='mix'){
      openModal({kind:kind,eyebrow:'Your engagement mix',title:'Talk through this plan',intro:'We will review your selected modules and come back with how we would sequence and price them for your team.',reasonLabel:'Anything we should know about your team or goals?',reasonPrefill:t.getAttribute('data-modules')?('Modules I am interested in: '+t.getAttribute('data-modules')+'\n\n'):''});
    }else{
      openModal({kind:kind,eyebrow:'Fractional Product Advisor',title:'Talk to a product advisor',intro:'Tell us a little about what you are working through and we will be in touch.',reasonLabel:'What\u2019s prompting your interest in an advisor?'});
    }
  });

  document.getElementById('cmSubmit').addEventListener('click',function(){
    var ok=true;
    function check(el,test){var f=el.parentElement;if(test){f.classList.add('err');ok=false;}else{f.classList.remove('err');}}
    check(fields.first,!fields.first.value.trim());
    check(fields.last,!fields.last.value.trim());
    check(fields.email,!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(fields.email.value.trim()));
    check(fields.reason,!fields.reason.value.trim());
    if(!ok)return;
    var sb=document.getElementById('cmSubmit'), err=document.getElementById('cmError');
    sb.disabled=true;sb.textContent='Sending\u2026';err.style.display='none';
    var labels={advisor:'Product Advisor enquiry',coaching:'Coaching enquiry',diagnostic:'Product Thinking Diagnostic booking',mix:'Engagement mix enquiry',course:'Course enrollment enquiry',north:'North demo request'};
    window.__ppSend({
      name:fields.first.value.trim()+' '+fields.last.value.trim(),
      email:fields.email.value.trim(),
      phone:document.getElementById('cmPhone').value.trim()||'not provided',
      message:fields.reason.value.trim(),
      _subject:'[Product Prot\u00e9g\u00e9] '+(labels[currentKind]||'Website enquiry')
    }).then(function(){
      formWrap.style.display='none';done.style.display='block';
    }).catch(function(){
      err.style.display='block';sb.disabled=false;sb.textContent='Send my message';
    });
  });
})();

/* home signals module removed in the editorial rework */

/* count up */
function animateCount(el){
  if(el.dataset.done)return;el.dataset.done=1;
  const target=+el.dataset.count,suf=el.dataset.suffix||'',pre=el.dataset.prefix||'',dec=+(el.dataset.dec||0);
  const dur=1400,t0=performance.now();
  function tick(t){const p=Math.min((t-t0)/dur,1);const e=1-Math.pow(1-p,3);const val=(target*e);el.textContent=pre+(dec?val.toFixed(dec):Math.round(val).toLocaleString())+suf;if(p<1)requestAnimationFrame(tick);}
  requestAnimationFrame(tick);
}
const io=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');if(en.target.dataset&&en.target.dataset.count!==undefined)animateCount(en.target);io.unobserve(en.target);}});},{threshold:.15});
document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=(i%3)*0.05+'s';io.observe(el);});
document.querySelectorAll('[data-count]').forEach(el=>io.observe(el));


})();
(function(){

/* ============ THE INSTRUMENT ============
   8 themes (from the real Product Mindset Snapshot) + 2 axis self-ratings.
   Each scenario option carries: theme points (0-8 weight), curiosity (C), execution (E).
   Curiosity = discovery, questions, problem-first, outcomes.
   Execution = rigor, structure, prioritization, shipping discipline.
*/
const THEMES = [
  "Product Vision","Strategic Thinking","Outcomes & Value","Trade-offs & Battle Selection",
  "Metrics & KPIs","Backlog & Prioritization","Epic & Requirements","Roadmap Alignment"
];

// Each question: theme index, prompt, sub, options [{t:text, s:themeScore0to8, c:curiosity, e:execution}]
const Q = [
  {
    theme:0,
    q:"A senior leader asks your team, in one sentence, why your product exists. What comes back?",
    sub:"How clearly is vision held across the people doing the work.",
    opts:[
      {t:"A crisp sentence about the customer and the change you create for them. Most of the team would say it the same way.",s:8,c:2,e:1},
      {t:"A reasonable answer, but three people would phrase it three different ways.",s:5,c:1,e:1},
      {t:"A description of what you are building right now, more feature than future.",s:3,c:0,e:1},
      {t:"Mostly silence, or a glance toward whoever owns the roadmap.",s:1,c:0,e:0}
    ]
  },
  {
    theme:1,
    q:"How does work get onto your roadmap?",
    sub:"Whether strategy is a filter, or the loudest voice wins.",
    opts:[
      {t:"Every item is checked against a few strategic pillars before it earns a place.",s:8,c:1,e:2},
      {t:"There is a strategy deck, and we reference it when there is time.",s:5,c:1,e:1},
      {t:"Whoever asks loudest, or most senior, tends to get their item in.",s:2,c:0,e:0},
      {t:"We work from a backlog of requests and rarely ask which strategy they serve.",s:1,c:0,e:1}
    ]
  },
  {
    theme:2,
    q:"A feature shipped last quarter. How do you know if it worked?",
    sub:"Outcomes over output. Launch as a starting line, not a finish line.",
    opts:[
      {t:"We named the metric before building, and we have measured the change against it since.",s:8,c:2,e:2},
      {t:"We track usage dashboards, but did not set a target up front.",s:5,c:1,e:1},
      {t:"We know it shipped on time. Impact is harder to say.",s:2,c:0,e:1},
      {t:"We have moved on to the next thing. No one circled back.",s:1,c:0,e:0}
    ]
  },
  {
    theme:3,
    q:"Engineering says the full scope will slip the date. What happens next?",
    sub:"Choosing the right battles, and trading scope against value on purpose.",
    opts:[
      {t:"We look at which slice delivers the most customer and business value, and cut to that on purpose.",s:8,c:2,e:2},
      {t:"We negotiate scope down, mostly by gut feel about what matters.",s:5,c:1,e:1},
      {t:"We push to keep everything and ask the team to find the time.",s:2,c:0,e:0},
      {t:"We cut whatever is least finished, regardless of its value.",s:2,c:0,e:1}
    ]
  },
  {
    theme:4,
    q:"Your leadership asks for one number that proves the product is healthy. You point to:",
    sub:"Telling a true KPI from a vanity metric, and laddering measures to the business.",
    opts:[
      {t:"A leading user-behavior metric that ladders up to a clear business KPI.",s:8,c:1,e:2},
      {t:"A solid business number, though the link to user behavior is fuzzy.",s:5,c:1,e:1},
      {t:"Total signups or pageviews. It is up and to the right.",s:2,c:0,e:1},
      {t:"We do not have one number we would all agree to stand behind.",s:1,c:0,e:0}
    ]
  },
  {
    theme:5,
    q:"Two strong ideas, not enough capacity for both. How do you decide?",
    sub:"Prioritization with a shared, defensible method instead of opinion.",
    opts:[
      {t:"We score both on reach, impact, confidence, and effort, then sequence with cost of delay in mind.",s:8,c:1,e:2},
      {t:"We discuss trade-offs as a group and reach a reasoned call.",s:6,c:2,e:1},
      {t:"The more senior sponsor usually wins the slot.",s:2,c:0,e:0},
      {t:"We try to do a bit of both and stretch the timeline.",s:2,c:0,e:1}
    ]
  },
  {
    theme:6,
    q:"A developer opens the ticket for a major piece of work. What do they find?",
    sub:"The Epic as a source of truth, not a one-line Jira ticket.",
    opts:[
      {t:"Problem, scope in and out, success metric, assumptions, risks, and testable stories. They can start with confidence.",s:8,c:1,e:2},
      {t:"A clear description and acceptance criteria, though scope edges get fuzzy.",s:5,c:1,e:1},
      {t:"A title and a sentence. The rest happens over Slack.",s:2,c:0,e:0},
      {t:"They ask three people what it actually means before writing code.",s:1,c:0,e:0}
    ]
  },
  {
    theme:7,
    q:"Pick the line that best describes your roadmap today.",
    sub:"A sequence of problems tied to strategy, versus a dated feature list.",
    opts:[
      {t:"Themes of problems to solve, each tied to a strategic pillar and a metric it should move.",s:8,c:2,e:2},
      {t:"A prioritized list of features with rough dates and owners.",s:4,c:0,e:1},
      {t:"A set of commitments we made to stakeholders, by date.",s:2,c:0,e:1},
      {t:"It changes often enough that the document is usually out of date.",s:1,c:0,e:0}
    ]
  },
  // axis self-ratings
  {
    axis:"c",
    theme:-1,
    q:"How would you describe your team's instinct when a new problem shows up?",
    sub:"Curiosity: staying in the question before jumping to the answer.",
    scale:[
      {sv:"1",sl:"Jump straight to a solution"},
      {sv:"2",sl:"Usually solution-first"},
      {sv:"3",sl:"A mix"},
      {sv:"4",sl:"Usually ask first"},
      {sv:"5",sl:"Dig into the problem before solving"}
    ]
  },
  {
    axis:"e",
    theme:-1,
    q:"And how would you describe your team's follow-through from plan to shipped, measured work?",
    sub:"Execution: the discipline that turns intent into delivered, measured value.",
    scale:[
      {sv:"1",sl:"Starts strong, fades out"},
      {sv:"2",sl:"Inconsistent"},
      {sv:"3",sl:"Gets there, unevenly"},
      {sv:"4",sl:"Reliable"},
      {sv:"5",sl:"Plans, ships, and measures consistently"}
    ]
  }
];

const TOTAL_Q = Q.length;

/* archetypes by Curiosity x Execution (mirrors the Snapshot's High/High = Innovator) */
const ARCH = {
  hh:{name:"Innovator",axis:"High Curiosity, High Execution",desc:"You pair a genuine pull toward the problem with the discipline to ship and measure. Teams in this quadrant turn good questions into delivered, proven value. The growth edge is scale: making your instinct repeatable for every team, not just the ones you touch."},
  hl:{name:"Visionary",axis:"High Curiosity, Building Execution",desc:"You see the problem clearly and ask the right questions, and the gap is in the machinery that turns insight into shipped, measured outcomes. Tightening prioritization, Epic rigor, and KPI follow-through converts strong thinking into results leadership can see."},
  lh:{name:"Architect",axis:"Building Curiosity, High Execution",desc:"You run a tight, reliable delivery machine. The growth edge is upstream: more discovery and sharper strategy so that all that execution power is aimed at the right problems, not just aimed well."},
  ll:{name:"Operator",axis:"Building Curiosity, Building Execution",desc:"The foundation is the opportunity here. Teams in this quadrant are often busy and well-intentioned, with vision, prioritization, and measurement still forming. Small shifts at the top of the pyramid tend to unlock outsized gains downstream."}
};

const ROLE_FRAMING = {
  cpo:{
    cta:"Turn this Snapshot into a plan for your org",
    ctaP:"This is the same instrument we run inside engagements, scored for whole cohorts. Let's read your results together and map where coaching moves the needle first.",
    leadH:"Get the full team version",
    leadP:"Send this to a work email and we will follow up with a tailored read for your product org, plus how the Snapshot scales across teams."
  },
  exec:{
    cta:"See what this is costing, and what to do about it",
    ctaP:"We translate this Snapshot into the dollars-and-outcomes terms your board cares about, then show where the return leaks and where to start.",
    leadH:"Get the executive read",
    leadP:"Send this to a work email and we will follow up with the business case version: where capacity is leaking and the fastest path to return."
  },
  hr:{
    cta:"Build a development plan from this Snapshot",
    ctaP:"This is the same instrument we use to baseline a whole team. Let's turn your results into a shared standard and a coaching plan that ramps Product Managers faster.",
    leadH:"Get the team development read",
    leadP:"Send this to a work email and we will follow up with the cohort version: how your Product Managers score by level, and where to focus growth."
  }
};

/* ============ STATE ============ */
let role='cpo';
let idx=0;
const answers=new Array(TOTAL_Q).fill(null); // each: {s,c,e} for scenarios, or {val} for axis

const introScreen=document.getElementById('introScreen');
const quizScreen=document.getElementById('quizScreen');
const resultsScreen=document.getElementById('resultsScreen');
const qcard=document.getElementById('qcard');
const progressWrap=document.getElementById('progressWrap');
const progressFill=document.getElementById('progressFill');
const progressLabel=document.getElementById('progressLabel');

/* role inherited from the home audience toggle (no second ask) */
function syncRoleFromHome(){
  var active=document.querySelector('#switch button.on');
  if(active&&active.dataset.aud)role=active.dataset.aud;
}

document.getElementById('startBtn').addEventListener('click',()=>{
  syncRoleFromHome();
  introScreen.style.display='none';
  quizScreen.style.display='block';
  progressWrap.style.display='block';
  idx=0; renderQ();
  window.scrollTo({top:0,behavior:'smooth'});
});

function updateProgress(){
  const pct=((idx)/(TOTAL_Q))*100;
  progressFill.style.width=pct+'%';
  progressLabel.textContent=(idx+1)+' / '+TOTAL_Q;
}

function renderQ(){
  updateProgress();
  const q=Q[idx];
  let html='';
  const themeLabel = q.theme>=0 ? THEMES[q.theme] : (q.axis==='c'?'Curiosity':'Execution');
  html+='<div class="q-theme"><span class="qn">Q'+(idx+1)+'</span>'+themeLabel+'</div>';
  html+='<div class="q-text">'+q.q+'</div>';
  if(q.sub)html+='<div class="q-sub">'+q.sub+'</div>';

  if(q.scale){
    html+='<div class="scale-row">';
    q.scale.forEach((s,i)=>{
      const sel=answers[idx]&&answers[idx].val===(i+1)?' sel':'';
      html+='<button class="scale-btn'+sel+'" data-val="'+(i+1)+'"><div class="sv">'+s.sv+'</div><div class="sl">'+s.sl+'</div></button>';
    });
    html+='</div>';
  }else{
    html+='<div class="options">';
    q.opts.forEach((o,i)=>{
      const sel=answers[idx]&&answers[idx].oi===i?' sel':'';
      html+='<button class="opt'+sel+'" data-oi="'+i+'"><span class="mk">'+(sel?'\u2713':'')+'</span><span class="ot">'+o.t+'</span></button>';
    });
    html+='</div>';
  }

  html+='<div class="qnav"><button class="back" id="backBtn"'+(idx===0?' disabled':'')+'>&#8592; Back</button><span class="hint">'+(idx===TOTAL_Q-1?'Last one':'Tap an answer to continue')+'</span></div>';

  qcard.innerHTML=html;
  qcard.classList.remove('in');
  void qcard.offsetWidth;
  qcard.classList.add('in');

  const backBtn=document.getElementById('backBtn');
  backBtn.addEventListener('click',()=>{ if(idx>0){idx--;renderQ();window.scrollTo({top:0,behavior:'smooth'});} });

  if(q.scale){
    qcard.querySelectorAll('.scale-btn').forEach(b=>b.addEventListener('click',()=>{
      const val=+b.dataset.val;
      answers[idx]={val,axis:q.axis};
      advance();
    }));
  }else{
    qcard.querySelectorAll('.opt').forEach(b=>b.addEventListener('click',()=>{
      const oi=+b.dataset.oi;const o=q.opts[oi];
      answers[idx]={oi,s:o.s,c:o.c,e:o.e,theme:q.theme};
      advance();
    }));
  }
}

function advance(){
  // brief delay so the selection is visible
  qcard.querySelectorAll('.opt,.scale-btn').forEach(x=>x.style.pointerEvents='none');
  setTimeout(()=>{
    if(idx<TOTAL_Q-1){idx++;renderQ();window.scrollTo({top:0,behavior:'smooth'});}
    else{showResults();}
  },230);
}

/* ============ SCORING ============ */
function computeResults(){
  // theme scores: 8 scenario questions, each 0-8
  const themeScores=new Array(8).fill(0);
  let curiosity=0, execution=0, curiosityMax=0, executionMax=0;
  let scenarioTotal=0;
  answers.forEach((a,i)=>{
    if(!a)return;
    const q=Q[i];
    if(q.axis){
      // self-rating 1-5 -> contributes to the axis (scaled to match scenario contributions)
      if(q.axis==='c'){curiosity+=(a.val-1)/4*6; curiosityMax+=6;}
      if(q.axis==='e'){execution+=(a.val-1)/4*6; executionMax+=6;}
    }else{
      themeScores[q.theme]=a.s;
      scenarioTotal+=a.s;
      curiosity+=a.c; curiosityMax+=2;
      execution+=a.e; executionMax+=2;
    }
  });
  const scoreMax=8*8; // 64, matching the real Snapshot scale
  const pct=Math.round((scenarioTotal/scoreMax)*100);

  const cN=curiosity/curiosityMax; // 0..1
  const eN=execution/executionMax;
  const hi=0.6;
  let key=(cN>=hi?'h':'l')+(eN>=hi?'h':'l');
  const arch=ARCH[key];

  return {themeScores,scenarioTotal,scoreMax,pct,cN,eN,arch};
}

/* radar svg */
function radarSVG(themeScores){
  const n=themeScores.length, cx=220, cy=210, R=150;
  const ang=i=>(-90 + i*(360/n))*Math.PI/180;
  function pt(i,r){return [cx+Math.cos(ang(i))*r, cy+Math.sin(ang(i))*r];}
  let rings='';
  [0.25,0.5,0.75,1].forEach(f=>{
    let p='';
    for(let i=0;i<n;i++){const [x,y]=pt(i,R*f);p+=(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)+' ';}
    rings+='<path d="'+p+'Z" fill="none" stroke="#e6ddca" stroke-width="1"/>';
  });
  let spokes='',labels='';
  const short=["Vision","Strategy","Outcomes","Trade-offs","Metrics","Backlog","Epics","Roadmap"];
  for(let i=0;i<n;i++){
    const [x,y]=pt(i,R);
    spokes+='<line x1="'+cx+'" y1="'+cy+'" x2="'+x.toFixed(1)+'" y2="'+y.toFixed(1)+'" stroke="#efe8d8" stroke-width="1"/>';
    const [lx,ly]=pt(i,R+24);
    let anchor='middle';
    if(lx>cx+10)anchor='start'; if(lx<cx-10)anchor='end';
    labels+='<text x="'+lx.toFixed(1)+'" y="'+(ly+4).toFixed(1)+'" font-size="12" font-weight="600" fill="#52615b" text-anchor="'+anchor+'" font-family="Inter,sans-serif">'+short[i]+'</text>';
  }
  let dp='';
  for(let i=0;i<n;i++){const r=R*(themeScores[i]/8);const [x,y]=pt(i,r);dp+=(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)+' ';}
  let dots='';
  for(let i=0;i<n;i++){const r=R*(themeScores[i]/8);const [x,y]=pt(i,r);dots+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="3.5" fill="#e8ad1c"/>';}
  return '<svg viewBox="0 0 440 420" xmlns="http://www.w3.org/2000/svg">'+rings+spokes+
    '<path d="'+dp+'Z" fill="rgba(255,197,52,.28)" stroke="#e8ad1c" stroke-width="2.5"/>'+dots+labels+'</svg>';
}

function showResults(){
  progressFill.style.width='100%';
  progressLabel.textContent=TOTAL_Q+' / '+TOTAL_Q;
  const r=computeResults();
  const f=ROLE_FRAMING[role];

  // strengths & focus
  const indexed=r.themeScores.map((s,i)=>({s,i})).sort((a,b)=>b.s-a.s);
  const strengths=indexed.slice(0,2);
  const focus=indexed.slice(-2).reverse(); // lowest two

  const focusCoach={
    0:"Run the seven Vision questions with your leads and land one or two sentences everyone can repeat.",
    1:"Define three to five strategic pillars and use them as the gate every roadmap item must pass.",
    2:"Name the metric before you build, then hold a short Go and value review after every launch.",
    3:"Practice cutting to the highest-value slice on purpose, using the Dual Value Lens to decide.",
    4:"Build a KPI Tree so every measure ladders from a user behavior up to a business outcome.",
    5:"Adopt one shared scoring method, RICE or weighted scoring, so prioritization stops being about who is loudest.",
    6:"Move major work into a full Epic, problem, scope in and out, metric, and testable stories, before code starts.",
    7:"Rebuild the roadmap as themes of problems tied to pillars and the metric each should move."
  };
  const strengthNote={
    0:"Vision is clear and shared, a real foundation to build on.",
    1:"Strategy is doing its job as a filter for the work.",
    2:"You connect work to outcomes, not just output.",
    3:"You choose your battles and trade scope with intent.",
    4:"Your measures are honest and ladder to the business.",
    5:"Prioritization runs on a shared, defensible method.",
    6:"Your Epics carry enough truth for teams to move fast.",
    7:"Your roadmap reads as strategy over time, not a feature list."
  };

  let barColor=v=>v>=6?'#1f8a7e':(v>=4?'#e8ad1c':'#e8623a');

  let html='';
  html+='<div class="res-hero">';
  html+='<div class="rk">Your Product Mindset Snapshot</div>';
  html+='<div class="scorebig">'+r.scenarioTotal+'<small> / '+r.scoreMax+'</small></div>';
  html+='<div class="pct">'+r.pct+'% product-mindset maturity across the eight themes</div>';
  html+='<div class="arch"><span class="star">&#9733;</span><span class="an">'+r.arch.name+'</span><span class="axx">'+r.arch.axis+'</span></div>';
  html+='</div>';

  // archetype
  html+='<div class="res-block"><h2>You read as a '+r.arch.name+'</h2><div class="arch-desc">'+r.arch.desc+'</div></div>';

  // radar
  html+='<div class="res-block"><h2>Your eight-theme profile</h2><div class="bsub">This is your Readiness DNA. The further each point reaches, the stronger that part of your product thinking.</div>';
  html+='<div class="radar-wrap">'+radarSVG(r.themeScores)+'</div>';
  // bars
  html+='<div style="margin-top:10px">';
  r.themeScores.forEach((s,i)=>{
    html+='<div class="theme-row"><div class="tname">'+THEMES[i]+'</div><div class="tbar"><div class="tfill" style="width:0" data-w="'+(s/8*100)+'" data-c="'+barColor(s)+'"></div></div><div class="tval">'+s+'/8</div></div>';
  });
  html+='</div>';
  html+='<div class="tleg"><span><span class="sw" style="background:#1f8a7e"></span>Strong (6 to 8)</span><span><span class="sw" style="background:#e8ad1c"></span>Forming (4 to 5)</span><span><span class="sw" style="background:#e8623a"></span>Opportunity (0 to 3)</span></div>';
  html+='</div>';

  // strengths
  html+='<div class="res-block"><h2>Where you are strong</h2><div class="focus-list">';
  strengths.forEach(o=>{html+='<div class="focus-item strength-item"><div class="fn">'+THEMES[o.i].split(" ")[0]+'</div><div><h4>'+THEMES[o.i]+'</h4><p>'+strengthNote[o.i]+'</p></div></div>';});
  html+='</div></div>';

  // focus
  html+='<div class="res-block"><h2>Where to focus next</h2><div class="bsub">Tactical struggles at the bottom of the pyramid usually trace to ambiguity at the top. These two themes will move the most for you.</div><div class="focus-list">';
  focus.forEach((o,k)=>{html+='<div class="focus-item"><div class="fn">0'+(k+1)+'</div><div><h4>'+THEMES[o.i]+' &middot; scored '+o.s+'/8</h4><p>'+focusCoach[o.i]+'</p></div></div>';});
  html+='</div></div>';

  // CTA
  html+='<div class="res-cta"><h2>'+f.cta+'</h2><p>'+f.ctaP+'</p><div class="row"><a role="button" tabindex="0" data-contact="diagnostic" class="btn btn-dark">Book the Product Thinking Diagnostic</a><a role="button" tabindex="0" data-view="work" class="btn btn-light">See how we work</a></div></div>';

  // lead capture
  html+='<div class="lead" id="leadBox"><h3>'+f.leadH+'</h3><p>'+f.leadP+'</p><div class="frow"><input type="email" id="leadEmail" placeholder="you@company.com" autocomplete="email"><button class="btn btn-yellow" id="leadBtn" style="flex:0 0 auto">Send my results</button></div><div class="fine">We use this only to follow up about your Snapshot. No list-selling, no spam.</div></div>';

  html+='<div class="restart"><button id="restartBtn">Start over</button></div>';
  html+='<div class="footnote">Scored on the eight themes behind the E3 Product Mindset and the Product Empowerment Pyramid. Ready for the full picture? The Product Thinking Diagnostic, run with our team, scores each Product Manager and the whole cohort and feeds a tailored engagement plan.</div>';

  resultsScreen.innerHTML='<a role="button" tabindex="0" data-view="home" class="view-back" style="margin-bottom:16px">&#8592; Back to home</a>'+html;
  quizScreen.style.display='none';
  progressWrap.style.display='none';
  resultsScreen.style.display='block';
  void resultsScreen.offsetWidth;
  resultsScreen.classList.add('in');
  window.scrollTo({top:0,behavior:'smooth'});

  // animate bars
  setTimeout(()=>{
    resultsScreen.querySelectorAll('.tfill').forEach(el=>{el.style.background=el.dataset.c;el.style.width=el.dataset.w+'%';});
  },200);

  // lead handlers
  const leadBtn=document.getElementById('leadBtn');
  leadBtn.addEventListener('click',()=>{
    const email=document.getElementById('leadEmail').value.trim();
    const ok=/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    const box=document.getElementById('leadBox');
    if(!ok){document.getElementById('leadEmail').style.borderColor='#e8623a';return;}
    leadBtn.disabled=true;leadBtn.textContent='Sending\u2026';
    const rr=computeResults();
    window.__ppSend({
      email:email,
      role:role,
      snapshot_score:rr.scenarioTotal+' / '+rr.scoreMax,
      archetype:rr.arch.name,
      _subject:'[Product Prot\u00e9g\u00e9] Snapshot results request'
    }).then(function(){
      box.classList.add('done');
      box.innerHTML='<div class="check">&#10003;</div><h3>Thanks. Your results are on the way.</h3><p style="margin:0">We will follow up at '+email+' with your tailored read and next steps.</p>';
    }).catch(function(){
      leadBtn.disabled=false;leadBtn.textContent='Send my results';
      document.getElementById('leadEmail').style.borderColor='#e8623a';
    });
  });

  document.getElementById('restartBtn').addEventListener('click',()=>{
    for(let i=0;i<answers.length;i++)answers[i]=null;
    idx=0;
    resultsScreen.style.display='none';resultsScreen.classList.remove('in');
    introScreen.style.display='block';
    window.scrollTo({top:0,behavior:'smooth'});
  });
}


})();
(function(){

const MOD_NAMES={
  snapshot:"Product Thinking Diagnostic",discovery:"Discovery",training:"Live Training",
  coaching:"1:1 Live Coaching",library:"Protégé Library",north:"North",course:"Online Course",
  advising:"Strategic Advising",advisor:"Fractional Product Advisor"
};
// what each module contributes, phrased as a capability
const MOD_CAP={
  snapshot:"a clear, science-backed read on where every Product Manager and the whole team actually stands",
  discovery:"a grounded view of how the team applies the craft on real work, so coaching aims at the right gaps",
  training:"a shared language across the team through live training on the E3 Product Mindset",
  coaching:"habit change that sticks, with weekly 1:1 coaching turning concepts into daily practice",
  library:"always-on access to the templates and playbooks that keep quality consistent",
  north:"an AI native tooling platform that keeps backlogs, roadmaps, and OKRs aligned to strategy and coaches Product Managers in the flow of their daily work",
  course:"a repeatable baseline that scales to new hires through the self-paced course",
  advising:"a senior outside voice on the hard calls, on demand",
  advisor:"a steady leadership-level partner who keeps the standard honest over time"
};
const PHASE={snapshot:'assess',discovery:'align',training:'align',coaching:'align',library:'scale',north:'scale',course:'scale',advising:'sustain',advisor:'sustain'};

const grid=document.getElementById('modGrid');
const modPicked=document.getElementById('modPicked');
const builderCta=document.getElementById('builderCta');
const mixResult=document.getElementById('mixResult');

function selected(){return [...grid.querySelectorAll('.mod.on')].map(m=>m.dataset.id);}

function refresh(){
  const on=selected();
  modPicked.textContent=on.length?on.map(id=>MOD_NAMES[id]).join(' · '):'Nothing picked yet, take your time';
  document.querySelector('.summary .sl').innerHTML='You have picked <b id="modCount">'+on.length+'</b> module'+(on.length===1?'':'s')+'. We will price and sequence it around your team and budget.';
  // if results are already showing, keep them in sync as the user changes the mix
  if(mixResult.style.display!=='none')renderMix();
}

function headline(on){
  var has=function(x){return on.indexOf(x)>-1;};
  var phases={};on.forEach(function(id){phases[PHASE[id]]=1;});
  var span=Object.keys(phases).length;
  // signature combinations
  if(on.length===0)return["Nothing selected yet","Pick a module or two above and we will tell you what that mix is built to accomplish."];
  if(on.length===1){
    var only=on[0];
    var map={
      snapshot:["A low-risk place to start","On its own, the Diagnostic proves whether the gap is real and where it sits for every Product Manager on the team, so any next step is aimed at something measured rather than a hunch."],
      discovery:["A focused deep-dive","Discovery alone gives you an honest read of how the team applies the craft on real work. Most teams pair it with the Diagnostic for the fuller picture."],
      training:["A shared language, fast","Live training alone resets the vocabulary and the standard for the whole team in days. Pair it with coaching when you want the change to stick."],
      coaching:["Deep, lasting change for a few","1:1 coaching alone drives real habit change for the people in it. Add training first when you want the whole team moving together."],
      library:["Always-on enablement","The Library alone keeps quality consistent and answers close at hand. It compounds once a shared language is in place."],
      north:["Tooling with coaching built in","North alone gives your team an AI native system for backlogs, roadmaps, and OKR alignment, and it coaches every Product Manager on requirements, storytelling, and strategic thinking while they work. Pair it with live coaching and the habits set even faster."],
      course:["Scalable fundamentals","The course alone gives individuals and new hires a solid, certified baseline. It pairs naturally with the Library for reinforcement."],
      advising:["Senior help on demand","Strategic Advising alone gives you an experienced outside voice for the hard calls, drawn down only as you need it."],
      advisor:["A steady leadership partner","A Fractional Advisor alone keeps the product mindset honest at the top. It is most powerful after a coaching cycle has set the standard."]
    };
    return map[only];
  }
  // multi-module signatures
  if(has('training')&&has('coaching')&&(has('snapshot')||has('discovery')))
    return["Built to change how the team works","This is the combination behind a full-tier jump in a single cycle. You measure the baseline, set one shared language through training, then make it stick with coaching, so quality stops running through one or two people."];
  if(has('snapshot')&&has('discovery')&&!has('training')&&!has('coaching'))
    return["Built to find the real gaps","Together the Diagnostic and Discovery give you a precise, evidence-based picture of where the team stands and what to prioritize, the right groundwork before any training or coaching investment."];
  if((has('library')||has('course')||has('north'))&&!has('coaching')&&!has('training'))
    return["Built to scale and sustain","This mix keeps the product mindset alive across the org. Shared tools and a self-paced baseline mean new people absorb the standard on day one and quality holds as you grow."];
  if((has('advisor')||has('advising'))&&!has('training')&&!has('coaching'))
    return["Built for senior guidance","This mix surrounds your leaders with experienced outside judgment on the decisions that carry the most risk, without adding headcount."];
  if(span>=3)
    return["Built for end-to-end transformation","This spans assess, align, and scale. You prove the gap, lift the team with a shared language and coaching, then lock it in with always-on enablement so the change outlasts any reorg."];
  if(has('training')&&has('library'))
    return["Built to learn it and keep it","Training sets the shared language and the Library keeps the tools close, so what the team learns does not fade by the next sprint."];
  // generic two-plus
  return["A strong, complementary mix","These modules reinforce each other well. Here is what each one brings to the engagement."];
}

function renderMix(){
  const on=selected();
  const h=headline(on);
  var html='<div class="mix-inner">';
  html+='<div class="mix-k">What this mix is built to accomplish</div>';
  html+='<h3>'+h[0]+'</h3>';
  html+='<p class="mix-lead">'+h[1]+'</p>';
  if(on.length){
    html+='<div class="mix-list">';
    on.forEach(function(id){
      html+='<div class="mix-item"><span class="mi-ic">&#10003;</span><div><b>'+MOD_NAMES[id]+'</b> gives you '+MOD_CAP[id]+'.</div></div>';
    });
    html+='</div>';
  }
  var modList=on.map(function(id){return MOD_NAMES[id];}).join(' \u00b7 ');
  html+='<div class="mix-cta"><a role="button" tabindex="0" data-contact="mix" data-modules="'+modList+'" class="btn btn-yellow">Talk through this plan</a><a role="button" tabindex="0" data-view="snapshot" class="btn btn-light">Start with the Snapshot</a></div>';
  html+='<p class="mix-fine">There is no wrong combination. Tell us your budget and goals and we will price and sequence the right version for you.</p>';
  html+='</div>';
  mixResult.innerHTML=html;
  mixResult.style.display='block';
}

grid.querySelectorAll('.mod').forEach(m=>m.addEventListener('click',function(e){
  e.preventDefault();
  // pure multiselect toggle: never move the page when a module is selected
  var sx=window.scrollX, sy=window.scrollY;
  m.classList.toggle('on');
  m.querySelector('.check').textContent=m.classList.contains('on')?'\u2713':'';
  refresh();
  window.scrollTo(sx,sy);
  requestAnimationFrame(function(){window.scrollTo(sx,sy);});
}));

/* builder presets: pre-select a starting mix, editable afterward */
var PRESETS={read:['snapshot'],lift:['snapshot','discovery','training','coaching','library'],standard:['training','course','library','north','advising','advisor'],scratch:[]};
var presetRow=document.getElementById('presetRow');
if(presetRow){
  presetRow.querySelectorAll('.preset').forEach(function(btn){
    btn.addEventListener('click',function(e){
      e.preventDefault();
      var sx=window.scrollX, sy=window.scrollY;
      presetRow.querySelectorAll('.preset').forEach(function(b){b.classList.remove('on');});
      btn.classList.add('on');
      var ids=PRESETS[btn.dataset.preset]||[];
      grid.querySelectorAll('.mod').forEach(function(m){
        var on=ids.indexOf(m.dataset.id)>-1;
        m.classList.toggle('on',on);
        m.querySelector('.check').textContent=on?'\u2713':'';
      });
      refresh();
      window.scrollTo(sx,sy);
      requestAnimationFrame(function(){window.scrollTo(sx,sy);});
    });
  });
}

builderCta.addEventListener('click',function(){
  renderMix();
  setTimeout(function(){
    var navEl=document.querySelector('nav');
    var offset=(navEl?navEl.getBoundingClientRect().height:0)+12;
    var y=mixResult.getBoundingClientRect().top+window.pageYOffset-offset;
    window.scrollTo({top:y<0?0:y,behavior:'smooth'});
  },40);
});

refresh();

/* reveal */
const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.14});
document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=(i%3)*0.05+'s';io.observe(el);});


})();

/* north video: graceful fallback when the media file is not present (e.g. single-file preview) */
(function(){
  document.querySelectorAll('video[data-fallback]').forEach(function(v){
    v.addEventListener('error',function(){
      var fb=v.parentElement.querySelector('.video-fb');
      if(!fb)return;
      var im=fb.querySelector('img');
      if(im&&!im.src)im.src=v.getAttribute('poster');
      v.style.display='none';fb.hidden=false;
    },true);
  });
})();
