import React from "react"

export function AsciiArt({ className }: { className?: string }) {
  return (
    <pre
      aria-hidden
      className={className}
      style={{ fontFamily: "monospace", whiteSpace: "pre", margin: 0 }}
    >
{`__
( o)
///\\
 \\V_/_`}
    </pre>
  )
}

export default AsciiArt
