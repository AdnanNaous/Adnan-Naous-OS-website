import type { Chapter } from "../motion/runtime";
import type { SceneInput } from "./scenes";
import { terrainVertices } from "./scenes/terrain";

// Small native WebGL scene: static relief, an extruded seal and architectural fins.
// The shader handles perspective, depth, normals and light; HTML remains the interface.
const skyVertex = `attribute vec2 position; varying vec2 uv;
void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
const skyFragment = `precision mediump float;
varying vec2 uv; uniform vec2 resolution; uniform float time; uniform vec2 pointer;
uniform float energy; uniform float exposure; uniform float cut;
void main(){
 vec2 p=vec2(uv.x,1.-uv.y); float aspect=resolution.x/resolution.y;
 vec2 q=(p-vec2(.77,.34))*vec2(aspect,1.);
 vec3 color=vec3(.026,.031,.032);
 float fog=exp(-dot(q,q)*4.5);
 color+=vec3(.032,.038,.038)*fog;
 // Muted amber spirit light and cyan glass catch the same mouse spotlight.
 vec2 light=(p-(pointer*.5+.5))*vec2(aspect,1.);
 float spot=exp(-dot(light,light)*8.);
 color+=vec3(.032,.06,.067)*spot*energy;
 float shaft=pow(max(0.,1.-abs(p.x-.82+(p.y-.15)*.24)*5.),6.);
 color+=vec3(.056,.044,.029)*shaft*(.55+.15*sin(time*.25))*exposure;
 vec2 grid=abs(fract(p*resolution/14.)-.5);
 float dotGrid=(1.-step(.055,grid.x))*(1.-step(.055,grid.y));
 color+=vec3(.02)*dotGrid;
 // Finite iris shading during chapter camera moves, never a fullscreen flash.
 float vignette=smoothstep(.95,.17,length((p-.5)*vec2(.8,1.)));
 color*=.6+.4*vignette;
 color*=1.-cut*.15;
 gl_FragColor=vec4(color,1.);
}`;
const worldVertex = `precision highp float;
attribute vec3 position; attribute vec3 normal; attribute vec3 material;
uniform vec2 resolution; uniform float time; uniform vec2 pointer;
uniform float energy; uniform float exposure; uniform vec4 camera;
uniform mediump float mode; uniform float still;
varying mediump vec3 tint; varying mediump float alpha; varying mediump float fringe;
void main(){
 float yaw=camera.x+sin(time*.105)*.065+pointer.x*.054;
 float co=cos(yaw),si=sin(yaw);
 vec3 p=position;
 float breath=sin(time*.24);
 if(mode<.5)p.z+=breath*material.y*.022*(1.-still);
 float x=p.x*co+(p.y-1.)*si;
 float z=(p.y-1.)*co-p.x*si+1.;
 float perspective=1./(1.+z*.55);
 float width=resolution.x/resolution.y<.9?1030.:1360.;
 float depth=1.-material.z/10.;
 float px=540.+x*width*.38*perspective+pointer.x*18.*(.4+depth*1.6);
 float py=490.+z*300.*perspective-p.z*420.*perspective+pointer.y*3.84+breath*12.*(1.-still);
 vec2 screen=vec2(px,py);
 screen=(screen-vec2(600.,420.))*camera.w+vec2(600.+camera.y,420.+camera.z);
 float aspect=resolution.x/resolution.y;
 // Change framing on portrait screens, never stretch the seal or its perspective.
 if(mode>.5)screen.x-=aspect<.9?300.:65.;
 gl_Position=vec4((screen.x-600.)/(400.*aspect),1.-screen.y/400.,clamp(z*.22-.4,-.9,.9),1.);
 vec3 sun=normalize(vec3(-.35,1.2,.55));
 vec3 lamp=normalize(vec3(pointer.x,1.2,pointer.y+.5));
 float incidence=max(0.,dot(normal,lamp));
 float radius=min(260.,240.*aspect);
 vec2 distance=(screen-vec2(600.+pointer.x*400.*aspect,400.+pointer.y*400.))/vec2(radius);
 float spot=max(0.,1.-dot(distance,distance));
 float spec=pow(incidence,8.)*spot*energy;
 float diffuse=max(0.,dot(normal,sun));
 float brightness=clamp(material.x+spot*incidence*.25*energy+spec*.3,0.,1.);
 vec3 silver=mix(vec3(.23,.29,.30),vec3(.88,.95,.93),brightness);
 float reading=mix(.52,.97,smoothstep(0.,1200.,screen.x));
 float fog=1.-z*.13;
 tint=silver*exposure*reading*fog;
 if(mode>.5)tint=mix(vec3(.20,.22,.22),vec3(.56,.52,.42),diffuse*.65+spec*.5)*reading*exposure;
 fringe=spot*energy*.7;
 alpha=mode>1.5?.6:1.;
 gl_PointSize=(.8+perspective*.8)*(brightness>.6?1.1:1.)*resolution.y/800.*camera.w;
}`;
const worldFragment = `precision mediump float; uniform float mode;
varying vec3 tint; varying float alpha; varying float fringe;
void main(){
 vec3 color=tint;
 if(mode<.5){
  vec2 p=gl_PointCoord-.5;
  float shape=1.-smoothstep(.38,.52,length(p));
  color+=vec3(.05,.20,.22)*fringe*(1.-smoothstep(-.5,.5,p.x));
  color+=vec3(.15,.03,.09)*fringe*smoothstep(-.5,.5,p.x);
  gl_FragColor=vec4(color,shape);
 }else gl_FragColor=vec4(color,alpha);
}`;

type Program = { handle: WebGLProgram; uniforms: Map<string, WebGLUniformLocation | null> };
type Resource = { sky: Program; world: Program; quad: WebGLBuffer; relief: WebGLBuffer; solids: WebGLBuffer; seal: WebGLBuffer; points: number; triangles: number; lines: number };

function geometry() {
  const solids: number[] = [], lines: number[] = [];
  const vertex=(out:number[],x:number,z:number,h:number,nx=0,ny=1,nz=0)=>out.push(x,z,h,nx,ny,nz,.65,0,5);
  // Architectural ribs rise behind the terrain, with front/side planes and real depth.
  for(let i=0;i<7;i++){
    const x=.55+i*.19,z=.45+i*.12,h=.65+Math.sin(i*.5)*.35,w=.035;
    const faces=[
      [[x,z,0],[x+w,z,0],[x+w,z,h],[x,z,h]],
      [[x+w,z,0],[x+w,z+.13,0],[x+w,z+.13,h],[x+w,z,h]],
    ];
    faces.forEach((face,index)=>[0,1,2,0,2,3].forEach(n=>vertex(solids,...face[n] as [number,number,number],index?1:0,index?0:1,0)));
  }
  // Concentric extruded rings, not a flat background image. Etched ticks resemble an instrument seal.
  for(let ring=0;ring<3;ring++)for(let i=0;i<128;i++){
    const radius=.38+ring*.055,depth=.10+ring*.035;
    for(const step of [i,i+1]){
      const a=step/128*Math.PI*2;
      vertex(lines,1.12+Math.cos(a)*radius,.28+Math.sin(a)*.12+depth,.64+Math.sin(a)*radius);
    }
    if(ring===2&&i%4===0){
      const a=i/128*Math.PI*2;
      for(const r of [radius,radius+.027])vertex(lines,1.12+Math.cos(a)*r,.28+Math.sin(a)*.12+depth,.64+Math.sin(a)*r);
    }
  }
  // An abstract eye suspended in the seal, authored from curves rather than copied game artwork.
  for(let side=0;side<2;side++)for(let i=0;i<48;i++)for(const j of [i,i+1]){
    const a=j/48*Math.PI;
    vertex(lines,1.12+Math.cos(a)*.31,.47,.64+Math.sin(a)*.13*(side?1:-1));
  }
  for(let i=0;i<64;i++)for(const j of [i,i+1]){
    const a=j/64*Math.PI*2;vertex(lines,1.12+Math.cos(a)*.074,.48,.64+Math.sin(a)*.074);
  }
  return {solids:new Float32Array(solids),seal:new Float32Array(lines)};
}

/** Null means WebGL is unavailable; the caller keeps the existing 2D scene. */
export function createGpuScene(canvas: HTMLCanvasElement, onLost: () => void, onRestored: () => void) {
  const gl=canvas.getContext("webgl",{alpha:false,antialias:false,depth:true,powerPreference:"default",preserveDrawingBuffer:false});
  if(!gl)return null;
  let resource: Resource | null=null,disposed=false;
  const shaders: WebGLShader[]=[],programs: WebGLProgram[]=[],buffers: WebGLBuffer[]=[];
  const release=()=>{
    buffers.forEach(b=>gl.deleteBuffer(b)); programs.forEach(p=>gl.deleteProgram(p)); shaders.forEach(s=>gl.deleteShader(s));
    buffers.length=programs.length=shaders.length=0;resource=null;
  };
  const compile=(type:number,source:string)=>{
    const s=gl.createShader(type);if(!s)throw new Error("shader allocation");shaders.push(s);
    gl.shaderSource(s,source);gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s)||"shader compile");return s;
  };
  const program=(vs:string,fs:string):Program=>{
    const p=gl.createProgram();if(!p)throw new Error("program allocation");programs.push(p);
    gl.attachShader(p,compile(gl.VERTEX_SHADER,vs));gl.attachShader(p,compile(gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);
    if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p)||"program link");
    return {handle:p,uniforms:new Map()};
  };
  const buffer=(data:Float32Array)=>{const b=gl.createBuffer();if(!b)throw new Error("buffer allocation");buffers.push(b);gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);return b;};
  const init=()=>{
    release();const relief=terrainVertices(),{solids,seal}=geometry();
    resource={sky:program(skyVertex,skyFragment),world:program(worldVertex,worldFragment),quad:buffer(new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1])),relief:buffer(relief),solids:buffer(solids),seal:buffer(seal),points:relief.length/9,triangles:solids.length/9,lines:seal.length/9};
  };
  const location=(p:Program,name:string)=>{if(!p.uniforms.has(name))p.uniforms.set(name,gl.getUniformLocation(p.handle,name));return p.uniforms.get(name)!;};
  const lost=(event:Event)=>{
    event.preventDefault();resource=null;
    // The browser already invalidated these objects; deleting them after restore
    // would operate on handles belonging to the old context generation.
    buffers.length=programs.length=shaders.length=0;onLost();
  };
  const restored=()=>{if(disposed)return;try{init();onRestored();}catch{release();onLost();}};
  try{init();}catch{release();gl.getExtension("WEBGL_lose_context")?.loseContext();return null;}
  canvas.addEventListener("webglcontextlost",lost);canvas.addEventListener("webglcontextrestored",restored);
  return {
    render(input:SceneInput,camera:readonly number[],cut:number){
      if(!resource||gl.isContextLost())return false;
      const r=resource; gl.viewport(0,0,canvas.width,canvas.height);gl.clear(gl.DEPTH_BUFFER_BIT);
      gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);
      gl.useProgram(r.sky.handle);gl.bindBuffer(gl.ARRAY_BUFFER,r.quad);
      const pos=gl.getAttribLocation(r.sky.handle,"position");gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
      gl.uniform2f(location(r.sky,"resolution"),canvas.width,canvas.height);
      gl.uniform1f(location(r.sky,"time"),input.time);gl.uniform2f(location(r.sky,"pointer"),input.pointerX/18,input.pointerY/12);
      gl.uniform1f(location(r.sky,"energy"),input.pointerForce||0);gl.uniform1f(location(r.sky,"exposure"),input.exposure??.82);gl.uniform1f(location(r.sky,"cut"),cut);
      gl.drawArrays(gl.TRIANGLES,0,6);gl.disableVertexAttribArray(pos);
      gl.useProgram(r.world.handle);gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
      gl.uniform2f(location(r.world,"resolution"),canvas.width,canvas.height);gl.uniform1f(location(r.world,"time"),input.time);
      gl.uniform2f(location(r.world,"pointer"),input.pointerX/18,input.pointerY/12);gl.uniform1f(location(r.world,"energy"),input.pointerForce||0);
      gl.uniform1f(location(r.world,"exposure"),input.exposure??.82);gl.uniform1f(location(r.world,"still"),input.reduced||input.quiet?1:0);
      gl.uniform4f(location(r.world,"camera"),camera[0],camera[1],camera[2],camera[3]);
      const attributes=["position","normal","material"].map(n=>gl.getAttribLocation(r.world.handle,n));
      const draw=(b:WebGLBuffer,mode:number,count:number,materialMode:number)=>{
        gl.bindBuffer(gl.ARRAY_BUFFER,b);attributes.forEach((a,i)=>{gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,3,gl.FLOAT,false,36,i*12);});
        gl.uniform1f(location(r.world,"mode"),materialMode);gl.drawArrays(mode,0,count);
      };
      draw(r.solids,gl.TRIANGLES,r.triangles,1);draw(r.seal,gl.LINES,r.lines,2);draw(r.relief,gl.POINTS,r.points,0);
      attributes.forEach(a=>gl.disableVertexAttribArray(a));return true;
    },
    dispose(){disposed=true;canvas.removeEventListener("webglcontextlost",lost);canvas.removeEventListener("webglcontextrestored",restored);release();gl.getExtension("WEBGL_lose_context")?.loseContext();},
  };
}

// The sequence shares the same landscape: establish, discover, build, reconnect.
export const chapterCamera: Record<Chapter,readonly number[]>={
  home:[0,0,0,1],brain:[-.14,30,30,1.04],work:[.12,-28,12,1.08],
  now:[.06,-10,-12,1.02],codex:[-.07,15,8,1.04],about:[0,0,0,1],contact:[.16,-18,16,1.04],
};
export const storyCamera=[[-.19,38,22,1.02],[.17,-34,12,1.06],[.07,-20,-18,1.13],[-.05,12,0,1.02]];
