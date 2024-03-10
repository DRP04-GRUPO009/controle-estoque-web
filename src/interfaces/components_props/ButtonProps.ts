export enum ButtonType {
    Submit = 'submit',
    Reset = 'reset',
    Button =  'button'
}

export interface ButtonProps {
    text: string,
    type: ButtonType
}