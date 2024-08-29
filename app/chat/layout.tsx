import { SidebarDesktop } from '@/components/sidebar-desktop'
// import { auth } from '@/auth'

interface ChatLayoutProps {
  children: React.ReactNode
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <>
      <div className="bg-muted p-5 flex">
        {/* <h2 className='text-black-600 p-5'>Chat AI</h2>  */}

        <div className="relative flex w-screen overflow-hidden bg-white border-2">
          <SidebarDesktop userId={1} />
          {children}
        </div>
      </div>
    </>
  )
}
