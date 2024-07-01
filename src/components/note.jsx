import React, { forwardRef } from 'react'
const Note = forwardRef(({content, initialPosition, handleClose = () => {}, ...props}, ref) => {
  return (
    <div
    ref={ref}
    style={
        {
            position: 'absolute',
            left:`${initialPosition?.x}px`,
            top:`${initialPosition?.y}px`,
            border: '1px solid black',
            userSelect: 'none',
            padding:'10px',
            width:'200px',
            cursor:'move',
            backgroundColor:'lightyellow'
        }
    }
    {...props}>
    📌 {content}
    <button
    style={{
            position: 'absolute',
            background: `none`,
            border: `none`,
            cursor: `pointer`,
        }} class="close-button" onClick= {() => handleClose()}>×</button>
    </div>
  )
})

export default Note