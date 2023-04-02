export default function LoadingPage() {
    return (
        <div className='flex flex-col h-screen w-full pt-20 ml-auto items-center bg-neutral-800'>
            <h2 className="text-3xl text-white font-semibold text-center">
                Click on a chat or start a new chat
            </h2>
            <img src='/loading.gif' alt='' className='md:w-[25vw] h-[25vw] content-center'/>
        </div>
    )
}