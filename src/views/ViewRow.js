const TableRow = (props) => {
    return (
        <p>
            <span style = {{"fontWeight": 600,}}>{props.label}</span>
            {props.children}
        </p>
    )
}

export default TableRow;