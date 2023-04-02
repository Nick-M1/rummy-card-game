export function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export function capitalise(text: string) {
    return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}