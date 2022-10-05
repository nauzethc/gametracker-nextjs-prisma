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
  const handleChange = (page: number) => {
    if (typeof onChange === 'function') {
      onChange(page)
    }
  }
  return (
    numPages > 1
      ? <div className={`pagination flex items-center justify-center gap-2 ${className}`}>
        {pages.map(numPage => numPage === page
          ? <span className="current w-8 h-8 flex items-center justify-center rounded-lg" key={numPage}>{numPage}</span>
          : <button onClick={() => handleChange(numPage)} className="w-8 h-8 rounded-lg" key={numPage}>{numPage}</button>
        )}
      </div>
      : null
  )
}
