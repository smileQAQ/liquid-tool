import React from 'react';

interface ScanMarkProps {
    children?: React.ReactNode;
    element?: React.ReactNode;
}

const ScanMark: React.FC<ScanMarkProps> = ({ children, element, sid }) => {
    const reactElement = React.isValidElement(element) ? element : React.isValidElement(children) ? children : null;
    const dataSid = reactElement?.props['data-sid'];
    return React.cloneElement((element || children) as React.ReactElement, { 'data-sid': dataSid || "" }) as React.ReactElement;
};

export default ScanMark;