const TableRow = (props) => {
    return (
        <tr>
            <td>
                <span style = {{"fontWeight": 600,
                                }}>{props.label}</span>
                {props.children}
            </td>
        </tr>
    )
}

export default TableRow;