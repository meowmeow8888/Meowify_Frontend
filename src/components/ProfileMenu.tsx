import { useState } from "react";

function ProfileMenu({ imageUrl }: { imageUrl: string }) {
  const [showMenu, setShowMenu] = useState(false)
  return (
    <>
      <img src={imageUrl} onClick={() => setShowMenu(e => !e)} className="size-10 object-cover rounded-full transition duration-200 hover:scale-120 hover:shadow-lg cursor-pointer"/>
    </>
  );
}
export default ProfileMenu;
