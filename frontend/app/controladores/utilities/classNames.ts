// Funcion para agilizar la puesta de todos los classNames
export default function classNames(...classes: (string | undefined | false)[]): string {
    return classes.filter(Boolean).join(" ");
}
  