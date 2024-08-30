'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useClerk, useAuth } from '@clerk/clerk-react'
import Show from '../../components/show'
import { useUser } from '@clerk/nextjs'
import { HiMenu } from 'react-icons/hi'

export default function HeaderComponent() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const { isSignedIn, isLoaded } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const menuRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const router = useRouter()

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prevState => !prevState)
  }

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false)
  }

  const handleLogout = () => {
    signOut()
    window.location.href = '/login'
  }

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      console.log('User is signed in:', isSignedIn)
    }
    //  else if (isLoaded) {
    //   router.push('/login') // Uncomment this to redirect if not signed in
    // }
  }, [isLoaded, isSignedIn, router])

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = event => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuRef])

  return (
    <div className="w-full">
      <Show IF={isSignedIn}>
        <header className="p-6 flex items-center justify-between">
          <div className="flex">
            {/* Logo */}
            <div
              className="flex cursor-pointer"
              onClick={() => router.push('/companyProfile')}
            >
              <img
                src="/images/cosmic-logo.png"
                alt="Logo"
                width={104}
                height={31}
              />
            </div>

            {/* Navigation for Desktop */}
            <nav className="hidden md:flex items-center ml-4">
              <Link href="/companyProfile">
                <button
                  className={`${
                    pathname === '/companyProfile'
                      ? 'text-white bg-[#8900A0]'
                      : 'text-[#8900A0] border-[#8900A0]'
                  } px-4 py-2 rounded-lg`}
                >
                  Ecommerce
                </button>
              </Link>
              <Link href="/chat">
                <button
                  className={`${
                    pathname.match(/^\/chat(\/\d+)?$/)
                      ? 'text-white bg-[#8900A0]'
                      : 'text-[#8900A0] border-[#8900A0]'
                  } px-4 py-2 rounded-lg`}
                >
                  Ai Chat
                </button>
              </Link>
            </nav>
          </div>

          {/* Profile Avatar for Desktop */}
          <div className="relative hidden md:flex items-center" ref={menuRef}>
            <img
              src={user?.imageUrl}
              alt="Profile Avatar"
              width={40}
              height={40}
              className="rounded-full cursor-pointer"
              onClick={toggleMenu}
            />

            {/* Dropdown Menu for Desktop */}
            {isMenuOpen && (
              <div className="absolute right-0 top-7 mt-2 w-60 bg-white shadow-lg rounded-lg overflow-hidden z-10">
                <div className="flex items-center p-4">
                  <img
                    src={user?.imageUrl}
                    alt="Avatar"
                    className="size-10 rounded-full"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.emailAddresses[0].emailAddress}
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-200">
                  <ul className="text-gray-700">
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <div
                        onClick={() => {
                          setIsMenuOpen(false)
                          router.push('/profile')
                        }}
                      >
                        Profile
                      </div>
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Log out
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Three-Dot Menu Icon for Mobile */}
          <div className="flex md:hidden items-center" ref={mobileMenuRef}>
            <button onClick={toggleMobileMenu}>
              <HiMenu className="text-[#8900A0] size-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="absolute right-[42px] top-[40px] mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-10 md:hidden">
              <ul className="text-gray-700">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <div
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      router.push('/companyProfile')
                    }}
                  >
                    Ecommerce
                  </div>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <div
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      router.push('/chat')
                    }}
                  >
                    Ai Chat
                  </div>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <div
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      router.push('/profile')
                    }}
                  >
                    Profile
                  </div>
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  Log out
                </li>
              </ul>
            </div>
          )}
        </header>
      </Show>
    </div>
  )
}
