import React from "react";
import {
  Input,
  Field,
} from "rimble-ui";

const NumberInput = ({label, handleInput, inputValue, placeholder}) => (
  <div>
    <Field label={label} width={1}>
      <Input
        type="number"
        required
        onChange={(event)=>handleInput(event.target.value)}
        value={inputValue}
        width={1}
        placeholder={placeholder}
      />
    </Field>
  </div>
)

export default NumberInput