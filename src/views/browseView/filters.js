export const filterOptions = (type) => type==='texts'?textFilters:authorFilters;

const textFilters = [{label: 'Type', property: 'text_type', type:'list'},
        {label: 'Language', property: 'text_language', type:'list'},
{label: 'Publication Year', property: 'text_original_publication_year',type:'range'},]

const authorFilters = [{label:'Positions', property:'author_positions', type:'list'},
                        {label:'Language', property:'author_name_language', type:'list'},
                        {label:'Birth Year', property:'author_birth_year', type:'range'},
                        {label:'Birth City', property:'author_birth_city', type:'list'},
                        {label:'Birth Country', property:'author_birth_country', type:'list'},
                        {label:'Death Year', property:'author_death_year', type:'range'},
                        {label:'Death City', property:'author_death_city', type:'list'},
                        {label:'Death Country', property:'author_death_country', type:'list'},
                        {label: 'Nationality', property:'author_nationality', type:'list'}
                    ];