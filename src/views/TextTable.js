import {Link} from 'react-router-dom';

function TextTable (props){
    const text = props.data;
    const title = text.title.split(",");
    const numTitles = title.length;
    const author = text.author
    var aka = "";
    if(numTitles>1){aka = "aka. " + title.slice(1,numTitles).join(", ")};
    return (
      (
        <div>
          <h1>{title[0]}</h1>
            <h3>{aka}</h3>
            <h3><Link to = {"/work/"+text.author_index}></Link>{author + author.author_id}</h3>
            <h3>{text.publication}</h3>
            <h3>{text.language}</h3>
            <h3>{text.genre}</h3>
            <h3>{text.description}</h3>
        <h1>{"Editions"}</h1>{/*mapping of editions*/}
        </div>
      )
    )
  }

  export default TextTable;