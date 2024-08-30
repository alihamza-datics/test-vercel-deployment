import { Sidebar } from '@/components/sidebar'

// import { auth } from '@/auth'
import { ChatHistory } from '@/components/chat-history'
import { SidebarMobile } from './sidebar-mobile'
import { SidebarToggle } from './sidebar-toggle'

export function SidebarDesktop({ userId }: any) {
  if (!userId) {
    return null
  }

  return (
    <>
      <div className="sidebar-chat">
        <Sidebar className=" h-screen peer inset-y-0 z-30 hidden -translate-x-full border-r bg-white duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex">
          <ChatHistory userId={userId} />
        </Sidebar>
      </div>

      {/* <> */}
      {/* <SidebarMobile>
<ChatHistory userId={session.user.id} />
</SidebarMobile>
 <SidebarToggle />  */}
    </>
  )
}
