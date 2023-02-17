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

const options = {"authors":authorFilters, "texts":textFilters,}

export default options