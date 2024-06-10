import { Pagination as PaginationNextUI } from '@nextui-org/react'

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
  const handleChange = (page: number) => {
    if (typeof onChange === 'function') {
      onChange(page)
    }
  }

  return numPages > 1
    ? <PaginationNextUI
        className={`${className}`}
        page={page}
        total={numPages}
        onChange={handleChange} />
    : null
}
