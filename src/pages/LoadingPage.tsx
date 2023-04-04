export default function LoadingPage() {
    return (
        <div className='flex flex-col h-screen w-screen pt-20 ml-auto items-center bg-neutral-800 space-y-6'>
            <h2 className="text-5xl text-white font-semibold text-center tracking-wider animate-pulse">
                Loading...
            </h2>
            <img src='/src/assets/loading.gif' alt='' className='w-[50vw] md:w-[25vw] content-center animate-pulse'/>
        </div>
    )
}