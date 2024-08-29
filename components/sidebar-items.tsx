'use client'

import { Chat } from '@/lib/types'
import { AnimatePresence, motion } from 'framer-motion'

import { removeChat, shareChat } from '@/app/actions'

import { SidebarActions } from '@/components/sidebar-actions'
import { SidebarItem } from '@/components/sidebar-item'
import { useState } from 'react'
import {usePathname } from 'next/navigation'

interface SidebarItemsProps {
  chats?: Chat[]
}

export function SidebarItems({ chats }) {
  const pathname = usePathname();
  const match = pathname.split('/chat/');
  const id = match ? +match[1] : null;
  const [selectedChatId, setSelectedChatId] = useState<number >(id);
  if (!chats?.length) return null

  const handleChatClick = (id: number) => {
    setSelectedChatId(id);
  };

  return (
    <AnimatePresence>
      {chats.map(
        (chat, index) =>
          chat && (
            <motion.div
              key={chat?.id}
              exit={{
                opacity: 0,
                height: 0
              }}
              onClick={() => handleChatClick(chat.id)}
              className={`cursor-pointer ${
                  selectedChatId === chat.id ? 'bg-[#8900A0] mr-[30px] rounded-lg border text-white' : ''
              }`}
            >
              <SidebarItem index={index} chat={chat} isSelected = {selectedChatId === chat.id}>
                <SidebarActions
                  chat={chat}
                  // removeChat={removeChat}
                  shareChat={shareChat}
                />
              </SidebarItem>
            </motion.div>
          )
      )}
    </AnimatePresence>
  )
}
