import { Dialog, Transition } from "@headlessui/react";

interface ModalBasicProps {
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  className?: string;
}

export default function ModalBasic({
  children,
  title,
  isOpen,
  setIsOpen,
  className,
}: ModalBasicProps) {
  return (
    <Transition appear show={isOpen}>
      <Dialog as="div" onClose={() => setIsOpen(false)}>
        <Transition.Child
          className="fixed inset-0 bg-slate-950 bg-opacity-30 z-50 transition-opacity"
          enter="transition ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-out duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          aria-hidden="true"
        />
        <Transition.Child
          className="fixed inset-0 z-50 overflow-hidden flex items-center my-4 justify-center px-4 sm:px-6"
          enter="transition ease-in-out duration-200"
          enterFrom="opacity-0 translate-y-4"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in-out duration-200"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-4"
        >
          <Dialog.Panel
            className={`bg-white dark:bg-slate-800 rounded shadow-lg overflow-auto max-w-2xl w-full max-h-full p-2 ${className}`}
          >
            {/* Modal header */}
            <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center">
                <Dialog.Title
                  className="font-bold text-slate-800 dark:text-slate-100 leading-6"
                  style={{ fontSize: "calc(1.255rem + 0.06vw)" }}
                >
                  {title}
                </Dialog.Title>
                <button
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400 bg-red-500 p-2 text-center rounded-lg "
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                >
                  <div className="sr-only">Close</div>
                  <svg className="w-4 h-4 currentColor">
                    <path
                      fill="#fff"
                      d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {children}
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
