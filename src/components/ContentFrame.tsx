interface ContentFrameProps {
  name: string;
  artist: string;
  album: string;
  likes: string | number;
  imageUrl: string; 
}

const ContentFrame: React.FC<ContentFrameProps> = ({
  name, artist, album, likes, imageUrl
}) => (
  <div className="flex items-center justify-end group hover:bg-white/5 p-2 rounded-md transition-colors cursor-pointer w-full">
    <div className="flex flex-col items-end mr-4">
      <h3 className="text-white font-bold text-lg leading-tight">{name}</h3>
      <div className="flex items-center gap-1.5 text-gray-400 text-sm font-medium">
        <span>•</span>
        <span>{artist}</span>
        <span>•</span>
        <span>{likes} likes</span>
        <span className="truncate max-w-37.5">{album}</span>
      </div>
    </div>
    <div className="relative h-16 w-16 shrink-0">
      <img
        src={imageUrl || "/default-placeholder.png"} 
        alt=""
        className="h-full w-full object-cover rounded-md shadow-lg"
      />
    </div>
  </div>
);
export default ContentFrame;