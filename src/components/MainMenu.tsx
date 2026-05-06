import { Menu, House, History, ListMusic } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function MainMenu() {
  const [showMenu, setShowMenu] = useState(false);
  const navigator = useNavigate();

  return (
    <div
      className={`flex flex-col h-fit py-3 pr-4 pl-2 gap-2
       overflow-hidden transition-all duration-300
       ${showMenu ? "w-48 ring-2 ring-gray-800" : "w-12"}`}
    >
      <Menu
        className="size-8 hover:scale-120 cursor-pointer"
        onClick={() => setShowMenu((prev) => !prev)}
      />

      <div
        className={`transition-all duration-300 overflow-hidden 
                  ${showMenu ? "opacity-100" : "opacity-0"}`}
      >
        <MenuItem icon={House} onClick={() => navigator(0)}>
          Home
        </MenuItem>
        <MenuItem icon={History}>History</MenuItem>
        <MenuItem icon={ListMusic}>Playlists</MenuItem>
      </div>
    </div>
  );
}

type MenuItemProps = {
  icon: React.ElementType;
} & React.HTMLAttributes<HTMLDivElement>;

function MenuItem({ children, onClick, icon: Icon, ...props }: MenuItemProps) {
  return (
    <div
      className="flex items-center gap-2 p-2 cursor-pointer transition-colors duration-150 hover:bg-gray-800 rounded"
      onClick={onClick}
      {...props}
    >
      <Icon className="size-5" />
      {children}
    </div>
  );
}

export default MainMenu;
