import React, { useState, useCallback, useRef, useEffect } from 'react';
import './App.css';
import VimEditor from './editor/editor';
import Header from './header/header';
import Sidebar from './sidebar/sidebar';
import FinishDialog from './editor/dialog';

const steps = [
  { step: 'Step 1/10', content: 'content', answer: 'answer' },
  { step: 'Step 2/10', content: 'content', answer: 'answer' },
  { step: 'Step 3/10', content: 'content', answer: 'answer' },
  { step: 'Step 4/10', content: 'content', answer: 'answer' },
  { step: 'Step 5/10', content: 'content', answer: 'answer' },
  { step: 'Step 6/10', content: 'content', answer: 'answer' }, 
  { step: 'Step 7/10', content: 'content', answer: 'answer' },
  { step: 'Step 8/10', content: 'content', answer: 'answer' },
  { step: 'Step 9/10', content: 'content', answer: 'answer' },
  { step: 'Step 10/10', content: 'content', answer: 'answer' },
]

function App() {
  const [stepShown, setStepShown] = useState(0)
  const [answerShown, setAnswerShown] = useState(-1)
  const [showDialog, setShowDialog] = useState(false)
  const editorRef = useRef(null)
  const dialogRef = useRef(null)
  const sidebarRef = useRef(null)

  const focusEditor = useCallback(() => {
    if (editorRef.current) {
      if (!showDialog) {
        editorRef.current.focus()
      } else if (dialogRef.current) {
        dialogRef.current.focus()
      }
    } else {
      console.log('editor not mounted')
    }
  }, [showDialog, editorRef, dialogRef]);

  useEffect(() => {
    document.addEventListener('click', focusEditor)
    return () => {
      document.removeEventListener('click', focusEditor)
    }
  }, [focusEditor]);

  const nextStep = useCallback(() => {
    setStepShown(current => {
      setAnswerShown(current);
      if (current === steps.length - 1) {
        setShowDialog(true);
      } else if (current === steps.length) {
        setShowDialog(true)
        return current
      }
      return current + 1;
    });
    setTimeout(() => {
      sidebarRef.current.scrollToBottom()
    }, 0)
  }, []);

  const showAnswer = useCallback(() => {
    setStepShown(current => {
      setAnswerShown(current)
      return current
    })
  }, [])



  return (
    <div className="App bg-stone-950 text-white min-h-screen flex flex-col p-4">
      <Header className="w-full h-16" />
      <div className="flex flex-1 p-2 space-x-6 flex-col md:flex-row">
        <div className="w-full md:w-4/5 p-4 rounded-lg bg-[#1e1e1e] mb-4 md:mb-0 max-h-[90vh] overflow-y-auto">
          <VimEditor nextStep={nextStep} showAnswer={showAnswer} editorRef={editorRef}/>
        </div>
        <div className="w-full md:w-1/5 p-4 rounded-lg bg-[#1e1e1e] max-h-[90vh] overflow-y-auto">
          <Sidebar ref={sidebarRef} steps={steps} stepShown={stepShown} answerShown={answerShown} />
        </div>
      </div>
      <FinishDialog showDialog={showDialog} setShowDialog={setShowDialog} dialogRef={dialogRef}/>
    </div>
  );
}

export default App;