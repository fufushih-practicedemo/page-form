'use client';

import { MdTextFields } from "react-icons/md";
import { ElementsType, FormElement, FormElementInstance } from "../FormElements";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const type: ElementsType = "TextField";
const extraAttributes = {
    label: "Text field",
    helperText: "Helper text",
    require: false,
    placeholder: "Value here...",

}

export const TextFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAttributes,
    }),
    designerBtnElement: {
        icon: MdTextFields,
        label: "Text field",
    },
    designerComponent: DesignerComponent,
    formComponent: () => <div>Form component</div>,
    propertiesComponent: () => <div>Properties component</div>,
}

type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes

}

function DesignerComponent({
    elementInstance
}: {
    elementInstance: FormElementInstance
}) {
    const element = elementInstance as CustomInstance;
    const {label, require, placeholder, helperText} = element.extraAttributes;
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label>
                {label}
                {require && "*"}
            </Label>
            <Input readOnly disabled placeholder={placeholder} />
            {helperText &&(
                <p className="text-mute-foreground text-[0.8rem]">{helperText}</p>
            )}
        </div>
    )
}