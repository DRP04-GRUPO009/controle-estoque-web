import { InputLabelProps } from "../../interfaces/components_props/InputLabelProps";


export default function InputLabel(props: InputLabelProps) {
    return (
        <>
            <label>{props.text}</label>
        </>
    );
}