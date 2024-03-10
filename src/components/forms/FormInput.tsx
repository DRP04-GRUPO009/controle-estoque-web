import { InputProps } from "../../interfaces/components_props/InputProps";

export default function FormInput(props: InputProps)
{
    return (
        <>
            <input type={props.type} name={props.name} id={props.name} />
        </>
    );
}