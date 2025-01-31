"use client";

import React from 'react'
import { useState } from "react"
import { getProfileRole } from '../(user)/user_details/getProfile';
import Link from 'next/link';
import Image from "next/image"
import { NAV_LINKS_ADMIN } from "@/constants"
import { UserNav } from "@/components/DropdownProfile"
import LoginButton from "@/components/LoginLogoutButton"
import { redirect } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion"

const NavbarAdmin = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
  
    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen)
    } 
    return (
        <nav className="flexBetween max-container padding-container relative z-30 py-5">
          <Link href="/">
            <Image src="/berlin.png" alt="logo" width={74} height={29} />
          </Link>
    
          <ul className="hidden h-full gap-12 lg:flex">
            {NAV_LINKS_ADMIN.map((link) => (
              <Link
                href={link.href}
                key={link.key}
                className="flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold"
              >
                {link.label}
              </Link>
            ))}
          </ul>
          <UserNav />
          <div className="hidden lg:flex items-center gap-4">
          <LoginButton />
          </div>
          
          <button
            onClick={toggleMenu}
            className="lg:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <Image
              src="/menu.svg"
              alt=""
              width={32}
              height={32}
              className="cursor-pointer"
            />
          </button>
    
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 bg-white shadow-lg lg:hidden"
              >
                <ul className="flex flex-col py-4">
                  {NAV_LINKS_ADMIN.map((link) => (
                    <li key={link.key} className="px-4 py-2">
                      <Link
                        href={link.href}
                        className="block w-full text-lg hover:font-bold"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                      <li className="px-4 py-2">
                      <LoginButton />
                      </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      )
}

export default NavbarAdmin