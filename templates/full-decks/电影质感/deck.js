const slides=[...document.querySelectorAll('.slide')];const dots=document.querySelector('.dots');let idx=0;slides.forEach((_,i)=>{const d=document.createElement('div');d.className='dot'+(i===0?' active':'');d.onclick=()=>go(i);dots.appendChild(d)});const dotEls=[...document.querySelectorAll('.dot')];function render(){slides.forEach((s,i)=>{s.classList.remove('active','prev','next');if(i===idx)s.classList.add('active');else if(i<idx)s.classList.add('prev');else s.classList.add('next')});dotEls.forEach((d,i)=>d.classList.toggle('active',i===idx));
  // 第一页人物图：每次切回第一页时重新播放入场动画，结束后追加呼吸动效
  const fig=document.querySelector('.cover-figure');
  if(fig){
    if(idx===0){
      // 重置动画：先移除loaded类和动画，强制reflow，再重新添加
      fig.classList.remove('loaded');
      fig.style.animation='none';
      fig.style.opacity='0';
      fig.style.transform='translateX(80px) translateY(18px) scale(0.96)';
      fig.style.filter='brightness(1.35) blur(12px) drop-shadow(-12px 0 40px rgba(0,0,0,.55))';
      void fig.offsetWidth; // trigger reflow
      fig.style.animation='';
      fig.style.opacity='';
      fig.style.transform='';
      fig.style.filter='';
      // 入场动画时长2.4s + delay 0.9s = 3.3s后加loaded类触发呼吸
      clearTimeout(fig._breathTimer);
      fig._breathTimer=setTimeout(()=>fig.classList.add('loaded'),2600);
    } else {
      clearTimeout(fig._breathTimer);
      fig.classList.remove('loaded');
    }
  }
}function go(i){idx=(i+slides.length)%slides.length;render()}document.querySelector('#prev').onclick=()=>go(idx-1);document.querySelector('#next').onclick=()=>go(idx+1);window.addEventListener('keydown',e=>{if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();go(idx+1)} if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();go(idx-1)}});let startX=0;window.addEventListener('pointerdown',e=>startX=e.clientX);window.addEventListener('pointerup',e=>{let dx=e.clientX-startX;if(Math.abs(dx)>60)go(idx+(dx<0?1:-1))});render();

