import React from 'react';

import classes from './Logo.module.css';
import LogoLight from '../../images/logo-light.png';

const Logo = (props)=>{
    return (
        <figure className={classes.Logo}>
            <img src={LogoLight} alt='gist-me logo'/>

        </figure>
    )
}

export default Logo;