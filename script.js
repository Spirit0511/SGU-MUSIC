const tracks=[
 {title:'Across the Universe',artist:'Hanson',album:'The Walk',year:'2007',duration:268},
 {title:'A Darker Heart',artist:'The Anix',album:'Sleepwalker',year:'2020',duration:231},
 {title:'Weightless',artist:'Aqualung',album:'Magnetic North',year:'2010',duration:246},
 {title:'Starlight',artist:'Muse',album:'Black Holes and Revelations',year:'2006',duration:240}
];
let current=0,playing=true,shuffle=false,repeat=false,elapsed=102,visualizer=true;
const $=id=>document.getElementById(id);
const fmt=s=>String(Math.floor(s/60)).padStart(2,'0')+':'+String(Math.floor(s%60)).padStart(2,'0');
function paintRange(el){const p=(Number(el.value)-Number(el.min))/(Number(el.max)-Number(el.min))*100;el.style.setProperty('--fill',p+'%')}
function row(t,i){return `<div class="track-row ${i===current?'current':''}" data-index="${i}"><span class="track-number">${String(i+1).padStart(2,'0')}</span><span class="track-details"><strong>${t.title}</strong><small>${t.artist} · ${t.album}</small></span><span class="track-length">${fmt(t.duration)}</span></div>`}
function renderLists(){ $('database-list').innerHTML=tracks.map(row).join('')||'<p class="note">NO TRACKS FOUND</p>'; $('playlist-list').innerHTML=tracks.map(row).join('')||'<p class="note">QUEUE EMPTY</p>'; $('database-count').textContent=String(tracks.length).padStart(2,'0')+' RECORDS';$('queue-count').textContent=String(tracks.length).padStart(2,'0');$('library-count').textContent=String(tracks.length).padStart(2,'0')+' TRACKS'; }
function paintTrack(){const t=tracks[current];if(!t)return;$('track-title').textContent=t.title;$('track-artist').textContent=t.artist;$('track-album').innerHTML=t.album.toUpperCase()+' <b>•</b> '+t.year;$('duration').textContent=fmt(t.duration);$('seek').max=t.duration;$('seek').value=elapsed;$('current-time').textContent=fmt(elapsed);$('percent').textContent=Math.round(elapsed/t.duration*100)+'%';paintRange($('seek'));renderLists()}
function setPlaying(v){playing=v;$('play').textContent=playing?'Ⅱ':'▶';$('play').setAttribute('aria-label',playing?'Pause':'Play');document.querySelector('.mini-bars').style.opacity=playing?'1':'.25';$('spectrum').classList.toggle('paused',!playing)}
function selectTrack(i){if(!tracks.length)return;current=(i+tracks.length)%tracks.length;elapsed=0;paintTrack();setPlaying(true)}
function showView(name){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id==='view-'+name));document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===name))}
document.querySelectorAll('.nav-item').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
$('play').addEventListener('click',()=>setPlaying(!playing));$('previous').addEventListener('click',()=>selectTrack(current-1));$('next').addEventListener('click',()=>selectTrack(current+1));
$('shuffle').addEventListener('click',()=>{shuffle=!shuffle;$('shuffle').classList.toggle('selected',shuffle)});$('repeat').addEventListener('click',()=>{repeat=!repeat;$('repeat').classList.toggle('selected',repeat)});
$('seek').addEventListener('input',e=>{elapsed=Number(e.target.value);$('current-time').textContent=fmt(elapsed);$('percent').textContent=Math.round(elapsed/tracks[current].duration*100)+'%';paintRange(e.target)});
$('volume').addEventListener('input',e=>{$('volume-value').textContent=e.target.value+'%';paintRange(e.target)});
document.addEventListener('click',e=>{const r=e.target.closest('.track-row');if(r)selectTrack(Number(r.dataset.index))});
$('search').addEventListener('input',e=>{const q=e.target.value.toLowerCase();document.querySelectorAll('#database-list .track-row').forEach((r,i)=>{r.style.display=(tracks[i].title+' '+tracks[i].artist+' '+tracks[i].album).toLowerCase().includes(q)?'grid':'none'})});
$('clear-queue').addEventListener('click',()=>{tracks.splice(0,tracks.length);current=0;elapsed=0;renderLists();$('track-title').textContent='NO TRACK SELECTED';$('track-artist').textContent='—';$('track-album').textContent='QUEUE EMPTY';setPlaying(false)});
$('glow').addEventListener('input',e=>{document.documentElement.style.setProperty('--cyan',`hsl(188 78% ${35+Number(e.target.value)*.2}%)`)});
$('visual-toggle').addEventListener('click',e=>{visualizer=!visualizer;e.currentTarget.classList.toggle('on',visualizer);$('spectrum').style.visibility=visualizer?'visible':'hidden';document.querySelector('.ticks').style.visibility=visualizer?'visible':'hidden'});
$('motion-toggle').addEventListener('click',e=>{const on=e.currentTarget.classList.toggle('on');document.body.classList.toggle('reduce-motion',on)});
for(let i=0;i<32;i++){const bar=document.createElement('i');bar.style.setProperty('--h',(15+Math.random()*85)+'%');$('spectrum').appendChild(bar)}
setInterval(()=>{if(!playing||!tracks.length)return;elapsed++;if(elapsed>=tracks[current].duration){if(repeat){elapsed=0}else if(shuffle){selectTrack(Math.floor(Math.random()*tracks.length));return}else{selectTrack(current+1);return}}$('seek').value=elapsed;$('current-time').textContent=fmt(elapsed);$('percent').textContent=Math.round(elapsed/tracks[current].duration*100)+'%';paintRange($('seek'));if(visualizer)$('spectrum').querySelectorAll('i').forEach(b=>b.style.setProperty('--h',(12+Math.random()*88)+'%'))},1000);
paintTrack();setPlaying(true);paintRange($('volume'));
