import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

export default function FinishDialog({ showDialog, setShowDialog, dialogRef }) {

  function close() {
    setShowDialog(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === 'Escape') {
      close();
    } else if (e.key === 'n') {
      window.location.reload();
    }
  }

  return (
    <>
      <Dialog 
        open={showDialog} 
        as="div" 
        className="relative z-10 focus:outline-none" 
        onClose={close} 
        ref={dialogRef}
        onKeyDown={handleKeyDown}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 -mt-16">
            <DialogPanel
              transition
              className="w-full max-w-sm rounded-xl bg-white/5 p-5 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle as="h3" className="text-lg/7 font-bold text-white flex items-center">
                <span className="mr-2 animate-tada inline-block">🎉</span>
                Congratulations!
              </DialogTitle>
              <p className="mt-2 text-base/6 text-white/50">
                You have completed the challenge!
              </p>
              <p className="mt-2 text-base/6 text-white/50">
                Refresh to try next one.
              </p>
              <div className="mt-4">
                <Button
                  className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-base/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                  onClick={close}
                >
                  Got it! <span className="ml-1">↵</span>
                </Button>
                <Button
                  className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-base/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700 ml-2"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  Next <span className="ml-1">n</span>
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}