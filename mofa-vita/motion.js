'use strict';
(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const control = document.querySelector('.motion-toggle');
  let paused = preference.matches;
  const canvas = document.querySelector('canvas.atmosphere');
  const context = canvas?.getContext('2d');
  let width = 1, height = 1, frame = 0, previous = 0, onscreen = true;
  const particles = Array.from({length:innerWidth < 600 ? 24 : 46}, (_,i) => ({x:((i*73+11)%101)/101,y:((i*43+7)%97)/97,r:0.5+(i%4)*0.38,s:0.006+(i%5)*0.002,phase:i*1.7}));
  function size() {
    if (!canvas || !context) return;
    const box = canvas.getBoundingClientRect(); width = box.width; height = box.height;
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.ceil(width*ratio); canvas.height = Math.ceil(height*ratio);
    context.setTransform(ratio,0,0,ratio,0,0);
  }
  function draw(now) {
    frame=0;
    if (paused || document.hidden || !onscreen || !context) return;
    const dt = previous ? Math.min((now-previous)/1000,0.05) : 0; previous=now;
    context.clearRect(0,0,width,height);
    for (const p of particles) {
      p.y-=p.s*dt; if(p.y < -0.03) p.y=1.03;
      const x=p.x*width+Math.sin(now/3500+p.phase)*14, y=p.y*height;
      context.globalAlpha=.2+(.5+.5*Math.sin(now/1600+p.phase))*.5;
      context.fillStyle=p.phase%3<1?'#e3b6f9':'#a7f8ff';
      context.shadowColor='#61ceff'; context.shadowBlur=8;
      context.beginPath(); context.arc(x,y,p.r,0,Math.PI*2); context.fill();
    }
    context.globalAlpha=1;frame=requestAnimationFrame(draw);
  }
  function run() {if(!frame&&!paused&&!document.hidden&&onscreen&&context){previous=0;frame=requestAnimationFrame(draw);}}
  function apply() {
    document.body.classList.toggle('motion-paused',paused);
    control.setAttribute('aria-pressed',String(paused));
    control.setAttribute('aria-label',window.siteI18n.t(paused?'开启页面动效':'暂停页面动效'));
    control.textContent=window.siteI18n.t(paused?'开启动效':'暂停动效');
    if(paused){cancelAnimationFrame(frame);frame=0;context?.clearRect(0,0,width,height);}
    else run();
  }
  document.addEventListener('languagechange', apply);
  control.addEventListener('click',()=>{paused=!paused;apply();});
  preference.addEventListener('change',()=>{paused=preference.matches;apply();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else run();});
  if(canvas&&context){size();new ResizeObserver(size).observe(canvas);new IntersectionObserver(entries=>{onscreen=entries[0].isIntersecting;if(!onscreen){cancelAnimationFrame(frame);frame=0;}else run();}).observe(canvas);}
  document.querySelectorAll('[data-tilt]').forEach(el=>{
    let pointerFrame=0;
    el.addEventListener('pointermove',event=>{
      if(paused||!finePointer.matches||pointerFrame)return;
      const x=event.clientX,y=event.clientY;
      pointerFrame=requestAnimationFrame(()=>{const b=el.getBoundingClientRect();el.style.setProperty('--tilt-x',`${-(y-b.top-b.height/2)/b.height*7}deg`);el.style.setProperty('--tilt-y',`${(x-b.left-b.width/2)/b.width*9}deg`);el.style.setProperty('--shine-x',`${(x-b.left)/b.width*100}%`);pointerFrame=0;});
    });
    el.addEventListener('pointerleave',()=>{cancelAnimationFrame(pointerFrame);pointerFrame=0;el.style.setProperty('--tilt-x','0deg');el.style.setProperty('--tilt-y','0deg');});
  });
  const hero=document.querySelector('.hero');
  if(hero){let pointerFrame=0;hero.addEventListener('pointermove',e=>{if(paused||!finePointer.matches||pointerFrame)return;const x=e.clientX,y=e.clientY;pointerFrame=requestAnimationFrame(()=>{const b=hero.getBoundingClientRect();hero.style.setProperty('--parallax-x',`${(x-b.left-b.width/2)*.018}px`);hero.style.setProperty('--parallax-y',`${(y-b.top-b.height/2)*.012}px`);hero.style.setProperty('--pointer-x',`${(x-b.left)/b.width*100}%`);hero.style.setProperty('--pointer-y',`${(y-b.top)/b.height*100}%`);pointerFrame=0;});});hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--parallax-x','0px');hero.style.setProperty('--parallax-y','0px');});}
  let scrollFrame=0;
  function progress(){const range=document.documentElement.scrollHeight-innerHeight;document.querySelector('.reading-progress').style.transform=`scaleX(${range>0?scrollY/range:0})`;scrollFrame=0;}
  addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(progress);},{passive:true});addEventListener('resize',progress);progress();
  if(!preference.matches&&'IntersectionObserver' in window){
    const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('motion-visible');reveal.unobserve(e.target);}}),{threshold:.1});
    document.querySelectorAll('.project-layout,.gallery-item,.history-entry,.section-heading,.steps').forEach((el,i)=>{el.classList.add('motion-reveal');el.style.setProperty('--reveal-delay',`${i%2*90}ms`);reveal.observe(el);});
  }
  apply();
})();
