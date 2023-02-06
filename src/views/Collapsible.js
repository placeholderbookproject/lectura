const Collapsible = (props) => {
    const [open, setOPen] = useState(false);
    const toggle = () => {setOPen(!open);}
    return (
      <>
        <span onClick = {toggle} className = "collapsibleBtn">{props.label}</span>
        {open &&
            <div className={open ? "content-show" : "content-parent"}>
                <div className="toggle">{props.children}</div>
            </div>
        }
      </>
    );
  };

  export default Collapsible;