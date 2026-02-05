'use client';

import { useState, useEffect } from 'react';
import PracticalModel from '@/components/PhysicsModel';
import { 
  generateQuestion, 
  checkAnswer, 
  getDisplayName,
  getDirectionDisplay,
  type Question, 
  type Direction 
} from '@/utils/quiz';

export default function Home() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [questionId, setQuestionId] = useState(0);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [feedback, setFeedback] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    setQuestion(generateQuestion());
    setQuestionId(prev => prev + 1);
  }, []);

  const handleAnswer = (direction: Direction) => {
    if (!question) return;

    const isCorrect = checkAnswer(question, direction);
    setTotalQuestions(prev => prev + 1);

    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback('✓ Correct! Well done!');
      setShowFeedback(true);
      
      // Generate new question after a short delay
      setTimeout(() => {
        setQuestion(generateQuestion());
        setQuestionId(prev => prev + 1);
        setShowFeedback(false);
      }, 1500);
    } else {
      setFeedback(`✗ Incorrect. The correct answer is: ${getDirectionDisplay(question.answer.direction)}`);
      setShowFeedback(true);
      
      // Show feedback longer for incorrect answers
      setTimeout(() => {
        setShowFeedback(false);
      }, 3000);
    }
  };

  const directions: Direction[] = ['up', 'down', 'left', 'right', 'out', 'in'];

  if (!question) return <div>Loading...</div>;

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            marginBottom: '10px',
            fontWeight: 'bold'
          }}>
            Fleming's Left Hand Rule
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            Interactive Drilling for HKDSE Students
          </p>
          <div style={{
            marginTop: '15px',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            Score: {score} / {totalQuestions}
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '20px'
        }}>
          {/* 3D Model */}
          <div className="card-panel" style={{
            background: 'white',
            borderRadius: '15px',
            padding: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{
              marginTop: 0,
              marginBottom: '15px',
              color: '#333',
              fontSize: '1.3rem'
            }}>
              Visualization
            </h2>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '10px' }}>
              Observe the setup below. <br/>
              <span style={{ color: '#ff4d4d' }}>Red = North</span>, <span style={{ color: '#4d94ff' }}>Blue = South</span>
            </p>
            <PracticalModel key={questionId} question={question} />
          </div>

          {/* Question Panel */}
          <div className="card-panel" style={{
            background: 'white',
            borderRadius: '15px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h2 style={{
              marginTop: 0,
              marginBottom: '20px',
              color: '#333',
              fontSize: '1.5rem'
            }}>
              Question
            </h2>

            {/* Given Information */}
            <div style={{
              background: '#f0f4ff',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '25px'
            }}>
              <h3 style={{ 
                marginTop: 0, 
                marginBottom: '15px',
                color: '#4a5568',
                fontSize: '1.1rem'
              }}>
                Information:
              </h3>
              {question.given.map((item, index) => (
                <div key={index} style={{
                  marginBottom: '10px',
                  fontSize: '1.1rem',
                  color: '#2d3748'
                }}>
                  <strong>{getDisplayName(item.type)}</strong>: 
                  <span style={{ 
                    marginLeft: '10px',
                    color: '#4c51bf',
                    fontWeight: 'bold'
                  }}>
                    {getDirectionDisplay(item.direction)}
                  </span>
                </div>
              ))}
            </div>

            {/* Question */}
            <div style={{
              background: '#fff5e6',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '25px'
            }}>
              <h3 style={{ 
                marginTop: 0, 
                marginBottom: '10px',
                color: '#4a5568',
                fontSize: '1.2rem'
              }}>
                Find the direction of:
              </h3>
              <p style={{ 
                fontSize: '1.3rem', 
                fontWeight: 'bold',
                color: '#d97706',
                margin: 0
              }}>
                {getDisplayName(question.answer.type)}
              </p>
            </div>

            {/* Answer Buttons */}
            <div className="answer-grid" style={{
              display: 'grid',
              gap: '10px',
              marginBottom: '20px'
            }}>
              {directions.map(dir => (
                <button
                  key={dir}
                  onClick={() => handleAnswer(dir)}
                  disabled={showFeedback}
                  style={{
                    padding: '15px 20px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '8px',
                    background: showFeedback ? '#e2e8f0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    cursor: showFeedback ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    opacity: showFeedback ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!showFeedback) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {getDirectionDisplay(dir)}
                </button>
              ))}
            </div>

            {/* Feedback */}
            {showFeedback && (
              <div style={{
                padding: '15px',
                borderRadius: '8px',
                background: feedback.startsWith('✓') ? '#d4edda' : '#f8d7da',
                color: feedback.startsWith('✓') ? '#155724' : '#721c24',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                textAlign: 'center',
                animation: 'fadeIn 0.3s'
              }}>
                {feedback}
              </div>
            )}
          </div>
        </div>

        {/* Rules Reference */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
          <h2 style={{ 
            marginTop: 0, 
            marginBottom: '15px',
            color: '#333',
            fontSize: '1.3rem'
          }}>
            Fleming's Left Hand Rule Reference
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '15px'
          }}>
            <div style={{
              padding: '15px',
              background: '#fff5f5',
              borderRadius: '8px',
              borderLeft: '4px solid #ff6b6b'
            }}>
              <strong style={{ color: '#c53030' }}>Thumb</strong>
              <p style={{ margin: '5px 0 0 0', color: '#666' }}>Force/Motion direction</p>
            </div>
            <div style={{
              padding: '15px',
              background: '#f0fff4',
              borderRadius: '8px',
              borderLeft: '4px solid #6bcf7f'
            }}>
              <strong style={{ color: '#2f855a' }}>First Finger</strong>
              <p style={{ margin: '5px 0 0 0', color: '#666' }}>Magnetic Field direction (N → S)</p>
            </div>
            <div style={{
              padding: '15px',
              background: '#eff6ff',
              borderRadius: '8px',
              borderLeft: '4px solid #4d96ff'
            }}>
              <strong style={{ color: '#2b6cb0' }}>Second Finger</strong>
              <p style={{ margin: '5px 0 0 0', color: '#666' }}>Current direction (+ to -)</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .answer-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
          .card-panel {
            padding: 15px !important;
          }
          .model-container {
            height: 250px !important; /* Mobile height override */
          }
          .answer-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 5px !important;
          }
          h1 {
            font-size: 1.6rem !important;
            margin-bottom: 5px !important;
          }
          /* Hide the 'Observe setup' text and line breaks on mobile */
          .card-panel p {
            display: none;
          }
          /* Compact the 'Information' and 'Question' boxes */
          .card-panel > div {
            padding: 10px !important;
            margin-bottom: 15px !important;
          }
          .card-panel h2 {
            font-size: 1.2rem !important;
            margin-bottom: 10px !important;
          }
          button {
            padding: 10px 5px !important;
            font-size: 0.9rem !important;
          }
        }
      `}</style>
    </main>
  );
}
