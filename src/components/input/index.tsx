import { RegisterOptions, UseFormRegister } from "react-hook-form";

interface InputProps{
    type: string;
    placeholder: string;
    name: string;
    register: UseFormRegister<any>;
    error?: string;
    rules?: RegisterOptions;
}

export function Input({ name, placeholder, type, register, rules, error }: InputProps) {
    return(
        <div>
            <input 
                placeholder={placeholder}
                type={type}
                {...register(name, rules)}
                id={name}                
            />
            {error && <p>{error}</p>}
        </div>
    )
}