// MediaPipe Hands 手势翻页：检测手掌中心点的横向轨迹。右挥下一页。
const gestureBtn=document.getElementById('gestureToggle');
const gestureStatus=document.getElementById('gestureStatus');
const gestureVideo=document.getElementById('gestureVideo');
const gestureCanvas=document.getElementById('gestureCanvas');
const gestureCtx=gestureCanvas.getContext('2d');
const gesturePreview=document.getElementById('gesturePreview');
const gestureLabel=document.getElementById('gestureLabel');
const gestureFlash=document.getElementById('gestureFlash');
let mpHands=null, mpCamera=null, gestureOn=false, wristHistory=[], lastGestureAt=0;
function setGestureStatus(text,on=false){gestureStatus.textContent=text;gestureStatus.classList.toggle('on',on)}
function flashGesture(){gestureFlash.classList.add('show');setTimeout(()=>gestureFlash.classList.remove('show'),220)}
const handConnections=[[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[0,17]];
function resizeGestureCanvas(){const r=gestureCanvas.getBoundingClientRect();const dpr=window.devicePixelRatio||1;gestureCanvas.width=Math.max(1,Math.round(r.width*dpr));gestureCanvas.height=Math.max(1,Math.round(r.height*dpr));gestureCtx.setTransform(dpr,0,0,dpr,0,0)}
function drawHandOverlay(results){resizeGestureCanvas();const w=gestureCanvas.clientWidth,h=gestureCanvas.clientHeight;gestureCtx.clearRect(0,0,w,h);const hands=results.multiHandLandmarks||[];if(!hands.length){gestureLabel.textContent=gestureOn?'未识别到手':'摄像头预览 / 手部识别';return}gestureLabel.textContent='已识别到手 · 可向右挥动';const lm=hands[0];gestureCtx.lineWidth=2;gestureCtx.strokeStyle='rgba(234,215,168,.95)';gestureCtx.fillStyle='rgba(9,252,60,.88)';for(const [a,b] of handConnections){gestureCtx.beginPath();gestureCtx.moveTo((1-lm[a].x)*w,lm[a].y*h);gestureCtx.lineTo((1-lm[b].x)*w,lm[b].y*h);gestureCtx.stroke()}for(const p of lm){gestureCtx.beginPath();gestureCtx.arc((1-p.x)*w,p.y*h,3.2,0,Math.PI*2);gestureCtx.fill()}}
function resetGestureHistory(){wristHistory=[]}
function stopGesture(){gestureOn=false;resetGestureHistory();try{if(mpCamera&&mpCamera.stop)mpCamera.stop()}catch(e){};if(gestureVideo.srcObject){gestureVideo.srcObject.getTracks().forEach(t=>t.stop());gestureVideo.srcObject=null}gesturePreview.classList.add('off');gestureLabel.textContent='摄像头预览 / 手部识别';gestureCtx.clearRect(0,0,gestureCanvas.clientWidth,gestureCanvas.clientHeight);gestureBtn.textContent='开启 MediaPipe 向右手势';setGestureStatus('MediaPipe Hands 未开启',false)}
function onHandsResults(results){
  if(!gestureOn)return;
  drawHandOverlay(results);
  const hands=results.multiHandLandmarks||[];
  if(!hands.length){resetGestureHistory();return}
  const lm=hands[0];
  const palmPts=[lm[0],lm[5],lm[9],lm[13],lm[17]];
  const cx=palmPts.reduce((a,p)=>a+p.x,0)/palmPts.length;
  const cy=palmPts.reduce((a,p)=>a+p.y,0)/palmPts.length;
  const now=performance.now();
  wristHistory.push({x:cx,y:cy,t:now});
  wristHistory=wristHistory.filter(p=>now-p.t<700).slice(-12);
  if(wristHistory.length<4||now-lastGestureAt<750){setGestureStatus('已识别到手：请向右挥动',true);return;}
  const first=wristHistory[0], last=wristHistory[wristHistory.length-1];
  const dx=last.x-first.x;
  const dy=last.y-first.y;
  const span=last.t-first.t;
  const isRight=dx>.06&&Math.abs(dy)<.24&&span<700;
    if(isRight){
    go(idx+1);
    lastGestureAt=now;
    resetGestureHistory();
    flashGesture();
    setGestureStatus('MediaPipe：右挥，下一页',true);
    setTimeout(()=>gestureOn&&setGestureStatus('已开启：向右挥动换下一页',true),900);
    }else{
    const dir=dx>=0?'右':'左';
    setGestureStatus(`已识别到手：${dir}向位移 ${Math.abs(dx).toFixed(2)} / 触发需 0.06`,true);
    }
}
async function startGesture(){try{if(!window.Hands||!window.Camera){setGestureStatus('MediaPipe 脚本未加载，请联网后刷新',false);return}gestureOn=true;gesturePreview.classList.remove('off');resizeGestureCanvas();gestureBtn.textContent='关闭 MediaPipe 手势';setGestureStatus('正在启动 MediaPipe Hands…',true);mpHands=new Hands({locateFile:file=>`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});mpHands.setOptions({maxNumHands:1,modelComplexity:1,minDetectionConfidence:.5,minTrackingConfidence:.5});mpHands.onResults(onHandsResults);mpCamera=new Camera(gestureVideo,{onFrame:async()=>{if(gestureOn&&mpHands)await mpHands.send({image:gestureVideo})},width:640,height:360});await mpCamera.start();setGestureStatus('已开启：向右挥动换下一页',true)}catch(err){gestureOn=false;gestureBtn.textContent='开启 MediaPipe 向右手势';setGestureStatus('无法开启：请检查摄像头权限或网络',false)}}
gestureBtn&&gestureBtn.addEventListener('click',()=>gestureOn?stopGesture():startGesture());
window.addEventListener('beforeunload',stopGesture);

// 注入演讲模式与快捷键
document.addEventListener('keydown', (e) => {
  if(e.key === 's' || e.key === 'S') {
    document.body.classList.toggle('presenter-mode');
  }
  if(e.key === 'g' || e.key === 'G') {
    if(typeof gestureOn !== 'undefined') {
      if(gestureOn) stopGesture();
      else startGesture();
    }
  }
});

// 注入编辑模式
import('./edit-mode.js').then(({ installEditMode }) => {
  installEditMode({
    root: document,
    editableSelector: "[data-editable], h1, b, span, p, .bodycopy, .kicker, .keywords, .page, .notes",
    layoutSelector: ".slide, .compare > div, .rulebox, h1, .bodycopy"
  });
}).catch(e => console.log('Edit mode not loaded:', e));
