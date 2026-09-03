import React from 'react';
import {Composition, AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, registerRoot} from 'remotion';

const BG = '#0b0b0b';
const FG = '#f2eee7';
const MUTED = '#8b8780';
const ACCENT = '#d4642a';
const GRID = '#242321';

const Box = ({x, y, w, h, label, value, progress = 0}: {x:number;y:number;w:number;h:number;label:string;value:string;progress?:number}) => (
  <div style={{position:'absolute', left:x, top:y, width:w, height:h, border:`1px solid ${GRID}`, boxSizing:'border-box', padding:24, background:'#10100f'}}>
    <div style={{fontFamily:'Arial',fontSize:13,letterSpacing:2,color:MUTED}}>{label}</div>
    <div style={{fontFamily:'Georgia',fontSize:29,color:FG,marginTop:13}}>{value}</div>
    {progress > 0 && <div style={{position:'absolute',left:24,right:24,bottom:20,height:3,background:'#242321'}}><div style={{height:3,width:`${progress*100}%`,background:ACCENT}}/></div>}
  </div>
);

const Scene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cycle = frame % 240;
  const scene = Math.floor(cycle / 80);
  const local = cycle % 80;
  const enter = spring({frame:local, fps, config:{damping:18, stiffness:120}});
  const opacity = interpolate(local,[0,12],[0,1],{extrapolateRight:'clamp'});
  const x = interpolate(enter,[0,1],[45,0]);

  const scenes = [
    {title:'AI RECRUITER', sub:'structured candidate evaluation', nodes:['RESUME','PARSER','MATCH','RISK','DECISION']},
    {title:'AI OPS COPILOT', sub:'intent → plan → action → memory', nodes:['INPUT','INTENT','PLAN','EXECUTE','MEMORY']},
    {title:'DELIVERY', sub:'software that actually ships', nodes:['CODE','GIT','CI/CD','DOCKER','AWS']},
  ];
  const s = scenes[scene];
  const active = Math.min(4, Math.floor((local / 80) * 5));

  return <AbsoluteFill style={{background:BG,color:FG,fontFamily:'Arial',overflow:'hidden'}}>
    <div style={{position:'absolute',inset:0,backgroundImage:`linear-gradient(${GRID} 1px,transparent 1px),linear-gradient(90deg,${GRID} 1px,transparent 1px)`,backgroundSize:'80px 80px',opacity:.35}}/>
    <div style={{position:'absolute',left:70,top:55,fontSize:13,letterSpacing:4,color:MUTED}}>ANIKET / SYSTEMS MOTION / 001</div>
    <div style={{position:'absolute',right:70,top:55,fontSize:12,letterSpacing:2,color:MUTED}}>AI · SOFTWARE · SYSTEMS</div>
    <div style={{position:'absolute',left:70,top:145,opacity,transform:`translateX(${x}px)`}}>
      <div style={{fontSize:14,letterSpacing:3,color:ACCENT}}>SELECTED SYSTEM</div>
      <div style={{fontFamily:'Georgia',fontSize:64,marginTop:12}}>{s.title}</div>
      <div style={{fontSize:17,color:MUTED,marginTop:12}}>{s.sub}</div>
    </div>
    <div style={{position:'absolute',left:70,right:70,top:330,height:1,background:GRID}}/>
    <div style={{position:'absolute',left:70,top:380,display:'flex',alignItems:'center'}}>
      {s.nodes.map((node,i)=> <React.Fragment key={node}>
        <div style={{width:145,height:76,border:`1px solid ${i === active ? ACCENT : GRID}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,letterSpacing:2,color:i === active ? FG : MUTED,background:'#10100f'}}>{node}</div>
        {i < s.nodes.length-1 && <div style={{width:48,height:1,background:ACCENT,opacity:.7}}/>}
      </React.Fragment>)}
    </div>
    <Box x={70} y={540} w={260} h={130} label="STATUS" value={scene===2?'DEPLOYED':'RUNNING'} progress={(local+1)/80}/>
    <Box x={350} y={540} w={260} h={130} label="STAGE" value={`${String(scene+1).padStart(2,'0')} / 03`} />
    <Box x={630} y={540} w={260} h={130} label="MODE" value="INSPECTABLE" />
    <div style={{position:'absolute',right:70,bottom:55,fontSize:12,letterSpacing:2,color:MUTED}}>BUILD → TEST → BREAK → DEBUG → SHIP</div>
  </AbsoluteFill>;
};

export const RemotionRoot: React.FC = () => <Composition id="ProfileMotion" component={Scene} durationInFrames={240} fps={30} width={1000} height={760}/>;

registerRoot(RemotionRoot);
