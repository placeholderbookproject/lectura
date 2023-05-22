import React, {useState} from 'react';
import AuthorTable from './authorView/AuthorTable';
import TextTable from './authorView/TextTable';

const ComponentPopup = (props) => {
    const [popupData, setPopupData] = useState(null);
    const {id, children, lang, type} = props;
    const popupDataFunc = (id) => {popupData?setPopupData(false):setPopupData(id)}
    return (
        <div className="table-row-content">
            <div className="popupArea" onClick={() => popupDataFunc(id)}>{children}</div>
                {popupData&&id&&
                    <div className = "popup" /*onMouseLeave={() => setPopupData(null)}*/>
                        <p><a href={type==="author"?"/author/"+id:"/text/"+id}>Go to the Page</a><button onClick = {() =>setPopupData(null)}> X</button></p>
                        {type==="author"
                            ?<AuthorTable className="popup" id = {popupData} lang={lang}/>
                            :<TextTable className="popup" id={popupData} lang={lang}/>}
                    </div>}
        </div>
    )
}

export default ComponentPopup