import { ButtonProps } from "../../interfaces/components_props/ButtonProps";

export default function Button(props: ButtonProps) {
    return (
        <>
            <button type={props.type}>{props.text}</button>
        </>
    );
}