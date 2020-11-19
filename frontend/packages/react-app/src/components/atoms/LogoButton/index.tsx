import * as React from "react"
import { Link } from 'react-router-dom'
import { Image } from "rimble-ui"

export interface LogoButtonProps {}

const LogoButton = ({}:LogoButtonProps) => (
    <Link to="/" style={{textDecoration: 'none'}}>
      <Image
        alt="logo"
        width="100"
        height="auto"
        src={`${window.location.origin}/iroiro_logo.svg`}
      />
    </Link>
  )

export default LogoButton