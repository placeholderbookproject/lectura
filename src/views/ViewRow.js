const TableRow = (props) => {
    const {children, label} = props
    return (children&&<p className="viewRow"><span style = {{"fontWeight": 600,}}>{label}</span>{props.children}</p>)
}
export default TableRow;