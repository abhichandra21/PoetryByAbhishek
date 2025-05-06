import type { FC } from 'react'  
import type { Poem } from '../types/index.js' 

interface PoemPageProps {
  poem: Poem;
}

const PoemPage: FC<PoemPageProps> = ({ poem }) => {
  return (
    <article className="mb-8 p-6 bg-paper-light dark:bg-paper-dark shadow-md">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 hindi">{poem.title}</h1>
      <div className="space-y-2 hindi text-lg md:text-xl">
        {poem.lines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </article>
  )
}

export default PoemPage