import React from 'react';
import { Link } from 'react-router-dom';

class Header extends React.Component {
    render() {
        return(
            <div className="header">
                <Link to="/"><p className="title">GrubHub</p></Link>
            </div>
        );
    }
}

export default Header;