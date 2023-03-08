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
    {value:'author_nationality', label:'Nationality'},
    {value: 'author_positions', label: 'Occupations'},
    {value:'author_birth_day', label: 'Birth Day'},
    {value:'author_birth_month',label: 'Birth Month'},
    {value: 'author_birth_year',label: 'Birth Year'},
    {value: 'author_birth_city', label:'Birth City'},
    {value: 'author_birth_country',label: 'Birth Country'},
    {value:'author_death_day',label:'Death Day'},
    {value:'author_death_month',label:'Death Month'},
    {value: 'author_death_year',label: 'Death Year'},
    {value:'author_death_city', label: 'Death City'},
    {value:'author_death_country', label:'Death Country'},
    {value: 'author_floruit', label: 'Floruit'},
    //{value: 'works', label: 'Works'},
]

export const options = {"authors":authorFilters, "texts":textFilters,}

const editRowTexts = [
    {label:labels.original_language+" ", input: [{value:'text_language', label: 'original language'}]},
    {label:labels.original_publication_date+ " ", input: [{value: 'text_original_publication_year', type: 'number', label: 'original publication year'}]},
    {label:labels.original_publisher_name+ " ", input: [{value: 'text_original_publication_publisher', label: 'original publisher name'}
        ,{value: 'text_original_publication_publisher_loc', label: 'original publication location'}]},
    {label:labels.original_publication_type+" ", input: [{value:'text_original_publication_type', label: 'publication type'}]},
    {label:labels.original_publication_length+" ", input: [{value:'text_original_publication_length', type: "number", label: 'length'}
        ,{value: 'text_original_publication_length_type', label: 'length type (lines, pages, etc)'}]},
    {label:labels.writing_period+" ", input: [{value:'text_writing_start', label: 'start'},{value:'text_writing_end', label: 'end'}]},
]

const editRowAuthors = [
    {label:labels.nationality+" ", input: [{value:'author_nationality', label: "nationality"}]},
    {label: labels.born+ " ", input: [{value:'author_birth_day', type:'number', label: "birth day"}
                ,{value:'author_birth_month', type:'number', label: "birth month"},{value: 'author_birth_year', type: "number", label: "birth year"}
                ,{value:'author_birth_city', label: "birth city"}, {value:'author_birth_country', label: "birth country"}]},
    {label: labels.died+ " ", input: [{value:'author_death_day', type: 'number', label: 'death day'}
                ,{value: 'author_death_month', label: "death month",type:'number'},{value: 'author_death_year', type: "number", label: "death year"}
                ,{value: 'author_death_city', label: "city of death"}, {value: 'author_death_country', label: "country of death"}]
            },
    {label: labels.floruit+" ", input: [{value:'author_floruit', label: 'floruit'}]},
]

const editRowEditions = [
    {label:labels.original_title+" ", input: [{value:'text_title', label: 'edition title'}]},
    {label: labels.author+ " ", input: [{value: 'text_author', label: 'author'},{value:'edition_editor', label: 'editors'}]},
    {label: labels.publication+ " ", input: [{value: 'edition_publication_year', type: "number", label: 'edition publication year'}
        ,{value: 'edition_publisher', label: 'edition publisher'}]},
    {label: labels.length+" ", input: [{value:'edition_length', type: "number", label: 'edition length'},{value:'edition_binding', label: 'binding type'}]},
    {label: labels.isbn+" ", input: [{value: 'edition_isbn', label: 'isbn'},{value:'edition_isbn13', label: 'isbn13'}]},
]

export const editRowAll = {texts: editRowTexts, authors: editRowAuthors, editions: editRowEditions}

//export default options