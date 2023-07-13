import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";

import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { scrollTo } from "../utils";
import { useWallet } from "../contexts";
import { useApp } from "../contexts";
import { useEffect } from "react";

export function Header() {
  let navigate = useNavigate();

  const [user, loading] = useAuthState(auth);
  const { modalOpen, setModalOpen } = useApp();
  const { handleConnect, progress } = useWallet();

  const [userInfoOpen, setUserInfoOpen] = useState<boolean>(false);

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [headerStyle, setHeaderStyle] = useState({
    transition: "all .6s ease",
  });
  const [logoStyle, setLogoStyle] = useState({
    width: "60%",
  });
  const [childLinkStyle, setChildLinkStyle] = useState({
    top: "120px",
  });


  useEffect(() => {
    if (!user) {
      navigate("/login");
    }

  }, [user]);

  useScrollPosition(({ currPos }) => {
    const isVisible = currPos.y == 0;
    setIsVisible(!isVisible);

    const shouldBeLogoStyle = {
      width: isVisible ? "60%" : "30%",
    };

    const shouldBeLinkStyle = {
      top: isVisible ? "120px" : "80px",
    };

    setLogoStyle(shouldBeLogoStyle);
    setChildLinkStyle(shouldBeLinkStyle);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 w-full h-[70px] bg-white"
      style={{
        boxShadow:
          "0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(43, 10, 10, 0.28)",
      }}
    >
      <div className="flex items-center justify-between h-full px-8 cursor-pointer">
        <img src="logo.jpg" className="h-full w-auto" />
        <div className="flex gap-2">
          {user &&
            <>
              <div className="h-full flex flex-row justify-between items-center gap-2 "
                onMouseEnter={() => setUserInfoOpen(true)}
                onMouseLeave={() => setUserInfoOpen(false)}>
                <p className="text-lg h-full">{user.displayName}</p>
                <picture>
                  <img
                    src={user.photoURL!}
                    alt="Picture of the author"
                    className="h-12 w-12 rounded-full"
                  />
                </picture>
              </div>
            </>
          }
        </div>
      </div>
      {userInfoOpen &&
        <div className="bg-[#ffffff] border w-auto h-auto absolute right-10 top-14"
          onMouseEnter={() => setUserInfoOpen(true)}
          onMouseLeave={() => setUserInfoOpen(false)}>
          <button
            onClick={() => auth.signOut()}
            className="w-full hover:bg-[#cccccccc] p-4 pl-24"
          >
            Sign Out
          </button>
        </div>
      }
    </header>
  );
}

export function Footer() {
  return <footer className=""></footer>;
}

export function MoveUp() {
  const [upStyle, setUpStyle] = useState({
    transition: "all 200ms ease-in",
    opacity: 0,
    transform: "translate(0, -50%)",
  });

  useScrollPosition(({ currPos }) => {
    const isVisible = currPos.y < -400;

    const shouldBeStyle = {
      opacity: isVisible ? 1 : 0,
      visibility: isVisible ? "visible" : "hidden",
      transition: `all 200ms ${isVisible ? "ease-in" : "ease-out"}`,
      transform: isVisible ? "none" : "translate(0, -50%)",
    };

    if (JSON.stringify(shouldBeStyle) === JSON.stringify(upStyle)) return;

    setUpStyle(shouldBeStyle);
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      className="fixed p-2 overflow-hidden rounded-full shadow-lg focus:outline-none bg-card"
      style={{ right: "1.5rem", bottom: "12%", ...upStyle }}
      onClick={() => scrollTo("__next")}
    >
      <FiChevronUp className="w-6 h-6" />
    </button>
  );
}
