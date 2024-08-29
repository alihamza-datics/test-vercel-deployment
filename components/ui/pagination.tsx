import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-end mt-4 w-full space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'} transition-all`}
      >
        <ChevronLeftIcon className="size-5 text-gray-500" />
      </button>
      <div className="flex space-x-1 overflow-auto">
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 border rounded ${currentPage === page ? 'bg-[#8900A0] text-white font-semibold' : 'bg-white text-black hover:bg-gray-100'} transition-all`}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'} transition-all`}
      >
        <ChevronRightIcon className="size-5 text-gray-500" />
      </button>
    </div>
  )
}
