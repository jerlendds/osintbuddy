import { Fragment } from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { toast } from 'react-toastify'

export function Fence({ children, language }) {
  return (
    <Highlight
      {...defaultProps}
      code={children.trimEnd()}
      language={language}
      theme={undefined}
    >
      {({ className, style, tokens, getTokenProps }) => (
        <pre className={classNames('flex items-start justify-between', className)} style={style}>
          <code>
            {tokens.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {line
                  .filter((token) => !token.empty)
                  .map((token, tokenIndex) => (
                    <span key={tokenIndex} {...getTokenProps({ token })} />
                  ))}
                {'\n'}
              </Fragment>
            ))}
          </code>
          <button onClick={() => {
            navigator.clipboard.writeText(children)
            toast.success('Copied to clipboard!')
          }} title="Copy to clipboard" >
          <ClipboardDocumentIcon className='h-5 w-5' />

          </button>
        </pre>
      )}
    </Highlight>
  )
}
