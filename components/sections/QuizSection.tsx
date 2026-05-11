'use client'
import { useState } from 'react'

interface Quiz {
  id: string
  question: string
  imageUrl: string | null
  imageCaption: string | null
  options: string
  correctOption: number
  explanation: string
}

export default function QuizSection({ quiz }: { quiz: Quiz }) {
  const [selected, setSelected] = useState<number|null>(null)
  const options: string[] = typeof quiz.options === 'string' ? JSON.parse(quiz.options) : quiz.options

  return (
    <section className="quiz-section">
      <div className="section-inner">
        <div className="section-label">HAFTANIN GÖRSELİ</div>
        <h2 className="section-heading">Her hafta bilginizi test edin, tanı becerilerinizi geliştirin!</h2>
        <div className="quiz-grid">
          <div className="quiz-image-side">
            {quiz.imageUrl ? (
              <img src={quiz.imageUrl} alt={quiz.imageCaption ?? 'Quiz görseli'} className="quiz-image"/>
            ) : (
              <div className="quiz-image-placeholder">
                <span style={{fontSize:64}}>🔬</span>
              </div>
            )}
            {quiz.imageCaption && <p className="quiz-caption">{quiz.imageCaption}</p>}
          </div>
          <div className="quiz-card">
            <h3 className="quiz-question">{quiz.question}</h3>
            <div className="quiz-options">
              {options.map((opt, i) => {
                const isSelected = selected === i
                const isCorrect = i === quiz.correctOption
                let cls = 'quiz-option'
                if (selected !== null) {
                  if (isCorrect) cls += ' correct'
                  else if (isSelected) cls += ' wrong'
                }
                return (
                  <button key={i} className={cls} onClick={() => setSelected(i)} disabled={selected !== null}>
                    <span className="quiz-opt-letter">{String.fromCharCode(65+i)}</span>
                    {opt}
                  </button>
                )
              })}
            </div>
            {selected !== null && (
              <div className={`quiz-explanation ${selected === quiz.correctOption ? 'correct' : 'wrong'}`}>
                <strong>{selected === quiz.correctOption ? '✓ Doğru!' : '✗ Yanlış!'}</strong>
                <p>{quiz.explanation}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
