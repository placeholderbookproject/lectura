import {Link} from 'react-router-dom';

function TextTable (props){
    const text = props.data;
    const title = text.title.split(",");
    const numTitles = title.length;
    const author = text.author
    var aka = "";
    if(numTitles>1){aka = "also known as: " + title.slice(1,numTitles).join(", ")};
    return (
      (
        <table id = "textTableWindow"><tbody>
            <tr>
                <th className = "Header">
                    {title[0]}{/*Text title: currently just the first title name*/}
                </th>
            </tr>
            <tr>
                <td>{aka}</td>{/*akas, a string of alternative names. Should be replaced with a list of language alternatives*/}
            </tr>
            <tr>
                <td>{/*Author of book, contains link to author page*/}
                    <span style={{"fontWeight": '700'}}>author: </span><Link to = {"/author/"+text.author_id}>{author}</Link>
                </td>
            </tr>
            <tr>
                <td>{/*Date (year) of first published year. In future should also contain a list of other publication dates*/}
                    <span style={{"fontWeight": '700'}}>first published: </span>{text.publication}
                </td>
            </tr>
            <tr>
                <td>{/*Currently no data on this, but should contain data on original language(s). Also list of languages in translations*/}
                {text.language}
                </td>
            </tr>
            <tr>
                <td>{/*To contain genre of the work. History, fiction, philsophy, etc; multiple tags*/}
                    {text.genre}
                </td>
            </tr>
            <tr>
                <td>{/*Brief description of the work. Should perhaps not be native, but extracted from other source*/}
                    {text.description}
                </td>            
            </tr>
        <tr className = {"Editions"}>
            <td>
                {"Editions"}
            </td>
        </tr>{/*Will contains a list of editions -> edition view (work/edition/id)
                Edition title, date of publication, editor name, language, ISBN (if exists)
                */}       
        </tbody></table>
      )
    )
  }

  export default TextTable;