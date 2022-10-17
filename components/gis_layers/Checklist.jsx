import React, { useState } from "react";
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import './Checklist.scss'



function Checklist(props) {
    const [expanded, setExpanded] = useState([]);
    
    function handleCheck(checked) {
        props.handleCheck(checked)
    }

    function handleExpanded(expanded) {
        setExpanded(expanded);
    }
    function onOrderChange(orderedNodes){

    }

    return(
        
        <CheckboxTree

                nodes={props.data}
                checked={props.checked}
                expanded={expanded}
                onCheck={handleCheck}
                onExpand={handleExpanded}
                orderable
                onOrderChange = {onOrderChange}
              
                
                

                icons={{
                    check: <i className="fa-regular fa-square-check"></i>,
                    uncheck: <span className="rct-icon rct-icon-uncheck" />,
                    halfCheck: <span className="rct-icon rct-icon-half-check" />,
                    expandClose: <i className="fa-regular fa-square-plus fa-1x"></i>,
                    expandOpen: <i className="fa-regular fa-square-minus fa-1x"></i>,
                    expandAll: <span className="rct-icon rct-icon-expand-all" />,
                    collapseAll: <span className="rct-icon rct-icon-collapse-all" />,
                    parentClose: <i className="fa-solid fa-layer-group"></i>,
                    parentOpen: <i className="fa-solid fa-layer-group"></i>,
                    leaf: ""
                }}

            />
            
    )
}

export default Checklist;