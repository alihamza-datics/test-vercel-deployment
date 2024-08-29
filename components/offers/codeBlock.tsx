import { useState, useRef, useEffect } from 'react'
import Prism from 'prismjs'
import {
  PencilIcon,
  CheckIcon,
  ClipboardIcon
} from '@heroicons/react/24/outline'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-sql'
import '@/app/globals.css'
import * as Tooltip from '@radix-ui/react-tooltip'

const CodeBlock = ({ query }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [tooltipContent, setTooltipContent] = useState('Copy')
  const codeRef = useRef(null)

  useEffect(() => {
    Prism.highlightAll()
  }, [isEditing])

  const handleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleSave = () => {
    setIsEditing(false)
    const updatedSQLQuery = codeRef.current.textContent
    // if (codeRef.current && onSave) {
    //   const updatedQuery = updatedSQLQuery
    //   onSave(updatedQuery)
    // }
    // await submitUserMessage({ sqlQuery: updatedSQLQuery })
  }

  const handleCopy = () => {
    if (codeRef.current) {
      navigator.clipboard.writeText(codeRef.current.textContent)
      setTooltipContent('Copied!')
      setTimeout(() => setTooltipContent('Copy'), 2000)
    }
  }

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold text-gray-800">Query</h2>
      <div className="relative bg-gray-900 border border-gray-700 rounded-md p-4 font-mono text-sm text-white">
        <pre>
          <code
            ref={codeRef}
            className="language-sql"
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            style={{
              whiteSpace: 'pre-wrap',
              minHeight: '100px', // Ensure enough height for content
              backgroundColor: isEditing ? '#2d3748' : 'transparent', // Background color for editing state
              padding: '4px', // Padding for better text visibility
              borderRadius: '4px', // Rounded corners
              boxShadow: isEditing
                ? '0 0 10px rgba(255, 255, 255, 0.2)'
                : 'none', // Shadow effect
              outline: 'none'
            }}
          >
            {query}
          </code>
        </pre>
        <div className="absolute bottom-7 right-5 flex space-x-2">
          <Tooltip.Root>
            <Tooltip.Trigger>
              <ClipboardIcon
                className="size-6 text-gray-400 cursor-pointer hover:text-gray-100 transition-transform duration-200 active:scale-90"
                onClick={handleCopy}
              />
            </Tooltip.Trigger>
            <Tooltip.Content
              side="bottom"
              align="center"
              className="bg-gray-800 text-white px-2 py-1 rounded"
            >
              {tooltipContent}
              <Tooltip.Arrow className="fill-gray-800" />
            </Tooltip.Content>
          </Tooltip.Root>
          {/* {!isEditing && (
            <Tooltip.Root>
              <Tooltip.Trigger>
                <PencilIcon
                  className="size-6 text-yellow-500 cursor-pointer hover:text-yellow-400 transition-transform duration-200 active:scale-90"
                  onClick={handleEdit}
                />
              </Tooltip.Trigger>
              <Tooltip.Content
                side="bottom"
                align="center"
                className="bg-gray-800 text-white px-2 py-1 rounded"
              >
                Edit
                <Tooltip.Arrow className="fill-gray-800" />
              </Tooltip.Content>
            </Tooltip.Root>
          )} */}
          {isEditing && (
            <Tooltip.Root>
              <Tooltip.Trigger>
                <CheckIcon
                  className="size-6 text-green-500 cursor-pointer hover:text-green-400 transition-transform duration-200 active:scale-90"
                  onClick={handleSave}
                />
              </Tooltip.Trigger>
              <Tooltip.Content
                side="bottom"
                align="center"
                className="bg-gray-800 text-white px-2 py-1 rounded"
              >
                Save
                <Tooltip.Arrow className="fill-gray-800" />
              </Tooltip.Content>
            </Tooltip.Root>
          )}
        </div>
      </div>
    </div>
  )
}

export default CodeBlock
