type PaginationProps = {
  className?: string,
  total: number,
  pageSize: number,
  page?: number,
  onChange?: Function | ((page: number) => void)
}

export default function Pagination ({
  className = '',
  pageSize,
  page = 1,
  total,
  onChange
}: PaginationProps) {
  const numPages = Math.ceil(total / pageSize)
  const pages = [...new Array(numPages)].map((_, index) => index + 1)
  const pagesToShow = [...new Set([
    // First pages
    ...pages.slice(0, 3),
    // Middle pages
    ...pages.slice(Math.max(0, page - 2), Math.min(page + 1, pages.length)),
    // Last pages
    ...pages.slice(pages.length - 3)
  ])].sort((a, b) => a - b)

  const pagination: (null|number)[] = []
  // Include empty spaces between ranges
  pagesToShow.forEach((page, index, pages) => {
    pagination.push(page)
    if (pages[index + 1] > page + 1) {
      pagination.push(null)
    }
  })

  const handleChange = (page: number) => {
    if (typeof onChange === 'function') {
      onChange(page)
    }
  }
  return (
    numPages > 1
      ? <div className={`pagination flex flex-wrap items-center justify-center gap-2 ${className}`}>
        {pagination.map((numPage, index) =>
          numPage === null
            ? <span key={index}>...</span>
            : numPage === page
              ? <span className="current w-8 h-8 flex items-center justify-center rounded-lg" key={index}>{numPage}</span>
              : <button onClick={() => handleChange(numPage)} className="w-8 h-8 rounded-lg" key={index}>{numPage}</button>
        )}
      </div>
      : null
  )
}
