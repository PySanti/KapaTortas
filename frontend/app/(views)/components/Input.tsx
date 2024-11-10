
interface InputProps {
    type?: string;
    placeholder?: string;
    value: any | undefined;
    inputHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
    [key: string]: any;
}

export default function Input({type = "text", placeholder = "", value, inputHandler, ...props}: InputProps) {
    return (
        <input
            type={ type }
            placeholder={ placeholder }
            value={ value }
            onChange={ inputHandler }
            className="bg-transparent border-b-2 outline-none text-secondary-light"
        />
    )
}