const TableRow = (props) => {
    const {children, label} = props
    return (
        children&&
        <p><span style = {{"fontWeight": 600,}}>{label}</span>{props.children}</p>
    )
}

export default TableRow;