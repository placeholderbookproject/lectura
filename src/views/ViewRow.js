const TableRow = (props) => {
    return (
        <tr>
            <td>
                <span style = {{"fontWeight": 700}}>{props.label}</span>
                {props.children}
            </td>
        </tr>
    )
}

export default TableRow;