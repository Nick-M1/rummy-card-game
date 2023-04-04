export function smoothScrollWithHighlight(elementId: string, scrollPosition: ScrollLogicalPosition ) {
    const element = document.getElementById( elementId )

    if (element == null)
        return

    // Scroll
    element.scrollIntoView({
        behavior: 'smooth',
        block: scrollPosition,
        inline: scrollPosition
    })

    // Highlight
    const originalClassname = element.className
    element.className = originalClassname + ' bg-blue-900/50'
    setTimeout(() => element.className = originalClassname, 1000)
}