import { useState } from "react";
import { Play, SkipBack, SkipForward, Pause } from "lucide-react"

function AudioControl({songLen, onPlay} : {songLen : number; onPlay: any}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [timePassed, setTimePassed] = useState(0)
  const progress = songLen ? (timePassed / songLen) * 100 : 0;
  return <>
    <input 
    type="range" 
    min="0"
    max={songLen} 
    value={timePassed}
    className="slider w-screen h-1 rounded-lg appearance-none cursor-pointer"
    style={{
    background: `linear-gradient(to right, #8b5cf6 ${progress}%, #1f2937 ${progress}%)`
  }}
    onChange={(e) => setTimePassed(Number(e.target.value))}

    ></input>
    <div className="flex flex-row py-3 justify-center gap-6">
      <ControlButton icon={SkipBack}></ControlButton>
      <ControlButton icon={isPlaying ? Pause : Play} onClick={() => {
        onPlay()
        setIsPlaying(e => !e)
        }}></ControlButton>
      <ControlButton icon={SkipForward}></ControlButton>
    </div>
  </>
}

type ControlButtonProps = {
  icon: React.ElementType;
} & React.HTMLAttributes<HTMLDivElement>;

function ControlButton({ onClick, icon: Icon, ...props }: ControlButtonProps) {
  return (
    <div
      className="group rounded-full p-2 cursor-pointer bg-[radial-gradient(circle_at_center,#4b2a7c_0%,#000_100%)] hover:ring-2 hover:ring-[#4b2a7c] transition-all duration-150"
      onClick={onClick}
      {...props}
    >
      <Icon className="size-10 rounded-full p-2 group-hover:bg-[#4b2a7c] transition-all duration-150" />
    </div>
  );
}

export default AudioControl;