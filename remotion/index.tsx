import React from 'react';
import {
  AbsoluteFill,
  Composition,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  registerRoot,
} from 'remotion';

const BG = '#0b0b0b';
const PANEL = '#10100f';
const FG = '#f2eee7';
const MUTED = '#8b8780';
const ACCENT = '#d4642a';
const GRID = '#242321';
const BLUE = '#7aa2c7';

const fade = (frame: number, start = 0, end = 12) =>
  interpolate(frame, [start, end], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

const Slide = ({children, delay = 0}: {children: React.ReactNode; delay?: number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = Math.max(0, frame - delay);
  const y = interpolate(spring({frame: f, fps, config: {damping: 18, stiffness: 120}}), [0, 1], [24, 0]);
  return <div style={{opacity: fade(f), transform: `translateY(${y}px)`}}>{children}</div>;
};

const Header = ({index, label}: {index: string; label: string}) => (
  <>
    <div style={{position: 'absolute', left: 58, top: 42, fontSize: 11, letterSpacing: 3, color: MUTED}}>
      ANIKET PANDEY / {index}
    </div>
    <div style={{position: 'absolute', right: 58, top: 42, fontSize: 11, letterSpacing: 2, color: MUTED}}>{label}</div>
  </>
);

const Line = ({x1, y1, x2, y2, progress, color = ACCENT}: {x1:number;y1:number;x2:number;y2:number;progress:number;color?:string}) => (
  <line x1={x1} y1={y1} x2={x1 + (x2-x1)*progress} y2={y1 + (y2-y1)*progress} stroke={color} strokeWidth="2" />
);

const AIArchitecture = () => {
  const frame = useCurrentFrame();
  const t = frame % 240;
  const phase = Math.floor(t / 60);
  const local = t % 60;
  const nodes = [
    ['INPUT', 90, 330],
    ['INTENT', 270, 220],
    ['PLAN', 450, 330],
    ['TOOLS', 630, 220],
    ['MEMORY', 810, 330],
  ] as const;
  const active = phase;
  return <AbsoluteFill style={{background: BG, color: FG, fontFamily: 'Arial'}}>
    <Header index="01" label="AI SYSTEM / INSPECTABLE" />
    <div style={{position:'absolute',left:58,top:105}}><div style={{fontSize:13,letterSpacing:3,color:ACCENT}}>AI ARCHITECTURE</div><div style={{fontFamily:'Georgia',fontSize:48,marginTop:10}}>Give the model a job.</div></div>
    <div style={{position:'absolute',left:58,top:185,fontSize:15,color:MUTED}}>Models become useful when they sit inside a system with context, tools, validation and memory.</div>
    <svg width="1000" height="760" style={{position:'absolute',inset:0}}>
      {nodes.slice(0,-1).map((n,i)=><Line key={i} x1={n[1]+110} y1={n[2]+35} x2={nodes[i+1][1]} y2={nodes[i+1][2]+35} progress={interpolate(local,[0,30],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}/>) }
    </svg>
    {nodes.map(([name,x,y],i)=><div key={name} style={{position:'absolute',left:x,top:y,width:110,height:70,border:`1px solid ${i===active?ACCENT:GRID}`,background:PANEL,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,letterSpacing:2,color:i===active?FG:MUTED}}>{name}</div>)}
    <div style={{position:'absolute',left:58,right:58,bottom:58,borderTop:`1px solid ${GRID}`,paddingTop:18,fontSize:11,letterSpacing:2,color:MUTED}}>CONTEXT → ORCHESTRATION → TOOLS → VALIDATION → MEMORY</div>
  </AbsoluteFill>;
};

const Delivery = () => {
  const frame = useCurrentFrame();
  const t = frame % 210;
  const step = Math.floor(t / 42);
  const progress = interpolate(t % 42,[0,34],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const stages = ['CODE','GIT','CI/CD','DOCKER','AWS'];
  return <AbsoluteFill style={{background:BG,color:FG,fontFamily:'Arial'}}>
    <Header index="02" label="DELIVERY / SHIP" />
    <div style={{position:'absolute',left:58,top:105}}><div style={{fontSize:13,letterSpacing:3,color:BLUE}}>DELIVERY PIPELINE</div><div style={{fontFamily:'Georgia',fontSize:48,marginTop:10}}>Software has to leave the laptop.</div></div>
    <div style={{position:'absolute',left:58,top:185,fontSize:15,color:MUTED}}>A small visual trace of how an idea becomes something deployable.</div>
    <div style={{position:'absolute',left:80,top:335,right:80,height:90,display:'flex',alignItems:'center'}}>
      {stages.map((stage,i)=><React.Fragment key={stage}>
        <div style={{width:125,height:72,border:`1px solid ${i===step?ACCENT:GRID}`,background:PANEL,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,letterSpacing:2,color:i===step?FG:MUTED}}>{stage}</div>
        {i<4&&<div style={{flex:1,height:2,background: i<step?ACCENT:GRID,position:'relative'}}><div style={{position:'absolute',left:0,top:-3,width:`${i===step?progress*100:(i<step?100:0)}%`,height:8,background:ACCENT}}/></div>}
      </React.Fragment>)}
    </div>
    <div style={{position:'absolute',left:80,top:470,fontFamily:'monospace',fontSize:12,color:MUTED,lineHeight:2}}>
      <div><span style={{color:ACCENT}}>✓</span> source committed</div><div><span style={{color:ACCENT}}>✓</span> checks executed</div><div><span style={{color:ACCENT}}>✓</span> container built</div><div><span style={{color:ACCENT}}>→</span> deployment target selected</div>
    </div>
    <div style={{position:'absolute',right:80,bottom:70,fontSize:11,letterSpacing:2,color:MUTED}}>BUILD → TEST → PACKAGE → DEPLOY</div>
  </AbsoluteFill>;
};

const Debugging = () => {
  const frame = useCurrentFrame();
  const t = frame % 240;
  const row = Math.min(3, Math.floor(t / 55));
  const items = [
    ['SCROLL', 'orphaned event listener', 'lifecycle cleanup'],
    ['VIDEO', 'duplicate preload', 'asset mismatch'],
    ['DEPLOY', 'missing runtime config', 'environment'],
    ['CMS', 'source/build/runtime drift', 'trace the path'],
  ];
  return <AbsoluteFill style={{background:BG,color:FG,fontFamily:'Arial'}}>
    <Header index="03" label="ENGINEERING LOG / DEBUG" />
    <div style={{position:'absolute',left:58,top:105}}><div style={{fontSize:13,letterSpacing:3,color:ACCENT}}>DEBUGGING LOG</div><div style={{fontFamily:'Georgia',fontSize:48,marginTop:10}}>The bug is rarely where it hurts.</div></div>
    <div style={{position:'absolute',left:58,top:185,fontSize:15,color:MUTED}}>Real failures are useful because they force the whole system to become visible.</div>
    <div style={{position:'absolute',left:58,right:58,top:275}}>
      {items.map(([area, symptom, cause],i)=><div key={area} style={{height:82,borderTop:`1px solid ${GRID}`,display:'grid',gridTemplateColumns:'130px 1fr 260px',alignItems:'center',opacity:i<=row?1:.25,transition:'none'}}><div style={{fontSize:11,letterSpacing:2,color:i===row?ACCENT:MUTED}}>{area}</div><div style={{fontFamily:'monospace',fontSize:13}}>{symptom}</div><div style={{fontSize:12,color:MUTED}}>{cause}</div></div>)}
    </div>
    <div style={{position:'absolute',left:58,bottom:72,fontSize:12,color:MUTED}}>OBSERVE THE SYMPTOM → TRACE THE SYSTEM → FIX THE CAUSE</div>
  </AbsoluteFill>;
};

const BuildTimeline = () => {
  const frame = useCurrentFrame();
  const t = frame % 240;
  const reveal = interpolate(t,[0,180],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const projects = [
    ['AI RECRUITER', 'candidate analysis / structured output'],
    ['AI OPS', 'intent / planning / execution / memory'],
    ['AG MAKEUP STUDIO', 'motion / CMS / production frontend'],
    ['INFRASTRUCTURE', 'Git / CI/CD / Docker / AWS'],
  ];
  return <AbsoluteFill style={{background:BG,color:FG,fontFamily:'Arial'}}>
    <Header index="04" label="BUILD HISTORY / 004" />
    <div style={{position:'absolute',left:58,top:105}}><div style={{fontSize:13,letterSpacing:3,color:BLUE}}>SELECTED BUILDS</div><div style={{fontFamily:'Georgia',fontSize:48,marginTop:10}}>Different problems. Same loop.</div></div>
    <div style={{position:'absolute',left:90,top:270,width:820,height:2,background:GRID}}><div style={{width:`${reveal*100}%`,height:2,background:ACCENT}}/></div>
    {projects.map(([name,desc],i)=>{
      const x=90+i*240;
      const p=interpolate(reveal,[i*.22,Math.min(1,i*.22+.28)],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
      return <div key={name} style={{position:'absolute',left:x,top:250,opacity:p,transform:`translateY(${(1-p)*20}px)`}}><div style={{width:18,height:18,borderRadius:20,background:i===3?BLUE:ACCENT,border:`4px solid ${BG}`}}/><div style={{marginTop:28,fontSize:12,letterSpacing:1}}>{name}</div><div style={{marginTop:10,width:185,fontSize:11,lineHeight:1.6,color:MUTED}}>{desc}</div></div>;
    })}
    <div style={{position:'absolute',left:58,right:58,bottom:65,borderTop:`1px solid ${GRID}`,paddingTop:18,fontSize:11,letterSpacing:2,color:MUTED}}>PROBLEM → PROTOTYPE → SYSTEM → INTERFACE → SHIP → LEARN</div>
  </AbsoluteFill>;
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="AIArchitecture" component={AIArchitecture} durationInFrames={240} fps={30} width={1000} height={760}/>
    <Composition id="DeliveryPipeline" component={Delivery} durationInFrames={210} fps={30} width={1000} height={760}/>
    <Composition id="DebuggingLog" component={Debugging} durationInFrames={240} fps={30} width={1000} height={760}/>
    <Composition id="BuildTimeline" component={BuildTimeline} durationInFrames={240} fps={30} width={1000} height={760}/>
  </>
);

registerRoot(RemotionRoot);
