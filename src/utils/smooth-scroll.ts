export function smoothScrollWithHighlight(elementId: string, block: ScrollLogicalPosition ) {
    const element = document.getElementById( elementId )

    if (element == null)
        return

    // Scroll
    element.scrollIntoView({
        behavior: 'smooth',
        block: block
    })

    // Highlight
    const originalClassname = element.className
    element.className = originalClassname + ' bg-blue-900/50'
    setTimeout(() => element.className = originalClassname, 1000)
}