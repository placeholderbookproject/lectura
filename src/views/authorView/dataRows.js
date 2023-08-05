import labels from '../labels.js'
import {transformYear, checkData, dateCoalesce} from '../formattingFuncs';

export const textRows = (info, data) => {
    const title = data&&data.text_title?data.text_title.split(","):"";
    const numTitles = title.length!==undefined?title.length:"";
    const {akaLabel, authorLabel, awardsLabel, bookLabel, bookdesc, copyrightLabel, dopYear, genreLabel, image,
        inceptionYear, languageLabel, lengthLabel, metreLabel, origincountryLabel, publYear, publishedInLabel,
        publisherLabel, titleLabel, typeLabel, formLabel} = info
    const {text_author,text_language, text_original_publication_year, text_original_publication_length,
        text_original_publication_length_type, text_q} = data
    const selectedDate = dateCoalesce(publYear, dopYear, inceptionYear);
    return (
        [{label:labels.aka,content:(numTitles>1)&&checkData(akaLabel,title.slice(1,numTitles).join(", "))},
        {label:"", content:bookdesc},{label:labels.author_name + " ", content:checkData(authorLabel, text_author)},
        {label:labels.written_date, content:checkData(transformYear(checkData(selectedDate,text_original_publication_year, labels.unspecified)))},
        {label:labels.language, content:checkData(languageLabel,text_language)},{label:"Origin Country ", content:origincountryLabel},
        {label:labels.genre, content:genreLabel},{label:labels.type, content:typeLabel},{label:"Form ", content:formLabel},
        {label:labels.metre, content:metreLabel},{label:"Published in ", content:publishedInLabel},{label:labels.publishers, content:publisherLabel},
        {label:labels.original_publication_length, content:text_original_publication_length !== null&&checkData(lengthLabel,text_original_publication_length) + 
            (text_original_publication_length_type !== "" && " " + text_original_publication_length_type + "")},
        {label:"Awards ", content:awardsLabel},{label:"Copyright Status ", content:copyrightLabel}]
        )

}