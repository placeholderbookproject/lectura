import labels from './labels.js';

const textFilters = [
    //{value: '#', label: "#"},
    {value: 'text_title', label: 'Title'},
    {value: 'text_author', label: 'Author'},
    {value: 'text_original_publication_year',label: 'Publication Year'},
    {value: 'text_language', label: 'Language'},
    {value: 'text_type', label: 'Type'},
    {value: 'text_genre', label: 'Genre'},
]

const authorFilters = [
    //{value: '#', label: "#"},
    {value: 'author_name', label: 'Author'},
    {value: 'author_positions', label: 'Positions'},
    {value: 'author_birth_year',label: 'Birth Year'},
    {value: 'author_death_year',label: 'Death Year'},
    {value: 'author_floruit', label: 'Floruit'},
    {value: 'author_birth_country',label: 'Country of Birth'},
    {value: 'author_birth_city', label:'City of Birth'},
    //{value: 'works', label: 'Works'},
]

export const options = {"authors":authorFilters, "texts":textFilters,}

const editRowTexts = [
    {label:labels.original_language+" ", input: [{value:'text_language'}], explanationText: ''},
    {label: labels.original_publication_date+ " ", input: [{value: 'text_original_publication_year'}], explanationText: ''},
    {label: labels.original_publisher_name+ " ", input: [{value: 'text_original_publication_publisher'}
        ,{value: 'text_original_publication_publisher_loc'}], explanationText: ' (publisher, location)'},
    {label: labels.original_publication_type+" ", input: [{value:'text_original_publication_type'}], explanationText: ''},
    {label: labels.original_publication_length+" ", input: [{value:'text_original_publication_length'}
        ,{value: 'text_original_publication_length_type'}], explanationText: ' (length, length type)'},
    {label: labels.writing_period+" ", input: [{value:'text_writing_start'},{value:'text_writing_end'}], explanationText: ' (start - writing)'},
]

const editRowAuthors = [
    {label:labels.nationality+" ", input: [{value:'author_nationality'}], explanationText: ''},
    {label: labels.born+ " ", input: [{value: 'author_birth_year'},{value:'author_birth_city'}, {value:'author_birth_country'}]
            , explanationText: ' (birth, birth city & country)'},
    {label: labels.died+ " ", input: [{value: 'author_death_year'},{value: 'author_death_city'}, {value: 'author_death_country'}]
            , explanationText: ' (publication year, publisher)'},
    {label: labels.floruit+" ", input: [{value:'author_floruit'}], explanationText: ''},
]

const editRowEditions = [
    {label:labels.original_title+" ", input: [{value:'text_title'}], explanationText: ' (title of edition)'},
    {label: labels.author+ " ", input: [{value: 'text_author'},{value:'edition_editor'}], explanationText: ' (author, editors)'},
    {label: labels.publication+ " ", input: [{value: 'edition_publication_year'},{value: 'edition_publisher'}], explanationText: ' (publication year, publisher)'},
    {label: labels.length+" ", input: [{value:'edition_length'},{value:'edition_binding'}], explanationText: ' (pages, binding)'},
    {label: labels.isbn+" ", input: [{value: 'edition_isbn'},{value:'edition_isbn13'}], explanationText: ' (isbn, isbn13)'},
]

export const editRowAll = {texts: editRowTexts, authors: editRowAuthors, editions: editRowEditions}

//export default options