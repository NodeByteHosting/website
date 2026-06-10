"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/packages/ui/components/ui/button"

interface ChangelogPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  translations: {
    previous: string
    next: string
  }
}

export function ChangelogPagination({ currentPage, totalPages, onPageChange, translations }: ChangelogPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 pt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        {translations.previous}
      </Button>

      <div className="flex items-center gap-1">
        {currentPage > 2 && (
          <>
            <Button
              variant={currentPage === 1 ? "default" : "ghost"}
              size="sm"
              onClick={() => onPageChange(1)}
              className="w-9 h-9 p-0"
            >
              1
            </Button>
            {currentPage > 3 && (
              <span className="px-2 text-muted-foreground">...</span>
            )}
          </>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(page => {
            if (totalPages <= 5) return true
            return Math.abs(page - currentPage) <= 1
          })
          .map(page => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "ghost"}
              size="sm"
              onClick={() => onPageChange(page)}
              className="w-9 h-9 p-0"
            >
              {page}
            </Button>
          ))}

        {currentPage < totalPages - 1 && (
          <>
            {currentPage < totalPages - 2 && (
              <span className="px-2 text-muted-foreground">...</span>
            )}
            <Button
              variant={currentPage === totalPages ? "default" : "ghost"}
              size="sm"
              onClick={() => onPageChange(totalPages)}
              className="w-9 h-9 p-0"
            >
              {totalPages}
            </Button>
          </>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {translations.next}
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  )
}
