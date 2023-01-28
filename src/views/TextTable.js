function TextTable (props){
    const text = props.data;
    const title = text.title.split(",");
    const numTitles = title.length;
    var aka = "";
    if(numTitles>1){aka = "aka. " + title.slice(1,numTitles).join(", ")};
    return (
      (
        <div>
        <table>
          <h1>{title[0]+ " (" + text.type + ")"}</h1>
            <h3>{aka}</h3>
            <h3>{text.publication + " (placeholder publication place, country)"}</h3>
            <h3>{text.language}</h3>
            <h3>{text.genre}</h3>
            <h3>{text.description}</h3>
        </table>
        <h1>{"Editions"}</h1>{/*mapping of editions*/}
        </div>
      )
    )
  }