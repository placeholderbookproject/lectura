const authorFields = () => {
    return (
        [,{label:'Author Name ',dict:'author_name',type:'text'}
        ,{label:'Author Alias(es) ',dict:'author_alias',type:'text'}
        ,{label:'Native Name ',dict:'author_native_name',type:'text'}
        ,{label:'Nationality ',dict:'author_nationality',type:'text'}
        ,{label:'Birth Year ',dict:'author_birth_year',type:'number'}
        ,{label:'Birth Place ',dict:'author_birth_place',type:'text'}
        ,{label:'Birth Country ',dict:'author_birth_country',type:'text'}
        ,{label:'Death Year ',dict:'author_death_year',type:'number'}
        ,{label:'Death Place ',dict:'author_death_place',type:'text'}
        ,{label:'Death Country ',dict:'author_death_country',type:'text'}
        ,{label:'Professions ',dict:'author_occupations',type:'text'}
        ,{label:'Languages ',dict:'author_language',type:'text'}]
    )
}
const textFields = () => {
    return [,{label:'Text Name ',dict:'text_title',type:'text'}
    ,{label:'Text Description ',dict:'text_description',type:'text'}
    ,{label:'Author Name ',dict:'text_author',type:'text'}
    ,{label:'Publication Year ',dict:'text_original_publication_year',type:'number'}
    ,{label:'Languages ',dict:'text_language',type:'text'}
    ,{label:'Genre ',dict:'text_genre',type:'text'}
    ,{label:'Type ',dict:'text_type',type:'text'}
    ,{label:'Form ',dict:'text_form',type:'text'}
    ,{label:'Metre ',dict:'text_metre',type:'text'}
    ,{label:'Length ',dict:'text_length',type:'text'}
    ,{label:'Copyright Status ',dict:'text_copyright',type:'text'}]
}

export const fields = (type) => {
    const fieldRange = {"Author":authorFields(), "Text":textFields()}
    return fieldRange[type]
}