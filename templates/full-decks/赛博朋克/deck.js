const slides = Array.from(document.querySelectorAll('.slide'));
const prevBtn = document.querySelector('#prevBtn');
const nextBtn = document.querySelector('#nextBtn');
const speakerBtn = document.querySelector('#speakerBtn');
const counter = document.querySelector('#counter');
const progressBar = document.querySelector('#progressBar');
const speakerPanel = document.querySelector('#speakerPanel');
const speakerTitle = document.querySelector('#speakerTitle');
const speakerNext = document.querySelector('#speakerNext');
const timer = document.querySelector('#timer');
let current = 0;
const start = Date.now();
function showSlide(index){
  current = Math.max(0, Math.min(index, slides.length - 1));
  slides.forEach((s,i)=>s.classList.toggle('active', i===current));
  const active = slides[current];
  const next = slides[current+1];
  counter.textContent = `${current+1} / ${slides.length}`;
  progressBar.style.width = `${((current+1)/slides.length)*100}%`;
  speakerTitle.textContent = active.dataset.title || '';
  speakerNext.textContent = next?.dataset.title || '结束';
  document.title = `${current+1}. ${active.dataset.title || 'Deck'}`;
}
prevBtn.addEventListener('click',()=>showSlide(current-1));
nextBtn.addEventListener('click',()=>showSlide(current+1));
speakerBtn.addEventListener('click',()=>speakerPanel.classList.toggle('open'));
document.addEventListener('keydown',(e)=>{
  if(['ArrowRight','PageDown',' '].includes(e.key)){ e.preventDefault(); showSlide(current+1); }
  if(['ArrowLeft','PageUp'].includes(e.key)){ e.preventDefault(); showSlide(current-1); }
  if(e.key.toLowerCase()==='s') speakerPanel.classList.toggle('open');
  if(e.key==='Home') showSlide(0);
  if(e.key==='End') showSlide(slides.length-1);
});
setInterval(()=>{
  const elapsed=Math.floor((Date.now()-start)/1000);
  timer.textContent = `${String(Math.floor(elapsed/60)).padStart(2,'0')}:${String(elapsed%60).padStart(2,'0')}`;
},1000);
showSlide(0);
