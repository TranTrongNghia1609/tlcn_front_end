import React from 'react'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

function TablePagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  showFirstLast = false,
  maxVisiblePages = 5 
}) {
  // Tính toán các trang hiển thị
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(currentPage - half, 1);
    let end = Math.min(start + maxVisiblePages - 1, totalPages);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(end - maxVisiblePages + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="mt-4 flex justify-center">
      <Pagination className="cursor-pointer">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={handlePrevious}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>

          {showFirstLast && visiblePages[0] > 1 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => onPageChange(1)}>
                  1
                </PaginationLink>
              </PaginationItem>
              {visiblePages[0] > 2 && (
                <PaginationItem>
                  <span className="px-4">...</span>
                </PaginationItem>
              )}
            </>
          )}

          {visiblePages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => onPageChange(page)}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {showFirstLast && visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                <PaginationItem>
                  <span className="px-4">...</span>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink onClick={() => onPageChange(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext 
              onClick={handleNext}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default TablePagination