import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import Steps from './steps';

const Sidebar = forwardRef(({ steps, stepShown, answerShown }, ref) => {
    const stepsRef = useRef(null);

    useEffect(() => {
        if (stepsRef.current) {
            const lastChild = stepsRef.current.lastElementChild;
            if (lastChild) {
                lastChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        }
    }, [steps]);

    useImperativeHandle(ref, () => ({
        scrollToBottom: () => {
            if (stepsRef.current) {
                const lastChild = stepsRef.current.lastElementChild;
                if (lastChild) {
                    lastChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }
            }
        }
    }));

    return (
        <div className="flex flex-col h-full">
            <h1 className="text-2xl font-bold mb-4">Steps</h1>
            <p className="text-base mb-4">A specific task in vim</p>

            <div ref={stepsRef} className="flex-grow overflow-auto scrollbar-hide">
                <div className="steps">
                    <Steps steps={steps} stepShown={stepShown} answerShown={answerShown} />
                </div>
            </div>
            <div className="hints sticky bottom-0 w-full bg-[#1e1e1e] p-4">
                <div className="hint flex items-center pb-2">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">:h</span>
                    <span className='text-xs pl-2'>show answer</span>
                </div>
                <div className="hint flex items-center">
                    <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">:n</span>
                    <span className='text-xs pl-2'>next step (manually)</span>
                </div>
            </div>
        </div>
    )
});

export default Sidebar;