import { Checkbox } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'


export default function Steps({ steps, stepShown, answerShown }) {

    return (
        <div className="w-full">
            <div className="mx-auto w-full max-w-md">
                <div className="flex flex-col gap-2">
                    {steps.slice(0, stepShown + 1).map((step, index) => (
                        <Checkbox
                            key={index}
                            value={step}
                            disabled
                            checked={index < stepShown}
                            className="group relative flex cursor-pointer rounded-lg bg-white/5 py-4 px-5 text-white shadow-md transition focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10 group-data-[checked]:animate-greenFlash"
                        >
                            <div className="flex w-full items-center justify-between ">
                                <div className="text-sm/6">
                                    <p className="font-semibold text-white">{index + 1}/{steps.length}</p>
                                    <div className="flex gap-2 text-white/50 pb-1">
                                        <div>{step.description}</div>
                                    </div>
                                    {index <= answerShown && (
                                        <div className="flex gap-2 text-white/50">
                                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                {step.command}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <CheckCircleIcon className="size-6 fill-green-500 opacity-0 transition group-data-[checked]:opacity-100" />
                            </div>
                        </Checkbox>
                    ))}
                </div>
            </div>
        </div>
    )
}