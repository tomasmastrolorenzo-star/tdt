export function Logo({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="currentColor" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 
        TDT Logo - Geometric Tracing
        A perfect inverted triangle outer bounding with an aggressive 'T' shape inside. 
      */}
      <path d="M 0 0 
               L 100 0 
               L 80 40 
               L 64 12 
               L 64 72 
               L 50 100 
               L 36 72 
               L 36 12 
               L 20 40 
               Z" 
      />
    </svg>
  )
}
