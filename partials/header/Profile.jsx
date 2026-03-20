"use client"
import Image from "next/image"
import { useEffect, useState } from "react";
import clsx from "clsx";
import Dropdown from "./Dropdown";
import { useUserInfoContext } from "@/context/UserInfoContext";


const Profile = () => {
  const [isToggled, setIsToggled] = useState(false)
  const { loading, userInfo, isUserLoggedIn: isLoggedIn } = useUserInfoContext()



  return (
    <div className="relative">

      <div className="w-10 h-10" onClick={() => setIsToggled(prev => !prev)}>
        <Image
          src={
            isLoggedIn
              ? userInfo?.photo || "/images/logo.png"
              : "/images/logo.png"
          }
          alt="profile"
          width={50}
          height={50}
          className={
            clsx("cursor-pointer",
              { "h-10 w-10 rounded-lg object-cover cursor-pointer hover:rounded-2xl duration-100": isLoggedIn }
            )
          }
        />
      </div>

      {isToggled && <Dropdown data={userInfo} isLoggedIn={isLoggedIn} />}


    </div>
  )
}

export default Profile